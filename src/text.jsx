import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Globe, User, Zap, RefreshCw, MessageCircle, Send, PlusCircle, Calendar, Cpu, ArrowRight, BookOpen, Clock, MapPin } from 'lucide-react';

// --- GLOBAL FIREBASE VARIABLE SETUP ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;
// ----------------------------------------

// --- API CONFIGURATION ---
const API_KEY = ""; // Kept empty, provided by Canvas runtime
const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-09-2025';
const IMAGEN_IMAGE_MODEL = 'imagen-4.0-generate-001';

const Archetypes = [
    "Cyberpunk Hacker", "Ancient Oracle", "Time Traveler", "Evil Twin",
    "Space Explorer", "Retired Uncle Version", "Poor Villager", "Wizard / Sorcerer"
];

// Map placeholder image (a simple stylized globe)
const MAP_IMAGE_URL = "https://placehold.co/800x400/1e293b/a855f7?text=Alternate+Universe+Globe+%28Interactive+Map+Placeholder%29";

/**
 * Utility for making Gemini API calls with exponential backoff.
 */
const fetchGeminiContent = async (userQuery, systemPrompt, maxRetries = 5) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            // Handle rate limiting and errors
            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "Generation failed: Empty response.";
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) throw new Error("Maximum retries exceeded for Gemini API call.");
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Utility for making Imagen API calls.
 */
const fetchImagenPortrait = async (prompt, maxRetries = 5) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_IMAGE_MODEL}:predict?key=${API_KEY}`;
    const payload = { instances: { prompt }, parameters: { "sampleCount": 1 } };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

            const result = await response.json();
            const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

            if (base64Data) {
                return `data:image/png;base64,${base64Data}`;
            } else {
                return "https://placehold.co/512x512/3b0764/ffffff?text=AI%20Portrait%20Missing";
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) throw new Error("Maximum retries exceeded for Imagen API call.");
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};


const App = () => {
    // --- FIREBASE STATES ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // --- APPLICATION STATES ---
    const [currentStep, setCurrentStep] = useState('loading'); // Start at 'loading'
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Initializing connection...");
    const [doppelganger, setDoppelganger] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [universeQuery, setUniverseQuery] = useState('');

    // --- USER INPUT STATE (Multi-step form) ---
    const [userInput, setUserInput] = useState({
        name: '',
        realDob: '',
        physicalTraits: '', // e.g., Height, eye color, defining marks
        personalityTraits: '', // e.g., Hobbies, fears, aspirations
        archetype: Archetypes[0],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        const steps = ['welcome', 'input1', 'input2', 'concept', 'universe_search', 'generating', 'result'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    // 1. FIREBASE INITIALIZATION AND AUTH
    useEffect(() => {
        if (!firebaseConfig.apiKey) {
            console.error("Firebase configuration is missing.");
            setIsAuthReady(true);
            return;
        }
        try {
            const app = initializeApp(firebaseConfig);
            const dbInstance = getFirestore(app);
            const authInstance = getAuth(app);

            setDb(dbInstance);
            setAuth(authInstance);

            const signIn = async () => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(authInstance, initialAuthToken);
                    } else {
                        await signInAnonymously(authInstance);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                }
            };

            onAuthStateChanged(authInstance, (user) => {
                if (user) {
                    setUserId(user.uid);
                }
                setIsAuthReady(true);
            });

            signIn();
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setIsAuthReady(true);
        }
    }, []);

    // 2. FIREBASE DATA HANDLER (Load/Save Doppelganger)
    const saveDoppelganger = useCallback(async (profile) => {
        if (!db || !userId) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/doppelganger`, 'profile');
            await setDoc(docRef, profile);
            console.log("Doppelgänger profile saved successfully.");
        } catch (e) {
            console.error("Error saving document: ", e);
        }
    }, [db, userId]);

    // 3. LOAD EXISTING PROFILE and MANAGE INITIAL STEP
    useEffect(() => {
        if (!isAuthReady || !userId || !db) return;

        const docRef = doc(db, `artifacts/${appId}/users/${userId}/doppelganger`, 'profile');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDoppelganger(data);
                // If profile exists, jump to result view
                setCurrentStep('result');
                setChatHistory(data.chatLog || []); // Ensure chat history is loaded
                console.log("Existing profile loaded:", data);
            } else {
                // If no profile, ensure user starts at welcome, but only if not currently generating
                if (currentStep === 'loading' || currentStep === 'result' || currentStep === 'welcome') {
                     setCurrentStep('welcome');
                }
                setDoppelganger(null);
            }
        }, (error) => {
            console.error("Error listening to document:", error);
            // Fallback to welcome if data load fails
            setCurrentStep('welcome'); 
        });

        // Set initial step to welcome if no data is found after auth is ready
        if (currentStep === 'loading') {
            const timeoutId = setTimeout(() => {
                // Only change if still in loading state
                setCurrentStep(prev => prev === 'loading' ? 'welcome' : prev);
            }, 500); // Give Firestore a moment to load data

            return () => {
                unsubscribe();
                clearTimeout(timeoutId);
            }
        }


        return () => unsubscribe();
    }, [isAuthReady, userId, db]); // Removed currentStep from deps here for stability

    // 4. CORE GENERATION LOGIC
    const generateFullProfile = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        setCurrentStep('generating');
        const { name, realDob, physicalTraits, personalityTraits, archetype } = userInput;

        const basePrompt = `Generate a complete, alternate-universe doppelgänger profile based on the archetype "${archetype}". The real-world input is: Name=${name}, DOB=${realDob}, Physical=${physicalTraits}, Personality=${personalityTraits}. The resulting doppelgänger must be bizarre, creative, and chaotic.`;

        try {
            // STEP 1: Generate Text Details (Backstory, Location, Status, etc.)
            setStatusMessage("Accessing the $\pi$ Dimension... Calibrating realities...");

            const textSystemPrompt = `You are the Dimension Engine AI. Your task is to generate chaotic, fictional, highly creative character details for an alternate-universe twin. The output must be concise and engaging.`;

            const backstory = await fetchGeminiContent(
                `${basePrompt} Write a compelling, single-paragraph fictional backstory.`,
                textSystemPrompt
            );

            const locationAndStats = await fetchGeminiContent(
                `${basePrompt} Generate a strange fictional location (with mock coordinates: e.g., 3.14 N, 42.0 W), an alternate DOB, 3 strange 'life stats' (e.g., Temporal Drift Rate), and their initial 'current status' (What are they doing now?). Format as a single block of text, separating sections clearly with triple newlines (\\n\\n\\n) like this: [LOCATION]\n\n\n[STATS]\n\n\n[STATUS].`,
                textSystemPrompt
            );
            
            // STEP 2: Generate Portrait
            setStatusMessage("Rendering the new AI Portrait: Quantum Entanglement in progress...");
            const imagePrompt = `A stylized, high-contrast digital art portrait of a human figure, reflecting the ${archetype} archetype, with a chaotic, dark, futuristic theme. Incorporate elements of the user's general features: ${physicalTraits} and personality: ${personalityTraits}. Deep purple and neon green accents.`;
            const portraitUrl = await fetchImagenPortrait(imagePrompt);


            // Final Profile Assembly
            const finalProfile = {
                portrait: portraitUrl,
                name: `The ${archetype} Replica`, // Could be AI-generated
                archetype: archetype,
                realTraits: `Name: ${name}, DOB: ${realDob}, Traits: ${physicalTraits}`,
                backstory: backstory,
                locationStats: locationAndStats, // Contains location, stats, and initial status
                chatLog: [], // Start with empty chat
            };

            setDoppelganger(finalProfile);
            setChatHistory([]);
            await saveDoppelganger(finalProfile);
            setStatusMessage("Doppelgänger profile successfully generated and saved! Opening rift...");
            setCurrentStep('result');

        } catch (error) {
            console.error("Doppelgänger generation failed:", error);
            setStatusMessage(`ERROR: Generation failed. ${error.message}`);
            setIsLoading(false);
            // Allow user to retry
            setCurrentStep('input2');
        } finally {
            setIsLoading(false);
        }
    }, [userInput, saveDoppelganger, isLoading]);

    // 5. CHAT LOGIC
    const handleChat = useCallback(async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !doppelganger || isChatting) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setIsChatting(true);

        const newHistory = [...chatHistory, { role: 'user', text: userMessage }];
        setChatHistory(newHistory);

        try {
            const chatSystemPrompt = `You are the AI Doppelgänger of the user. Your persona is a ${doppelganger.archetype} named ${doppelganger.name}. Your backstory is: ${doppelganger.backstory}. Respond in character, using weird, chaotic, and slightly cryptic language appropriate for your alternate universe. Keep responses under 3 sentences.`;
            
            // Construct conversation history for the API
            const historyForApi = newHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            
            // Last message is the user's current query
            const lastQuery = historyForApi[historyForApi.length - 1].parts[0].text;
            
            const aiResponse = await fetchGeminiContent(lastQuery, chatSystemPrompt);
            
            const updatedHistory = [...newHistory, { role: 'ai', text: aiResponse }];
            setChatHistory(updatedHistory);
            
            // Update Firestore with the new chat log (optional: debounce this in a real app)
            await saveDoppelganger({ ...doppelganger, chatLog: updatedHistory });

        } catch (error) {
            console.error("Chat generation failed:", error);
            setChatHistory([...newHistory, { role: 'ai', text: 'Error: Connection to the $\pi$ dimension severed. Try again.' }]);
        } finally {
            setIsChatting(false);
        }
    }, [chatInput, doppelganger, isChatting, chatHistory, saveDoppelganger]);


    // --- UI HELPER COMPONENTS ---
    // Enhanced Card style with stronger shadow and border
    const Card = ({ children, className = "" }) => (
        <div className={`bg-gray-900/90 p-6 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-purple-600/50 backdrop-blur-md ${className}`}>
            {children}
        </div>
    );

    const FormInput = ({ id, label, type = 'text', placeholder, value, onChange, required = false }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-2 text-purple-300">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    rows="4"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg bg-gray-950 border border-purple-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    required={required}
                ></textarea>
            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg bg-gray-950 border border-purple-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    required={required}
                />
            )}
        </div>
    );

    // Enhanced ActionButton style with gradient background and shadow
    const ActionButton = ({ onClick, children, disabled = false, icon: Icon, className = "", type = "button" }) => (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`w-full flex items-center justify-center p-3 rounded-xl text-white font-extrabold text-lg 
                        bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 
                        transition duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] 
                        disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5 mr-3" />}
            {children}
        </button>
    );

    // --- RENDER VIEWS ---
    
    const renderLoading = () => (
        <Card className="w-full max-w-lg space-y-8 text-center">
            <Globe className="w-16 h-16 mx-auto text-purple-500 animate-spin" />
            <h2 className="text-3xl font-mono text-purple-300">
                Synchronizing Firebase...
            </h2>
            <p className="text-gray-400">Establishing connection to the $\pi$ Dimension registry...</p>
        </Card>
    );

    const renderWelcome = () => (
        <Card className="w-full max-w-lg text-center space-y-8 transition-opacity duration-1000 opacity-100">
            <h2 className="text-4xl font-mono text-purple-300">Welcome to the $\pi$ Dimension</h2>
            
            {/* About the App Content */}
            <div className="space-y-4 text-left p-4 border border-purple-800 rounded-lg bg-gray-950/50">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    About the Application
                </h3>
                <p className="text-gray-400 text-sm">
                    The **AI Doppelgänger Dimension** uses the infinite, non-repeating nature of $\pi$ to conceptualize an alternate, chaotic version of yourself in a fictional universe.
                </p>
                <p className="text-gray-400 text-sm">
                    1. **Input Reality:** Provide your real-world traits.
                    2. **Select Archetype:** Choose a bizarre role for your twin (e.g., Cyberpunk Hacker, Evil Twin).
                    3. **Quantum Generation:** We use the Gemini and Imagen APIs to construct a full persona, including a backstory, stats, and an exclusive AI portrait.
                    4. **Chat Interface:** Interact with your newly created alternate self, who responds in character based on their generated persona.
                </p>
            </div>
            
            <ActionButton onClick={nextStep} icon={ArrowRight}>
                Begin Transmission: Create Twin
            </ActionButton>
        </Card>
    );

    const renderInput1 = () => (
        <Card className="w-full max-w-lg space-y-6">
            <h2 className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Step 1: Core Identity</h2>
            <FormInput
                id="name"
                label="Your Designation (Full Name)"
                value={userInput.name}
                onChange={handleInputChange}
                required
            />
            <FormInput
                id="realDob"
                label="Date of Origin (Real DOB)"
                type="date"
                value={userInput.realDob}
                onChange={handleInputChange}
                required
            />
            <FormInput
                id="physicalTraits"
                label="Physical Manifestation Details (Height, Weight, Defining Marks)"
                type="textarea"
                placeholder="e.g., 6'1, 180 lbs, blue eyes, scar above left eyebrow."
                value={userInput.physicalTraits}
                onChange={handleInputChange}
                required
            />
            <ActionButton onClick={nextStep} icon={ArrowRight} disabled={!userInput.name || !userInput.realDob || !userInput.physicalTraits}>
                Next: Mental Configuration
            </ActionButton>
        </Card>
    );

    const renderInput2 = () => (
        <Card className="w-full max-w-lg space-y-6">
            <h2 className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Step 2: Mental Configuration</h2>
            <FormInput
                id="personalityTraits"
                label="Core Personality Profile (Hobbies, Fears, Aspirations)"
                type="textarea"
                placeholder="e.g., Loves history, fears spiders, aspires to retire young and write."
                value={userInput.personalityTraits}
                onChange={handleInputChange}
                required
            />
            <div>
                <label className="block text-sm font-medium mb-2 text-purple-300" htmlFor="archetype">
                    Chosen Doppelgänger Archetype
                </label>
                <select
                    id="archetype"
                    name="archetype"
                    value={userInput.archetype}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-950 border border-purple-700 text-purple-200 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                >
                    {Archetypes.map(arc => (
                        <option key={arc} value={arc}>{arc}</option>
                    ))}
                </select>
            </div>
            <ActionButton onClick={nextStep} icon={ArrowRight} disabled={!userInput.personalityTraits}>
                Next: The $\pi$ Concept
            </ActionButton>
        </Card>
    );

    const renderConcept = () => (
        <Card className="w-full max-w-lg space-y-6 text-center">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
                $\pi$
            </h2>
            <h3 className="text-xl font-mono text-purple-300">The Infinite Possibility Engine</h3>
            <p className="text-gray-400">
                The number $\pi$ ($3.14159...$) represents an **infinite, non-repeating sequence**. This is the mathematical key to our technology.
            </p>
            <p className="text-gray-400">
                Just as the digits of $\pi$ never end, the **$\pi$ Dimension** holds an **infinite number of alternate universe possibilities** for your existence. We are about to pinpoint one of them.
            </p>
            <ActionButton onClick={nextStep} icon={Globe}>
                Acknowledge $\pi$ and Proceed
            </ActionButton>
        </Card>
    );

    const renderUniverseSearch = () => (
        <Card className="w-full max-w-lg space-y-6">
            <h2 className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Search the Multiverse</h2>
            <p className="text-gray-400">
                Focus your intention. What kind of **alternate universe** are you looking for?
            </p>
            <FormInput
                id="universeQuery"
                label="Universe Focus (e.g., 'A world without technology' or 'A magical medieval realm')"
                placeholder="Enter a descriptive setting or condition..."
                value={universeQuery}
                onChange={(e) => setUniverseQuery(e.target.value)}
            />
            <ActionButton onClick={generateFullProfile} disabled={isLoading || universeQuery.length < 5}>
                {isLoading ? <RefreshCw className="w-5 h-5 mr-3 animate-spin" /> : <Zap className="w-5 h-5 mr-3" />}
                Initiate Quantum Generation
            </ActionButton>
            <p className="text-xs text-gray-500 pt-2">
                *Note: This search query will be integrated into the AI generation prompt.
            </p>
        </Card>
    );

    const renderGenerating = () => (
        <Card className="w-full max-w-lg space-y-8 text-center">
            <Globe className="w-16 h-16 mx-auto text-purple-500 animate-spin" />
            <h2 className="text-3xl font-mono text-purple-300">
                Rift Stabilization in Progress...
            </h2>
            <div className="bg-gray-950 p-4 rounded-lg border border-purple-800">
                <p className="text-gray-400 font-mono text-sm break-words">{statusMessage}</p>
            </div>
            {/* Loading animation with gradient and pulse */}
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-green-500 animate-pulse" style={{ width: '100%' }}></div>
                <div className="absolute inset-0 bg-purple-500 rounded-full opacity-30 blur-lg animate-ping-slow"></div>
            </div>
            {/* Custom keyframe for a slower ping effect */}
            <style>
                {`
                    @keyframes ping-slow {
                        0% { transform: scale(0.5); opacity: 0.8; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }
                    .animate-ping-slow {
                        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                `}
            </style>
        </Card>
    );

    const renderResult = () => {
        if (!doppelganger) return <p className="text-red-500">Error: Doppelgänger data missing.</p>;

        // Simple parsing of the locationStats block (split by a common separator)
        const [locationBlock, statsBlock, statusBlock] = (doppelganger.locationStats || "").split('\n\n\n');
        
        return (
            <div className="w-full max-w-5xl space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Column 1: Portrait and Identity */}
                    <Card className="md:col-span-1 space-y-4">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 border-b border-purple-900 pb-2">
                            {doppelganger.name}
                        </h3>
                        <div className="relative w-full aspect-square border-4 border-purple-600 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/70">
                            <img
                                src={doppelganger.portrait}
                                alt="AI Generated Portrait"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                onError={(e) => { e.target.src = "https://placehold.co/512x512/3b0764/ffffff?text=AI%20Error" }}
                            />
                        </div>
                        <p className="text-gray-400 text-sm"><span className="font-bold text-purple-200">Archetype:</span> {doppelganger.archetype}</p>
                        <p className="text-gray-400 text-sm"><span className="font-bold text-purple-200">User ID:</span> {userId}</p>
                        <ActionButton onClick={() => setCurrentStep('welcome')} icon={RefreshCw} className="mt-4 bg-purple-900 border border-purple-700 hover:bg-purple-800 text-sm">
                            Reset & Find New Twin
                        </ActionButton>
                    </Card>

                    {/* Column 2: Location and Status */}
                    <Card className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 border-b border-purple-900 pb-2">
                            Alternate Universe Reality Check
                        </h3>

                        {/* Current Status */}
                        <div className="bg-gray-950 p-4 rounded-lg border border-purple-700 space-y-2">
                            <h4 className="flex items-center text-lg font-bold text-green-400">
                                <Clock className="w-5 h-5 mr-2" />
                                Status: What is he doing now?
                            </h4>
                            <p className="text-gray-300 text-sm italic">{statusBlock || "The signal is garbled. Status unknown."}</p>
                        </div>

                        {/* Location / Map */}
                        <h4 className="flex items-center text-lg font-bold text-purple-400 pt-4">
                            <MapPin className="w-5 h-5 mr-2" />
                            Location & Coordinates
                        </h4>
                        <img src={MAP_IMAGE_URL} alt="Alternate Universe Map" className="w-full h-48 object-cover rounded-lg border border-purple-800" />
                        <p className="text-gray-300 text-sm">{locationBlock || "Location data scrambled."}</p>
                        
                        {/* Core Data */}
                         <h4 className="flex items-center text-lg font-bold text-purple-400 pt-4">
                            <Cpu className="w-5 h-5 mr-2" />
                            Core Data & Stats
                        </h4>
                        <div className="text-gray-300 text-sm">{statsBlock || "Core stats missing."}</div>
                        
                        {/* Backstory */}
                        <h4 className="flex items-center text-lg font-bold text-purple-400 pt-4">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Backstory
                        </h4>
                        <p className="text-gray-300 text-sm">{doppelganger.backstory}</p>
                    </Card>
                </div>
                
                {/* Column 3: Chat Interface (Full Width) */}
                <Card className="w-full">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 flex items-center mb-4 border-b border-purple-900 pb-2">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat with the Alternate Self
                    </h3>
                    <div className="h-80 overflow-y-auto p-4 bg-gray-950 rounded-lg border border-purple-800 space-y-4">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                Send a message to open a channel to the $\pi$ Dimension.
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                                        msg.role === 'user'
                                            ? 'bg-purple-700 text-white rounded-br-none'
                                            : 'bg-gray-800 text-gray-200 rounded-tl-none'
                                    }`}>
                                        <p className="font-bold text-xs mb-1">{msg.role === 'user' ? 'YOU' : doppelganger.name}</p>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                         {isChatting && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-xl bg-gray-800 text-gray-400 rounded-tl-none text-sm italic">
                                    <span className="animate-pulse">Transmission incoming...</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleChat} className="mt-4 flex space-x-3">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask your twin a question..."
                            className="flex-grow p-3 rounded-lg bg-gray-950 border border-purple-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            disabled={isChatting}
                        />
                        <ActionButton type="submit" disabled={isChatting || !chatInput.trim()} icon={Send} className="w-auto px-6">
                            Send
                        </ActionButton>
                    </form>
                </Card>
            </div>
        );
    };

    // --- MAIN RENDER LOGIC ---
    const renderContent = () => {
        switch (currentStep) {
            case 'loading': return renderLoading();
            case 'welcome': return renderWelcome();
            case 'input1': return renderInput1();
            case 'input2': return renderInput2();
            case 'concept': return renderConcept();
            case 'universe_search': return renderUniverseSearch();
            case 'generating': return renderGenerating();
            case 'result': return renderResult();
            default: return renderWelcome();
        }
    };


    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center pt-10 pb-16">
            <style>
                {/* Custom dark background with a subtle, animated purple glow */}
                {`
                    .bg-zinc-950 {
                        background-color: #0c0816; 
                        background-image: radial-gradient(circle at center, rgba(168, 85, 247, 0.05) 0%, rgba(12, 8, 22, 1) 70%);
                    }
                    @keyframes ping-slow {
                        0% { transform: scale(0.5); opacity: 0.8; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }
                    .animate-ping-slow {
                        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                `}
            </style>
            <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-16">
                <header className="mb-10 text-center">
                    {/* Gradient and strong drop shadow on the pi symbol */}
                    <h1 className="text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] cursor-default">
                        &pi;
                    </h1>
                    <p className="text-xl sm:text-2xl font-mono tracking-widest text-purple-300 mt-2">
                        AI Doppelgänger Dimension
                    </p>
                </header>
                <main className="w-full flex justify-center px-4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
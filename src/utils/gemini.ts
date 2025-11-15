'use server';

const GEMINI_TEXT_MODEL = "gemini-2.0-flash";
const API_KEY = process.env.GEMINI_API_KEY!;

export const fetchGeminiContent = async (
    userQuery: string,
    systemPrompt: string,
    maxRetries: number = 5
) => {

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [
            {
                parts: [{ text: userQuery }]
            }
        ],
        tools: [
            { google_search: {} }
        ],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        }
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            const result = await response.json();

            return (
                result.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Generation failed: Empty response."
            );

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);

            if (attempt === maxRetries - 1) {
                throw new Error("Maximum retries exceeded for Gemini API call.");
            }

            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

const IMAGEN_IMAGE_MODEL = "imagen-3.0-generate-001";

export const fetchImagenPortrait = async (prompt: string, maxRetries: number = 5) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_IMAGE_MODEL}:predict?key=${API_KEY}`;

    const payload = {
        instances: { prompt },
        parameters: { sampleCount: 1 }
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(r => setTimeout(r, delay));
                continue;
            }

            if (!response.ok)
                throw new Error(`API call failed with status: ${response.status}`);

            const result = await response.json();
            const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

            if (base64Data) {
                return `data:image/png;base64,${base64Data}`;
            } else {
                return "https://placehold.co/512x512/3b0764/ffffff?text=AI%20Portrait%20Missing";
            }

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);

            if (attempt === maxRetries - 1)
                throw new Error("Maximum retries exceeded for Imagen API call.");

            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(r => setTimeout(r, delay));
        }
    }
};

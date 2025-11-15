# 🌌 AI Doppelgänger Dimension

**AI Doppelgänger Dimension** is a fun, chaotic, and creative web application that generates an alternate-universe version of a user based on their photo and personal details.  
Users can explore their fictional twin through interactive option-based panels instead of receiving all info at once.  
Perfect for hackathons, demos, and AI experimentation.

---

## 🚀 Overview

This application creates a fully fictional “alternate self” of the user using AI.  
After uploading their image and traits, the system generates:

- A new **AI portrait**
- A custom **alternate personality**
- A fictional **backstory**
- Strange, fun **life stats**
- A unique **alternate date of birth**
- A fictional **location with coordinates**
- Many more selectable details

Each user’s doppelgänger is saved to their account, making the experience persistent across logins.

---

## 🧠 Core Concept

Instead of showing everything at once, the app reveals the doppelgänger in **separate, clickable sections**, such as:

- Alternate Date of Birth  
- Personality  
- Backstory  
- Location Coordinates  
- Career  
- Lifestyle & Daily Routine  
- Friends & Rivals  
- Secrets & Weird Habits  

Each panel is AI-generated on demand.

---

## 🧩 User Input

The system collects:

- **User Image**
- **Height, weight, physical traits**
- **Date of Birth**
- **Optional personality or lifestyle traits**
- **Chosen Doppelgänger Archetype**, such as:

  - Rich Millionaire  
  - Poor Villager  
  - Ancient Human / Caveman  
  - King / Queen  
  - Cyberpunk Hacker  
  - Evil Twin  
  - Wizard / Sorcerer  
  - Warrior / Samurai  
  - Time Traveler  
  - Space Explorer  
  - Alien Hybrid  
  - Retired Uncle Version  

*(Fully customizable; more can be added)*

---

## 🎨 Output (What the App Generates)

### 1️⃣ **AI-Generated Portrait**
A new avatar created from:
- The user’s real photo  
- The chosen archetype  
- Stylized AI rendering  

### 2️⃣ **Interactive Details Panels**
Each detail is shown only when clicked:

- **Alternate Universe DOB**  
- **Backstory Paragraph**  
- **Personality Traits**  
- **Location Coordinates**  
- **Daily Routine**  
- **Major Achievements**  
- **Strengths & Weaknesses**  
- **Friends / Rivals**  
- **Secrets / Quirks**  
- **Favorite Quotes**  

---

## 🔐 Account System

- Users must **create an account**.
- Their doppelgänger is **saved** in the database.
- They can view it every time they log in.
- They may **reset** to generate a brand new alternate version.

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js (React + App Router)
- TailwindCSS / ShadCN (optional)

### **AI / Backend**
- OpenAI API (Text + Image Generation)
- Anthropic (optional)
- Node API Routes (Next.js Server Actions)

### **Auth**
- Manual Auth

### **Database**
- MongoDB (using Mongoose or Prisma)  

### **Hosting**
- Vercel (recommended for Next.js)

---

## 🎯 Why This Fits the Hackathon Theme

### ✔ **The App Nobody Asked For**  
Nobody needs an alternate-universe version of themselves — yet it’s impossible to stop exploring.

## 🧪 Demo Flow (Under 4 Minutes)

1. User logs in → dashboard shown  
2. Upload image + fill traits → choose archetype  
3. AI generates the **Doppelgänger Portrait**  
4. Click to reveal:
   - Personality  
   - Backstory  
   - Location  
   - Date of Birth  
   - Quirks  
5. Show full profile card  
6. Option to regenerate a new alternate self  

---

## 🗂️ Project Structure (Next.js)


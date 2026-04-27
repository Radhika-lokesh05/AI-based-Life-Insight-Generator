# ✦ LifeInsight AI: AI-based Life Insight Generator

**Discover your life's probabilistic trajectory through the lens of grounded behavioral AI.**

LifeInsight AI is a sophisticated web application that provides structured, realistic life pattern analysis. Unlike traditional predictive tools, it leverages **Google Gemini 1.5 Flash** and developmental psychology principles to generate grounded insights based on your name and date of birth.

![LifeInsight AI Preview](https://via.placeholder.com/1200x600/121212/ffffff?text=LifeInsight+AI+Glassmorphism+Dashboard)

## ✨ Key Features

- **Grounded AI Analysis**: Uses the Gemini 1.5 Flash model to provide probabilistic insights, avoiding superstition or absolute claims.
- **Multi-Dimensional Life Mapping**:
  - **Core Nature**: Deep dive into personality tendencies.
  - **Family Life**: Past, present, and future family dynamics.
  - **Love & Relationships**: Relationship patterns and trajectory.
  - **Career Timeline**: Professional milestones and long-term outlook.
  - **Communication Style**: Social and professional interaction patterns.
- **Modern Glassmorphism UI**: A premium, responsive interface featuring dynamic background orbs, smooth transitions, and a clean grid layout.
- **Secure & Private**: All data is processed in real-time and never stored on the server.

## 🛠️ Tech Stack

- **Frontend**: 
  - HTML5 & CSS3 (Custom Glassmorphism Design System)
  - Vanilla JavaScript (Async/Await, DOM Manipulation)
- **Backend**:
  - Python 3.x
  - Flask (RESTful API)
  - Flask-CORS
- **AI Engine**:
  - Google Generative AI (Gemini 1.5 Flash)
- **Environment**:
  - Dotenv for secure API key management

## 📂 Project Structure

```text
├── css/                # Styling (Modern Glassmorphism)
├── js/                 # Frontend logic
│   ├── app.js          # UI & API interaction
│   └── analyzer.js     # Data processing helpers
├── server/             # Flask Backend
│   ├── app.py          # API Endpoints
│   ├── gemini_client.py# Gemini API Wrapper
│   ├── prompt_builder.py# Logic for AI Instruction
│   ├── .env            # Environment Variables (API Key)
│   └── requirements.txt# Python Dependencies
└── index.html          # Main Entry Point
```

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-life-insight-generator.git
cd ai-life-insight-generator
```

### 2. Configure the Backend
Navigate to the `server` directory and install dependencies:
```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file in the `server` folder:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Server
```bash
python app.py
```
The backend will start at `http://localhost:5000`.

### 4. Launch the Frontend
Simply open `index.html` in your browser or use a Live Server extension.

## 🧠 How it Works

1. **Input Validation**: The frontend validates name and age (must be realistic).
2. **Contextualization**: The Flask backend calculates the user's specific life stage (e.g., "Career Entry Phase", "Consolidation Phase").
3. **Structured Prompting**: A prompt is built using behavioral psychology principles, instructing Gemini to respond in a strict JSON format.
4. **Deterministic Output**: Gemini 1.5 Flash generates a grounded, probabilistic JSON response.
5. **Dynamic Rendering**: The frontend parses the JSON and populates the Glassmorphism grid with animations.

## ⚠️ Ethics & Disclaimer
LifeInsight AI is designed for entertainment and self-reflection. It uses probabilistic modeling based on general developmental patterns and does not provide absolute predictions, medical advice, or financial planning.

---
*Built with ❤️ using Google Gemini AI*

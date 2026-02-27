# Toolmen Server Frontend

## 📝 About The Service
The `toolmen-server-frontend` is the user-facing web interface for the Toolmen 2.0 system. It provides an intuitive, interactive dashboard that allows users to easily configure, launch, and monitor their dedicated Kubernetes-based AI and machine learning training environments. It communicates directly with the `toolmen-server-backend` to submit tasks and retrieve real-time environment status.

## 🛠️ Tech Stack
* **Framework / Library**: React
* **Language**: JavaScript
* **Styling**: Tailwind 
* **Containerization**: Docker

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
* Node.js (v22 or newer recommended)
* npm 

### 1. Install Dependencies
Navigate to this directory and install the required packages:
```bash
# Using npm
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the frontend directory to configure the connection to your backend service:

```env
# Example .env configuration
REACT_APP_BACKEND_BASE_URL=https://server-backend.toolmen.bime.ntu.edu.tw # URL for toolmen-server-backend
REACT_APP_YOUTUBE_TUTORIAL_SITE=https://www.youtube.com/embed/Mwd0Voio0-I   # URL for youtube tutorial website

```

### 3. Start the Development Server

Run the local development server with hot-reload enabled:

```bash
# Using npm
npm start
# (or npm run dev, depending on your package.json)

```

The application should now be running locally, typically at `http://localhost:3000` or `http://localhost:5173`.

AI Feedback System
--

Overview
- Full-stack app for collecting user feedback and generating AI-powered responses, summaries, and recommended actions.
- Backend: Django, Django REST Framework and integrates Google Gemini.
- Frontend: React Router v7 with Tailwind CSS.

Prerequisites
- Python 3.11+ (recommended)
- Node.js 18+ and npm
- A Google Gemini API key (`GEMINI_API_KEY`)

Quick Start
1) Backend (Django API)
    - Create `backend/.env` with your secrets:
        ```
        GEMINI_API_KEY=your_gemini_api_key
        DJANGO_SECRET_KEY=your-django-secret-key-here
        ```
    - Move to the `backend` folder:
        ```
        cd "d:\My Projects\review-ai-app\backend"
        ```
    - Setup and activate virtual env:
        ```
        python -m venv .venv
        .venv\Scripts\Activate 
        ```
    - Install the requirements:
        ```
        pip install -r requirements.txt
        ```
    - Run Migrations:
        ```
        python manage.py makemigrations
        python manage.py migrate
        ```

    - Run the Server:
        ```
        python manage.py runserver
        ```
2) Frontend
    - Move to `frontend` folder
        ```
        cd "\frontend"
        ```
    - Install and run dev server:
        ```
        npm install
        npm run dev
        ```
    - Optional: configure API base URL. The app defaults to `http://localhost:8000/api`. To override, add `.env` at project root of `frontend/`:
        ```
        API_BASE_URL=<your-backend-api-url>
        ```
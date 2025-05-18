# HMT-EZQ (EZ-RFQ) Quoting App

A modern manufacturing quoting application for Ravnsgaard Metal, featuring a FastAPI backend and a Vite+React frontend. The app allows users to create, view, and manage quotes with parts, operations, and file uploads, with a focus on usability and professional quoting workflows.

---

## Features
- **Quote Management:** Create, edit, and view detailed manufacturing quotes.
- **Parts & Operations:** Add multiple parts per quote, each with customizable operations.
- **File Uploads:** Attach PDF and STEP files to each part (optional).
- **Live Price Calculation:** See live unit price per part based on operation times, material cost, and hourly rate.
- **Custom Hourly Rate:** Set and edit hourly rate per part (default 1000 kr).
- **PDF Export:** Export quotes as PDF (backend feature).
- **Modern UI:** Clean, responsive, and user-friendly design.

---

## Project Structure

```
backend/    # FastAPI backend (Python)
frontend/   # Vite + React frontend (JavaScript/JSX)
```

---

## Getting Started

### Backend (FastAPI)
1. **Create and activate a virtual environment:**
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
2. **Install dependencies:**
   ```powershell
   pip install fastapi uvicorn[standard] sqlalchemy pydantic python-multipart jinja2 reportlab
   ```
3. **Run the backend server:**
   ```powershell
   uvicorn main:app --reload
   ```

### Frontend (Vite + React)
1. **Install dependencies:**
   ```powershell
   cd frontend
   npm install
   ```
2. **Run the frontend dev server:**
   ```powershell
   npm run dev
   ```

---

## Usage
- Open the frontend in your browser (default: http://localhost:5173/).
- Start creating quotes, adding parts, operations, and uploading files as needed.
- All data is saved to the backend and can be viewed in detail.

---

## API Endpoints (Backend)
- `GET /` — Status check
- `POST /quotes/` — Create a new quote
- `GET /quotes/` — List all quotes
- `GET /quotes/{quote_id}` — Get detailed quote info
- `POST /upload/` — Upload PDF/STEP files
- ...and more

---

## Customization & Development
- **Frontend:** Edit React components in `frontend/src/components/` and main logic in `frontend/src/App.jsx`.
- **Backend:** Edit FastAPI endpoints and models in `backend/main.py`.
- **Styling:** Global styles in `frontend/src/App.css`.

---

## License
This project is for internal use at Ravnsgaard Metal. Contact the author for licensing or commercial inquiries.

---

## Credits
Developed by Ravnsgaard Metal with FastAPI, React, and Vite.

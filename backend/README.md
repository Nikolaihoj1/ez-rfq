# EZ-RFQ Backend

This is the FastAPI backend for the EZ-RFQ manufacturing quoting app.

## Features
- File uploads (PDF, STEP)
- Quote and part management
- PDF export
- SQLite database

## Getting Started

1. Create and activate the virtual environment:
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   ```
2. Install dependencies (if not already):
   ```powershell
   pip install fastapi uvicorn[standard] sqlalchemy pydantic python-multipart jinja2 reportlab
   ```
3. Run the development server:
   ```powershell
   uvicorn main:app --reload
   ```

## API
- Root endpoint: `GET /` returns a status message.
- More endpoints coming soon.

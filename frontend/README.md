# EZ-RFQ Frontend

This is the Vite+React frontend for the EZ-RFQ manufacturing quoting app.

## Features
- Modern UI for managing parts, operations, and quotes
- File upload and preview (PDF, STEP)
- Quote list, copy, and edit features
- PDF export

## Getting Started

1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```

The app will be available at the local address shown in the terminal (usually http://localhost:5173).

## API
- Connects to the FastAPI backend (see backend/README.md for details).

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

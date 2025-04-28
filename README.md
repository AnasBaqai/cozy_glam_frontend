# Cozy Glam Frontend

This is the frontend for the Cozy Glam e-commerce application built with React, TypeScript, and Vite.

## Project Structure

```
cozy_glam_frontend/
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── cozy_glam_logo.jpeg (To be provided)
│   │   └── components/
│   │   └── ui/
│   │   └── pages/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── LoginPage.tsx
│   │       └── signup/
│   │           └── SignupPage.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
│   └── favicon.ico (To be provided)
├── index.html
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd cozy_glam_frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your logo and favicon:

   - Place your `cozy_glam_logo.jpeg` in `src/assets/images/`
   - Place your `favicon.ico` in `public/`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Technology Stack

- React - UI library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Routing

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Design Notes

The design follows a clean and modern aesthetic with:

- Consistent spacing throughout the UI
- Elegant typography combining serif for headings and sans-serif for content
- Responsive layout that works on all devices

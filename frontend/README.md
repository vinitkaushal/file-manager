# File Management System - Frontend

This is the frontend of a full-featured File Management System built using React (Vite), Redux Toolkit, and SCSS. It enables users to upload, view, organize, and manage files and folders through an interactive UI with real-time two-way interaction between the sidebar tree and the main content section.

## Features

- Folder/file hierarchy display with collapsible tree view
- Two-way dynamic updates between sidebar and middle section
- File viewing with iframe integration
- Create/Edit/Delete folders and files via modals
- Upload with drag & drop support and visual progress
- Filters: by name, description, and date
- Pagination for performance on large datasets
- Responsive design with clean, modern UI

## Technologies

React (Vite), Redux Toolkit, SCSS, Fetch API, Jest (optional for testing)

## Folder Structure

- `src/assets/`: images and icons
- `src/components/`: UI components like Sidebar, MiddleSection, Modal etc.
- `src/features/`: Redux slices (ui, folderForm, fetchFilesAndFolders)
- `src/hooks/`: custom hooks like `useApiService`
- `src/styles/`: global and shared styles
- `src/utils/`: utility functions like `normalizeItems.js`
- `App.jsx`, `main.jsx`: entry and root component setup

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/vinitkaushal/file-manager.git
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of your project and add the following:

```env
VITE_BASE_URL=http://localhost:5000
```

4. Run the development server:

```bash
npm install
```

5. Start the server:

```bash
npm start
```

App runs at `http://localhost:5173`

## API Integration

Ensure the backend is running and accessible. API endpoints used include:

- `POST /api/getFilesAndFolders` for fetching hierarchy with filters
- `GET /api/files/view/:id` for iframe file viewing
- `POST /api/folders/create` for folder creation
- `POST /api/files/upload` for file uploads

The frontend uses `VITE_BASE_URL` from `.env` file for all API requests.

## Build

To build for production:

```bash
npm run build
```

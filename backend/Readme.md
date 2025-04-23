# File Management System - Backend

This is the backend service for the File Management System built using **Node.js**, **Express.js**, and **MongoDB**. It provides a RESTful API for file and folder management, including uploading, deleting, editing, and hierarchical retrieval with support for filtering and pagination.

## Features

- Create/Edit/Delete folders
- Upload/Delete/View files
- Hierarchical file & folder retrieval with nested structure
- Filtering by name, description, date
- Pagination support
- Upload progress tracking using Server-Sent Events (SSE)
- MongoDB for storage with Mongoose ODM

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Multer for file uploads
- dotenv for environment configuration
- cors, morgan, body-parser, express-validator

## Folder Structure

- `controllers/`: route handler logic
- `routes/`: route definitions
- `models/`: Mongoose schemas
- `uploads/`: directory where uploaded files are stored (excluded from version control using .gitignore)
- `config/`: database and app configurations
- `utils/`: utility functions like sendProgress
- `server.js`: main entry point

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/vinitkaushal/file-manager.git
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/file_management
```

4. Start the server:

```bash
npm start
```

Backend runs at `http://localhost:5000`

## API Endpoints

- `POST /api/folders/create`: Create new folder
- `PATCH /api/folders/edit`: Edit folder details
- `DELETE /api/folders/delete/:id`: Delete a folder
- `POST /api/files/upload`: Upload a file
- `GET /api/files/view/:id`: View file content
- `DELETE /api/files/delete/:id`: Delete file
- `POST /api/getFilesAndFolders`: Get folder/file hierarchy with filters

Postman collection added for testing all routes.

## Testing

Use Postman or Swagger to test routes locally.

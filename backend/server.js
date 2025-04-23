require('dotenv').config();
require('express-async-errors');

const express = require('express');
const connectDB = require('./config/db');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const fileManagerRoutes = require('./routes/fileManagerRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/getFilesAndFolders', fileManagerRoutes);
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

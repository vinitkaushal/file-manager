import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../features/ui/uiSlice';
import Modal from '../Modal/Modal';
import './UploadFileModal.css';
import uploadIcon from "../../assets/upload-file-icon.png";
import uploadingIcon from "../../assets/uploading-file-icon.png";
import useApiService from '../../hooks/useApiService';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];

const UploadFileModal = () => {
    const base_URL = import.meta.env.VITE_BASE_URL;
    const { postAPI } = useApiService();
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const sseRef = useRef(null);
    const dispatch = useDispatch();
    const { isOpen, modalType } = useSelector((state) => state.ui);
    const { parentFolderId } = useSelector((state) => state.folderForm);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Invalid file type. Only PDF, PNG, JPG, and TXT files are allowed.";
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `File size exceeds ${MAX_FILE_SIZE_MB}MB.`;
        }
        return null;
    };

    const handleFileSelect = (selectedFile) => {
        const validationError = validateFile(selectedFile);
        if (validationError) {
            setError(validationError);
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        setError('');
        if (!file) {
            setError('Please upload file');
            return;
        }

        try {
            sseRef.current = new EventSource(`${base_URL}/api/files/progress`);

            sseRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data && data.name === file?.name) {
                    setUploadProgress(data.progress);

                    if (data.progress >= 100) {
                        sseRef.current.close();
                        sseRef.current = null;
                        dispatch(hideModal());
                        setFileUploading(false);
                        setFile(null);
                    }
                }
            };

            sseRef.current.onerror = (err) => {
                console.error("SSE error:", err);
                if (sseRef.current) {
                    sseRef.current.close();
                    sseRef.current = null;
                }
            };

            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append("folder", parentFolderId ? parentFolderId : null);
            formdata.append("isParentFile", parentFolderId ? true : false);

            setFileUploading(true);
            const result = await postAPI(`/api/files/upload`, formdata);

            if (!result) {
                setError("Something went wrong during file upload.");
            }

        } catch (error) {
            console.error('Error during file upload:', error);
            setError("Upload failed.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length) {
            handleFileSelect(droppedFiles[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <Modal isOpen={isOpen && modalType === 'uploadFile'} onClose={() => dispatch(hideModal())} title={"Upload document"}>
            {!fileUploading ? (
                <>
                    <label htmlFor="uploadDocument" className="upload-label">Browse document</label>
                    <label
                        className={`file-drop-area ${isDragging ? 'dragging' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        htmlFor="uploadDocument"
                    >
                        <input
                            type="file"
                            id="uploadDocument"
                            className="hidden-file-input"
                            accept=".pdf, .png, .jpg, .jpeg, .txt"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                        <div className="upload-icon-preview">
                            <img src={uploadIcon} alt="upload" />
                            <p>{file ? file?.name : 'Browse or drag & drop'}</p>
                        </div>
                        {error && <p className="error-text">{error}</p>}
                    </label>
                </>
            ) : (
                <>
                    <div className="upload-preview">
                        <div className="file-info">
                            <img src={uploadingIcon} alt="uploading" />
                            <div>
                                <div className="file-name">{file?.name}</div>
                                <div className="file-size">{(file?.size / 1024 / 1024).toFixed(1)} MB</div>
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="progress-text">{uploadProgress}% upload completed</p>
                    </div>
                </>
            )}
            <div className="modal-buttons">
                <button className="cancel-button" onClick={() => {
                    if (sseRef.current) {
                        sseRef.current.close();
                        sseRef.current = null;
                    }
                    setFile(null);
                    setFileUploading(false);
                    dispatch(hideModal());
                }}>Cancel</button>
                <button className={`create-button ${fileUploading ? "disable-button" : ""}`} onClick={handleUpload} disabled={fileUploading}>Upload</button>
            </div>
        </Modal >
    );
};

export default UploadFileModal;

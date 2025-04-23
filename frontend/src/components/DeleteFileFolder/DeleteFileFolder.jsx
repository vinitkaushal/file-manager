import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../features/ui/uiSlice';
import { resetFolderForm } from '../../features/folder/folderFormSlice';
import Modal from '../Modal/Modal';
import './DeleteFileFolder.css';
import useApiService from '../../hooks/useApiService';

const DeleteFileFolder = () => {
    const { deleteAPI } = useApiService();
    const dispatch = useDispatch();
    const { isOpen, modalType } = useSelector((state) => state.ui);
    const { parentFolderId } = useSelector((state) => state.folderForm);
    const handleSubmit = async () => {
        try {
            const result = await deleteAPI(`/api/${modalType === 'DeleteFile' ? "files" : "folders"}/delete/${parentFolderId}`);
            if (result) {
                const response = JSON.parse(result);
                if (response?.success) {
                    dispatch(resetFolderForm());
                    dispatch(hideModal());
                }
            } else {
                console.error('Something went wrong while creating folder.');
            }
        } catch (error) {
            console.error('Error during folder creation:', error);
        }
    };

    return (
        <Modal isOpen={isOpen && (modalType === 'DeleteFile' || modalType === 'DeleteFolder')} onClose={() => dispatch(hideModal())} title={`Delete ${modalType === 'DeleteFile' ? "File" : "Folder"}`}>

            <div className="delete-title">
                Are you sure you want to delete this {modalType === 'DeleteFile' ? "file" : "folder"}?
            </div>

            <div className="modal-buttons">
                <button className="cancel-button" onClick={() => dispatch(hideModal())}>Cancel</button>
                <button className="create-button" onClick={handleSubmit}>Delete</button>
            </div>
        </Modal>
    );
};

export default DeleteFileFolder;

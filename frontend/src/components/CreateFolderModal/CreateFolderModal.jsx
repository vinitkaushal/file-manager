import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../features/ui/uiSlice';
import { setFolderName, setFolderDescription, resetFolderForm } from '../../features/folder/folderFormSlice';
import Modal from '../Modal/Modal';
import './CreateFolderModal.css';
import useApiService from '../../hooks/useApiService';

const CreateFolderModal = () => {
    const { postAPI, patchAPI } = useApiService();
    const dispatch = useDispatch();
    const { isOpen, modalType } = useSelector((state) => state.ui);
    const { name, description, parentFolderId } = useSelector((state) => state.folderForm);
    const [errors, setErrors] = React.useState({});
    console.log(parentFolderId)
    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Folder name is required';
        // if (!description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const raw = JSON.stringify({
                name: name.trim(),
                description: description.trim(),
                parent: modalType === 'createFolder' ? null : parentFolderId
            });
            let result = {};
            if (modalType === 'editFolder') result = await patchAPI(`/api/folders/edit`, raw);
            else result = await postAPI('/api/folders/create', raw);
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
        <Modal isOpen={isOpen && (modalType === 'folderAdd' || modalType === 'createFolder' || modalType === 'editFolder')} onClose={() => dispatch(hideModal())} title={`${modalType === 'editFolder' ? "Update" : "Create"} Folder`}>
            <label htmlFor="Name">Name</label>
            <input
                type="text"
                id="Name"
                placeholder="Folder name"
                value={name}
                onChange={(e) => dispatch(setFolderName(e.target.value))}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}

            <label htmlFor="description">Description</label>
            <input
                type="text"
                id="description"
                placeholder="Folder description"
                value={description}
                onChange={(e) => dispatch(setFolderDescription(e.target.value))}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}

            <div className="modal-buttons">
                <button className="cancel-button" onClick={() => dispatch(hideModal())}>Cancel</button>
                <button className="create-button" onClick={handleSubmit}>{modalType === 'editFolder' ? "Update" : "Create"}</button>
            </div>
        </Modal>
    );
};

export default CreateFolderModal;

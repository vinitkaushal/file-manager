import React, { useState, useEffect, useRef } from 'react';
import './ContextMenu.css';
import { useDispatch } from 'react-redux';
import { showModal, hideModal } from '../../features/ui/uiSlice';
import plusIcon from '../../assets/plus.png';
import filterIcon from '../../assets/filter.png';
import { resetFolderForm } from '../../features/folder/folderFormSlice';
import { fetchFilesAndFolders } from '../../features/fetchFilesAndFolders/fetchFilesAndFolders';

const ContextMenu = () => {
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({ name: '', description: '', date: '' });
    const [showDropdown, setShowDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);


    const dropdownRef = useRef(null);
    const filterRef = useRef(null);

    const handleClear = () => {
        setFilters({ name: '', description: '', date: '' });
    };

    const handleApply = () => {
        dispatch(fetchFilesAndFolders({ page: 1, limit: 10, ...filters }));
        setShowFilterDropdown(!showFilterDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) ||
                filterRef.current && !filterRef.current.contains(event.target)
            ) {
                if (showDropdown) setShowDropdown(!showDropdown);
                if (showFilterDropdown) setShowFilterDropdown(!showFilterDropdown);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown, showFilterDropdown]);

    return (
        <div className="context-menu">
            <button className="filter-button" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                <img src={filterIcon} alt="filter" />
            </button>
            <button className="plus-button" onClick={() => setShowDropdown(!showDropdown)}>
                <img src={plusIcon} alt="plus" />
            </button>

            {showDropdown && (
                <div className="dropdown" ref={dropdownRef}>
                    <div onClick={() => { dispatch(showModal('createFolder')); dispatch(resetFolderForm()); setShowDropdown(!showDropdown); }}>Create Folder</div>
                    <hr className='hr' />
                    <div onClick={() => { dispatch(showModal('uploadFile')); setShowDropdown(!showDropdown); }}>Upload File</div>
                </div>
            )}

            {showFilterDropdown && (
                <div className="filter-dropdown" ref={filterRef}>
                    <div className="filter-header">
                        <span>Filters</span>
                        <div className='filter-close-buttons'>
                            <button className="clear-button" onClick={handleClear}>Clear</button>
                            <button className="close-button" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>&times;</button>
                        </div>
                    </div>
                    <div className="filter-body">

                        <label htmlFor="folderName">Name</label>
                        <input
                            type="text"
                            placeholder="Folder name"
                            id='folderName'
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        />
                        <div className="filter-inputs">
                            <label htmlFor="folderDescription">Description</label>
                            <input
                                type="text"
                                placeholder="Description"
                                id='folderDescription'
                                value={filters.description}
                                onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                            />
                        </div>
                        <div className="filter-inputs">
                            <label htmlFor="folderDate">Date</label>
                            <input
                                type="date"
                                value={filters.date}
                                id='folderDate'
                                placeholder='DD-MM-YYYY'
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>Cancel</button>
                            <button className="create-button" onClick={handleApply}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContextMenu;

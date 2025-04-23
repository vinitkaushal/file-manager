import React, { Fragment, useEffect, useRef, useState } from 'react';
import './MiddleSection.css';
import folderIcon from '../../assets/folder.png';
import uploadingIcon from "../../assets/uploading-file-icon.png";
import expandIcon from '../../assets/expand.png';
import editIcon from '../../assets/edit.png';
import deleteIcon from '../../assets/delete.png';
import createIcon from '../../assets/create.png';
import uploadIcon from '../../assets/upload.png';
import { useDispatch, useSelector } from 'react-redux';
import { selectFolder, showModal, toggleFolderOpen } from '../../features/ui/uiSlice';
import { fetchFilesAndFolders } from '../../features/fetchFilesAndFolders/fetchFilesAndFolders';
import { normalizeItems } from '../../utiles/normalizeItems';
import { setFolderDescription, setFolderName, setParentFolderId, resetFolderForm } from '../../features/folder/folderFormSlice';
import { formatDate } from '../../utiles/common';

const FolderRow = ({ item, level = 0, isLastChild = false, isUnderNoChildParent = false, onFileClick }) => {
    const [showOptions, setShowOptions] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const selectedFolderId = useSelector((state) => state.ui.selectedFolderId);
    const openFolders = useSelector((state) => state.ui.openFolders);
    const isFile = item.isFile;
    const isOpen = openFolders.includes(item.id);

    const handleToggleDropdown = (e) => {
        e.stopPropagation();
        setShowOptions(prev => !prev);
    };

    const handleClick = () => {
        if (isFile) {
            onFileClick(item.id);
        } else {
            dispatch(selectFolder(item.id));
            dispatch(toggleFolderOpen(item.id));
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <>
            <tr className={`middle-row ${item.id === selectedFolderId ? 'highlight' : ''}`} onClick={handleClick}>
                <td className="middle-indent" style={{
                    paddingLeft: `${item.children?.length === 0 && level === 0
                        ? 1
                        : isUnderNoChildParent
                            ? 3 * 1.5
                            : level * 1.5
                        }rem`,
                    position: "relative"
                }}>
                    {!item.isFile && item.children?.length > 0 && (
                        <button
                            className={`middle-toggle-btn ${isOpen ? 'expanded' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                        >
                            <img src={expandIcon} alt="toggle" className="middle-toggle-icon" />
                        </button>
                    )}
                    <span className="middle-serial-wrapper">
                        {!item.isFile && <span className="middle-serial">{item.count}</span>}
                        <img
                            src={item.isFile ? uploadingIcon : folderIcon}
                            alt="icon"
                            className="middle-folder-icon"
                        />
                    </span>
                    {item.name}
                </td>
                <td className="middle-folder-desc">{item.description || '–––'}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>{formatDate(item.updatedAt)}</td>
                <td className="middle-folder-options">
                    <div className="dropdown-wrapper" onClick={handleToggleDropdown}>
                        <span>⋮</span>
                        {showOptions && (
                            <div className="dropdown" ref={dropdownRef}>
                                {!item.isFile && (
                                    <>
                                        <div onClick={() => {
                                            setShowOptions(false);
                                            dispatch(showModal('editFolder'));
                                            dispatch(setFolderName(item.name));
                                            dispatch(setFolderDescription(item.description));
                                            dispatch(setParentFolderId(item.id));
                                        }}>
                                            <img src={editIcon} alt="edit" className="middle-dropdown-icon" />
                                            Edit
                                        </div>
                                        <hr className="hr" />
                                    </>
                                )}
                                <div onClick={() => {
                                    setShowOptions(false);
                                    dispatch(showModal(isFile ? 'DeleteFile' : 'DeleteFolder'));
                                    dispatch(setParentFolderId(item.id));
                                }}>
                                    <img src={deleteIcon} alt="delete" className="middle-dropdown-icon" />
                                    Delete
                                </div>
                                {!item.isFile && (
                                    <>
                                        <hr className="hr" />
                                        <div onClick={() => {
                                            setShowOptions(false);
                                            dispatch(resetFolderForm());
                                            dispatch(showModal('folderAdd'));
                                            dispatch(setParentFolderId(item.id));
                                        }}>
                                            <img src={createIcon} alt="create" className="middle-dropdown-icon" />
                                            Create Folder
                                        </div>
                                        <hr className="hr" />
                                        <div onClick={() => {
                                            setShowOptions(false);
                                            dispatch(resetFolderForm());
                                            dispatch(showModal('uploadFile'));
                                            dispatch(setParentFolderId(item.id));
                                        }}>
                                            <img src={uploadIcon} alt="upload" className="middle-dropdown-icon" />
                                            Upload Document
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </td>
            </tr>
            {isOpen && item.children?.map((child, index) => (
                <FolderRow
                    key={child.id}
                    item={child}
                    level={level + 1}
                    isLastChild={index === item.children.length - 1}
                    isUnderNoChildParent={item.children?.length === 0}
                    onFileClick={onFileClick}
                />
            ))}
        </>
    );
};

const MiddleSection = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.files);
    const normalizedData = normalizeItems(data?.data || []);
    const [page, setPage] = useState(1);
    const [fileToView, setFileToView] = useState(null);
    const limit = 10;
    const totalPages = data?.totalPages || 1;

    useEffect(() => {
        dispatch(fetchFilesAndFolders({ page, limit }));
    }, [dispatch, page]);

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handleFileClick = (fileId) => {
        const fileURL = `${import.meta.env.VITE_BASE_URL}/api/files/view/${fileId}`;
        console.log("Opening file at URL:", fileURL);
        setFileToView(fileURL);
    };

    return (
        <Fragment>
            <div className="middle-layout">
                <div className="left-pane">
                    <div className="table-container">
                        <table className="middle-section-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Created at</th>
                                    <th>Updated at</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {normalizedData?.length > 0 ? normalizedData.map((item, index) => (
                                    <FolderRow
                                        key={item.id}
                                        item={item}
                                        isLastChild={index === normalizedData.length - 1}
                                        isUnderNoChildParent={false}
                                        onFileClick={handleFileClick}
                                    />
                                )) :
                                    <tr>
                                        <td className='no-record' colSpan={5}>No Record Found</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <button onClick={handlePrev} disabled={page === 1}>Previous</button>
                            <span>Page {page}</span>
                            <button onClick={handleNext} disabled={page >= totalPages}>Next</button>
                        </div>
                    </div>
                </div>

                {fileToView && (
                    <div className="right-pane">
                        <div className="file-preview-header">
                            <h3>File Preview</h3>
                            <button className="close-button" onClick={() => setFileToView(null)}>✕</button>
                        </div>
                        <iframe src={fileToView} title="File Viewer" width="100%" height="100%" />
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default MiddleSection;

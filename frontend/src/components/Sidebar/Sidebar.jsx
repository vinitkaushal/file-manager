import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Sidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleSidebar,
    showModal,
    selectFolder,
    toggleFolderOpen
} from '../../features/ui/uiSlice';
import folderIcon from "../../assets/folder.png";
import uploadingIcon from "../../assets/uploading-file-icon.png";
import documentIcon from "../../assets/document.png";
import avatarIcon from "../../assets/avatar.png";
import { fetchFilesAndFolders } from '../../features/fetchFilesAndFolders/fetchFilesAndFolders';
import { normalizeItems } from '../../utiles/normalizeItems';
import { setParentFolderId } from '../../features/folder/folderFormSlice';

const TreeNode = ({ item, level = 0, isLastChild }) => {
    const dispatch = useDispatch();
    const selectedFolderId = useSelector((state) => state.ui.selectedFolderId);
    const openFolders = useSelector((state) => state.ui.openFolders);

    const isFile = item.isFile;
    const isOpen = openFolders.includes(item.id);
    const hasChildren = item.children?.length > 0;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = () => {
        if (!isFile) {
            dispatch(selectFolder(item.id));
            dispatch(toggleFolderOpen(item.id));
        }
    };
    const isSelected = String(item.id) === String(selectedFolderId);
    return (
        <li className="tree-node">
            <div
                className={`node-content ${isSelected ? 'highlight' : ''}`}
                onClick={handleClick}
            >
                <img src={isFile ? uploadingIcon : folderIcon} alt="icon" />
                <span className='wrap-text'>{item.name}</span>

                {!isFile && (
                    <span className="expand-icon context-menu" onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }} ref={dropdownRef}>
                        +
                        {showDropdown && (
                            <div className="dropdown">
                                <div onClick={() => {
                                    dispatch(showModal('folderAdd'));
                                    dispatch(setParentFolderId(item.id));
                                    setShowDropdown(false);
                                }}>Create Folder</div>
                                <hr className="hr" />
                                <div onClick={() => { dispatch(showModal('file')); setShowDropdown(false); }}>Upload File</div>
                            </div>
                        )}
                    </span>
                )}
            </div>

            {hasChildren && isOpen && (
                <ul className="tree-children">
                    {item.children.map((child, index) => (
                        <TreeNode key={child.id} item={child} level={level + 1} isLastChild={index === item.children.length - 1} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Sidebar = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.sidebarOpen);
    const { data } = useSelector((state) => state?.files);
    useLayoutEffect(() => {
        dispatch(fetchFilesAndFolders({ page: 1, limit: 10 }));
    }, [dispatch]);
    const normalizedData = normalizeItems(data?.data);
    return (
        <div className="sidebar-shell">
            <div className="sidebar-icons">
                <div></div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span className="avatar"><img src={avatarIcon} alt="avatar" /></span>
            </div>

            <div className={`sidebar sidebar-content ${isOpen ? 'open' : 'closed'}`}>
                <button className="toggle-btn" onClick={() => dispatch(toggleSidebar())}>
                    {isOpen ? '<' : '>'}
                </button>

                {isOpen && (
                    <>
                        <div className="sidebar-header">
                            <div className="title">Folders & Documents</div>
                            <div className="counts">
                                <div className="count-block">
                                    <img src={folderIcon} alt="Folder Icon" />
                                    <div className="count-block-title">Folder</div>
                                    <div className="count-block-counter">{(data?.totalCount?.folder && data?.totalCount?.folder !== 0) ? data?.totalCount?.folder + "+" : 0}</div>
                                </div>
                                <div className="vertical-line"></div>
                                <div className="count-block">
                                    <img src={documentIcon} alt="Document Icon" />
                                    <div className="count-block-title">Document</div>
                                    <div className="count-block-counter">{(data?.totalCount?.file && data?.totalCount?.file !== 0) ? data?.totalCount?.file + "+" : 0}</div>
                                </div>
                            </div>
                        </div>

                        <div className="tree-scroll-container">
                            <ul className="tree-root">
                                {normalizedData?.map((item, index) => (
                                    <TreeNode key={item.id} item={item} isLastChild={index === normalizedData.length - 1} />
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import ContextMenu from '../ContextMenu/ContextMenu';
import './TopBar.css';

const TopBar = ({ path, onNavigate }) => {
    return (
        <div className="top-bar">
            <Breadcrumb path={path} onNavigate={onNavigate} />
            <ContextMenu />
        </div>
    );
};

export default TopBar;

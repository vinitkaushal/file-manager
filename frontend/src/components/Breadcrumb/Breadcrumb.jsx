import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ path, onNavigate }) => {
    const parts = path.split('/').filter(Boolean);

    return (
        <nav className="breadcrumb">
            <ul>
                {parts.map((folder, index) => {
                    const fullPath = parts.slice(0, index + 1).join('/');
                    return (
                        <li key={index} onClick={() => onNavigate(fullPath)}>
                            {folder}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;

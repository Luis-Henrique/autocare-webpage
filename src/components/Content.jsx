import React from 'react';
import '../styles/Content.css';

const Content = () => {
    return (
        <div className="content">
            <div id="home">
                <h1>Welcome to the Home Page</h1>
                <p>This is the content area. You can add your blocks/components here.</p>
            </div>
            <div id="sobre">
                <h2>Sobre Section</h2>
                <p>This is the Sobre section.</p>
            </div>
            <div id="contato">
                <h2>Contato Section</h2>
                <p>This is the Contato section.</p>
            </div>
        </div>
    );
};

export default Content;

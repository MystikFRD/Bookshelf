import React from 'react';
import ReactDOM from 'react-dom/client';

const DiagnosticApp = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Diagnostic Page</h1>
            <p>If you can see this, basic React rendering is working correctly.</p>
            <p>Current URL: {window.location.href}</p>
            <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
};

// Log to help debug
console.log('Diagnostic script running');

try {
    console.log('Attempting to render diagnostic app...');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<DiagnosticApp />);
    console.log('Diagnostic app rendered successfully!');
} catch (error) {
    console.error('Error during diagnostic render:', error);

    // Try to show the error on screen even if React fails
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
      <div style="color: red; padding: 20px; font-family: Arial;">
        <h1>React Initialization Error</h1>
        <pre>${error.message}\n\n${error.stack}</pre>
      </div>
    `;
    }
}
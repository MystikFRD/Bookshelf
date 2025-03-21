import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store/store';

// Simple component that's guaranteed to render
const DiagnosticApp = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Diagnostic Page</h1>
            <p>If you can see this, basic React rendering is working correctly.</p>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <h2>Environment Check</h2>
                <ul>
                    <li>React Version: {React.version}</li>
                    <li>Development Mode: {process.env.NODE_ENV === 'development' ? 'Yes' : 'No'}</li>
                    <li>Base URL: {window.location.origin}</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <h2>Redux Store Check</h2>
                <button
                    onClick={() => {
                        try {
                            console.log('Redux Store:', store.getState());
                            alert('Redux store logged to console. Check developer tools.');
                        } catch (error) {
                            console.error('Error accessing Redux store:', error);
                            alert('Error accessing Redux store: ' + error.message);
                        }
                    }}
                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Check Redux Store
                </button>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <h2>Next Steps</h2>
                <ol>
                    <li>Try uncommenting parts of your main app one by one to find what's causing the error</li>
                    <li>Check browser console for errors (F12 → Console tab)</li>
                    <li>Verify your API integration is working correctly</li>
                    <li>Check for routing issues</li>
                </ol>
            </div>
        </div>
    );
};
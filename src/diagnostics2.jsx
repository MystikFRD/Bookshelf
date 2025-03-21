try {
    console.log('Attempting to render diagnostic app...');
    const root = ReactDOM.createRoot(document.getElementById('root'));

    // Try rendering with the Redux Provider
    try {
        root.render(
            <Provider store={store}>
                <DiagnosticApp />
            </Provider>
        );
        console.log('Diagnostic app rendered successfully with Redux!');
    } catch (reduxError) {
        console.error('Error with Redux Provider:', reduxError);

        // If Redux fails, try rendering without it
        try {
            root.render(<DiagnosticApp />);
            console.log('Diagnostic app rendered successfully without Redux!');
        } catch (reactError) {
            console.error('Error during basic React render:', reactError);

            // Try to show the error on screen even if React fails
            const rootElement = document.getElementById('root');
            if (rootElement) {
                rootElement.innerHTML = `
          <div style="color: red; padding: 20px; font-family: Arial;">
            <h1>React Initialization Error</h1>
            <p>Redux Error: ${reduxError.message}</p>
            <p>React Error: ${reactError.message}</p>
            <pre>${reduxError.stack}\n\n${reactError.stack}</pre>
          </div>
        `;
            }
        }
    }
} catch (error) {
    console.error('Critical error during diagnostic render:', error);

    // Try to show the error on screen even if React fails
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
      <div style="color: red; padding: 20px; font-family: Arial;">
        <h1>Critical Initialization Error</h1>
        <pre>${error.message}\n\n${error.stack}</pre>
      </div>
    `;
    }
}

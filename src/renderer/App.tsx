import React from 'react';

function App() {
  // Test that ElectronAPI types are available
  const handleTestAPI = () => {
    if (window.electronAPI) {
      console.log('ElectronAPI is available and properly typed');
      // This will show TypeScript intellisense for the API methods
      window.electronAPI.getRecentPortfolios().then(portfolios => {
        console.log('Recent portfolios:', portfolios);
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Momentum Net Worth Tracker</h1>
      <p>Welcome to your personal net worth tracking application!</p>
      <p>
        This is the initial setup. The UI framework will be added in the next
        tasks.
      </p>
      <button
        onClick={handleTestAPI}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        Test ElectronAPI Types
      </button>
    </div>
  );
}

export default App;

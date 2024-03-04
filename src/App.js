import React, { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

function App() {
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Could not connect to MetaMask. Please try again.');
      }
    } else {
      setErrorMessage('Please install MetaMask!');
    }
  };

  const signMessage = async () => {
    if (!message.trim()) {
      setErrorMessage('Please enter a message to sign.');
      return;
    }
    if (accounts.length === 0) {
      setErrorMessage('No accounts found. Connect to MetaMask first.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Account:", await signer.getAddress());
      const signature = await signer.signMessage(message);
      setSignedMessage(signature);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error signing message. Please try again.');
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header className="App-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <button onClick={connectWallet} style={{ width: '200px' }}>Connect MetaMask</button>
        <input
          type="text"
          placeholder="Enter message to sign"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrorMessage('');
          }}
          style={{ margin: '10px 0', padding: '10px', width: '200px' }}
        />
        <button onClick={signMessage} style={{ width: '200px' }} disabled={!message.trim()}>Sign Message</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {signedMessage && (
          <div style={{ marginTop: '20px' }}>
            <p>Signed Message:</p>
            <textarea readOnly value={signedMessage} rows={10} cols={50} style={{ width: '100%' }} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

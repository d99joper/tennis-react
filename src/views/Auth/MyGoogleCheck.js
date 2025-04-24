import React, { useEffect, useRef } from 'react';
import { authAPI, playerAPI } from 'api/services';
import { enums } from 'helpers';

const MyGoogleCheck = ({ mode, callback, toggleLoading }) => {
  const codeClientRef = useRef(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleCodeClient;
      document.body.appendChild(script);
    };

    const initGoogleCodeClient = () => {
      if (!window.google?.accounts?.oauth2) return;

      codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'profile email openid',
        redirect_uri: 'postmessage',
        callback: async (response) => {
          if (response.code) {
            if (toggleLoading) toggleLoading();
            try {
              callback(response.code);
            } catch (err) {
              console.error('Login failed:', err);
            } finally {
              if (toggleLoading) toggleLoading();
            }
          }
        }
      });
    };

    if (!window.google?.accounts?.oauth2) {
      loadGoogleScript();
    } else {
      initGoogleCodeClient();
    }
  }, [callback, toggleLoading]);

  const handleClick = () => {
    codeClientRef.current?.requestCode();  // ✅ Only triggers when button is clicked
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={styles.icon}
      />
      <span style={styles.text}>
        {mode === enums.LOGIN_MODES.SIGN_UP ? 'Sign up with Google' : 'Sign in with Google'}
      </span>
    </button>
  );
};

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontSize: '16px',
    fontWeight: 500,
    color: '#444',
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
};

export default MyGoogleCheck;

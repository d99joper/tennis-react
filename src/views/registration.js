import React from 'react';
import Login from './login_django';
import { enums } from 'helpers';

const Registration = () => {

  const openPopup = (url, e) => {
    e.preventDefault()
    // Specify the size and other options for the popup
    const popupOptions = 'width=600,height=800,left=100,top=100,toolbar=no,scrollbars=yes,resizable=yes'

    // Open the popup window with the provided URL and options
    window.open(url, '_blank', popupOptions)
  }
  

  return (
    <div>
      <h2 >Registration</h2>
      {/* Your registration form goes here */}
      <Login mode={enums.LOGIN_MODES.SIGN_UP} />

      <p>
        By registering, you agree to our{' '}
        <a href='/terms-of-service' onClick={(e) => {openPopup('/terms-of-service', e)}}>Terms of Service</a> and{' '}
        <a href="/privacy-policy" onClick={(e) => {openPopup('/privacy-policy', e)}}>Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Registration;

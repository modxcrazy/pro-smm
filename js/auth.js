import { auth, ui, uiConfig } from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = 'index.html';
    } else {
      // Initialize FirebaseUI
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  // Handle sign up link
  document.getElementById('signUpLink').addEventListener('click', e => {
    e.preventDefault();
    uiConfig.signInSuccessUrl = 'index.html';
    uiConfig.signInOptions = [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      }
    ];
    ui.start('#firebaseui-auth-container', uiConfig);
  });

  // Handle forgot password link
  document.getElementById('forgotPasswordLink').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('forgotPasswordModal').style.display = 'block';
  });

  // Forgot password form
  document.getElementById('forgotPasswordForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('Password reset email sent. Please check your inbox.');
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('forgotPasswordForm').reset();
      })
      .catch(error => {
        console.error("Error sending reset email:", error);
        alert(`Error: ${error.message}`);
      });
  });

  // Modal close handlers
  document.querySelector('#forgotPasswordModal .close').addEventListener('click', () => {
    document.getElementById('forgotPasswordModal').style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('forgotPasswordModal')) {
      document.getElementById('forgotPasswordModal').style.display = 'none';
    }
  });
});

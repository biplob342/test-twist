// Login and Sign Up functionality for Testy Twists food ordering website

/**
 * Initialize authentication when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
  // Check if user is already logged in
  checkAuthStatus();

  // Initialize form toggle
  initializeFormToggle();

  // Initialize forms
  initializeLoginForm();
  initializeSignUpForm();

  // Initialize password toggles
  initializePasswordToggles();

  // Initialize password strength checker
  initializePasswordStrength();

  // Initialize social login buttons
  initializeSocialLogin();
});

/**
 * Check if user is already logged in
 */
function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // If user is logged in and tries to access login page, redirect to home
  if (currentUser && window.location.pathname.includes('login.html')) {
    // Show a message that user is already logged in
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect') || 'index.html';

    if (!urlParams.get('force')) {
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    }
  }
}

/**
 * Initialize form toggle between login and sign up
 */
function initializeFormToggle() {
  const loginToggle = document.getElementById('loginToggle');
  const signupToggle = document.getElementById('signupToggle');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginToggle.addEventListener('click', function () {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    clearAllErrors();
  });

  signupToggle.addEventListener('click', function () {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    clearAllErrors();
  });
}

/**
 * Initialize login form
 */
function initializeLoginForm() {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors('login');

    // Get form values
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate
    if (!validateEmail(email)) {
      showError('loginEmailError', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      showError('loginPasswordError', 'Password must be at least 6 characters');
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('hungerUsers')) || [];

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      showError('loginEmailError', 'No account found with this email');
      return;
    }

    if (user.password !== password) {
      showError('loginPasswordError', 'Incorrect password');
      return;
    }

    // Login successful
    const currentUser = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      loginTime: new Date().toISOString(),
      rememberMe: rememberMe
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Show success message
    showSuccess('Login Successful!', `Welcome back, ${user.name}!`);

    // Redirect after delay
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || 'index.html';
      window.location.href = redirectTo;
    }, 1500);
  });

  // Handle forgot password
  const forgotPassword = document.querySelector('.forgot-password');
  forgotPassword.addEventListener('click', function (e) {
    e.preventDefault();
    alert('Password reset functionality will be available soon. Please contact support at testytwist@gmail.com');
  });
}

/**
 * Initialize sign up form
 */
function initializeSignUpForm() {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors('signup');

    // Get form values
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate
    let isValid = true;

    if (name.length < 2) {
      showError('signupNameError', 'Please enter your full name');
      isValid = false;
    }

    if (!validateEmail(email)) {
      showError('signupEmailError', 'Please enter a valid email address');
      isValid = false;
    }

    if (!validatePhone(phone)) {
      showError('signupPhoneError', 'Please enter a valid phone number');
      isValid = false;
    }

    if (password.length < 6) {
      showError('signupPasswordError', 'Password must be at least 6 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showError('signupConfirmPasswordError', 'Passwords do not match');
      isValid = false;
    }

    if (!agreeTerms) {
      alert('Please agree to the Terms & Conditions');
      isValid = false;
    }

    if (!isValid) return;

    // Get existing users
    const users = JSON.parse(localStorage.getItem('hungerUsers')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      showError('signupEmailError', 'An account with this email already exists');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone,
      password: password,
      createdAt: new Date().toISOString(),
      orders: []
    };

    users.push(newUser);
    localStorage.setItem('hungerUsers', JSON.stringify(users));

    // Auto login
    const currentUser = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      loginTime: new Date().toISOString(),
      rememberMe: true
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Show success message
    showSuccess('Account Created!', `Welcome to Testy Twists, ${name}!`);

    // Redirect after delay
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || 'index.html';
      window.location.href = redirectTo;
    }, 1500);
  });
}

/**
 * Initialize password toggle buttons
 */
function initializePasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = this.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

/**
 * Initialize password strength checker
 */
function initializePasswordStrength() {
  const passwordInput = document.getElementById('signupPassword');
  const strengthIndicator = document.getElementById('passwordStrength');

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      const password = this.value;
      const strength = calculatePasswordStrength(password);

      strengthIndicator.textContent = strength.text;
      strengthIndicator.className = 'password-strength ' + strength.class;
    });
  }
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength === 0 || password.length === 0) {
    return { text: '', class: '' };
  } else if (strength <= 2) {
    return { text: 'Weak password', class: 'weak' };
  } else if (strength <= 3) {
    return { text: 'Medium password', class: 'medium' };
  } else {
    return { text: 'Strong password', class: 'strong' };
  }
}

/**
 * Initialize social login buttons
 */
function initializeSocialLogin() {
  const socialButtons = document.querySelectorAll('.social-btn');

  socialButtons.forEach(button => {
    button.addEventListener('click', function () {
      const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
      alert(`${provider} login will be available soon. Please use email registration.`);
    });
  });
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (basic validation for Bangladeshi numbers)
 */
function validatePhone(phone) {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s\-]/g, '');
  // Check if it's a valid format (10-15 digits, optionally starting with +)
  const re = /^\+?\d{10,15}$/;
  return re.test(cleaned);
}

/**
 * Show error message
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

/**
 * Clear errors for a specific form
 */
function clearErrors(formType) {
  const prefix = formType === 'login' ? 'login' : 'signup';
  const errorElements = document.querySelectorAll(`[id^="${prefix}"][id$="Error"]`);

  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
  });
}

/**
 * Clear all errors
 */
function clearAllErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
  });
}

/**
 * Show success message
 */
function showSuccess(title, message) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const successDiv = document.getElementById('authSuccess');
  const successTitle = document.getElementById('successTitle');
  const successMessage = document.getElementById('successMessage');

  // Hide forms
  loginForm.classList.add('hidden');
  signupForm.classList.add('hidden');

  // Show success
  successTitle.textContent = title;
  successMessage.textContent = message;
  successDiv.classList.remove('hidden');
}

/**
 * Logout function (can be called from other pages)
 */
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.hungerAuth = {
    logout: logout,
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
    isLoggedIn: () => !!localStorage.getItem('currentUser')
  };
}


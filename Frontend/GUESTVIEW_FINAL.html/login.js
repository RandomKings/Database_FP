const apiBaseUrl = "http://localhost:8000";
const firebaseConfig = {
    apiKey: "AIzaSyBfjOkpEgJ_NnE2keqP5dB2LHPyp3bGsQ8",
    authDomain: "hotel-reservation-6110e.firebaseapp.com",
    projectId: "hotel-reservation-6110e",
    storageBucket: "hotel-reservation-6110e.appspot.com",
    messagingSenderId: "203684596661",
    appId: "1:203684596661:web:d5ea0c48bca5e1865e67fc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth(); // Initialize auth

// Helper function to set userId globally in local storage
function setGlobalUserId(userId) {
    localStorage.setItem("userId", userId);
}

// Helper function to get the global userId
function getGlobalUserId() {
    return localStorage.getItem("userId");
}

// Prevent duplicate event listeners
if (!window.loginFormListenerAdded) {
    window.loginFormListenerAdded = true;

    let isLoggingIn = false; // Guard for duplicate submissions

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        if (isLoggingIn) return; // Block duplicate submissions
        isLoggingIn = true;

        const submitButton = document.querySelector('button[type="submit"]');
        const messageElement = document.getElementById('message');
        submitButton.disabled = true; // Disable submit button

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Basic validation
        if (!email || !password) {
            messageElement.textContent = "Please fill in all fields.";
            resetState();
            return;
        }

        try {
            // Log in user with Firebase
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            
            // Store the user UID globally in local storage
            const userId = userCredential.user.uid;
            setGlobalUserId(userId); // Save userId globally
            
            // Redirect to dashboard or desired page
            messageElement.textContent = "Login successful!";
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Error during login:", error);
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                messageElement.textContent = "Invalid email or password.";
            } else {
                messageElement.textContent = error.message || "An error occurred during login.";
            }
        } finally {
            resetState();
        }

        function resetState() {
            submitButton.disabled = false;
            isLoggingIn = false;
        }
    });
}

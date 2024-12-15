const apiBaseUrl = "http://localhost:8000";
const firebaseConfig = {
    apiKey: "AIzaSyBfjOkpEgJ_NnE2keqP5dB2LHPyp3bGsQ8",
    authDomain: "hotel-reservation-6110e.firebaseapp.com",
    projectId: "hotel-reservation-6110e",
    storageBucket: "hotel-reservation-6110e.appspot.com",
    messagingSenderId: "203684596661",
    appId: "1:203684596661:web:d5ea0c48bca5e1865e67fc"
};


const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth(); 

//store the userid for easier access
function setGlobalUserId(userId) {
    localStorage.setItem("userId", userId);
}

//gets the userid
function getGlobalUserId() {
    return localStorage.getItem("userId");
}


if (!window.loginFormListenerAdded) {
    window.loginFormListenerAdded = true;

    let isLoggingIn = false; 

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault(); 

        if (isLoggingIn) return; 
        isLoggingIn = true;

        const submitButton = document.querySelector('button[type="submit"]');
        const messageElement = document.getElementById('message');
        submitButton.disabled = true;

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        
        if (!email || !password) {
            messageElement.textContent = "Please fill in all fields.";
            resetState();
            return;
        }

        try {
            
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            
           
            const userId = userCredential.user.uid;
            setGlobalUserId(userId); 
           
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

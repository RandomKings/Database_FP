
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

if (!window.signupFormListenerAdded) {
    window.signupFormListenerAdded = true;

    let isSubmitting = false; 

    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault(); 

        if (isSubmitting) return; 
        isSubmitting = true;

        const submitButton = document.querySelector('button[type="submit"]');
        const messageElement = document.getElementById('message');
        submitButton.disabled = true; 
        
        const formData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone_number: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            date_of_birth: document.getElementById('dob').value,
            password: document.getElementById('password').value.trim()
        };

        
        if (Object.values(formData).some(value => !value)) {
            messageElement.textContent = "Please fill in all fields.";
            resetState();
            return;
        }

        try {
            // Create user with Firebase
            const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
            const guestID = userCredential.user.uid;

            // Prepare data fro the database
            const guestData = {
                guestID: guestID,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address,
                date_of_birth: formData.date_of_birth
            };

            // creating guest in database
            const response = await fetch(`${apiBaseUrl}/create_guests/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(guestData)
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.detail && error.detail.includes("already exists")) {
                    throw new Error("The email address is already in use.");
                }
                throw new Error(error.detail || "Failed to save guest data.");
            }

        } catch (error) {
            console.error("Error during signup:", error);
            if (error.message.includes("already in use")) {
                messageElement.textContent = "The email address is already in use.";
                resetState();
                return;
            } else {
                messageElement.textContent = error.message;
            }
        } finally {
            resetState();
            window.location.href = "login.html";
        }

        function resetState() {
            submitButton.disabled = false;
            isSubmitting = false;
        }
    });
}
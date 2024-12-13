function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Simulate successful login
    alert("Login successful!");
    window.location.href = "select_hotels.html"; // Redirect to select hotels page
    return true;
}

function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Simple email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Simulate successful sign-up
    alert("Sign-up successful!");
    window.location.href = "signup.html"; // Redirect to select hotels page
    return true;

}


// hotel selections page

// Assuming you stored the user's first and last name in local storage during sign-up


// The rest of your script.js code for handling hotel cards can go here
function bookHotel(hotelName) {
    alert(`You have booked ${hotelName}!`);
    // Here you can add code to handle the booking process
}

// Function to generate hotel cards

//DUMMY DATA
const hotels = [
    { name: "Hotel Sunshine", location: "Miami, FL", price: "$150/night",  },
    { name: "Mountain Retreat", location: "Aspen, CO", price: "$200/night" },
    { name: "City Center Hotel", location: "New York, NY", price: "$250/night" },
    { name: "Beach side Resort", location: "Cancun, Mexico", price: "$300/night" },
    { name: "Desert Oasis", location: "Phoenix, AZ", price: "$180/night" },
    { name: "Lakeside Inn", location: "Lake Tahoe, CA", price: "$220/night" }
];

// Dummy data for rooms
const rooms = [
    { hotelName: "Hotel Sunshine", type: "Deluxe Room", price: "$150/night", availability: 5 },
    { hotelName: "Hotel Sunshine", type: "Standard Room", price: "$100/night", availability: 2 },
    { hotelName: "Mountain Retreat", type: "Suite", price: "$300/night", availability: 3 },
    { hotelName: "Mountain Retreat", type: "Standard Room", price: "$200/night", availability: 0 },
    { hotelName: "City Center Hotel", type: "Executive Room", price: "$250/night", availability: 4 },
    { hotelName: "Beach side Resort", type: "Family Room", price: "$350/night", availability: 1 },
    { hotelName: "Desert Oasis", type: "Standard Room", price: "$180/night", availability: 2 },
    { hotelName: "Lakeside Inn", type: "Luxury Room", price: "$220/night", availability: 0 }
];


// Function to generate hotel cards
function generateHotelCards() {
    const hotelList = document.getElementById('hotel-list');
    hotelList.innerHTML = ''; // Clear existing cards

    hotels.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.innerHTML = `
            <h2>${hotel.name}</h2>
            <p>Location: ${hotel.location}</p>
            <p>Price: ${hotel.price}</p>
            <button onclick="bookHotel('${hotel.name}')">Book Now</button>
        `;
        hotelList.appendChild(hotelCard);
    });
}

// Function to generate room cards based on selected hotel
function generateRoomCards(selectedHotel) {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = ''; // Clear existing cards

    rooms.forEach(room => {
        if (room.hotelName === selectedHotel) {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <h2>${room.type}</h2>
                <p>Price: ${room.price}</p>
                <p>Availability: ${room.availability} rooms available</p>
                <button onclick="bookRoom('${room.type}', '${room.price}')"
                        ${room.availability === 0 ? 'disabled' : ''}>
                    ${room.availability === 0 ? 'Sold Out' : 'Book Now'}
                </button>
            `;
            roomList.appendChild(roomCard);
        }
    });
}

// Function to handle hotel booking
function bookHotel(hotelName) {
    // Redirect to room details page with the selected hotel name
    window.location.href = `room_details.html?hotel=${encodeURIComponent(hotelName)}`;
}

//room booking button
function bookRoom(roomType, roomPrice) {
    // Logic to handle the booking process
    alert(`You have booked a ${roomType} for ${roomPrice}.`);
    // Optionally, you can redirect to the payment page or perform other actions here
    window.location.href = 'payments.html';
}

// Function to initialize the hotel selection page
function initHotelSelection() {
    window.onload = generateHotelCards;
}

// Function to initialize the room details page
function initRoomDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedHotel = urlParams.get('hotel');

    if (selectedHotel) {
        generateRoomCards(selectedHotel);
    } else {
        document.getElementById('room-list').innerHTML = '<p>No hotel selected.</p>';
    }
}

// Check which page is being loaded and initialize accordingly
if (document.getElementById('hotel-list')) {
    initHotelSelection();
} else if (document.getElementById('room-list')) { // Corrected here
    initRoomDetails();
}


//LOGIN PAGE

// Dummy data for registered users
const registeredUsers = [
    { email: "user1@example.com", password: "password123" },
    { email: "user2@example.com", password: "my_password" },
    { email: "user3@example.com", password: "secure_pass" },
    { email: "user4@example.com", password: "let_me_in" },
    { email: "user5@example.com", password: "123456" }
];

// Function to validate login
function validateLogin(email, password) {
    const user = registeredUsers.find(user => user.email === email && user.password === password);
    return user !== undefined; // Returns true if user is found, false otherwise
}

// Handle form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    if (validateLogin(emailInput, passwordInput)) {
        document.getElementById('message').textContent = "Login successful!";
        // Redirect to another page or perform other actions
    } else {
        document.getElementById('message').textContent = "Invalid email or password.";
    }
});

const apiBaseUrl = "http://localhost:8000";


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch room types for a specific hotel
async function fetchRoomTypes(hotelId) {
    try {
        const response = await fetch(`${apiBaseUrl}/get_rooms/${hotelId}`);
        if (!response.ok) {
            throw new Error(`Error fetching room types: ${response.statusText}`);
        }
        const roomTypes = await response.json();
        return roomTypes;
    } catch (error) {
        console.error(error);
        alert('Failed to load room types. Please try again later.');
        return [];
    }
}

// Function to fetch room details by type
async function fetchRoomDetailsByType(roomType) {
    try {
        const response = await fetch(`${apiBaseUrl}/get_room_details_by_type/${roomType}`);
        if (!response.ok) {
            throw new Error(`Error fetching room details: ${response.statusText}`);
        }
        const roomDetails = await response.json();
        return roomDetails;
    } catch (error) {
        console.error(error);
        alert('Failed to load room details. Please try again later.');
        return null;
    }
}

// Function to generate room cards dynamically
async function generateRoomCards() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = ''; 

    const hotelId = getQueryParam('hotel_id');
    if (!hotelId) {
        alert('No hotel selected.');
        return;
    }

    const roomTypes = await fetchRoomTypes(hotelId);

    // Iterate over room types and fetch details for each
    for (const roomType of roomTypes) {
        const roomDetails = await fetchRoomDetailsByType(roomType.room_type);
        if (!roomDetails) continue;

        // Check if the room is booked or reserved
        const isUnavailable = roomType.status.toLowerCase() === 'booked' || roomType.status.toLowerCase() === 'reserved'|| roomType.status.toLowerCase() === 'under maintenance';

        const roomCard = document.createElement('div');
        roomCard.className = 'room-card bg-white rounded-lg shadow-md py-10 px-20 hover:shadow-lg transition-shadow';

        roomCard.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${roomDetails.roomType}</h2>
            <p class="text-gray-600 mt-2">Price: <span class="font-medium">$${roomDetails.price}/night</span></p>
            <p class="text-gray-600 mt-2">Bed Type: <span class="font-medium">${roomDetails.bed_type}</span></p>
            <p class="text-gray-600 mt-2">Capacity: <span class="font-medium">${roomDetails.max_occupancy} persons</span></p>
            <p class="text-gray-600 mt-2">Status: <span class="font-medium ${isUnavailable ? 'text-red-500' : 'text-green-500'}">${roomType.status}</span></p>
        `;

        // Add a "Book Room" button only if the room is available
        if (!isUnavailable) {
            const bookButton = document.createElement('button');
            bookButton.className = 'mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors';
            bookButton.textContent = 'Book Room';
            bookButton.onclick = () => redirectToReservation(
                hotelId, 
                roomType.roomID, 
                roomDetails.roomType, 
                roomType.status, 
                roomDetails.price
            );
            roomCard.appendChild(bookButton);
        }

        roomList.appendChild(roomCard);
    }
}


function redirectToReservation(hotelId, roomId, roomType, roomStatus, price) {
   
    const params = new URLSearchParams({
        hotel_id: hotelId,
        room_id: roomId,
        room_type: roomType,
        room_status: roomStatus,
        total_price: price
    });
    window.location.href = `reservation.html?${params.toString()}`;
}

function initRoomSelection() {
    window.onload = generateRoomCards;
}

if (document.getElementById('room-list')) {
    initRoomSelection();
}

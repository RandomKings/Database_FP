const apiBaseUrl = "http://localhost:8000";

//fetching the hotels function
async function fetchHotels() {
    try {
        const response = await fetch(`${apiBaseUrl}/get_all_hotels/`);
        if (!response.ok) {
            throw new Error(`Error fetching hotels: ${response.statusText}`);
        }
        const hotels = await response.json();
        return hotels;
    } catch (error) {
        console.error(error);
        alert('Failed to load hotels. Please try again later.');
        return [];
    }
}

//input the retreived hotels dynamically
async function generateHotelCards() {
    const hotelList = document.getElementById('hotel-list');
    hotelList.innerHTML = ''; 

    const hotels = await fetchHotels();

    hotels.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card bg-white rounded-lg shadow-md py-10 px-20 hover:shadow-lg transition-shadow';
        hotelCard.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${hotel.hotel_name}</h2>
            <p class="text-gray-600 mt-2">City: <span class="font-medium">${hotel.city}</span></p>
            <p class="text-gray-600 mt-2">Rating: <span class="font-medium">${hotel.rating.toFixed(1)} ★</span></p>
            <p class="text-gray-600 mt-2">Contact: <span class="font-medium">${hotel.phone_number}</span></p>
            <button 
                class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onclick="selectHotel(${hotel.hotelID})"
            >
                View Rooms
            </button>
        `;
        hotelList.appendChild(hotelCard);
    });
}


function selectHotel(hotelId) {

    window.location.href = `room_details.html?hotel_id=${hotelId}`;
}


function initHotelSelection() {
    window.onload = generateHotelCards;
}

if (document.getElementById('hotel-list')) {
    initHotelSelection();
}

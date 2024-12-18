        const apiBaseUrl = 'http://localhost:8000';
        

        function showSection(section) {
            document.getElementById('hotels-section').classList.add('hidden');
            document.getElementById('guests-section').classList.add('hidden');
            document.getElementById('reservations-section').classList.add('hidden');
            document.getElementById('rooms-section').classList.add('hidden');

            if (section === 'hotels') {
                document.getElementById('hotels-section').classList.remove('hidden');
                fetchHotels();
            } else if (section === 'guests') {
                document.getElementById('guests-section').classList.remove('hidden');
                fetchGuests();
            } else if (section === 'reservations') {
                document.getElementById('reservations-section').classList.remove('hidden');
            }else if (section === 'rooms') {
                document.getElementById('rooms-section').classList.remove('hidden');
            }
        }

      
        async function fetchHotels() {
            try {
                const response = await fetch(`${apiBaseUrl}/get_all_hotels/`);
                if (!response.ok) throw new Error('Failed to fetch hotels.');

                const hotels = await response.json();
                const hotelsTableBody = document.getElementById('hotels-table-body');
                hotelsTableBody.innerHTML = '';

                hotels.forEach(hotel => {
                    hotelsTableBody.innerHTML += `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">${hotel.hotelID}</td>
                            <td class="border border-gray-300 px-4 py-2">${hotel.hotel_name}</td>
                            <td class="border border-gray-300 px-4 py-2">${hotel.city}</td>
                            <td class="border border-gray-300 px-4 py-2">${hotel.rating}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" onclick="viewRooms(${hotel.hotelID}, '${hotel.hotel_name}')">View Rooms</button>
                                <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-2" onclick="showAddRoomForm(${hotel.hotelID}, '${hotel.hotel_name}')">Add Room</button>
                            </td>
                        </tr>
                    `;
                });
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        }

        
        async function fetchGuests() {
            try {
                const response = await fetch(`${apiBaseUrl}/getall_guests/`);
                if (!response.ok) throw new Error('Failed to fetch guests.');

                const guests = await response.json();
                const guestsTableBody = document.getElementById('guests-table-body');
                guestsTableBody.innerHTML = '';

                guests.forEach(guest => {
                    guestsTableBody.innerHTML += `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">${guest.guestID}</td>
                            <td class="border border-gray-300 px-4 py-2">${guest.first_name} ${guest.last_name}</td>
                            <td class="border border-gray-300 px-4 py-2">${guest.email}</td>
                            <td class="border border-gray-300 px-4 py-2">${guest.phone_number}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" 
                                    onclick="viewReservations('${guest.guestID}', '${guest.first_name} ${guest.last_name}')">
                                    View Reservations
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } catch (error) {
                console.error('Error fetching guests:', error);
            }
        }

        async function updateRoomStatus(hotelID, roomID) {
            const statusDropdown = document.getElementById(`status-${roomID}`);
            const newStatus = statusDropdown.value;
        
            try {
                const response = await fetch(`${apiBaseUrl}/change_room_status/${hotelID}/${roomID}?status=${newStatus}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) throw new Error('Failed to update room status.');
        
                alert('Room status updated successfully!');
                // Refresh the room list to reflect changes
                viewRooms(hotelID, document.getElementById('reservations-title').textContent.split('Rooms for ')[0]);
            } catch (error) {
                console.error('Error updating room status:', error);
                alert('An error occurred while updating room status. Please try again.');
            }
        }
        
        async function viewRooms(hotelID, hotelName) {
            try {
                const response = await fetch(`${apiBaseUrl}/get_rooms/${hotelID}`);
                if (!response.ok) throw new Error('Failed to fetch rooms.');
        
                const rooms = await response.json();
                const roomsTableBody = document.getElementById('rooms-table-body');
                const roomsTitle = document.getElementById('rooms-title');
        
                // Set title and clear previous rows
                roomsTitle.textContent = `Rooms for ${hotelName}`;
                roomsTableBody.innerHTML = '';
        
                if (rooms.length === 0) {
                    roomsTableBody.innerHTML = `
                        <tr>
                            <td colspan="4" class="border border-gray-300 px-4 py-2 text-center">No rooms available for this hotel.</td>
                        </tr>
                    `;
                    return;
                }
        
                rooms.forEach(room => {
                    const isEditable = room.status !== 'Booked' && room.status !== 'Reserved';
                    const canDelete = room.status === 'Available' || room.status === 'Under Maintenance';
        
                    roomsTableBody.innerHTML += `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">${room.roomID}</td>
                            <td class="border border-gray-300 px-4 py-2">${room.room_type}</td>
                            <td class="border border-gray-300 px-4 py-2">${room.status}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">
                                ${isEditable ? `
                                    <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded" 
                                        onclick="updateRoomStatus(${hotelID}, ${room.roomID})">
                                        Update
                                    </button>
                                ` : '<span class="text-gray-500">Not Editable</span>'}
                                ${canDelete ? `
                                    <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded ml-2" 
                                        onclick="deleteRoom(${hotelID}, ${room.roomID})">
                                        Delete
                                    </button>
                                ` : ''}
                            </td>
                        </tr>
                    `;
                });
        
                showSection('rooms');
            } catch (error) {
                console.error('Error fetching rooms:', error);
                alert('An error occurred while fetching rooms. Please try again.');
            }
        }
        
        



async function viewReservations(guestID, guestName) {
    try {
        const response = await fetch(`${apiBaseUrl}/reservations/guest/${guestID}`);
        if (!response.ok) throw new Error('Failed to fetch reservations.');

        const reservations = await response.json();
        const reservationsTableBody = document.getElementById('reservations-table-body');
        const reservationsTitle = document.getElementById('reservations-title');

        reservationsTitle.textContent = `Reservations for ${guestName}`;
        reservationsTableBody.innerHTML = '';

        for (const reservation of reservations) {
            
            const hotelResponse = await fetch(`${apiBaseUrl}/get_hotel_by_id/${reservation.hotelID}`);
            if (!hotelResponse.ok) throw new Error('Failed to fetch hotel.');

            const hotel = await hotelResponse.json();

            reservationsTableBody.innerHTML += `
                <tr>
                    <td class="border border-gray-300 px-4 py-2">${reservation.reservationID}</td>
                    <td class="border border-gray-300 px-4 py-2">${reservation.roomID}</td>
                    <td class="border border-gray-300 px-4 py-2">${reservation.check_in_date}</td>
                    <td class="border border-gray-300 px-4 py-2">${reservation.check_out_date}</td>
                    <td class="border border-gray-300 px-4 py-2">${reservation.total_price}</td>
                    <td class="border border-gray-300 px-4 py-2">${reservation.status}</td>
                </tr>
            `;
        }

        showSection('reservations');
    } catch (error) {
        alert(`No reservation made by ${guestName}`);
    }
}
let selectedHotelID = null;
let selectedHotelName = null;

function showAddRoomForm(hotelID, hotelName) {
    selectedHotelID = hotelID;
    selectedHotelName = hotelName;

    document.getElementById('modal-hotel-name').textContent = hotelName;
    document.getElementById('add-room-modal').classList.remove('hidden');
}


function closeAddRoomModal() {
    document.getElementById('add-room-modal').classList.add('hidden');
}


async function addRoom() {
    const roomType = document.getElementById('room-type').value;

    const roomData = {
        hotelID: selectedHotelID,
        status: 'Available',
        room_type: roomType
    };

    try {
        const response = await fetch(`${apiBaseUrl}/create_rooms/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) throw new Error('Failed to add room.');

        alert('Room added successfully!');
        closeAddRoomModal();
    } catch (error) {
        console.error('Error adding room:', error);
        alert('An error occurred while adding the room. Please try again.');
    }
}

function showAddHotelModal() {
    document.getElementById('add-hotel-modal').classList.remove('hidden');
}

function closeAddHotelModal() {
    document.getElementById('add-hotel-modal').classList.add('hidden');
    document.getElementById('hotel-name').value = '';
    document.getElementById('city').value = '';
    document.getElementById('address').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('rating').value = '';
}


async function addHotel() {
    const hotelData = {
        hotel_name: document.getElementById('hotel-name').value.trim(),
        city: document.getElementById('city').value.trim(),
        address: document.getElementById('address').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone_number: document.getElementById('phone-number').value.trim(),
        rating: parseFloat(document.getElementById('rating').value.trim()),
    };

    try {
        const response = await fetch(`${apiBaseUrl}/create_hotel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hotelData),
        });

        if (!response.ok) throw new Error('Failed to add hotel.');

        alert('Hotel added successfully!');
        closeAddHotelModal();
        fetchHotels();
    } catch (error) {
        console.error('Error adding hotel:', error);
        alert('An error occurred while adding the hotel. Please try again.');
    }
}


async function deleteRoom(hotelID, roomID) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
        const response = await fetch(`${apiBaseUrl}/delete_rooms/${hotelID}/${roomID}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete room.');

        alert('Room deleted successfully!');
        viewRooms(hotelID, selectedHotelName); 
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('An error occurred while deleting the room. Please try again.');
    }
}

        document.addEventListener('DOMContentLoaded', () => showSection('hotels'));
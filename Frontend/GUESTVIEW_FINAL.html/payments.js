document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const amountPayingInput = document.getElementById('amountPaying');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const statusMessage = document.getElementById('statusMessage');
    const apiBaseUrl = "http://localhost:8000";

    // Retrieve reservationID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const reservationID = urlParams.get('reservationID');

    if (!reservationID) {
        statusMessage.textContent = 'Reservation ID not found in the URL.';
        statusMessage.style.color = 'red';
        return;
    }

    // Fetch the reservation details from the API
    async function fetchReservationDetails() {
        try {
            const response = await fetch(`${apiBaseUrl}/get_reservations_by_id/${reservationID}`);
            if (!response.ok) {
                throw new Error(`Error fetching reservation details: ${response.statusText}`);
            }
            const reservationData = await response.json();
            if (reservationData && reservationData.total_price) {
                amountPayingInput.value = reservationData.total_price;
            } else {
                throw new Error('Total price not found in the reservation data.');
            }
        } catch (error) {
            statusMessage.textContent = error.message;
            statusMessage.style.color = 'red';
        }
    }

    fetchReservationDetails();

    // Add payment methods to the dropdown
    const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Online'];
    paymentMethods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        paymentMethodSelect.appendChild(option);
    });

    // Function to update reservation status
    async function updateReservationStatus(reservationID) {
        const statusUpdateData = {
            reservation_status: "Confirmed",
        };

        try {
            const response = await fetch(`${apiBaseUrl}/update_reservation_status/${reservationID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(statusUpdateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error updating reservation status.');
            }

            const updatedReservation = await response.json();
            console.log('Updated Reservation:', updatedReservation);
        } catch (error) {
            console.error('Error updating reservation status:', error);
            throw error;
        }
    }

    // Function to update room status to "Booked"
    async function updateRoomStatusToBooked(reservationID) {
        try {
            // Get hotelID and roomID using /reservation_rooms/{reservation_id}
            const reservationRoomResponse = await fetch(`${apiBaseUrl}/reservation_rooms/${reservationID}`);
            if (!reservationRoomResponse.ok) {
                const errorData = await reservationRoomResponse.json();
                throw new Error(errorData.detail || 'Error fetching reservation room details.');
            }

            const reservationRoomData = await reservationRoomResponse.json();
            console.log(reservationRoomData);
            const { hotelID, roomID } = reservationRoomData[0];
            console.log(hotelID, roomID);

            // Update room status to "Booked" using /change_room_status/{hotel_id}/{room_id}
            const updateRoomResponse = await fetch(
                `${apiBaseUrl}/change_room_status/${hotelID}/${roomID}?status=Booked`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!updateRoomResponse.ok) {
                const errorData = await updateRoomResponse.json();
                throw new Error(errorData.detail || 'Failed to update room status to Booked.');
            }

            const updatedRoom = await updateRoomResponse.json();
            console.log('Room status updated to Booked:', updatedRoom);
        } catch (error) {
            console.error('Error updating room status to Booked:', error);
            throw error;
        }
    }

    // Handle form submission
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const paymentMethod = paymentMethodSelect.value;

        if (!paymentMethod) {
            statusMessage.textContent = 'Please select a payment method.';
            statusMessage.style.color = 'red';
            return;
        }

        const paymentDate = new Date().toISOString().split('T')[0];

        const paymentData = {
            reservationID: reservationID,
            amount_paid: parseFloat(amountPayingInput.value),
            payment_method: paymentMethod,
            payment_date: paymentDate,
        };

        try {
            // Post payment data to the API
            const response = await fetch(`${apiBaseUrl}/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error processing payment.');
            }

            const paymentResult = await response.json();
            console.log('Payment Result:', paymentResult);

            // Update room status to "Booked"
            await updateRoomStatusToBooked(reservationID);

            // Update reservation status to Confirmed (only after payment and room status update)
            await updateReservationStatus(reservationID);

            // Display success message
            statusMessage.textContent = `Payment successful! Transaction ID: ${paymentResult.paymentID}`;
            statusMessage.style.color = 'green';

            // Redirect to overview.html
            window.location.href = `overview.html?payment_id=${paymentResult.paymentID}`;
        } catch (error) {
            statusMessage.textContent = error.message;
            statusMessage.style.color = 'red';
        }
    });
});

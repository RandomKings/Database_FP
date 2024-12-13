// payments.js

document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const amountPayingInput = document.getElementById('amountPaying');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const statusMessage = document.getElementById('statusMessage');

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
            const response = await fetch(`http://localhost:8000/get_reservations_by_id/${reservationID}`);
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

    // Handle form submission
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const paymentMethod = paymentMethodSelect.value;

        if (!paymentMethod) {
            statusMessage.textContent = 'Please select a payment method.';
            statusMessage.style.color = 'red';
            return;
        }

        // Get the current date in ISO format (e.g., 2024-12-13)
        const paymentDate = new Date().toISOString().split('T')[0];

        // Prepare the payment data to send to the API
        const paymentData = {
            reservationID: reservationID, // Matches `PaymentCreate` schema
            amount_paid: parseFloat(amountPayingInput.value), // Ensure it's a number
            payment_method: paymentMethod, // Matches expected values: Credit Card, Debit Card, Cash, Online
            payment_date: paymentDate, // Add the current date
        };
        console.log(paymentData)
        try {
            // Post the payment data to the /payments/ endpoint
            const response = await fetch('http://localhost:8000/payments/', {
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

            const result = await response.json();
            console.log(result)
            statusMessage.textContent = `Payment successful! Transaction ID: ${result.paymentID}`;
            statusMessage.style.color = 'green';

            // Optionally, you can redirect or clear the form
            paymentForm.reset();
        } catch (error) {
            statusMessage.textContent = error.message;
            statusMessage.style.color = 'red';
        }
    });
});

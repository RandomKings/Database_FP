
    const apiBaseUrl = "http://localhost:8000";

    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    async function validatePaymentAndFetchReservationId(paymentId) {
      try {
        const response = await fetch(`${apiBaseUrl}/payments/${paymentId}`);
        if (!response.ok) {
          throw new Error(`Error fetching payment details: ${response.statusText}`);
        }
        const paymentData = await response.json();
        return paymentData.reservationID;
      } catch (error) {
        document.getElementById('reservation-details').innerHTML = `
          <p class="text-red-500">Failed to fetch payment details. Please try again later.</p>
        `;
        return null;
      }
    }

    async function fetchReservationDetails(reservationId) {
      try {
        const response = await fetch(`${apiBaseUrl}/get_reservations_by_id/${reservationId}`);
        if (!response.ok) {
          throw new Error(`Error fetching reservation details: ${response.statusText}`);
        }
        const reservationData = await response.json();
        return reservationData;
      } catch (error) {
        document.getElementById('reservation-details').innerHTML = `
          <p class="text-red-500">Failed to fetch reservation details. Please try again later.</p>
        `;
        return null;
      }
    }

    async function fetchReservationRoomDetails(reservationId) {
      try {
        const response = await fetch(`${apiBaseUrl}/reservation_rooms/${reservationId}`);
        if (!response.ok) {
          throw new Error(`Error fetching reservation room details: ${response.statusText}`);
        }
        const roomDetails = await response.json();
        return roomDetails[0];
      } catch (error) {
        document.getElementById('reservation-details').innerHTML = `
          <p class="text-red-500">Failed to fetch room details. Please try again later.</p>
        `;
        return null;
      }
    }

    async function fetchHotelDetails(hotelId) {
      try {
        const response = await fetch(`${apiBaseUrl}/get_hotel_by_id/${hotelId}`);
        if (!response.ok) {
          throw new Error(`Error fetching hotel details: ${response.statusText}`);
        }
        const hotelData = await response.json();
        return hotelData;
      } catch (error) {
        document.getElementById('reservation-details').innerHTML = `
          <p class="text-red-500">Failed to fetch hotel details. Please try again later.</p>
        `;
        return null;
      }
    }

    async function loadReservationDetails() {
      const paymentId = getQueryParam('payment_id');
      if (!paymentId) {
        document.getElementById('reservation-details').innerHTML = `
          <p class="text-red-500">No payment ID provided. Unable to fetch details.</p>
        `;
        return;
      }

      const reservationID = await validatePaymentAndFetchReservationId(paymentId);
      if (!reservationID) {
        return;
      }

      const reservationDetails = await fetchReservationDetails(reservationID);
      const roomDetails = await fetchReservationRoomDetails(reservationID);
      const hotelDetails = await fetchHotelDetails(roomDetails.hotelID);

      if (reservationDetails && roomDetails && hotelDetails) {
        document.getElementById('reservation-details').classList.add('hidden');
        document.getElementById('details-container').classList.remove('hidden');

        document.getElementById('amount-paid').textContent = `$${reservationDetails.total_price || '0.00'}`;
        document.getElementById('reservation-id').textContent = reservationID;
        document.getElementById('check-in').textContent = reservationDetails.check_in_date || 'N/A';
        document.getElementById('check-out').textContent = reservationDetails.check_out_date || 'N/A';
        document.getElementById('room-number').textContent = roomDetails.roomID || 'N/A';
        document.getElementById('hotel-name').textContent = hotelDetails.hotel_name || 'N/A';
        document.getElementById('hotel-address').textContent = hotelDetails.address || 'N/A';

        document.getElementById('dashboard-button').classList.remove('hidden');
      }
    }

    function redirectToDashboard() {
      window.location.href = 'dashboard.html';
    }

    window.onload = loadReservationDetails;
  
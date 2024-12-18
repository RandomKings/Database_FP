document.addEventListener("DOMContentLoaded", async () => {
    const apiBaseUrl = "http://localhost:8000";

    
    const params = new URLSearchParams(window.location.search);

    // get the data from previous page
    const hotelId = params.get("hotel_id");
    const roomId = params.get("room_id");
    const roomType = params.get("room_type");
    const roomStatus = params.get("room_status");
    const totalPrice = params.get("total_price");

    //input data into the page
    if (hotelId) {
        document.getElementById("hotelID").value = hotelId;
        document.getElementById("hotelID").readOnly = true;
    }

    if (roomId) {
        document.getElementById("roomID").value = roomId;
        document.getElementById("roomID").readOnly = true;
    }

    if (roomType) {
        document.getElementById("room_type").value = roomType;
        document.getElementById("room_type").readOnly = true;
    }

    if (roomStatus) {
        document.getElementById("room_status").value = roomStatus;
        document.getElementById("room_status").readOnly = true;
    }

    if (totalPrice) {
        document.getElementById("total_price").value = totalPrice;
        document.getElementById("total_price").readOnly = true;
    }

    // get the userid
    const guestId = localStorage.getItem("userId"); 
    if (!guestId) {
        alert("Guest ID not found in local storage.");
        return;
    }

    try {
        // Fetch guest details from the API
        const response = await fetch(`${apiBaseUrl}/get_guests_by_id/${guestId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch guest details: ${response.statusText}`);
        }
        const guestDetails = await response.json();

        // Populate the guest name in the form
        const guestName = `${guestDetails.first_name} ${guestDetails.last_name || ""}`.trim();
        const guestIdField = document.getElementById("guestID");
        guestIdField.value = guestName;
        guestIdField.readOnly = true; // Make it read-only since it's pre-filled
    } catch (error) {
        console.error("Error fetching guest details:", error);
        alert("Failed to fetch guest details. Please try again.");
    }

    
    const form = document.getElementById("combined-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        document.getElementById("result").textContent = "Submitting...";

        // first create the reservation details
        const reservationData = {
            check_in_date: document.getElementById("check_in_date").value,
            check_out_date: document.getElementById("check_out_date").value,
            total_price: parseFloat(document.getElementById("total_price").value),
            reservation_status: "Pending",
        };

        try {
            // create it
            const reservationResponse = await fetch(`${apiBaseUrl}/create_reservations/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData),
            });

            if (!reservationResponse.ok) {
                const error = await reservationResponse.json();
                throw new Error(error.detail || "Failed to create reservation");
            }

            const reservationResult = await reservationResponse.json();
            const reservationID = reservationResult.reservationID;

            // then create the resevation for the room
            const reservationRoomData = {
                reservationID: reservationID,
                roomID: parseInt(document.getElementById("roomID").value),
                hotelID: parseInt(document.getElementById("hotelID").value),
                guestID: guestId, // Use the guest ID from local storage
            };

            const reservationRoomResponse = await fetch(`${apiBaseUrl}/create_reservation_rooms/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationRoomData),
            });

            if (!reservationRoomResponse.ok) {
                const error = await reservationRoomResponse.json();
                throw new Error(error.detail || "Failed to create reservation room");
            }

            const reservationRoomResult = await reservationRoomResponse.json();

            // finally uopdate the status
            const updateRoomResponse = await fetch(
                `${apiBaseUrl}/change_room_status/${reservationRoomData.hotelID}/${reservationRoomData.roomID}?status=Reserved`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!updateRoomResponse.ok) {
                const error = await updateRoomResponse.json();
                throw new Error(error.detail || "Failed to update room status");
            }

            const updatedRoomResult = await updateRoomResponse.json();

            
            window.location.href = `payments.html?reservationID=${reservationID}`;
        } catch (error) {
           
            document.getElementById("result").textContent = `Error: ${error.message}`;
            console.error("Submission Error:", error);
        }
    });
});

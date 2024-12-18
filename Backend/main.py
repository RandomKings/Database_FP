from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Base, engine
import schema  # Import schema module
import crud  # Import CRUD functions
from typing import List 
from fastapi.middleware.cors import CORSMiddleware

# Reflect tables
Base.prepare(engine, reflect=True)

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; change to specific origins for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

# API to create a new hotel
@app.post("/create_hotel/", response_model=schema.HotelResponse, tags=["Hotel"])
async def create_hotel(hotel: schema.HotelCreate, db: Session = Depends(get_db)):
    new_hotel = crud.create_hotel(db=db, hotel=hotel)
    if new_hotel is None:
        raise HTTPException(status_code=400, detail="Hotel with this email already exists.")
    return new_hotel

@app.get("/get_all_hotels/", response_model=List[schema.HotelResponse], tags=["Hotel"])
async def get_all_hotels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hotels = crud.get_all_hotels(db, skip=skip, limit=limit)
    return hotels


@app.put("/update_hotel/{hotel_id}", response_model=schema.HotelResponse, tags=["Hotel"])
async def update_hotel(hotel_id: int, hotel: dict, db: Session = Depends(get_db)):
    updated_hotel = crud.update_hotel(db, hotel_id, hotel)
    if not updated_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return updated_hotel


@app.get("/get_hotel_by_name/{hotel_name}", response_model=schema.HotelResponse, tags=["Hotel"])
async def get_hotel_by_name(hotel_name: str, db: Session = Depends(get_db)):
    hotel = crud.get_hotel_by_name(db, hotel_name)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel

# Get All Rooms for a Hotel
@app.get("/get_rooms/{hotel_id}", response_model=list[schema.RoomResponse], tags=["Rooms"])
async def get_rooms_by_hotel(hotel_id: int, db: Session = Depends(get_db)):
    rooms = crud.get_rooms_by_hotel(db, hotel_id)
    return rooms


@app.get("/get_hotel_by_id/{hotel_id}", response_model=schema.HotelResponse, tags=["Hotel"])
async def get_hotel_by_id(hotel_id: int, db: Session = Depends(get_db)):
    hotel = crud.get_hotel_by_id(db, hotel_id)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel


@app.delete("/del_hotel_by_id/{hotel_id}", response_model=schema.HotelResponse, tags=["Hotel"])
async def delete_hotel_by_id(hotel_id: int, db: Session = Depends(get_db)):
    deleted_hotel = crud.delete_hotel_by_id(db, hotel_id)
    if not deleted_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return deleted_hotel


@app.delete("/delete_hotel_by_name/{hotel_name}", response_model=schema.HotelResponse, tags=["Hotel"])
async def delete_hotel_by_name(hotel_name: str, db: Session = Depends(get_db)):
    deleted_hotel = crud.delete_hotel_by_name(db, hotel_name)
    if not deleted_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return deleted_hotel

# Create RoomDetails
@app.post("/create_room_details/", response_model=schema.RoomDetailResponse, tags=["RoomDetails"])
async def create_room_details(room_details: schema.RoomDetailCreate, db: Session = Depends(get_db)):
    new_room = crud.create_room_details(db, room_details.dict())
    return new_room

# Update RoomDetails
@app.put("/update_room_details/{room_type}", response_model=schema.RoomDetailResponse, tags=["RoomDetails"])
async def update_room_details(room_type: str, updates: schema.RoomDetailCreate, db: Session = Depends(get_db)):
    updated_room = crud.update_room_details(db, room_type, updates.dict(exclude_unset=True))
    if not updated_room:
        raise HTTPException(status_code=404, detail="Room type not found")
    return updated_room

# Get RoomDetails by Room Type
@app.get("/get_room_details_by_type/{room_type}", response_model=schema.RoomDetailResponse, tags=["RoomDetails"])
async def get_room_details_by_type(room_type: str, db: Session = Depends(get_db)):
    room = crud.get_room_details_by_type(db, room_type)
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
    return room

# Get All RoomDetails
@app.get("/getall_room_details/", response_model=list[schema.RoomDetailResponse], tags=["RoomDetails"])
async def get_all_room_details(db: Session = Depends(get_db)):
    rooms = crud.get_all_room_details(db)
    return rooms

# Delete RoomDetails by Room Type
@app.delete("/delete_room_details/{room_type}", response_model=schema.RoomDetailResponse, tags=["RoomDetails"])
async def delete_room_details(room_type: str, db: Session = Depends(get_db)):
    deleted_room = crud.delete_room_details(db, room_type)
    if not deleted_room:
        raise HTTPException(status_code=404, detail="Room type not found")
    return deleted_room

# Create a Room
@app.post("/create_rooms/", response_model=schema.RoomResponse, tags=["Rooms"])
async def create_room(room: schema.RoomCreate, db: Session = Depends(get_db)):
    new_room = crud.create_room(db, room)
    return new_room


@app.put("/change_room_status/{hotel_id}/{room_id}", response_model=schema.RoomResponse, tags=["Rooms"])
async def change_room_status(hotel_id: int, room_id: int, status: str, db: Session = Depends(get_db)):
    room = crud.get_room_by_id_and_hotel_id(db, room_id=room_id, hotel_id=hotel_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found for the specified hotel")

    updated_room = crud.update_room_status(db, room_id=room_id, hotel_id=hotel_id, status=status)
    return updated_room


# Get a Room by ID and Hotel ID
@app.get("/get_rooms_by_id/{hotel_id}/{room_id}", response_model=schema.RoomResponse, tags=["Rooms"])
async def get_room_by_id(hotel_id: int, room_id: int, db: Session = Depends(get_db)):
    room = crud.get_room_by_id(db, room_id, hotel_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


# Get All Rooms for a Hotel
@app.get("/get_rooms/{hotel_id}", response_model=list[schema.RoomResponse], tags=["Rooms"])
async def get_rooms_by_hotel(hotel_id: int, db: Session = Depends(get_db)):
    rooms = crud.get_rooms_by_hotel(db, hotel_id)
    return rooms


# Delete a Room
@app.delete("/delete_rooms/{hotel_id}/{room_id}", response_model=schema.RoomResponse, tags=["Rooms"])
async def delete_room(hotel_id: int, room_id: int, db: Session = Depends(get_db)):
    deleted_room = crud.delete_room(db, room_id, hotel_id)
    if not deleted_room:
        raise HTTPException(status_code=404, detail="Room not found")
    return deleted_room

# Create a Guest
@app.post("/create_guests/", response_model=schema.GuestResponse, tags=["Guests"])
async def create_guest(guest: schema.GuestCreate, db: Session = Depends(get_db)):
    new_guest = crud.create_guest(db, guest)
    return new_guest


# Get a Guest by ID
@app.get("/get_guests_by_id/{guest_id}", response_model=schema.GuestResponse, tags=["Guests"])
async def get_guest_by_id(guest_id: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_id(db, guest_id)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest  # orm_mode and alias handle field mapping



# Get a Guest by Email
@app.get("/get_guests_by_email/email/{email}", response_model=schema.GuestResponse, tags=["Guests"])
async def get_guest_by_email(email: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_email(db, email)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest


# Get All Guests
@app.get("/getall_guests/", response_model=list[schema.GuestResponse], tags=["Guests"])
async def get_all_guests(db: Session = Depends(get_db)):
    guests = crud.get_all_guests(db)
    return guests


# Update a Guest
@app.put("/update_guests/{guest_id}", response_model=schema.GuestResponse, tags=["Guests"])
async def update_guest(guest_id: int, updates: schema.GuestCreate, db: Session = Depends(get_db)):
    updated_guest = crud.update_guest(db, guest_id, updates.dict(exclude_unset=True))
    if not updated_guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return updated_guest


# Delete a Guest
@app.delete("/delete_guests/{guest_id}", response_model=schema.GuestResponse, tags=["Guests"])
async def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    deleted_guest = crud.delete_guest(db, guest_id)
    if not deleted_guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return deleted_guest

# Create a Reservation
@app.post("/create_reservations/", response_model=schema.ReservationResponse, tags=["Reservations"])
async def create_reservation(reservation: schema.ReservationCreate, db: Session = Depends(get_db)):
    if reservation.check_in_date >= reservation.check_out_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
    
    # Force the reservation status to "Pending"
    reservation.reservation_status = "Pending"
    
    new_reservation = crud.create_reservation(db, reservation)
    return new_reservation



# Get a Reservation by ID
@app.get("/get_reservations_by_id/{reservation_id}", response_model=schema.ReservationResponse, tags=["Reservations"])
async def get_reservation_by_id(reservation_id: int, db: Session = Depends(get_db)):
    reservation = crud.get_reservation_by_id(db, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


# Get All Reservations
@app.get("/getall_reservations/", response_model=list[schema.ReservationResponse], tags=["Reservations"])
async def get_all_reservations(db: Session = Depends(get_db)):
    reservations = crud.get_all_reservations(db)
    return reservations


# Update a Reservation
@app.put("/update_reservations/{reservation_id}", response_model=schema.ReservationResponse, tags=["Reservations"])
async def update_reservation(reservation_id: int, updates: schema.ReservationCreate, db: Session = Depends(get_db)):
    if updates.check_in_date and updates.check_out_date and updates.check_in_date >= updates.check_out_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
    updated_reservation = crud.update_reservation(db, reservation_id, updates.dict(exclude_unset=True))
    if not updated_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return updated_reservation

@app.put("/update_reservation_status/{reservation_id}", response_model=schema.ReservationResponse, tags=["Reservations"])
async def update_reservation_status(reservation_id: int, status_update: schema.ReservationStatusUpdate, db: Session = Depends(get_db)):
    # Call the CRUD function to update the status
    updated_reservation = crud.update_reservation_status(db, reservation_id, status_update.reservation_status)

    if not updated_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    return updated_reservation



# Delete a Reservation
@app.delete("/delete_reservations_by_id/{reservation_id}", response_model=schema.ReservationResponse, tags=["Reservations"])
async def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    deleted_reservation = crud.delete_reservation(db, reservation_id)
    if not deleted_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return deleted_reservation

# Create a ReservationRoom
@app.post("/create_reservation_rooms/", response_model=schema.ReservationRoomResponse, tags=["ReservationRooms"])
async def create_reservation_room(reservation_room: schema.ReservationRoomCreate, db: Session = Depends(get_db)):
    new_reservation_room = crud.create_reservation_room(db, reservation_room)
    return new_reservation_room


# Get All ReservationRooms for a Reservation
@app.get("/reservation_rooms/{reservation_id}", response_model=list[schema.ReservationRoomResponse], tags=["ReservationRooms"])
async def get_reservation_rooms_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation_rooms = crud.get_reservation_rooms_by_reservation(db, reservation_id)
    if not reservation_rooms:
        raise HTTPException(status_code=404, detail="No rooms found for this reservation")
    return reservation_rooms

@app.get("/reservations/guest/{guest_id}", response_model=list[schema.ReservationWithRoom], tags=["Reservations"])
async def get_reservations_by_guest_id(guest_id: str, db: Session = Depends(get_db)):

    reservations = crud.get_reservations_by_guest_id(db, guest_id)
    if not reservations:
        raise HTTPException(status_code=404, detail="No reservations found for the specified guest ID.")

    # Map the combined results into the new schema format
    result = []
    for reservation, room in reservations:
        result.append(schema.ReservationWithRoom(
            reservationID=reservation.reservationID,
            check_in_date=reservation.check_in_date,
            check_out_date=reservation.check_out_date,
            total_price=reservation.total_price,
            reservation_status=reservation.reservation_status,
            created_at=reservation.created_at,
            updated_at=reservation.updated_at,
            roomID=room.roomID,
            hotelID=room.hotelID,
            guestID=room.guestID,
            status=reservation.reservation_status
        ))

    return result



# Delete a ReservationRoom
@app.delete("/reservation_rooms/{reservation_id}/{room_id}/{hotel_id}", response_model=schema.ReservationRoomResponse, tags=["ReservationRooms"])
async def delete_reservation_room(reservation_id: int, room_id: int, hotel_id: int, db: Session = Depends(get_db)):
    deleted_reservation_room = crud.delete_reservation_room(db, reservation_id, room_id, hotel_id)
    if not deleted_reservation_room:
        raise HTTPException(status_code=404, detail="ReservationRoom not found")
    return deleted_reservation_room


# Create a Payment
@app.post("/payments/", response_model=schema.PaymentResponse, tags=["Payments"])
async def create_payment(payment: schema.PaymentCreate, db: Session = Depends(get_db)):
    new_payment = crud.create_payment(db, payment)
    if not new_payment:
        raise HTTPException(status_code=400, detail="Failed to create payment")
    return new_payment

# Get a Payment by ID
@app.get("/payments/{payment_id}", response_model=schema.PaymentResponse, tags=["Payments"])
async def get_payment_by_id(payment_id: int, db: Session = Depends(get_db)):
    payment = crud.get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

# Get All Payments
@app.get("/payments/", response_model=list[schema.PaymentResponse], tags=["Payments"])
async def get_all_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    payments = crud.get_all_payments(db, skip=skip, limit=limit)
    return payments

# Update a Payment
@app.put("/payments/{payment_id}", response_model=schema.PaymentResponse, tags=["Payments"])
async def update_payment(payment_id: int, updates: dict, db: Session = Depends(get_db)):
    updated_payment = crud.update_payment(db, payment_id, updates)
    if not updated_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return updated_payment

# Delete a Payment
@app.delete("/payments/{payment_id}", response_model=schema.PaymentResponse, tags=["Payments"])
async def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    deleted_payment = crud.delete_payment(db, payment_id)
    if not deleted_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return deleted_payment

@app.post("/cancellations/", response_model=schema.CancellationResponse, tags=["Cancellations"])
def create_cancellation(cancellation: schema.CancellationCreate, db: Session = Depends(get_db)):
    try:
        db_cancellation = crud.create_cancellation(db, cancellation)
        return db_cancellation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
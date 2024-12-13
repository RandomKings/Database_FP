from sqlalchemy.orm import Session
import database  # Import the database module
import schema  # Import the schema module


# Hotels
def create_hotel(db: Session, hotel: schema.HotelCreate):
    # Check if a hotel with the same email already exists
    existing_hotel = db.query(database.Hotels).filter(database.Hotels.email == hotel.email).first()
    if existing_hotel:
        return None  # Return None if the hotel already exists

    # Create a new hotel record
    new_hotel = database.Hotels(
        hotel_name=hotel.hotel_name,
        city=hotel.city,
        address=hotel.address,
        email=hotel.email,
        phone_number=hotel.phone_number,
        rating=hotel.rating
    )
    db.add(new_hotel)
    db.commit()
    db.refresh(new_hotel)
    return new_hotel


# Update a hotel
def update_hotel(db: Session, hotel_id: int, updates: dict):
    hotel = db.query(database.Hotels).filter(database.Hotels.hotelID == hotel_id).first()
    if not hotel:
        return None
    for key, value in updates.items():
        if value is not None:  # Only update non-None values
            setattr(hotel, key, value)
    db.commit()
    db.refresh(hotel)
    return hotel

# Get all hotels
def get_all_hotels(db: Session, skip: int = 0, limit: int = 100):
    return db.query(database.Hotels).offset(skip).limit(limit).all()

# Get a hotel by name
def get_hotel_by_name(db: Session, hotel_name: str):
    return db.query(database.Hotels).filter(database.Hotels.hotel_name == hotel_name).first()


# Get a hotel by ID
def get_hotel_by_id(db: Session, hotel_id: int):
    return db.query(database.Hotels).filter(database.Hotels.hotelID == hotel_id).first()


# Delete a hotel by ID
def delete_hotel_by_id(db: Session, hotel_id: int):
    hotel = db.query(database.Hotels).filter(database.Hotels.hotelID == hotel_id).first()
    if not hotel:
        return None
    db.delete(hotel)
    db.commit()
    return hotel


# Delete a hotel by name
def delete_hotel_by_name(db: Session, hotel_name: str):
    hotel = db.query(database.Hotels).filter(database.Hotels.hotel_name == hotel_name).first()
    if not hotel:
        return None
    db.delete(hotel)
    db.commit()
    return hotel


# RoomDetails
def create_room_details(db: Session, room_details: dict):
    new_room = database.RoomDetails(**room_details)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room


# Update RoomDetails
def update_room_details(db: Session, room_type: str, updates: dict):
    room = db.query(database.RoomDetails).filter(database.RoomDetails.roomType == room_type).first()
    if not room:
        return None
    for key, value in updates.items():
        if value is not None:  # Only update non-None values
            setattr(room, key, value)
    db.commit()
    db.refresh(room)
    return room



# Get RoomDetails by Room Type
def get_room_details_by_type(db: Session, room_type: str):
    return db.query(database.RoomDetails).filter(database.RoomDetails.roomType == room_type).first()


# Get All RoomDetails
def get_all_room_details(db: Session):
    return db.query(database.RoomDetails).all()


# Delete RoomDetails by Room Type
def delete_room_details(db: Session, room_type: str):
    room = db.query(database.RoomDetails).filter(database.RoomDetails.roomType == room_type).first()
    if not room:
        return None
    db.delete(room)
    db.commit()
    return room

# Create a Room
def create_room(db: Session, room: schema.RoomCreate):
    new_room = database.Rooms(
        roomID=room.roomID,
        hotelID=room.hotelID,
        status=room.status,
        room_type=room.room_type
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room


# Update a Room
def update_room(db: Session, room_id: int, hotel_id: int, updates: dict):
    room = db.query(database.Rooms).filter(
        database.Rooms.roomID == room_id,
        database.Rooms.hotelID == hotel_id
    ).first()
    if not room:
        return None
    for key, value in updates.items():
        if value is not None:  # Update only non-None fields
            setattr(room, key, value)
    db.commit()
    db.refresh(room)
    return room

def get_room_by_id_and_hotel_id(db: Session, room_id: int, hotel_id: int):
    return db.query(database.Rooms).filter(database.Rooms.roomID == room_id, database.Rooms.hotelID == hotel_id).first()

def update_room_status(db: Session, room_id: int, hotel_id: int, status: str):
    room = db.query(database.Rooms).filter(database.Rooms.roomID == room_id, database.Rooms.hotelID == hotel_id).first()
    if not room:
        return None
    room.status = status
    db.commit()
    db.refresh(room)
    return room



# Get a Room by ID and Hotel ID
def get_room_by_id(db: Session, room_id: int, hotel_id: int):
    return db.query(database.Rooms).filter(
        database.Rooms.roomID == room_id,
        database.Rooms.hotelID == hotel_id
    ).first()


# Get All Rooms for a Hotel
def get_rooms_by_hotel(db: Session, hotel_id: int):
    return db.query(database.Rooms).filter(database.Rooms.hotelID == hotel_id).all()


# Delete a Room by ID and Hotel ID
def delete_room(db: Session, room_id: int, hotel_id: int):
    room = db.query(database.Rooms).filter(
        database.Rooms.roomID == room_id,
        database.Rooms.hotelID == hotel_id
    ).first()
    if not room:
        return None
    db.delete(room)
    db.commit()
    return room

# Create a Guest
def create_guest(db: Session, guest: schema.GuestCreate):
    # Create a new guest entry
    new_guest = database.Guests(
        guestID=guest.guest_id,  # Ensure this matches the database schema
        first_name=guest.first_name,
        last_name=guest.last_name,
        email=guest.email,
        phone_number=guest.phone_number,
        address=guest.address,
        date_of_birth=guest.date_of_birth,
    )
    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)  # Refresh to get the updated object with `guestID`
    return new_guest  # Return the full object


def get_guest_by_id(db: Session, guest_id: str):
    return db.query(database.Guests).filter(database.Guests.guestID == guest_id).first()



# Get a Guest by Email
def get_guest_by_email(db: Session, email: str):
    return db.query(database.Guests).filter(database.Guests.email == email).first()


# Get All Guests
def get_all_guests(db: Session):
    return db.query(database.Guests).all()


# Update a Guest
def update_guest(db: Session, guest_id: int, updates: dict):
    guest = db.query(database.Guests).filter(database.Guests.guestID == guest_id).first()
    if not guest:
        return None
    for key, value in updates.items():
        if value is not None:  # Only update non-None fields
            setattr(guest, key, value)
    db.commit()
    db.refresh(guest)
    return guest


# Delete a Guest by ID
def delete_guest(db: Session, guest_id: int):
    guest = db.query(database.Guests).filter(database.Guests.guestID == guest_id).first()
    if not guest:
        return None
    db.delete(guest)
    db.commit()
    return guest

# Create a Reservation
def create_reservation(db: Session, reservation: schema.ReservationCreate):
    new_reservation = database.ReservationDetails(
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        total_price=reservation.total_price,
        reservation_status=reservation.reservation_status
    )
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    return new_reservation


# Get a Reservation by ID
def get_reservation_by_id(db: Session, reservation_id: int):
    return db.query(database.ReservationDetails).filter(
        database.ReservationDetails.reservationID == reservation_id
    ).first()


# Get All Reservations
def get_all_reservations(db: Session):
    return db.query(database.ReservationDetails).all()


# Update a Reservation
def update_reservation(db: Session, reservation_id: int, updates: dict):
    reservation = db.query(database.ReservationDetails).filter(
        database.ReservationDetails.reservationID == reservation_id
    ).first()
    if not reservation:
        return None
    for key, value in updates.items():
        if value is not None:  # Update only non-None fields
            setattr(reservation, key, value)
    db.commit()
    db.refresh(reservation)
    return reservation


# Delete a Reservation
def delete_reservation(db: Session, reservation_id: int):
    reservation = db.query(database.ReservationDetails).filter(
        database.ReservationDetails.reservationID == reservation_id
    ).first()
    if not reservation:
        return None
    db.delete(reservation)
    db.commit()
    return reservation

def create_reservation_room(db: Session, reservation_room: schema.ReservationRoomCreate):
    new_reservation_room = database.ReservationRooms(
        reservationID=reservation_room.reservationID,
        roomID=reservation_room.roomID,
        hotelID=reservation_room.hotelID,
        guestID=reservation_room.guestID
    )
    db.add(new_reservation_room)
    db.commit()
    db.refresh(new_reservation_room)
    return new_reservation_room


# Get All ReservationRooms for a Reservation
def get_reservation_rooms_by_reservation(db: Session, reservation_id: int):
    return db.query(database.ReservationRooms).filter(
        database.ReservationRooms.reservationID == reservation_id
    ).all()


# Delete a ReservationRoom
def delete_reservation_room(db: Session, reservation_id: int, room_id: int, hotel_id: int):
    reservation_room = db.query(database.ReservationRooms).filter(
        database.ReservationRooms.reservationID == reservation_id,
        database.ReservationRooms.roomID == room_id,
        database.ReservationRooms.hotelID == hotel_id
    ).first()
    if not reservation_room:
        return None
    db.delete(reservation_room)
    db.commit()
    return reservation_room

def create_payment(db: Session, payment: schema.PaymentCreate):
    new_payment = database.Payments(
        payment_date=payment.payment_date,
        amount_paid=payment.amount_paid,
        payment_method=payment.payment_method,
        reservationID=payment.reservationID,
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

# Get a Payment by ID
def get_payment_by_id(db: Session, payment_id: int):
    return db.query(database.Payments).filter(database.Payments.paymentID == payment_id).first()

# Get All Payments
def get_all_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(database.Payments).offset(skip).limit(limit).all()

# Update a Payment
def update_payment(db: Session, payment_id: int, updates: dict):
    payment = db.query(database.Payments).filter(database.Payments.paymentID == payment_id).first()
    if not payment:
        return None
    for key, value in updates.items():
        setattr(payment, key, value)
    db.commit()
    db.refresh(payment)
    return payment

# Delete a Payment
def delete_payment(db: Session, payment_id: int):
    payment = db.query(database.Payments).filter(database.Payments.paymentID == payment_id).first()
    if not payment:
        return None
    db.delete(payment)
    db.commit()
    return payment

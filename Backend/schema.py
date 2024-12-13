#this file contains the scema of the database
from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


# -------- Hotels Schema --------
class HotelBase(BaseModel):
    hotel_name: str
    city: str
    address: str
    email: str 
    phone_number: str
    rating: float = Field(..., ge=0, le=5)  # Rating must be between 0 and 5

class HotelCreate(HotelBase):
    pass  # For creating hotels

class HotelResponse(HotelBase):
    hotelID: int  # Include primary key in the response

    class Config:
        orm_mode = True


# -------- RoomDetails Schema --------
class RoomDetailBase(BaseModel):
    roomType: str
    price: float
    bed_type: str
    max_occupancy: int

class RoomDetailCreate(RoomDetailBase):
    pass  # For creating room details

class RoomDetailResponse(RoomDetailBase):
    class Config:
        orm_mode = True


# -------- Rooms Schema --------
class RoomBase(BaseModel):
    roomID: int
    hotelID: int
    status: str  # ENUM('Available', 'Booked', 'Under Maintenance', 'Reserved')
    room_type: Optional[str]  # Can be null due to foreign key constraints

class RoomCreate(RoomBase):
    pass  # For creating rooms

class RoomResponse(BaseModel):
    id: int = Field(alias="roomID")
    hotel_id: int = Field(alias="hotelID")
    room_type: str
    status: str

    class Config:
        orm_mode = True





# -------- Guests Schema --------
class GuestBase(BaseModel):
    guest_id: str = Field(alias="guestID")  # Map guestID (DB) to guest_id
    first_name: str
    last_name: Optional[str]
    email: EmailStr
    phone_number: str
    address: str
    date_of_birth: date

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy compatibility
        allow_population_by_field_name = True  # Allow accessing fields by their Pydantic name


class GuestCreate(GuestBase):
    pass


class GuestResponse(GuestBase):
    pass


# -------- ReservationDetails Schema --------
class ReservationBase(BaseModel):
    check_in_date: date
    check_out_date: date
    total_price: float = Field(..., ge=0)  # Must be non-negative
    reservation_status: str = Field(default="Pending")  # ENUM('Pending', 'Confirmed', 'Cancelled')

class ReservationCreate(ReservationBase):
    pass  # For creating reservations

class ReservationResponse(ReservationBase):
    reservationID: int  # Include primary key
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# -------- ReservationRooms Schema --------
class ReservationRoomBase(BaseModel):
    reservationID: int
    roomID: int
    hotelID: int
    guestID: str

class ReservationRoomCreate(ReservationRoomBase):
    pass  # For creating reservation-room mappings

class ReservationRoomResponse(ReservationRoomBase):
    class Config:
        orm_mode = True


# -------- Payments Schema --------
class PaymentBase(BaseModel):
    payment_date: date
    amount_paid: float = Field(..., ge=0)  # Must be non-negative
    payment_method: str  # ENUM('Credit Card', 'Debit Card', 'Cash', 'Online')
    reservationID: int

class PaymentCreate(PaymentBase):
    pass  # For creating payments

class PaymentResponse(PaymentBase):
    paymentID: int  # Include primary key

    class Config:
        orm_mode = True


# -------- Cancellations Schema --------
class CancellationBase(BaseModel):
    cancellation_date: date
    reason: Optional[str]
    reservationID: int

class CancellationCreate(CancellationBase):
    pass  # For creating cancellations

class CancellationResponse(CancellationBase):
    cancellationID: int  # Include primary key in the response

    class Config:
        orm_mode = True



from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker

# Database URL (update with your credentials)
DATABASE_URL = "mysql+pymysql://root:Pranav123@localhost/reservationsystem"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# SessionLocal is used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Automap base for reflecting tables
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Access the reflected tables
Hotels = Base.classes.hotels
RoomDetails = Base.classes.roomdetails
Rooms = Base.classes.rooms
Guests = Base.classes.guests
ReservationDetails = Base.classes.reservationdetails
ReservationRooms = Base.classes.reservationrooms
Payments = Base.classes.payments
Cancellations = Base.classes.cancellations

# Dependency for FastAPI to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

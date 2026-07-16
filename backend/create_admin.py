from dotenv import load_dotenv
import os

from database.session import SessionLocal
from models.admin import Admin
from core.security import hash_password

# Load environment variables
load_dotenv()

db = SessionLocal()

username = os.getenv("ADMIN_USERNAME")
password = os.getenv("ADMIN_PASSWORD")

if not username or not password:
    raise ValueError("ADMIN_USERNAME or ADMIN_PASSWORD is missing in .env")

# Get the first (and only) admin
admin = db.query(Admin).first()

if admin:
    admin.username = username
    admin.password_hash = hash_password(password)

    db.commit()

    print("✅ Super Admin updated successfully!")

else:
    admin = Admin(
        username=username,
        password_hash=hash_password(password)
    )

    db.add(admin)
    db.commit()

    print("✅ Super Admin created successfully!")

db.close()
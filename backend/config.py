import os
class Config:
    # SECRET_KEY = os.getenv("SECRET_KEY", "8c3f24e76136444095078d39cd573727")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://Jeevashree:12345@task1.mbwh52m.mongodb.net/")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "8c3f24e76136444095078d39cd573727")
    # DEBUG = os.getenv("DEBUG", "True").lower() == "true"
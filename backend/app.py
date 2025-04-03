from flask import Flask, jsonify, request
import pymongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
import os
from bson import ObjectId
from flask_cors import CORS

app = Flask(__name__)


uri = "mongodb+srv://Jeevashree:12345@task1.mbwh52m.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=5000)  
db = client["task1"]


try:
    client.server_info()  
except Exception as e:
    print(f" MongoDB Connection Error: {e}")

app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY", "8c3f24e76136444095078d39cd573727")
jwt = JWTManager(app)
CORS(app)


@app.route("/")
def home():
    return jsonify({"message": "Flask app is running!"}), 200


@app.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        required_fields = ("first_name", "last_name", "email", "password")
        if not data or not all(k in data for k in required_fields):
            return jsonify({"message": "Invalid input"}), 400

        
        user = db.users.find_one({"email": data['email']}, {"_id": 1})
        if user:
            return jsonify({"message": "User already exists"}), 400

        hash_password = generate_password_hash(data['password'])
        db.users.insert_one({
            "first_name": data['first_name'],
            "last_name": data['last_name'],
            "email": data['email'],
            "password": hash_password
        })
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = db.users.find_one({"email": data['email']}, {"password": 1, "_id": 1})  
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({"access_token": access_token}), 200
    return jsonify({"message": "Invalid Credentials"}), 401


@app.route('/createTask', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not all(k in data for k in ("title", "description", "due_date")):
        return jsonify({"message": "Invalid input"}), 400

    db.tasks.insert_one({
        "user_id": user_id,
        "title": data['title'],
        "description": data['description'],
        "due_date": data['due_date'],
        "completed": False
    })
    return jsonify({"message": "Task Created"}), 201


@app.route('/getAllTasks', methods=['GET'])
@jwt_required()
def get_all_tasks():
    user_id = get_jwt_identity()
    tasks = list(db.tasks.find({"user_id": user_id, "completed": False}, {"_id": 1, "title": 1, "due_date": 1}))
    return jsonify([{"_id": str(task["_id"]), "title": task["title"], "due_date": task["due_date"]} for task in tasks]), 200


@app.route('/getTask/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()
    try:
        task = db.tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
        if not task:
            return jsonify({"message": "Task not found"}), 404
        task["_id"] = str(task["_id"])
        return jsonify(task), 200
    except:
        return jsonify({"message": "Invalid task ID format"}), 400


@app.route('/updateTask/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    update_data = {k: v for k, v in data.items() if k in ("title", "description", "due_date", "completed")}

    if not update_data:
        return jsonify({"message": "No valid fields to update"}), 400

    result = db.tasks.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task Updated"}), 200


@app.route('/deleteTask/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    result = db.tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    if result.deleted_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task Deleted"}), 200


@app.route('/markTaskComplete/<task_id>', methods=['PATCH'])
@jwt_required()
def mark_task_complete(task_id):
    user_id = get_jwt_identity()
    result = db.tasks.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": {"completed": True}})
    if result.matched_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task marked as completed"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  
    app.run(host="0.0.0.0", port=port)

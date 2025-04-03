from flask import Flask,jsonify,request
import pymongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,JWTManager
import os
from bson import ObjectId
from flask_cors import CORS

uri = "mongodb+srv://Jeevashree:12345@task1.mbwh52m.mongodb.net/"
app = Flask(__name__)
client = pymongo.MongoClient(uri)
db = client["task1"]
app.config['JWT_SECRET_KEY'] = '8c3f24e76136444095078d39cd573727'
jwt=JWTManager(app)
CORS(app)


@app.route("/register",methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ("first_name", "last_name", "email", "password")):
            return jsonify({"message": "Invalid input"}), 400

        if db.users.find_one({"email": data['email']}):
            return jsonify({"message": "User already exists"}), 400
        hash_password = generate_password_hash(data['password'])
        db.users.insert_one({
            "first_name": data['first_name'],
            "last_name": data['last_name'],
            "email": data['email'],
            "password": hash_password
        })
        return jsonify({"message": "User registered successfully"}), 201
        
    except:
        raise Exception("Error has been Occured")


@app.route('/login', methods=['post'])
def login_user():
    data = request.get_json()
    user = db.users.find_one({"email": data['email']})
    if user and check_password_hash(user['password'],data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({"access_token":access_token}),200
    return jsonify({"message":"Invalid Credentials"}),401


@app.route('/createTask',methods=['POST'])
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
    """Retrieves all tasks for the logged-in user"""
    user_id = get_jwt_identity()
    tasks = list(db.tasks.find({"user_id": user_id, "completed": False})) 
    for task in tasks:
        task["_id"] = str(task["_id"])
    return jsonify(tasks), 200


@app.route('/getTask/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Retrieves a single task by ID"""
    user_id = get_jwt_identity()
    try:
        object_id = ObjectId(task_id)
    except:
        return jsonify({"message": "Invalid task ID format"}), 400

    task = db.tasks.find_one({"_id": object_id, "user_id": user_id})  
    if not task:
        return jsonify({"message": "Task not found"}), 404
    task["_id"] = str(task["_id"])
    return jsonify(task), 200


@app.route('/updateTask/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Updates task details"""
    user_id = get_jwt_identity()
    data = request.get_json()
    updated_task = {
        "title": data.get("title"),
        "description": data.get("description"),
        "due_date": data.get("due_date"),
        "completed": data.get("completed", False)  
    }
    try:
        object_id = ObjectId(task_id)
    except:
        return jsonify({"message": "Invalid task ID format"}), 400

    result = db.tasks.update_one({"_id": object_id, "user_id": user_id}, {"$set": updated_task})  
    if result.matched_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task Updated"}), 200


@app.route('/deleteTask/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Deletes a task"""
    user_id = get_jwt_identity()
    try:
        object_id = ObjectId(task_id)
    except:
        return jsonify({"message": "Invalid task ID format"}), 400

    result = db.tasks.delete_one({"_id": object_id, "user_id": user_id}) 
    if result.deleted_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task Deleted"}), 200


@app.route('/markTaskComplete/<task_id>', methods=['PATCH'])
@jwt_required()
def mark_task_complete(task_id):
    """Marks a task as completed"""
    user_id = get_jwt_identity()
    try:
        object_id = ObjectId(task_id)
    except:
        return jsonify({"message": "Invalid task ID format"}), 400

    result = db.tasks.update_one({"_id": object_id, "user_id": user_id}, {"$set": {"completed": True}})  
    if result.matched_count == 0:
        return jsonify({"message": "Task not found or not authorized"}), 404
    return jsonify({"message": "Task marked as completed"}), 200



if __name__ == "__main__":
    app.run(port=5000, debug=True)
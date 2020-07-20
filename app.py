from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from models.homeworkuser import Db, HomeworkUser
from os import environ
from dotenv import load_dotenv
from pathlib import Path

#load_dotenv('.env')

# path to .env file
env_path=Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# access variables for db
import os
# localhost vars
USER = os.getenv('USER')
PASSWORD = os.getenv('PASSWORD')
URI = os.getenv('URI')
# production vars
HEROKU_USER = os.getenv('HEROKU_USER')
HEROKU_URI = os.getenv('HEROKU_URI')
HEROKU_PASSWORD = os.getenv('HEROKU_PASSWORD')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = HEROKU_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = environ.get('HEROKU_PASSWORD')
Db.init_app(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/load_data', methods=['GET'])
def load_data():
    users_json = {'users': []}
    users = HomeworkUser.query.all()
    for user in users:
        user_info = user.__dict__
        del user_info['_sa_instance_state']
        users_json['users'].append(user_info)
    return jsonify(users_json)

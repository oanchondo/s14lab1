from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from models.homeworkuser import Db, HomeworkUser
from os import environ
from flask_heroku import Heroku

load_dotenv('.env')

app = Flask(__name__)
heroku = Heroku(app)

#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#app.secret_key = environ.get('SECRET_KEY')
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

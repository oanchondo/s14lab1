from flask import Flask, render_template, request, redirect, url_for
from models.user import db, User
from modules.userform import UserForm
from faker import Faker
from random import randint
from dotenv import load_dotenv
from pathlib import Path

# TODO go to https://pypi.org/project/python-dotenv/ to create .env file to store passwords
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

# Connect db to app
#app.config['SQLALCHEMY_DATABASE_URI'] = URI
app.config['SQLALCHEMY_DATABASE_URI'] = HEROKU_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#app.secret_key = os.getenv('PASSWORD')
app.secret_key = os.getenv('HEROKU_PASSWORD')
db.init_app(app)

# TODO style with either CSS or bootstrap = DONE

@app.route('/', methods=['GET', 'POST'])
def index():
	form = UserForm()
	# if request form
	if form.validate_on_submit():
		first_name = request.form['first_name']
		age = request.form['age']
		new_user = User(first_name=first_name, age=age)
		db.session.add(new_user)
		db.session.commit()
			
	# Query all
	users = User.query.all()
	# Iterate and print
	for user in users:
		User.toString(user)

	return render_template("index.html", users=users, form=form)


# @route /adduser - GET, POST
@app.route('/adduser', methods=['GET', 'POST'])
def addUser():
	form = UserForm()
	# If GET
	if request.method == 'GET':
	    return render_template('adduser.html', form=form)
	# If POST
	else:
	    if form.validate_on_submit():
	        first_name = request.form['first_name']
	        age = request.form['age']
	        new_user = User(first_name=first_name, age=age)
	        db.session.add(new_user)
	        db.session.commit()
	        return redirect(url_for('index'))
	    else:
	        return render_template('adduser.html', form=form)

# TODO create a read route for an individual user
# nees to 
@app.route('/<first_name>')
def show_user(first_name):
	user = User.query.filter_by(first_name=first_name).first_or_404()
	return render_template("user.html", user=user)

# TODO create a route to delete a user by id
@app.route('/delete', methods=['POST'])
def delete():
	user_id = request.form.get("user_id")
	user = User.query.filter_by(user_id=user_id).delete()
	db.session.commit()
	return redirect(url_for("index"))


# TODO create a route to update a user's name or age
@app.route("/update", methods=["POST"])
def update():
	# distinguish between old and new name/age
	newname = request.form.get("newname")
	oldname = request.form.get("oldname")
	newage = request.form.get("newage")
	oldage = request.form.get("oldage")

	# search for in db and update
	user = User.query.filter_by(first_name=oldname).first()
	user.first_name = newname
	user = User.query.filter_by(age=oldage).first()
	user.age = newage

	# save changes
	db.session.commit()
	return redirect(url_for("index"))

# TODO create a route that can generate mock data of any amount(names can be nonsense)
@app.route("/fake", methods=['GET', 'POST'])
def fake():
	# load Faker()
	fake = Faker()
	# generate data
	first_name = fake.name().replace(" ","")
	age = randint(0,100)

	# store into db
	new_user = User(first_name=first_name, age=age)
	db.session.add(new_user)
	db.session.commit()
	return redirect(url_for('index'))

# Done improve the styling of your site
# TODO (EC) introduce validation features that require user confirmation for deleting/updating
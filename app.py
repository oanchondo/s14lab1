from flask import Flask, render_template
import joblib as joblib


app = Flask(__name__)

# Load ML model
model = joblib.load('notebooks/train_test_split.pkl')
model2 = joblib.load('notebooks/decision_tree.pkl')

@app.route('/')
def index():

    # Make prediction - features = ['BEDS', 'BATHS', 'SQFT', 'AGE', 'LOTSIZE', 'GARAGE']
	prediction = model.predict([[3, 2, 2000, 70, 10903.0, 1]])[0][0].round(1)
	prediction = str(prediction)
	# Make prediction - features = ['BEDS', 'BATHS', 'SQFT', 'AGE', 'LOTSIZE', 'GARAGE']
	prediction2 = model2.predict([[3, 2, 2000, 70, 10903.0, 1]])[0][0].round(1)
	prediction2 = str(prediction2)
	return render_template('index.html', pred=prediction, pred2=prediction2)



@app.route('/world')
def hello_world():
    return 'Hello, World!'


@app.route('/<you>')
def hello_you(you):

    return f'Hello, {you}!'

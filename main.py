from flask import Flask, jsonify, request, g
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from handler.accounts import Accounts


load_dotenv(".env")

#Activate
app = Flask(__name__)
#Apply CORS to this app
CORS(app)


@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop('db', None)

    if db is not None:
        db.close()


@app.route('/')
def greeting():
    return 'Hello Im Batman'


@app.route('/email/accounts', methods=['POST'])
def handleAccount():
    if request.method == 'POST':

        return Accounts().addNewAccount(request.json)
    else:
        return jsonify("Method not allowed"), 405



if __name__ == '__main__':
    app.run()

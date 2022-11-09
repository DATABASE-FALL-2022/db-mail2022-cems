from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

#Activate
app = Flask(__name__)
#Apply CORS to this app
CORS(app)

@app.route('/')
def greeting():
    return 'Hello Im Batman'

if __name__ == '__main__':
    app.run()

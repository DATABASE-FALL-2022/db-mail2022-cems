from flask import Flask, jsonify, request, g
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from handler.accounts import Accounts
from handler.message import Message
from handler.friends import FriendsHandler


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


@app.route('/cems')
def greeting():
    return 'Welcome to CEMS DB Project'

@app.route('/cems/account', methods=['GET','POST'])
def getAllAccounts():
    if request.method == 'POST':
        # print("REQUEST: ", request.json)
        return Accounts().addNewAccount(request.json)
            
    elif request.method == "GET":
        if not request.args:
            return Accounts().getAllAccounts()
        else:
            #return AccountHandler().searchAccounts(request.args) 
            return 'searched for Accounts with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<int:uid>', methods=['GET','PUT','DELETE'])
def getAccountByID(uid):
    if request.method == 'GET':
        return Accounts().getAccountById(uid)
    
    elif request.method == 'PUT':
        #return AccountHandler().updateAccount(uid,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        #return AccountHandler().deleteAccount(uid)
        return 'Deleted Account with uid provided'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/friend', methods=['GET','POST'])
def getAllFriends():
    if request.method == 'POST':
        return FriendsHandler().addFriendship(request.json)
    elif request.method == 'GET':
        if not request.args:
            return FriendsHandler().getAllFriends()
        else:
            #return FriendHandler().searchFriends(request.args)
            return 'Search for friendships with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/friend/<int:uid>', methods=['DELETE'])
def deleteFriend(uid):
    if request.method == 'DELETE':
        #return FriendHandler().deleteFriend(uid)
        return 'Deleted Friend with uid provided'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message', methods=['GET','POST'])
def getAllMessages():
    if request.method == 'POST':
        return Message().sendNewMessage(request.json)
   
    elif request.method == 'GET':
        if not request.args:
            #return MessageHandler().getAllMessages()
            return 'Got all messages'
        else:
            #return MessageHandler().searchMesages(request.args)
            return 'Searched for messages with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/<int:mid>', methods=['GET', 'PUT', 'DELETE'])
def getMessageById(mid):
    if request.method == 'GET':
        #return MessageHandler().getMessageById(mid)
        return 'Got message with mid provided'
    elif request.method == 'PUT':
        #return MessageHandler().updateMessage(mid, request.form)
        return 'Updated message with mid provided using request.form info'
    elif request.method == 'DELETE':
        #return MessageHandler().deleteMessage(mid)
        return 'Deleted message with provided mid'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/inbox', methods=['GET'])
def getUserInbox(uid):
    if request.method == 'GET':
        #return MessageHandler().getUserInbox(uid)
        return 'Got User inbox with provided UID'
    else:
        return jsonify(Error="Method not allowed."), 405
@app.route('/cems/message/outbox', methods=['GET'])
def getUserOutbox(uid):
    if request.method == 'GET':
        #return MessageHandler().getUserOutbox(uid)
        return 'Got User inbox with provided UID'
    else:
        return jsonify(Error="Method not allowed."), 405

#@app.route('/cems/recipient/topTenUserInbox')


if __name__ == '__main__':
    app.run()


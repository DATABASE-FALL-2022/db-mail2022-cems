from flask import Flask, jsonify, request, g
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from handler.accounts import Accounts
from handler.message import MessageHandler
from handler.friends import FriendsHandler


load_dotenv(".env")

# Activate
app = Flask(__name__)
# Apply CORS to this app
CORS(app)


@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop('db', None)

    if db is not None:
        db.close()


@app.route('/cems')
def greeting():
    return 'Welcome to CEMS DB Project'


@app.route('/cems/account', methods=['GET', 'POST'])
def getAllAccounts():
    if request.method == 'POST':
        # print("REQUEST: ", request.json)
        return Accounts().addNewAccount(request.json)

    elif request.method == "GET":
        if not request.args:
            return Accounts().getAllAccounts()
        else:
            # return AccountHandler().searchAccounts(request.args)
            return 'searched for Accounts with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def getAccountByID(uid):
    if request.method == 'GET':
        return Accounts().getAccountById(uid)

    elif request.method == 'PUT':
        # return AccountHandler().updateAccount(uid,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        # return AccountHandler().deleteAccount(uid)
        return 'Deleted Account with uid provided'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<string:email>', methods=['GET', 'PUT', 'DELETE'])
def getAccountByEmail(email):
    if request.method == 'GET':
        return Accounts().getAccountByEmail(email)

    elif request.method == 'PUT':
        # return AccountHandler().updateAccount(uid,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        # return AccountHandler().deleteAccount(uid)
        return 'Deleted Account with email provided'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/upPremium/<int:uid>', methods=['POST'])
def updatePremiumAccount(uid):
    if request.method == 'POST':
        return Accounts().updatePremiumAccount(uid)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/dnPremium/<int:uid>', methods=['POST'])
def demotePremiumAccount(uid):
    if request.method == 'POST':
        return Accounts().demotePremiumAccount(uid)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/premium/<int:uid>', methods=['GET'])
def verifyPremiumAccount(uid):
    if request.method == 'GET':
        return Accounts().verifyPremiumAccount(uid)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/friend', methods=['GET', 'POST'])
def getAllFriends():
    if request.method == 'POST':
        return FriendsHandler().addFriendship(request.json)
    elif request.method == 'GET':
        if not request.args:
            return FriendsHandler().getAllFriends()
        else:
            # return FriendHandler().searchFriends(request.args)
            return 'Search for friendships with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/friend/<int:user_id>/<int:friend_id>', methods=['DELETE'])
def deleteFriend(user_id, friend_id):
    """
    Delete friend with `friend_id` from account with `user_id`.
    """
    if request.method == 'DELETE':
        return FriendsHandler().deleteFriend(user_id, friend_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message', methods=['GET', 'POST'])
def getAllMessages():
    if request.method == 'POST':
        return MessageHandler().sendNewMessage(request.json)

    elif request.method == 'GET':
        if not request.args:
            return MessageHandler().getAllMessages()
        else:
            # TODO
            # return MessageHandler().searchMesages(request.args)
            return 'Searched for messages with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/<int:mid>', methods=['GET', 'PUT', 'DELETE'])
def getMessageById(mid):
    if request.method == 'GET':
        # return MessageHandler().getMessageById(mid)
        return 'Got message with mid provided'
    elif request.method == 'PUT':
        # return MessageHandler().updateMessage(mid, request.form)
        return 'Updated message with mid provided using request.form info'
    elif request.method == 'DELETE':
        # return MessageHandler().deleteMessage(mid)
        return 'Deleted message with provided mid'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/inbox/<int:user_id>', methods=['GET'])
def getUserInbox(user_id):
    if request.method == 'GET':
        return MessageHandler().getUserInbox(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/outbox/<int:user_id>', methods=['GET'])
def getUserOutbox(user_id):
    if request.method == 'GET':
        return MessageHandler().getUserOutbox(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405

# TODO
# @app.route('/cems/recipient/topTenUserInbox')


if __name__ == '__main__':
    app.run()

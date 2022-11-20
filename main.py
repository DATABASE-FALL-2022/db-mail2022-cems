from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from handler.account import AccountHandler
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
        return AccountHandler().addNewAccount(request.json)
    elif request.method == "GET":
        if not request.args:
            return AccountHandler().getAllAccounts()
        else:
            # TODO - not necessary at the moment
            # return AccountHandler().searchAccounts(request.args)
            return 'searched for Accounts with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def getAccountByID(user_id):
    if request.method == 'GET':
        return AccountHandler().getAccountById(user_id)
    elif request.method == 'PUT':
        # TODO
        # return AccountHandler().updateAccount(user_id,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        # TODO
        # return AccountHandler().deleteAccount(user_id)
        return 'Deleted Account with user_id provided'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<string:email>', methods=['GET', 'PUT', 'DELETE'])
def getAccountByEmail(email):
    if request.method == 'GET':
        return AccountHandler().getAccountByEmail(email)

    elif request.method == 'PUT':
        # TODO
        # return AccountHandler().updateAccount(user_id,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        # TODO
        # return AccountHandler().deleteAccount(user_id)
        return 'Deleted Account with email provided'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/upPremium/<int:user_id>', methods=['POST'])
def updatePremiumAccount(user_id):
    if request.method == 'POST':
        return AccountHandler().updatePremiumAccount(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/dnPremium/<int:user_id>', methods=['POST'])
def demotePremiumAccount(user_id):
    if request.method == 'POST':
        return AccountHandler().demotePremiumAccount(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/premium/<int:user_id>', methods=['GET'])
def verifyPremiumAccount(user_id):
    if request.method == 'GET':
        return AccountHandler().verifyPremiumAccount(user_id)
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
            # TODO - not necessary at the moment
            # return FriendHandler().searchFriends(request.args)
            return 'Search for friendships with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405




@app.route('/cems/friend/<int:user_id>/<int:friend_id>', methods=['PUT','DELETE'])
def getFriendRelation(user_id, friend_id):
    """
    Delete friend with `friend_id` from account with `user_id`.
    """
    if request.method == 'DELETE':
        return FriendsHandler().deleteFriend(user_id, friend_id)
    elif request.method == 'PUT':
        #return FriendsHandler().updateFriendship(user_id, friend_id, request.json)
        return 'Updated friendship with provided request.json'
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
            # TODO - Point 6
            # return MessageHandler().searchMesages(request.args)
            return 'Searched for messages with request.args'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/<int:m_id>', methods=['GET', 'PUT', 'DELETE'])
def getMessageById(m_id):
    if request.method == 'GET':
        return MessageHandler().getMessageById(m_id)
    elif request.method == 'PUT':
        # TODO
        # return MessageHandler().updateMessage(m_id, request.form)
        return 'Updated message with m_id provided using request.form info'
    elif request.method == 'DELETE':
        # TODO - Delete for nomal user
        # return MessageHandler().deleteMessage(m_id)
        return 'Deleted message with provided m_id'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/premium/<int:m_id>/', methods=['DELETE'])
def deleteMessageById(m_id):
    if request.method == 'DELETE':
        #return MessageHandler.deleteMessageCompletely(m_id)
        return 'Deleted message completely as premium of proveided m_id'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/inbox/<int:user_id>', methods=['GET'])
def getUserInbox(user_id):
    if request.method == 'GET':
        return MessageHandler().getUserInbox(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/inbox/category/<int:user_id>/<string:category>', methods=['GET'])
def getInboxByCategory(user_id, category):
    if request.method == 'GET':
        return MessageHandler().getInboxByCategory(user_id, category)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/outbox/<int:user_id>', methods=['GET'])
def getUserOutbox(user_id):
    if request.method == 'GET':
        return MessageHandler().getUserOutbox(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/recipient', methods=['GET'])
def getAllRecipientMessages():
    if request.method == 'GET':
        #return RecipientHandler().getAllRecipientMessages()
        return 'Got all recipient messages'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/recipient/<int:u_id>/<int:m_id>', methods=['GET','PUT', 'DELETE'])
def getRecipientById(u_id,m_id):
    if request.method == 'GET':
        #return RecipientHandler().getRecipientById(m_id,u_id)
        return 'Got Recipient Message from provided m_id and u_id'
    elif request.method == 'PUT':
        #return RecipientHandler().updateRecipientMessage(m_id, u_id, request.form)
        return 'Updated Recipient Message from provided m_id and u_id with provided request.form'
    elif request.method == 'DELETE':
        #return RecipientHandler().deleteRecipientMessage(m_id, u_id)
        return 'Deleted Recipient Message from provided m_id and u_id'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/recipient/premium/<int:u_id>/<int:m_id>', methods=['DELETE'])
def deleteRecipientCompletely(u_id,m_id):
    if request.method == 'DELETE':
        #return RecipientHandler().deleteRecipientCompletely(m_id,u_id)
        return 'Deleted Completely Recipient Message from provided m_id and u_id'
    else:
        return jsonify(Error="Method not allowed."), 405

# Statistics #
#@app.route('/cems/recipient/statistics')
#def getEmailMostRecipients():
#    if request.method == 'GET':
#        return 

#@app.route('/cems/recipient/topTenUserInbox')


if __name__ == '__main__':
    app.run()

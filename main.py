from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from handler.account import AccountHandler
from handler.message import MessageHandler
from handler.friends import FriendsHandler
from handler.recipient import RecipientHandler

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
        return AccountHandler().updateAccountById(user_id, request.form.to_dict())
    elif request.method == 'DELETE':
        return AccountHandler().deleteAccountById(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/account/<string:email>', methods=['GET', 'PUT', 'DELETE'])
def getAccountByEmail(email):
    if request.method == 'GET':
        return AccountHandler().getAccountByEmail(email)
    elif request.method == 'PUT':
        return AccountHandler().updateAccountByEmail(email, request.form.to_dict())
    elif request.method == 'DELETE':
        return AccountHandler().deleteAccountByEmail(email)
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


@app.route('/cems/friends', methods=['GET', 'POST'])
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


@app.route('/cems/friends/<int:user_id>', methods=['GET'])
def getEmailsSentByFriends(user_id):
    """
    The `user_id` is the user for which the query will get the emails
    sent to by their friends.
    """
    if request.method == 'GET':
        return FriendsHandler().getEmailsSentByFriends(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/friends/<int:user_id>/<int:friend_id>', methods=['PUT', 'DELETE'])
def getFriendRelation(user_id, friend_id):
    """
    Delete friend with `friend_id` from account with `user_id`.
    """
    if request.method == 'DELETE':
        return FriendsHandler().deleteFriend(user_id, friend_id)
    elif request.method == 'PUT':
        # return FriendsHandler().updateFriendship(user_id, friend_id, request.form.to_dict())
        return 'Updated friendship with provided request.json'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message', methods=['GET', 'POST'])
def getAllMessages():
    if request.method == 'POST':

        if 'reply_id' in request.json:
            return MessageHandler().sendReply(request.json)

        else:
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
        return MessageHandler().updateMessage(m_id, request.form.to_dict())
    elif request.method == 'DELETE':
        # TODO - Delete for nomal user
        # return MessageHandler().deleteMessage(m_id)
        return 'Deleted message with provided m_id'
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/premium/<int:m_id>/', methods=['DELETE'])
def deleteMessageById(m_id):
    if request.method == 'DELETE':
        # return MessageHandler.deleteMessageCompletely(m_id)
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
def getUserInboxByCategory(user_id, category):
    if request.method == 'GET':
        return MessageHandler().getInboxByCategory(user_id, category)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/inbox/markCategory/<int:user_id>/<int:m_id>/<string:category>', methods=['PUT'])
def markCategory(user_id, m_id, category):
    if request.method == 'PUT':
        return MessageHandler().markCategory(user_id, m_id, category)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/message/outbox/<int:user_id>', methods=['GET'])
def getUserOutbox(user_id):
    if request.method == 'GET':
        return MessageHandler().getUserOutbox(user_id)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/recipient', methods=['GET', 'POST'])
def getAllRecipientMessages():
    if request.method == 'GET':
        return RecipientHandler().getAllRecipientMessages()
    elif request.method == 'POST':
        return RecipientHandler().createRecipientMessage(request.json)
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/recipient/<int:user_id>/<int:m_id>', methods=['GET', 'PUT', 'DELETE'])
def getRecipientById(user_id, m_id):
    if request.method == 'GET':
        return RecipientHandler().getRecipientById(m_id,user_id)
    elif request.method == 'PUT':
        return RecipientHandler().updateRecipientMessage(m_id, user_id, request.form.to_dict())
    else:
        return jsonify(Error="Method not allowed."), 405
    

@app.route('/cems/recipient/del/<int:user_id>/<int:m_id>', methods=['PUT'])
def deleteRecipientMessage(m_id, user_id):
    if request.method == 'PUT':
        return RecipientHandler().deleteRecipientMessage(m_id, user_id)


@app.route('/cems/recipient/premium/<int:user_id>/<int:m_id>', methods=['DELETE'])
def deleteRecipientCompletely(user_id, m_id):
    if request.method == 'DELETE':
        return RecipientHandler().deleteRecipientCompletely(m_id, user_id)
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/read', methods=['PUT'])
def updateRead():

    if request.method == 'PUT':
        return MessageHandler().readMessage(request.json)

    else:
        return jsonify(Error="Method not allowed."), 405

#Global Statistics#


@app.route('/cems/recipient/mostRecipients/global',methods=['GET'])
def getGlobalEmailMostRecipients():
    if request.method == 'GET':
        return RecipientHandler().getGlobalEmailMostRecipients()
    else:
        return jsonify(Error="Method not allowed."), 405
    
    
@app.route('/cems/message/mostReplies/global',methods=['GET'])
def getGlobalEmailMostReplies():
    if request.method == 'GET':
        
        return MessageHandler().getGlobalEmailMostReplies()
    else:
        return jsonify(Error="Method not allowed."), 405
@app.route('/cems/recipient/topTenInbox', methods=['GET'])
def getTopTenInbox():
    if request.method == 'GET':
        return RecipientHandler().getTopTenInbox()
    else:
        return jsonify(Error="Method not allowed."), 405
@app.route('/cems/message/topTenOutbox', methods=['GET'])
def getTopTenOutbox():
    if request.method == 'GET':
        return RecipientHandler().getTopTenOutbox()
    else:
        return jsonify(Error="Method not allowed."), 405


@app.route('/cems/recipient/topEmail/<int:user_id>', methods=['GET'])
def getEmailWithMostRecipients(user_id):
    
    if request.method == 'GET':
        return RecipientHandler().getEmailWithMostRecipientsByUserId(user_id)

    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/topEmail/<int:user_id>', methods=['GET'])
def getEmailWithMostReplies(user_id):
    
    if request.method == 'GET':
        return MessageHandler().getEmailWithMostRepliesByUserId(user_id)

    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/message/topFive/<int:user_id>', methods=['GET'])
def getTopFiveReceive(user_id):
    
    if request.method == 'GET':
        return MessageHandler().getTopFiveReceiveFromUsers(user_id)

    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/cems/recipient/topFive/<int:user_id>', methods=['GET'])
def getTopFiveSent(user_id):
    
    if request.method == 'GET':
        return RecipientHandler().getTopFiveSentToUsers(user_id)

    else:
        return jsonify(Error="Method not allowed."), 405


if __name__ == '__main__':
    app.run()

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

#Activate
app = Flask(__name__)
#Apply CORS to this app
CORS(app)

@app.route('/')
def greeting():
    return 'Welcome to CEMS DB Project'

@app.route('/account/getAll', methods=['GET','POST'])
def getAllAccounts():
    if request.method == 'POST':
        print("REQUEST: ", request.json)
        #return AccountHandler().insertAccountJson(request.json)
        return 'Inserted new Account'
    else:
        if not request.args:
            #return AccountHandler().getAllAccounts()
            return 'Got all Accounts'
        else:
            #return AccountHandler().searchAccounts(request.args) 
            return 'searched for Accounts with request.args'

@app.route('/account/getById/<int:uid>', methods=['GET','PUT','DELETE'])
def getAccountByID(uid):
    if request.method == 'GET':
        #return AccountHandler().getAccountById(uid)
        return 'Got Account with uid provided'
    elif request.method == 'PUT':
        #return AccountHandler().updateAccount(uid,request.form)
        return 'Updated Account with provided request.form'
    elif request.method == 'DELETE':
        #return AccountHandler().deleteAccount(uid)
        return 'Deleted Account with uid provided'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/friend/getAll', methods=['GET','POST'])
def getAllFriends():
    if request.method == 'POST':
        #return FriendHandler().insertFriendJson(request.json)
        return 'Inserted new Friendship'
    else:
        if not request.args:
            #return FriendHandler().getAllFriends()
            return 'Got all friendships'
        else:
            #return FriendHandler().searchFriends(request.args)
            return 'Search for friendships with request.args'

@app.route('/message/getAll', methods=['GET','POST'])
def getAllMessages():
    if request.method == 'POST':
        #return MessageHandler().insertMesaggeJson(request.json)
        return 'Inserted new message'
    else:
        if not request.args:
            #return MessageHandler().getAllMessages()
            return 'Got all messages'
        else:
            #return MessageHandler().searchMesages(request.args)
            return 'Searched for messages with request.args'

@app.route('/message/getById/<int:mid>', methods=['GET', 'PUT', 'DELETE'])
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

if __name__ == '__main__':
    app.run()


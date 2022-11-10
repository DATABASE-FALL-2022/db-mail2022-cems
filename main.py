from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

#Activate
app = Flask(__name__)
#Apply CORS to this app
CORS(app)

@app.route('/')
def greeting():
    return 'Welcome to CEMS DB Project'

@app.route('/users', methods=['GET','POST'])
def getAllUsers():
    if request.method == 'POST':
        print("REQUEST: ", request.json)
        #return UserHandler().insertUserJson(request.json)
        return 'Inserted new User'
    else:
        if not request.args:
            #return UserHandler().getAllUsers()
            return 'Got all users'
        else:
            #return UserHandler().searchUsers(request.args) 
            return 'searched for users with request.args'

@app.route('/users/<int:uid>', methods=['GET','PUT','DELETE'])
def getUserByID(uid):
    if request.method == 'GET':
        #return UserHandler().getUserById(uid)
        return 'Got user with uid provided'
    elif request.method == 'PUT':
        #return UserHandler().updateUser(uid,request.form)
        return 'Updated User with provided request.form'
    elif request.method == 'DELETE':
        #return UserHandler().deleteUser(uid)
        return 'Deleted User with uid provided'
    else:
        return jsonify(Error="Method not allowed."), 405

@app.route('/friends', methods=['GET','POST'])
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

@app.route('/messages', methods=['GET','POST'])
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

@app.route('/messages/<int:mid>', methods=['GET', 'PUT', 'DELETE'])
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


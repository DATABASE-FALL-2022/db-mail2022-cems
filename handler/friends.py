from dao.friends import FriendsDAO
from flask import jsonify

class FriendsHandler():

    def getAllFriends(self):
        return jsonify(FriendsDAO().getAllFriends()), 200

    def addFriend(self, json):
        return jsonify(FriendsDAO().addNewAccount(json)) , 201 #Only returns the user_id
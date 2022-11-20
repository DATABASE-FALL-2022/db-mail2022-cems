from dao.friends import FriendsDAO
from flask import jsonify

class FriendsHandler():

    def getAllFriends(self):
        return jsonify(FriendsDAO().getAllFriends()), 200

    def addFriendship(self, json):
        return jsonify(FriendsDAO().addFriendship(json)) , 201
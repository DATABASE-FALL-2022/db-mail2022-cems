from dao.friends import FriendsDAO
from flask import jsonify

class FriendsHandler():

    def getAllFriends(self):
        return jsonify(FriendsDAO().getAllFriends()), 200

    def addFriendship(self, json):
        return jsonify(FriendsDAO().addFriendship(json)), 201

    def deleteFriend(self, user_id, friend_id):
        return jsonify(FriendsDAO().deleteFriend(user_id, friend_id)), 200
 
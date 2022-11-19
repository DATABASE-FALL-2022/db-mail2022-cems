from dao.friends import FriendDAO
from flask import jsonify

class FriendHandler():

    def getAllFriends(self):
        return jsonify(FriendDAO().getAllFriends()), 200
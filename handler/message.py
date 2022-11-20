from dao.message import MessageDAO
from flask import jsonify

class MessageHandler:

    def sendNewMessage(self, json):
        valid_recipient = MessageDAO().verifyEmailExist(json['receiver_email'])
        if valid_recipient:
            return jsonify(MessageDAO().sendNewMessage(json['id'], json['receiver_email'], json['subject'], json['body']))
        return jsonify('ERROR: Invalid recipient email address')
    
    def getAllMessages(self):
        return jsonify(MessageDAO().getAllMessages()), 200

    def getUserInbox(self, user_id):
        result = MessageDAO().getUserInbox(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found.'), 200

    def getUserOutbox(self, user_id):
        result = MessageDAO().getUserOutbox(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found.'), 200

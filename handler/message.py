from dao.message import MessageDAO
from flask import jsonify





class Message:

    def sendNewMessage(self, json):

        valid_recipient = MessageDAO().verifyEmailExist(json['receiver_email'])

        if valid_recipient:
            return jsonify(MessageDAO().sendNewMessage(json['id'], json['receiver_email'], json['subject'], json['body']))

        return jsonify('ERROR: Invalid recipient email address')
from dao.recipient import RecipientDAO
from flask import jsonify

class RecipientHandler:
    
    def getEmailMostRecipients(self, type):
        if type == 'global' or type == 'user':
            return jsonify(RecipientDAO().getEmailMostRecipients(type)), 200
        else:
            return jsonify(Error="Type not valid")
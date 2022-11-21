from dao.recipient import RecipientDAO
from flask import jsonify

class RecipientHandler:
    
    def getEmailMostRecipients(self, type):
        if type == 'global' or type == 'user':
            return jsonify(RecipientDAO().getEmailMostRecipients(type)), 200
        else:
            return jsonify(Error="Type not valid")

    def getAllRecipientMessages(self):
        result = RecipientDAO().getAllRecipientMessages()
        if result:
            return jsonify(result), 200
        return jsonify('No recipient messages found'), 200
    
    def createRecipientMessage(self, request):
        result = RecipientDAO().createRecipientMessage(request)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Unable to create'), 200
    
    def getRecipientById(self, m_id, u_id):
        result = RecipientDAO().getRecipientById(m_id, u_id)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Recipient not found'), 200
    
    def updateRecipientMessage(self, m_id, u_id, request):
        result = RecipientDAO().updateRecipientMessage(m_id, u_id, request)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Recipient message not found'), 200
 
    def deleteRecipientMessage(self, m_id, u_id):
        return jsonify(RecipientDAO().deleteRecipientMessage(m_id, u_id)), 200
    
    def deleteRecipientCompletely(self, m_id,u_id):
        return jsonify(RecipientDAO().deleteRecipientCompletely(m_id, u_id)), 200
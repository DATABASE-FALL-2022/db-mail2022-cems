from dao.recipient import RecipientDAO
from flask import jsonify

class RecipientHandler:
    
    def getGlobalEmailMostRecipients(self):
        return jsonify(RecipientDAO().getGlobalEmailMostRecipients()), 200

    def getTopTenInbox(self):
        return jsonify(RecipientDAO().getTopTenInbox())
    def getTopTenOutbox(self):
        return jsonify(RecipientDAO().getTopTenOutbox())


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
    
    def getRecipientById(self, m_id, user_id):
        result = RecipientDAO().getRecipientById(m_id, user_id)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Recipient not found'), 200
    
    def updateRecipientMessage(self, m_id, user_id, request):
        result = RecipientDAO().updateRecipientMessage(m_id, user_id, request)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Recipient message not found'), 200
 
    def deleteRecipientMessage(self, m_id, user_id):
        return jsonify(RecipientDAO().deleteRecipientMessage(m_id, user_id)), 200
    
    def deleteRecipientCompletely(self, m_id, user_id):
        return jsonify(RecipientDAO().deleteRecipientCompletely(m_id, user_id)), 200

    def updateCategory(self, user_id, m_id, category):

        result = RecipientDAO().updateCategory(user_id, m_id, category)

        return jsonify(result), 200

    def removeCategory(self, user_id, m_id):

        result = RecipientDAO().removeCategory(user_id, m_id)
        return jsonify(result), 200

    def getEmailWithMostRecipientsByUserId(self, user_id):

        result = RecipientDAO().getEmailWithMostRecipientsByUserId(user_id)
        return jsonify(result), 200

    def getTopFiveSentToUsers(self, user_id):

        result = RecipientDAO().getTopFiveSentToUsers(user_id)
        return jsonify(result), 200
from dao.message import MessageDAO
from dao.account import AccountDAO
from flask import jsonify

class MessageHandler:

    def sendNewMessage(self, json):
        valid_recipient = MessageDAO().verifyEmailExist(json['receiver_email'])
        if valid_recipient:
            return jsonify(MessageDAO().sendNewMessage(json['id'], json['receiver_email'], json['subject'], json['body']))
        return jsonify(Error='Invalid recipient email address')
    
    def getAllMessages(self):
        return jsonify(MessageDAO().getAllMessages()), 200

    def getUserInbox(self, user_id):
        result = MessageDAO().getUserInbox(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found.'), 200
    
    def getInboxByCategory(self, user_id, category):
        result = MessageDAO().getInboxByCategory(user_id, category)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found.'), 200

    def getUserOutbox(self, user_id):
        result = MessageDAO().getUserOutbox(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found.'), 200
    
    def getMessageById(self, m_id):
        result = MessageDAO().getMessageById(m_id)
        if result:
            return jsonify(result), 200
        return jsonify('Message not found.'), 200

    def readMessage(self, json):
        isRead = MessageDAO().verifyRead(json['m_id'])

        if isRead:
            return jsonify('Message already marked as read'), 200

        messageExist = MessageDAO().verifyMessageExist(json['m_id'])

        if messageExist:
            accountExist = AccountDAO().verifyAccountExist(json['user_id'])

            if accountExist:
                result = MessageDAO().readMessage(json['m_id'], json['user_id'])
                return jsonify(result), 200

            else:
                return jsonify(Error="Account doesn't exist"), 200

        else:
            return jsonify(Error="Message doesn't exist"), 200
        

    def sendReply(self, json):

        valid_recipient = MessageDAO().verifyEmailExist(json['receiver_email'])
        valid_message = MessageDAO().verifyMessageExist(json['reply_id'])

        if valid_recipient:
            if valid_message:
                result = MessageDAO().sendReply(json['reply_id'], json['id'], json['receiver_email'], json['subject'], json['body'])
                return jsonify(result), 200
            else:
                return jsonify(Error="Message doesn't exist")
        else:
            return jsonify(Error="Email address doesn't exist")
    
    def getGlobalEmailMostReplies(self):
        return jsonify(MessageDAO().getGlobalEmailMostReplies()), 200
        


    def updateMessage(self, m_id, request):
        if not request:
            return jsonify(Error='Nothing to update.'), 200

        result = MessageDAO().updateMessage(m_id, request)
        if result:
            return jsonify(result), 200
        return jsonify(Error='Message not found.'), 200

    

    def getEmailWithMostRepliesByUserId(self, user_id):

        result = MessageDAO().getEmailWithMostRepliesByUserId(user_id)
        return jsonify(result), 200



    def getTopFiveReceiveFromUsers(self, user_id):
        
        result = MessageDAO().getTopFiveReceiveFromUsers(user_id)
        return jsonify(result), 200

    def deleteMessagePremium(self, u_id, m_id):

        if(AccountDAO().verifyPremiumAccount(u_id) == False):
            return jsonify("Permission denied, become premium first!")
        result = MessageDAO().deleteMessagePremium(m_id)
        return jsonify(result), 200

    def deleteMessage(self, m_id):

        result = MessageDAO().deleteMessage(m_id)
        return jsonify(result), 200
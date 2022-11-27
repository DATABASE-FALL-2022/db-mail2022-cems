from dao.account import AccountDAO
from flask import jsonify


class AccountHandler:

    def addNewAccount(self, json):
        if AccountDAO().verifyUniqueEmail(json['email_address']):
            # Only returns the user_id
            return jsonify(AccountDAO().addNewAccount(json)), 201
        return jsonify(Error="Email already exists in the system")

    def getAllAccounts(self):
        return jsonify(AccountDAO().getAllAccounts()), 200

    def getAccountById(self, user_id):
        result = AccountDAO().getAccountById(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found'), 200

    def getAccountByEmail(self, email):
        result = AccountDAO().getAccountByEmail(email)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found'), 200

    def updatePremiumAccount(self, user_id):
        result = AccountDAO().updatePremiumAccount(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)

    def demotePremiumAccount(self, user_id):
        result = AccountDAO().demotePremiumAccount(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)

    def verifyPremiumAccount(self, user_id):
        result = AccountDAO().verifyPremiumAccount(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)

    def updateAccountById(self, user_id, request):
        if not request:
            return jsonify('Nothing to update', 200)
        result = AccountDAO().updateAccountById(user_id, request)
        if result:
            return result, 200
        return jsonify('Account not found', 200)

    def updateAccountByEmail(self, email, request):
        if not request:
            return jsonify('Nothing to update', 200)
        result = AccountDAO().updateAccountByEmail(email, request)
        if result:
            return result, 200
        return jsonify('Account not found', 200)

    def deleteAccountById(self, user_id):
        result = AccountDAO().deleteAccountById(user_id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)

    def deleteAccountByEmail(self, email):
        result = AccountDAO().deleteAccountByEmail(email)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)

    def markCategory(self, user_id, m_id, category):
        result = AccountDAO().markCategory(user_id, m_id, category)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found', 200)
    
    def searchMessages(self, request_args):
        result = AccountDAO().searchMessages(request_args)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found'), 200

    def getTopFiveSentToAccounts(self):
        return

    def getTopFiveReceiveFromAccounts(self):
        return

    def getTopTenAccountsWithMostInboxMessages(self):
        return

    def getTopTenAccountsWithMostOutboxMessages(self):
        return

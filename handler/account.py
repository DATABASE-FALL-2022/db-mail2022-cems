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

    def updateAccount(self, user_id, request):
        if not request:
            return "Nothing to update"
        result = AccountDAO().updateAccount(user_id, request)
        if result:
            return result, 200
        return jsonify('Account not found', 200)

    def getTopFiveSentToAccounts(self):
        return

    def getTopFiveReceiveFromAccounts(self):
        return

    def getTopTenAccountsWithMostInboxMessages(self):
        return

    def getTopTenAccountsWithMostOutboxMessages(self):
        return

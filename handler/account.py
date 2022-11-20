from dao.account import AccountDAO
from flask import jsonify

class AccountHandler:

    def addNewAccount(self, json):
        if AccountDAO().verifyUniqueEmail(json['email_address']):
            # Only returns the user_id
            return jsonify(AccountDAO().addNewAccount(json)), 201
        return jsonify("ERROR: Email already exists in the system")

    def getAllAccounts(self):
        return jsonify(AccountDAO().getAllAccounts()), 200

    def getAccountById(self, id):
        result = AccountDAO().getAccountById(id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found :('), 200

    def getAccountByEmail(self, email):
        result = AccountDAO().getAccountByEmail(email)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found :('), 200

    def updatePremiumAccount(self, id):
        result = AccountDAO().updatePremiumAccount(id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found :(', 200)

    def demotePremiumAccount(self, id):
        result = AccountDAO().demotePremiumAccount(id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found :(', 200)

    def verifyPremiumAccount(self, id):
        result = AccountDAO().verifyPremiumAccount(id)
        if result:
            return jsonify(result), 200
        return jsonify('Account not found :(', 200)

    def getTopFiveSentToAccounts(self):
        return

    def getTopFiveReceiveFromAccounts(self):
        return

    def getTopTenAccountsWithMostInboxMessages(self):
        return

    def getTopTenAccountsWithMostOutboxMessages(self):
        return
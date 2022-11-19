from dao.accounts import AccountsDAO
from flask import jsonify


class Accounts:

    def addNewAccount(self, json):

        if AccountsDAO().verifyUniqueEmail(json['email_address']):

            # Only returns the user_id
            return jsonify(AccountsDAO().addNewAccount(json)), 201

        return jsonify("ERROR: Email already exists in the system")

    def getAllAccounts(self):
        return jsonify(AccountsDAO().getAllAccounts()), 200

    def getAccountById(self, id):

        result = AccountsDAO().getAccountById(id)

        if result:
            return jsonify(result), 200
        return jsonify('Account not found :('), 200

    def getAccountByEmail(self, email):

        result = AccountsDAO().getAccountByEmail(email)

        if result:
            return jsonify(result), 200
        return jsonify('Account not found :('), 200

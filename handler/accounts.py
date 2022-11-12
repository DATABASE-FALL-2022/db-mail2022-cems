from dao.accounts import AccountsDAO
from flask import jsonify





class Accounts:

    def addNewAccount(self, json):

        if AccountsDAO().verifyUniqueEmail(json['email_address']):

            return jsonify(AccountsDAO().addNewAccount(json)) , 201 #Only returns the user_id

        return jsonify("Error in accounts handler") 
from config import get_db
# RealDictCursor is used to configurate the cursor to return a dictionary
from psycopg2.extras import RealDictCursor


class AccountDAO:

    def verifyUniqueEmail(self, email):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT user_id, email_address FROM account WHERE email_address=%s;
        '''
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        if result == None:
            return True
        return False

    def verifyAccountExist(self, user_id):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT * FROM account WHERE user_id = %s;
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return True
        return False

    def addNewAccount(self, json):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        INSERT INTO account (first_name, last_name, date_of_birth, gender, phone_number, email_address, passwd)
        VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING user_id;
        '''
        cursor.execute(query, (json['first_name'], json['last_name'], json['date_of_birth'],
                       json['gender'], json['phone_number'], json['email_address'], json['passwd']))
        # Returns the user_id of the recently created user (why is allways returning 0?)
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        return result

    def getAllAccounts(self):
        """
        This function return all tuples in the account table with all the infor including
        delicate info like passwords.
        """
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result

    def getAccountById(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account WHERE user_id = %s
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getAccountByEmail(self, email):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account WHERE email_address = %s
        '''
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def updatePremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = true WHERE user_id = %s
        '''
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def demotePremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = false WHERE user_id = %s;
        '''
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def verifyPremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT is_premium FROM account WHERE user_id = %s;
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        result = result["is_premium"]
        return result

    def updateAccount(self, user_id, request):
        # Gets all values from current account before updating it
        original_account = self.getAccountById(user_id)
        # Replace only the keys from the request
        result = {key: request.get(
            key, original_account[key]) for key in original_account}

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET first_name = %s, last_name = %s, date_of_birth = %s, gender = %s, phone_number = %s, email_address = %s, passwd = %s, is_premium = %s
        WHERE user_id = %s;
        '''
        cursor.execute(query, (result['first_name'], result['last_name'], result['date_of_birth'], result['gender'],
                       result['phone_number'], result['email_address'], result['passwd'], result['is_premium'], user_id))
        conn.commit()
        cursor.close()
        result_msg = "Updated the following values from user_id " + \
            str(user_id) + ":\n"

        for key in request:
            result_msg = result_msg + key + ": " + \
                str(original_account[key]) + " -> " + str(request[key]) + "\n"
        return result_msg

    def getTopFiveSentToAccounts():
        return

    def getTopFiveReceiveFromAccounts():
        return

    def getTopTenAccountsWithMostInboxMessages():
        return

    def getTopTenAccountsWithMostOutboxMessages():
        return

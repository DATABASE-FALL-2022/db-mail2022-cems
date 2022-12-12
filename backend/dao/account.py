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
        SELECT * FROM account WHERE user_id = %s AND is_deleted = false;
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
        SELECT * FROM account WHERE is_deleted = false
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result

    def getAccountById(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account WHERE user_id = %s AND is_deleted = false
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getAccountByEmail(self, email):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account WHERE email_address = %s AND is_deleted = false
        '''
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def updatePremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = true WHERE user_id = %s AND is_deleted = false
        '''
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def demotePremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = false WHERE user_id = %s AND is_deleted = false
        '''
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def verifyPremiumAccount(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT is_premium FROM account WHERE user_id = %s AND is_deleted = false
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        result = result["is_premium"]
        return result

    def deleteAccountById(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        UPDATE account
        SET is_deleted = true
        WHERE user_id = %s
        """

        
        
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def deleteAccountByEmail(self, email):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        UPDATE account
        SET is_deleted = true
        WHERE email_address = %s
        """
        cursor.execute(query, (email,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def markCategory(user_id, m_id, category):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        UPDATE recipient SET category = %s
        WHERE user_id = %s
        AND m_id = %s;
        """
        cursor.execute(query, (category, user_id, m_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def updateAccountById(self, user_id, request):
        original_account = self.getAccountById(user_id)

        if not original_account:
            return ('Account with id: %s not found' % user_id)

        result = {key: request.get(key, original_account[key]) for key in original_account}

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account
        SET first_name = %s, last_name = %s, date_of_birth = %s, gender = %s, phone_number = %s, email_address = %s, passwd = %s, is_premium = %s
        WHERE user_id = %s;
        '''
        cursor.execute(query, (result['first_name'], result['last_name'], result['date_of_birth'], result['gender'],
                       result['phone_number'], result['email_address'], result['passwd'], result['is_premium'], user_id))
        conn.commit()
        cursor.close()
        result_msg = "Updated the following values from user_id " + str(user_id) + ":\n"

        for key in request:
            result_msg = result_msg + key + ": " + str(original_account[key]) + " -> " + str(request[key]) + "\n"
        return result_msg

    def updateAccountByEmail(self, email, request):
        original_account = self.getAccountByEmail(email)

        if not original_account:
            return ('Account with email: %s not found' % email)

        result = {key: request.get(key, original_account[key]) for key in original_account}

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account 
        SET first_name = %s, last_name = %s, date_of_birth = %s, gender = %s, phone_number = %s, email_address = %s, passwd = %s, is_premium = %s
        WHERE email_address = %s;
        '''
        cursor.execute(query, (result['first_name'], result['last_name'], result['date_of_birth'], result['gender'],
                       result['phone_number'], result['email_address'], result['passwd'], result['is_premium'], email))
        conn.commit()
        cursor.close()
        result_msg = "Updated the following values from email " + str(email) + ":\n"

        for key in request:
            result_msg = result_msg + key + ": " + str(original_account[key]) + " -> " + str(request[key]) + "\n"
        return result_msg

    def searchMessages(self, request_args):
        user_id = request_args.get('user_id')
        if user_id is None:
            return "user_id argument for search does not exist."
        email = request_args.get('email_address')
        if email is None:
            return "Email address argument for search does not exist."
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, r.is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient AS r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND a.email_address = %s
        AND r.is_deleted = false
        AND a.is_deleted = false
        ORDER BY m_date DESC;
        """
        cursor.execute(query, (user_id, email,))
        result = cursor.fetchone()
        cursor.close()
        return result

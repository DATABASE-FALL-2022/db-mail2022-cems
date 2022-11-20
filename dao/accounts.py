from config import get_db
# RealDictCursor is used to configurate the cursor to return a dictionary
from psycopg2.extras import RealDictCursor


class AccountsDAO:

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

    def getAccountById(self, id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM account WHERE user_id = %s
        '''
        cursor.execute(query, (id,))
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

    def updatePremiumAccount(self, id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = true WHERE user_id = %s
        '''
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

    def demotePremiumAccount(self, id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE account SET is_premium = false WHERE user_id = %s;
        '''
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"

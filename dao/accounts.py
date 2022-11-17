from config import get_db
from psycopg2.extras import RealDictCursor #RealDictCursor is used to configurate the cursor to return a dictionary




class AccountsDAO:

    def verifyUniqueEmail(self, email):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT user_id, email_address FROM account WHERE email_address=%s;
        '''
        cursor.execute(query,(email,))
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
        cursor.execute(query, (json['first_name'], json['last_name'], json['date_of_birth'], json['gender'], json['phone_number'], json['email_address'], json['passwd']))
        result = cursor.fetchone() #Returns the user_id of the recently created user (why is allways returning 0?)
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

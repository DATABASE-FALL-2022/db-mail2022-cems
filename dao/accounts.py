from config import get_db
import psycopg2
from psycopg2.extras import DictCursor




class AccountsDAO:

    def verifyUniqueEmail(self, email):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT user_id, email_address FROM account WHERE email_address=%s;
        '''
        cursor.execute(query,(email,))
        result = cursor.fetchone()
        if result == None:
            return True
        return False


    def addNewAccount(self, json):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=DictCursor)
        query = '''
        INSERT INTO account (first_name, last_name, date_of_birth, gender, phone_number, email_address, passwd) 
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        '''
        cursor.execute(query, (json['first_name'], json['last_name'], json['date_of_birth'], json['gender'], json['phone_number'], json['email_address'], json['passwd']))
        result = cursor.lastrowid #Returns the user_id of the recently created user
        conn.commit()
        cursor.close()
        return result

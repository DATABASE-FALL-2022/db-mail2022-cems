from config import get_db
from psycopg2.extras import RealDictCursor #RealDictCursor is used to configurate the cursor to return a dictionary

class MessageDAO:

    def verifyEmailExist(self, email):
        conn = get_db()
        conn.autocommit = True
        cursor = conn.cursor()
        query = """
        SELECT * FROM account WHERE email_address = %s;
        """
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return True
        return False

    def sendNewMessage(self, sender_id, receiver_email, subject, body):
        conn = get_db()
        conn.autocommit = True
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        send_query = """
        INSERT INTO message(user_id, subject, body, m_date) VALUES (%s, %s, %s, current_timestamp) RETURNING m_id;
        """
        receive_query = """
        INSERT INTO recipient(user_id, m_id) VALUES ((SELECT user_id FROM account WHERE email_address = %s), %s);
        """

        #Insert message into the sender outbox
        cursor.execute(send_query, (sender_id, subject, body))
        message_id = cursor.fetchone()['m_id']

        #Insert message into the receiver inbox
        cursor.execute(receive_query, (receiver_email, message_id))
        cursor.close()
        return ('Message sent to %s' % (receiver_email))

    def getAllMessages(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM message;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
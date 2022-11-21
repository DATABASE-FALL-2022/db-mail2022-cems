from config import get_db
from psycopg2.extras import RealDictCursor #RealDictCursor is used to configurate the cursor to return a dictionary
from datetime import datetime
from dao.account import AccountDAO


class MessageDAO:

    def verifyEmailExist(self, email):
        conn = get_db()
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

    def verifyMessageExist(self, m_id):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT * FROM message WHERE m_id = %s
        '''
        cursor.execute(query, (m_id,))
        result = cursor.fetchone()
        cursor.close()
        if result: 
            return True

        return False

    def verifyRead(self, m_id):
        conn = get_db()
        cursor = conn.cursor()
        query = '''
        SELECT is_read FROM recipient WHERE m_id = %s
        '''
        cursor.execute(query, (m_id,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def sendNewMessage(self, sender_id, receiver_email, subject, body):
        conn = get_db()
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
        conn.commit()

        #Insert message into the receiver inbox
        cursor.execute(receive_query, (receiver_email, message_id))
        conn.commit()
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

    def getUserInbox(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND is_deleted = FALSE
        ORDER BY m_date DESC;
        """
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result

    def getInboxByCategory(self, user_id, category):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND category = %s
        AND is_deleted = FALSE
        ORDER BY m_date DESC;
        """
        cursor.execute(query, (user_id, category,))
        result = cursor.fetchall()
        cursor.close()
        return result

    def getUserOutbox(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT user_id, m_id, reply_id, subject, body, m_date
        FROM account NATURAL INNER JOIN message
        WHERE user_id = %s
        ORDER BY m_date DESC;
        """
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result

    def getMessageById(self, m_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM message WHERE m_id = %s
        '''
        cursor.execute(query, (m_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def sendSupportMessage(self, type, arg1, arg2, arg3):

        if type == 'read_notification':
            current_datetime = datetime.now().strftime("%H:%M on %B %d, %Y")
            subject = 'Read Notification'
            body = '%s has read your message with id: %s at %s' % (arg2, arg3, current_datetime)
            self.sendNewMessage(12, arg1, subject, body)

    def readMessage(self, m_id, reader_id):

        conn = get_db()
        # conn.autocommit = True
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        #Mark as read
        read_query = '''
        UPDATE recipient SET is_read = True WHERE m_id = %s AND user_id = %s
        '''
        cursor.execute(read_query, (m_id, reader_id))
        conn.commit()
        cursor.close()

        #Notify as read
        sender_id = self.getMessageById(m_id)['user_id']
        sender_email = AccountDAO().getAccountById(sender_id)['email_address']
        reader_email = AccountDAO().getAccountById(reader_id)['email_address']
        self.sendSupportMessage('read_notification', sender_email, reader_email, m_id)

        return ('Message with id: %s marked as read' % m_id)
        

    def sendReply(self, m_id, sender_id, receiver_email, subject, body):

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        send_query = """
        INSERT INTO message(user_id, subject, body, reply_id, m_date) VALUES (%s, %s, %s, %s, current_timestamp) RETURNING m_id;
        """
        receive_query = """
        INSERT INTO recipient(user_id, m_id) VALUES ((SELECT user_id FROM account WHERE email_address = %s), %s);
        """
        
        #Insert message into sender outbox
        cursor.execute(send_query, (sender_id, subject, body, m_id))
        message_id = cursor.fetchone()['m_id']
        conn.commit()
        
        #Insert message into receiver inbox
        cursor.execute(receive_query, (receiver_email, message_id))
        conn.commit()
        cursor.close()
        return ('Reply sent to %s' % receiver_email)


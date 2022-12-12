from config import get_db
# RealDictCursor is used to configurate the cursor to return a dictionary
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dao.account import AccountDAO
import logging

logging.basicConfig(filename='logfile.log', encoding='utf-8', level=logging.DEBUG, format='%(levelname)s:%(message)s', filemode='w')


class MessageDAO:

    def verifyEmailExist(self, email):
        conn = get_db()
        cursor = conn.cursor()
        isList = isinstance(email, list)
        query = """
        SELECT * FROM account WHERE email_address = %s AND is_deleted = false;
        """
        isValid = True

        if isList:
            for email_i in email:
                cursor.execute(query, (email_i,))
                result = cursor.fetchone()
                if not result:
                    isValid = False
                    break

        else:
            cursor.execute(query, (email,))
            result = cursor.fetchone()
            if not result:
                isValid = False
                
        cursor.close()
        return isValid

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

        if isinstance(receiver_email, list):
            logging.debug('receiver_email is a list')

        else:
            logging.debug('receiver_email is not a list')

        

        send_query = """
        INSERT INTO message(user_id, subject, body, m_date) VALUES (%s, %s, %s, current_timestamp) RETURNING m_id;
        """

        receive_query = """
        INSERT INTO recipient(user_id, m_id) VALUES ((SELECT user_id FROM account WHERE email_address = %s), %s);
        """

        # Insert message into the sender outbox
        cursor.execute(send_query, (sender_id, subject, body))
        message_id = cursor.fetchone()['m_id']
        conn.commit()

        for receiver in receiver_email:
            # Insert message into the receiver inbox
            cursor.execute(receive_query, (receiver, message_id))
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
        SELECT a.email_address as sender_email_address, first_name|| ' ' ||last_name as sender_name, r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, r.is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient AS r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND r.is_deleted = false
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
        SELECT a.email_address as sender_email_address, first_name|| ' ' ||last_name as sender_name, r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, r.is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient AS r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND category = %s
        AND r.is_deleted = false
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
        SELECT a.user_id AS sender_id, m.m_id AS m_id, r.user_id AS receiver_id, reply_id, subject, body, m_date, is_read, r.is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient AS r ON (m.m_id = r.m_id)
        WHERE a.user_id = %s
        AND r.is_deleted = false
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
            self.sendNewMessage(12, [arg1], subject, body)

    def readMessage(self, m_id, reader_id):

        conn = get_db()
        # conn.autocommit = True
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Mark as read
        read_query = '''
        UPDATE recipient SET is_read = True WHERE m_id = %s AND user_id = %s
        '''
        cursor.execute(read_query, (m_id, reader_id))
        conn.commit()
        cursor.close()

        # Notify as read
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

        # Insert message into sender outbox
        cursor.execute(send_query, (sender_id, subject, body, m_id))
        message_id = cursor.fetchone()['m_id']
        conn.commit()

        # Insert message into receiver inbox
        cursor.execute(receive_query, (receiver_email, message_id))
        conn.commit()
        cursor.close()
        return ('Reply sent to %s' % receiver_email)

    def getGlobalEmailMostReplies(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT reply_id AS m_id, count(reply_id) AS stats
        FROM message
        WHERE reply_id IS NOT NULL
        GROUP BY reply_id
        ORDER BY count(reply_id)
        DESC LIMIT 1;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result

    def updateMessage(self, m_id, request):
        original_message = self.getMessageById(m_id)

        if not original_message:
            return ('Message with id: %s not found' % m_id)

        result = {key: request.get(key, original_message[key]) for key in original_message}

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE message 
        SET user_id = %s, reply_id = %s, subject = %s, body = %s, m_date = %s
        WHERE m_id = %s;
        '''
        cursor.execute(query, (result['user_id'], result['reply_id'], result['subject'], result['body'],
                       result['m_date'], m_id))
        conn.commit()
        cursor.close()
        result_msg = "Updated the following values from m_id " + str(m_id) + ": "

        for key in request:
            result_msg = result_msg + key + ": " + str(original_message[key]) + " -> " + str(request[key]) + ""
        return result_msg

    def getEmailWithMostRepliesByUserId(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT m.reply_id as m_id, count(*) AS stats
        FROM message AS m INNER JOIN recipient AS r ON m.m_id = r.m_id
        WHERE r.user_id = %s
        AND m.reply_id IS NOT NULL
        GROUP BY m.reply_id
        ORDER BY count(*)
        DESC LIMIT 1;
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def getTopFiveReceiveFromUsers(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT m.user_id, count(*) AS stats
        FROM message AS m INNER JOIN recipient AS r ON m.m_id = r.m_id
        WHERE r.user_id = %s
        GROUP BY m.user_id
        ORDER BY count(*) DESC
        LIMIT 5;
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result

    def deleteMessagePremium(self, m_id):

        conn =get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        delete_from_recipient_query = """
        DELETE FROM recipient
        WHERE m_id = %s;
        """
        delete_from_message_query = """
        DELETE FROM message
        WHERE m_id = %s;
        """
        cursor.execute(delete_from_recipient_query, (m_id,))
        conn.commit()
        cursor.execute(delete_from_message_query, (m_id,))
        conn.commit()
        cursor.close()
        return f'Deleted email with message ID m_id={m_id} from DB'

    def deleteMessage(self, m_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE message
        SET is_deleted = true
        WHERE m_id = %s
        '''
        cursor.execute(query, (m_id,))
        conn.commit()
        cursor.close()
        return f'Deleted email with message ID m_id={m_id} from outbox'
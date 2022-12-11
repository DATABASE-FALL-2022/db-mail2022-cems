from config import get_db
# RealDictCursor is used to configurate the cursor to return a dictionary
from psycopg2.extras import RealDictCursor
from dao.message import MessageDAO
from dao.account import AccountDAO

class RecipientDAO:
    def getGlobalEmailMostRecipients(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT m_id, count(user_id) AS stats FROM recipient GROUP BY m_id ORDER BY count(user_id) DESC LIMIT 1;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        conn.commit()
        cursor.close()
        return result

    def getTopTenInbox(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT a.user_id, count(m_id) as stats
        FROM account AS a NATURAL INNER JOIN recipient AS r
        WHERE a.user_id IN (SELECT user_id FROM recipient)
        GROUP BY r.user_id, a.user_id
        ORDER BY count(m_id)
        DESC LIMIT 10;
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        conn.commit()
        cursor.close()
        return result

    def getTopTenOutbox(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT a.user_id, count(m_id) as stats
        FROM account AS a NATURAL INNER JOIN message AS m
        WHERE a.user_id IN (
                SELECT user_id
                FROM message)
        GROUP BY m.user_id, a.user_id
        ORDER BY count(m_id)
        DESC LIMIT 10;
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        conn.commit()
        cursor.close()
        return result

    def getAllRecipientMessages(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM recipient;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result

    def createRecipientMessage(self, request):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        INSERT INTO recipient (user_id, m_id, category, is_read, is_deleted)
        VALUES (%s, %s, %s, %s, %s) RETURNING user_id, m_id, category, is_read, is_deleted;
        '''
        cursor.execute(query, (request['user_id'], request['m_id'], request.get('category'),
                       request['is_read'], request['is_deleted']))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        return result
    
    def getRecipientById(self, m_id, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM recipient
        WHERE m_id = %s
        AND user_id = %s;
        """
        cursor.execute(query, (m_id, user_id))
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def updateRecipientMessage(self, m_id, user_id, request):
        original_message = self.getRecipientById(m_id, user_id)

        if not original_message:
            return ('Recipient message with id: %s not found' % m_id)

        original_message = original_message[0]
        result = {key: request.get(key, original_message[key]) for key in original_message}

        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        UPDATE recipient
        SET user_id = %s, m_id = %s, category = %s, is_read = %s, is_deleted = %s
        WHERE user_id = %s
        AND m_id = %s;
        '''
        cursor.execute(query, (result['user_id'], result['m_id'], result['category'], result['is_read'],
                       result['is_deleted'], user_id, m_id))
        conn.commit()
        cursor.close()
        result_msg = "Updated the following values from user_id " + str(user_id) + ": "

        for key in request:
            result_msg = result_msg + key + ": " + str(original_message[key]) + " -> " + str(request[key]) + " "
        return result_msg
 
    def deleteRecipientMessage(self, m_id, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        UPDATE recipient
        SET is_deleted = TRUE
        WHERE user_id = %s
        AND m_id = %s;
        """
        cursor.execute(query, (user_id, m_id,))
        conn.commit()
        cursor.close()
        return str(cursor.rowcount) + " record(s) affected"
    
    def deleteRecipientCompletely(self, m_id, user_id):
        if AccountDAO.verifyPremiumAccount(user_id):
            return f'User with user_id={user_id} does not have Premium access.'
        conn = get_db()
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
        return f'Deleted email with message ID m_id={m_id} from DB'

    def getEmailWithMostRecipientsByUserId(self, user_id):
        
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT r.m_id, count(*) AS stats
        FROM recipient AS r INNER JOIN message AS m ON r.m_id = m.m_id
        WHERE m.user_id = %s
        GROUP BY r.m_id
        ORDER BY count(*) DESC
        LIMIT 1;
        '''
        cursor.execute(query, (user_id,))
        result =  cursor.fetchall()
        cursor.close()
        return result

    def getTopFiveSentToUsers(self, user_id):
        
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT r.user_id, count(*) AS stats
        FROM message AS m INNER JOIN recipient AS r ON m.m_id = r.m_id
        WHERE m.user_id = %s
        GROUP BY r.user_id
        ORDER BY count(*) DESC
        LIMIT 5;
        '''
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result
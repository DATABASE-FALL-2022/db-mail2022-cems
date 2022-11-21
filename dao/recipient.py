from config import get_db
# RealDictCursor is used to configurate the cursor to return a dictionary
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dao.message import MessageDAO

class RecipientDAO:
    def getEmailMostRecipients(self, type):
        conn = get_db()
        cursor = conn.cursor()
        if type == 'global':
            query = """
        SELECT m_id FROM recipient GROUP BY m_id ORDER BY count(user_id) DESC LIMIT 1;
        """
        elif type =='user':
            query = """
        SELECT * FROM recipient;
        """
        
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        result = MessageDAO.getMessageById(self,result)
        return result
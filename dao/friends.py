from config import get_db
from psycopg2.extras import RealDictCursor #RealDictCursor is used to configurate the cursor to return a dictionary

class FriendDAO:

    def getAllFriends(self):
        """
        """
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT * FROM friends;
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result

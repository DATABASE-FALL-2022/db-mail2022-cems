from config import get_db
from psycopg2.extras import RealDictCursor #RealDictCursor is used to configurate the cursor to return a dictionary

class FriendsDAO:

    def getAllFriends(self):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM friends;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def getAllFriendsByUserId(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT *
        FROM account
        WHERE user_id IN (SELECT friend_id
                        FROM friends
                        WHERE user_id = %s) 
                        AND is_deleted = false;
        """
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def getIsFriend(self, user_id, friend_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = '''
        SELECT EXISTS(
            SELECT * FROM friends
            WHERE user_id = %s
            AND friend_id = %s
            ORDER BY user_id
        );
        '''
        cursor.execute(query, (user_id, friend_id))
        result = cursor.fetchone()
        cursor.close()
        return result

    def addFriendship(self, json):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor) 
        query = """
        INSERT INTO friends (user_id, friend_id)
        VALUES (%s, %s)
        RETURNING user_id, friend_id;
        """
        cursor.execute(query, (json['user_id'], json['friend_id']))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        return result

    def deleteFriend(self, user_id, friend_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor) 
        query = """
        DELETE FROM friends
        WHERE user_id = %s AND friend_id = %s
        RETURNING (user_id, friend_id);
        """
        cursor.execute(query, (user_id, friend_id,))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        return result
    
    def getEmailsSentByFriends(self, user_id):
        conn = get_db()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT r.user_id AS receiver_id, m.m_id AS m_id, a.user_id AS sender_id, reply_id, subject, body, m_date, category, is_read, r.is_deleted
        FROM account AS a INNER JOIN message AS m ON (a.user_id = m.user_id)
        INNER JOIN recipient AS r ON (m.m_id = r.m_id)
        WHERE r.user_id = %s
        AND a.user_id IN
            (SELECT friend_id
            FROM friends
            WHERE user_id = %s)
        AND r.is_deleted = false
        ORDER BY m_date DESC;
        """
        cursor.execute(query, (user_id, user_id,))
        result = cursor.fetchall()
        cursor.close()
        return result

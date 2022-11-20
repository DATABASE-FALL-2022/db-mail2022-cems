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

from config import create_connection



conn = create_connection()
cursor = conn.cursor()

query = "select * from account"
cursor.execute(query)
result = cursor.fetchone()
print(result)

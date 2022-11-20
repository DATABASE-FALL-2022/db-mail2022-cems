import os
import psycopg2
from flask import g
from dotenv import dotenv_values

filename = ".env.db"
config = dotenv_values(filename)

def create_connection():
    try:
        conn = psycopg2.connect(**config)

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    else:
        print("Connection succesful") #testing purposes
        return conn

    
def get_db():
    if 'db' not in g:
        g.db = create_connection()
    return g.db
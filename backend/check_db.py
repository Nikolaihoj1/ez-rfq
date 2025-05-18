import sqlite3

def check_db():
    conn = sqlite3.connect('quotes.db')
    c = conn.cursor()
    
    print("\nTables in database:")
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = c.fetchall()
    for table in tables:
        print(f"- {table[0]}")
        
    print("\nClients:")
    c.execute("SELECT * FROM clients;")
    clients = c.fetchall()
    for client in clients:
        print(client)
        
    print("\nSenders:")
    c.execute("SELECT * FROM senders;")
    senders = c.fetchall()
    for sender in senders:
        print(sender)
        
    conn.close()

if __name__ == "__main__":
    check_db()

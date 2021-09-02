import datetime
import sqlite3 as sql
import threading
import src.api.defaultsql as defsql

db = sql.connect("patiket.db",check_same_thread=False)
cur = db.cursor()
lock = threading.Lock()

def curexec(sql):
    try:
        lock.acquire(True)
        cur.execute(sql)
        db.commit()
    finally:
        lock.release()

def createTable(tablename,values):
    text = ""
    for value in values:    
        if value == values[-1]:
            text += "'"+str(value)+"'"
        else:
            text += "'"+str(value)+"',"
    sql = "CREATE TABLE if not exists '"+tablename+"' ("+text+")"
    cur.execute(sql)
    db.commit()

def getLastId(table_name):
    sqlid = "SELECT MAX(CAST(id AS INT )) FROM "+table_name+";"
    try:
        lock.acquire(True)
        cur.execute(sqlid)
        fetch = cur.fetchall()
    finally:
        lock.release()
        _id = fetch[0][0]
        
    if _id == None:
        _id = 0
    else:
        _id += 1
    return _id

def getTimestamp():
    date = datetime.datetime.now()
    date = str(date.timestamp()).split(".")
    text = date[0]+date[1]
    return text

def getMeta(pet_id,key):
    sql = "SELECT meta_value FROM pet_meta WHERE meta_key = '"+key+"' AND pet_id='"+ pet_id +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()

    if  len(list(fetch)) != 0:
        return fetch[0][0]
    else:
        return None

def getMetas(pet_id):
    sql = "SELECT meta_key,meta_value FROM pet_meta WHERE pet_id='"+ pet_id +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch


def setMeta(pet_id,key,value):
    res = getMeta(pet_id,key)
    if res != None:
        update = "UPDATE pet_meta SET meta_value='"+ str(value) +"' WHERE meta_key = '"+key+"' AND pet_id='"+ pet_id +"'"
        curexec(update)
    else:
        _id = _id = getLastId("pet_meta")
        add = "INSERT INTO pet_meta VALUES ('"+ str(_id) +"','"+ pet_id +"','"+ key +"','"+ str(value) +"')"
        curexec(add)

def addPet(user_id,name):        
    _id = _id = getLastId("pets")
    add = "INSERT INTO pets VALUES ('"+ str(_id) +"','"+ user_id +"','"+ name +"','"+ str(datetime.datetime.now()) +"')"
    curexec(add)

def getEmptyPet(pet_id):
    sql = "SELECT * FROM empty_pets WHERE id = '"+ str(pet_id) +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch

def transferPet(pet_id,user_id):
    add = "INSERT INTO pets VALUES ('"+ str(pet_id) +"','"+ user_id +"','','"+ str(datetime.datetime.now()) +"')"
    curexec(add)
    delete = "DELETE FROM empty_pets WHERE id ='"+pet_id+"';"
    curexec(delete)

def getPet(pet_id):
    sql = "SELECT * FROM pets WHERE id = '"+ str(pet_id) +"'"
    print(sql)
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()[0]
        return fetch
    finally:
        lock.release()

def getPets(user_id):
    sql = "SELECT * FROM pets WHERE user_id = '"+ str(user_id) +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch

def getUserFromId(user_id):
    sql = "SELECT * FROM users WHERE user_id = '"+ user_id +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch

def getUserFromMail(mail):
    sql = "SELECT * FROM users WHERE mail = '"+ mail +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch

def addUser(mail,pass_hash):
    _id = _id = getLastId("users")
    add = "INSERT INTO users VALUES ('"+ str(_id) +"','"+ mail +"','"+ pass_hash +"','"+ str(datetime.datetime.now()) +"')"
    curexec(add)

def updateName(pet_id,name):
    update = "UPDATE pets SET name='"+ str(name) +"' WHERE id = '"+ str(pet_id) +"'"
    curexec(update)

def getGalleries(pet_id):    
    sql = "SELECT * FROM gallery WHERE pet_id = '"+ pet_id +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()
        return fetch

def getGallery(pet_id,gallery_id):
    sql = "SELECT * FROM gallery WHERE pet_id = '"+ pet_id +"' AND gallery_id = '"+ gallery_id +"'"
    try:
        lock.acquire(True)
        cur.execute(sql)
        fetch = cur.fetchall()
    finally:
        lock.release()

    if  len(list(fetch)) != 0:
        return fetch[0][0]
    else:
        return None

def setGallery(pet_id,gallery_id,photo_name):
    res = getGallery(pet_id,gallery_id)
    if res != None:
        update = "UPDATE gallery SET photo_name='"+ str(photo_name) +"' WHERE gallery_id = '"+gallery_id+"' AND pet_id='"+ pet_id +"'"
        curexec(update)
    else:
        _id = getLastId("gallery")
        add = "INSERT INTO gallery VALUES ('"+ str(_id) +"','"+ pet_id +"','"+ gallery_id +"','"+ str(photo_name) +"')"
        curexec(add)

def removeAllGalleries(pet_id):
    sql = "DELETE FROM gallery WHERE pet_id ='"+pet_id+"';"
    curexec(sql)

def deletePet(pet_id):
    sql = "DELETE FROM pets WHERE id ='"+pet_id+"';"
    curexec(sql)
    sql = "DELETE FROM pet_meta WHERE pet_id ='"+pet_id+"';"
    curexec(sql)
    removeAllGalleries(pet_id)

defsql.setSQL()
import src.api.sql as sql
import random
import string

def setSQL():
    sql.createTable("users",["id","mail","pass_hash","created"])
    sql.createTable("pets",["id","user_id","name","created"])
    sql.createTable("pet_meta",["id","pet_id","meta_key","meta_value"])
    sql.createTable("gallery",["id","pet_id","gallery_id","photo_name"])
    sql.createTable("empty_pets",["id","pin"])


    sqlunique = "CREATE UNIQUE INDEX if not exists idx_gallery ON gallery (id);"
    sql.cur.execute(sqlunique)
    sql.db.commit()

    sqlunique = "CREATE UNIQUE INDEX if not exists idx_users ON users (id);"
    sql.cur.execute(sqlunique)
    sql.db.commit()

    sqlunique = "CREATE UNIQUE INDEX if not exists idx_pets ON pets (id);"
    sql.cur.execute(sqlunique)
    sql.db.commit()

    sqlunique = "CREATE UNIQUE INDEX if not exists idx_pet_meta ON pet_meta (id);"
    sql.cur.execute(sqlunique)
    sql.db.commit()

    sqlunique = "CREATE UNIQUE INDEX if not exists idx_empty_pets ON empty_pets (id);"
    sql.cur.execute(sqlunique)
    sql.db.commit()

#    for i in range(1,1000):
#        letters = string.ascii_lowercase+string.ascii_uppercase+string.digits
#        key = ''.join(random.choice(letters) for i in range(8))
#        add = "INSERT INTO empty_pets VALUES ('"+str(i)+"','"+key+"')"
#        sql.curexec(add)
import sqlite3

from flask import g

DATANASE_URI = "database.db"


# create db connection
def get_db():
    db = getattr(g, "db", None)
    if db is None:
        db = g.db = sqlite3.connect(DATANASE_URI)

    return db


# close db connection
def disconnect():
    db = getattr(g, "db", None)
    if db is not None:
        g.db.close()
        g.db = None


# not used any more
# store user's token
def createUserSession(steamid, token):
    # insert user's steamid and token
    try:
        get_db().execute("insert into userSessions values (?,?);", [steamid, token])
        get_db().commit()
        return True
    except:
        return False


# not used any more
# check active session by token
def activeSession(token):
    cursor = get_db().execute(
        "select token from userSessions where token like ?;", [token]
    )
    sessionToken = cursor.fetchall()
    cursor.close()
    if sessionToken != []:
        return True
    else:
        return False


# check active session by steamid
def activeSessionSteamid(steamid):
    cursor = get_db().execute(
        "select token from userSessions where steamid like ?;", [steamid]
    )
    sessionToken = cursor.fetchall()
    cursor.close()
    if sessionToken != []:
        return sessionToken[0][0]
    else:
        return False


# method to delete active user session
def deleteSession(token):
    try:
        get_db().execute("delete from userSessions where token like (?);", [token])
        get_db().commit()
        return True
    except:
        return False


# get steamid of user by the token
def getSteamidByToken(token):
    #print("database,token",token)
    cursor = get_db().execute(
        "select steamid from userSessions where token like ?;", [token]
    )
    userSteamid = cursor.fetchall()
    cursor.close()

    return userSteamid[0][0]

# method to check existence of user
def userExists(steamid):
    # fetch user by email
    cursor = get_db().execute("select steamid from userInfo where steamid like ?;", [steamid])
    user = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if user != []:
        return True
    else:
        return False
        
# create user with platform specific information
def createUser(userInformation):
    # insert passed dictionary and create user in database
    try:
        get_db().execute(
            "insert into userInfo values (?,?,?);",
            [
                userInformation["steamid"],
                userInformation["personname"],
                userInformation["aboutProfile"]
            ],
        )
        get_db().commit()
        return True
    except:
        return False

#get user information from database
def getUser(steamid):
   # fetch user by email
    cursor = get_db().execute("select * from userInfo where steamid like ?;", [steamid])
    userInfo = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if userInfo != []:
        return userInfo[0]
    else:
        return False 

#get user information from database
def getAllUser():
   # fetch user by email
    cursor = get_db().execute("select steamid from userInfo;")
    users = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if users != []:
        return users
    else:
        return False 

#method to create follow entry
def followUser(steamid, followid):
    # insert user's steamid and token
    try:
        get_db().execute("insert into followRel values (?,?);", [steamid, followid])
        get_db().commit()
        return True
    except:
        return False

#method to create follow entry
def getFollower(steamid):
    # get a users followers
    cursor = get_db().execute("select steamid from userInfo where followid like ?;", [steamid])
    user = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if user != []:
        return True
    else:
        return False
    
#method to fuzzy search User 
def searchUser(searchTerm):
    cursor = get_db().execute(
        "select steamid from userInfo where personname like ?;", (f"%{searchTerm}%",)
    )
    userSteamid = cursor.fetchall()
    cursor.close()
    return userSteamid

#method to reate post in database
def createPost(steamid, appid, descr, accessRuleID, postMedia):
    try:
        print(steamid, appid, descr, accessRuleID, postMedia)
        cursor = get_db().execute(
            "insert into userPost (steamid, appid, descr, accessRuleID, postMedia, ts) values (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);",
            [steamid, appid, descr, accessRuleID, postMedia],
        )
        
        get_db().commit()
        cursor.close()
        return True
    except:
        return False

#method to fetch id for media filename (based on last id)
def getLastUsedID():
    cursor = get_db().execute("select max(rowid) from userMedia;")

    lastId = cursor.fetchall()
    cursor.close()

    return lastId[0][0]

#create database entry for media
def uploadMedia(filenam, typeofm):
    try:
        cursor = get_db().execute(
            "insert into userMedia (filenam, typeofm) values (?, ?);",
            [filenam, typeofm],
        )
        get_db().commit()
        cursor.close()
        return True
    except:
        return False
    
#delete database entry for media
def deleteMedia(filenam):
    try:
        cursor = get_db().execute(
            "delete from userMedia where filenam like ?;",
            [filenam],
        )
        get_db().commit()
        cursor.close
        return True
    except:
        return False
    
#fetch posts of user
def getUserPosts(steamid):
    cursor = get_db().execute(
        "select * from userPost where steamid like ?;", [steamid]
    )
    posts = cursor.fetchall()
    cursor.close()
    if posts != []:
        return posts
    else:
        return False
    
#fetch media for a post
def getMedia(filenam):
    cursor = get_db().execute(
        "select * from userMedia where filenam like ?;", [filenam]
    )
    media = cursor.fetchall()
    cursor.close()
    if media != []:
        return media[0]
    else:
        return False

def setFollow(steamid, followid):
    try:
        get_db().execute("insert into followRel values (?,?);", [steamid, followid])
        get_db().commit()
        return True
    except:
        return False
    
def deleteFollow(steamid, followid):
    try:
        get_db().execute("delete from followRel where steamid like (?) and followsID like (?);", [steamid, followid])
        get_db().commit()
        return True
    except:
        return False
    
#fetch followers
def getFollowers(steamid):
    cursor = get_db().execute(
        "select followsID from followRel where steamid like ?;", [steamid]
    )
    followers = cursor.fetchall()
    cursor.close()
    if followers != []:
        return followers
    else:
        return False
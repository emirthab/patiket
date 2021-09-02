from flask import Blueprint,Flask
from flask.helpers import send_from_directory
from flask import request
import os
from datetime import datetime
import src.api.sql as sql
import src.api.token as jwt
import requests
import json
from werkzeug.utils import secure_filename


listener = Blueprint("listener",__name__)

urlTag = "/api/v1"
acceptMetas = ["owner","phone","birth","breed","adress","note","gender","profilepic"]

@listener.route(urlTag+"/uploads/<file>",methods=["GET","POST"])
def uploads(file):
	if request.method == "GET":
		return send_from_directory(directory=os.getcwd()+"/src/static/uploads/", filename=file)

@listener.route(urlTag+"/pet/<pet_id>",methods=["GET","POST"])
def getPet(pet_id):
	if request.method == "GET":
		try:
			pet = sql.getPet(pet_id)
			Json = {
				"response":"ok",
				"id":pet[0],
				"user_id":pet[1],
				"name":pet[2],
				"created":pet[3],
			}
			return Json
		except Exception as e:	
			print(e)
			return {
				"response":str(e)
			}

@listener.route(urlTag+"/pet/<pet_id>/getmeta",methods=["GET","POST"])
def getMeta(pet_id):
	if request.method == "GET":
		key = request.args.get("key")
		if key:
			meta = sql.getMeta(pet_id,key)
			if meta:
				metaJson = {
					"response":"ok",
					"meta_key":key,
					"meta_value":meta
				}
				return metaJson
			else:
				return {
					"response":"Meta not found."
				}
		else:
			Json = '''{"response":"ok","metas":{'''
			metas = sql.getMetas(pet_id)
			for meta in metas:
				meta_key = meta[0]
				meta_value = meta[1]
				meta_value = meta_value.replace("\n"," ")
				metaJson = '"'+meta_key+'":"'+meta_value+'",'
				Json = Json + metaJson
			if len(list(metas)) > 0:
				Json = Json[:-1]
			Json += """}}""" 
			return json.loads(Json)

@listener.route(urlTag+"/register",methods=["POST"])
def register():
	if request.method == "POST":
		content = request.json
		mail = content["mail"]
		pass_hash = content["pass_hash"]
		res = sql.getUserFromMail(mail)
		if  len(list(res)) == 0:
			sql.addUser(mail,pass_hash)
			user = sql.getUserFromMail(mail)[0][0]
			token = jwt.encodeToken(user)
			return {
				"response":"ok",
				"token":str(token)
			}
		else:
			return {
				"response":"User already exist."
			}

@listener.route(urlTag+"/login",methods=["POST"])
def login():
	if request.method == "POST":
		content = request.json
		mail = content["mail"]
		pass_hash = content["pass_hash"]

		try:
			user = sql.getUserFromMail(mail)[0]
		except Exception as e:
			return {
				"response": str(e)
			}

		db_pass_hash = user[2]
		if pass_hash == db_pass_hash and db_pass_hash != "googleuser":
			token = jwt.encodeToken(user[0])
			return {
				"response":"ok",
				"token":str(token)
			}
		else:
			return {
				"response":"Wrong Pass."
				}

@listener.route(urlTag+"/getpets",methods=["POST"])
def getpets():
	if request.method == "POST":
		content = request.json
		token = content["token"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":
			userid = decoded["userid"]
			pets = sql.getPets(userid)
			Json = "["
			for pet in pets:
				_Json = '{"id":"'+ pet[0] +'","user_id":"'+pet[1]+'","name":"'+pet[2]+'","created":"'+pet[3]+'"},'
				Json += _Json
			if len(list(pets)) > 0:
				Json = Json[:-1]
			Json += "]"
			Json = '{"response":"ok","pets":'+Json+'}'
			return json.loads(Json)
		else:
			return decoded

@listener.route(urlTag+"/pet/<pet_id>/updatename",methods=["POST"])
def updateName(pet_id):
	if request.method == "POST":
		content = request.json
		token = content["token"]
		name = content["name"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":
			userid = decoded["userid"]
			pet = sql.getPet(pet_id)
			if userid == pet[1]:
				sql.updateName(pet_id,name)
				return {
					"response":"ok"
				}
			else:
				return{
					"response":"Userid does not match pet's userid."
				}
		else:
			return decoded
				

@listener.route(urlTag+"/pet/<pet_id>/setmeta",methods=["POST"])
def setmeta(pet_id):
	if request.method == "POST":
		content = request.json
		token = content["token"]
		metas = content["metas"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":
			userid = decoded["userid"]
			pet = sql.getPet(pet_id)
			if userid == pet[1]:
				oneSuccessed = False
				oneAborted = False
				success = "{"
				abort = "{"
				for meta in metas:
					value = metas[meta]
					if meta in acceptMetas:
						sql.setMeta(pet_id,meta,value)
						success += '"'+meta+'":"'+str(value)+'",'
						if oneSuccessed == False:
							oneSuccessed = True				
					else:
						if oneAborted == False:
							oneAborted = True
						abort += '"'+meta+'":"'+value+'",'
				if oneSuccessed == True:
					success = success[:-1]
				if oneAborted == True:
					abort = abort[:-1]
				Json = '{"response":"ok","success":'+success+"},"+'"abort":'+abort+"}}"
				return json.loads(Json)
		else:
			return decoded

@listener.route(urlTag+"/pet/<pet_id>/uploadpp",methods=["POST"])
def uploadPp(pet_id):
	if request.method == "POST":
		token = request.headers["token"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":
			userid = decoded["userid"]
			pet = sql.getPet(pet_id)
			if userid == pet[1]:
				f = request.files.get("File")
				if f:
					filename = secure_filename(f.filename)
					if '.' in filename:					
						extension = "."+str(filename.split('.', 1)[1].lower())		
						filename = sql.getTimestamp()+extension				
						f.save(os.getcwd()+"/public/uploads/"+filename)		
						sql.setMeta(pet_id,"profilepic",filename)
						return {							
								"response":"ok"
						}
					else:
						return {
							"response":"File extension not found."
						}
				else:				
					return {
						"response":"File error."
					}	
			else:				
				return {
					"response":"User id does not match pet's user id."
				}
		else:
			return decoded

@listener.route(urlTag+"/pet/<pet_id>/getgallery",methods=["GET"])
def getGAllery(pet_id):
	if request.method == "GET":
		gallery = sql.getGalleries(pet_id)
		_gallery = []
		for i in range(len(list(gallery))):
			j = i+1
			for j in range(len(list(gallery))):
				if gallery[i][2] < gallery[j][2]:
					temp = gallery[i]
					gallery[i] = gallery[j]
					gallery[j] = temp

		for photo in gallery:			
			photoName = photo[3]
			json = {
				"name":photoName,
				"size":"0kb",
				"source":"/uploads/"+photoName
			}
			_gallery.append(json)			
		return{
			"response":"ok",
			"gallery":_gallery			
		}

@listener.route(urlTag+"/pet/<pet_id>/uploadgallery",methods=["POST"])
def uploadGallery(pet_id):
	if request.method == "POST":		
		file = request.files.get("file")		
		token = request.args.get("token")		
		decoded = jwt.decodeToken(token)		
		if decoded["userid"] == sql.getPet(pet_id)[1]:			
			filename = secure_filename(file.filename)
			if '.' in filename:				
				extension = "."+str(filename.split('.', 1)[1].lower())
				filename = sql.getTimestamp()+extension
				file.save(os.getcwd()+"/public/uploads/"+filename)				
				return {
					"image":filename,
					"response":"ok"
				}
			else:
				return 500
		else:
			return 500

@listener.route(urlTag+"/pet/<pet_id>/setgallerymeta",methods=["POST"])
def setGalleryMeta(pet_id):
	if request.method == "POST":
		content = request.json
		token = content["token"]
		metas = content["metas"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":		
			userid = decoded["userid"]
			pet = sql.getPet(pet_id)			
			if userid == pet[1]:				
				sql.removeAllGalleries(pet_id)				
				if len(metas) > 0:					
					for meta in metas:						
						sql.setGallery(pet_id,str(meta),str(metas[str(meta)]))						
					return {
						"response":"ok"
					}
				return {
					"response":"ok"
				}

@listener.route(urlTag+"/addnewpet",methods=["POST"])
def addNewPet():
	if request.method == "POST":
		content = request.json
		token = content["token"]
		pin = content["pin"]
		pet_id = content["id"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":		
			userid = decoded["userid"]
			empty = sql.getEmptyPet(pet_id)
			if len(list(empty)) > 0:
				_pin = empty[0][1]
				if pin == _pin:
					sql.transferPet(pet_id,userid)
					return {
						"response":"ok"
					}
				else:
					return {
						"response":"Invalid pin code."
					}
			else:
				return {
					"response":"Pet is not found."
				}
		else:
			return decoded

@listener.route(urlTag+"/pet/<pet_id>/delete",methods=["POST"])
def deletePet(pet_id):
	if request.method == "POST":		
		token = request.json["token"]
		decoded = jwt.decodeToken(token)
		if decoded["response"] == "ok":
			userid = decoded["userid"]
			pet = sql.getPet(pet_id)			
			if userid == pet[1]:
				sql.deletePet(pet_id)
				return {
					"response":"ok"
				}
			else:
				return {
					"response":"User id does not match pet's user id."
				}
		else:
			return decoded

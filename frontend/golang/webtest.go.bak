package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
	//"github.com/nu7hatch/gouuid"
	"io"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"argus/aimgolib/mongo"
	"argus/aimgolib/mqtt"
	
	"math/rand"
	"strconv"
	"net/smtp"
	"strings"
	"argus/aimgolib/encrypt"
	
	"crypto/hmac"
    "crypto/sha256"
	"errors"
	"runtime"
	
	"encoding/json"
)
type Command struct {
	CommTitle string
	Comm string
	Path string
	Param string
	Enable bool
	Resultdelay string
}
type Person struct {
	NAME  string
	PASSWORD string
	COMPANY string
	EMAIL string
	VERIFICATION string
	DEVICENAME string
	PERMISSION string
	DUEDATE string
	LEVEL string
	COMMANDTIMES string
	SUBSCRIBE string
	CREATED string
	PHONE string
	INVITER string
	USERNAME string
}

type Devices struct {
	COMPANY string
	DEVICEID string
	DEVICENAME string
	AGENTVERSION string
	DEVICEMODEL string
	STATUS string
	TIME string
	EMAILCOMPANY string
	EMAIL string
	SUBSCRIBER string
	SUBSCRIBER_WAIT string
	INVITED string
}

type Log struct {
	ID bson.ObjectId `bson:"_id,omitempty"`
	COMPANY string
	NAME string
	TARGET string
	TITLE string
	COMMAND string
	CONTENT string
	FROM string
	TYPE string
	QTYPE string
	STATUS string
	VIEW string
	SCHEDULEID string
	TIME string
}

type Schedule struct{
	COMPANY string
	NAME string
	DEVICEID string
	COMMANDTITLE string
	COMMAND string
	LOGCOMMAND string
	LOGCONTENT string
	USERFROM string
	TIMESTART string
	SCHEDULEID string
	STATUS string
}

type Company struct{
	COMPANYID string
	COMPANYNAME string
}

type Men struct {
	Persons []Person
}

var collection *mgo.Collection
var acollection *mgo.Collection
var bcollection *mgo.Collection
var ccollection *mgo.Collection
var dcollection *mgo.Collection
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Println("method:", r.Method)
	log.Println("r.Method", r.Method)
	if r.Method == "POST" {
		r.ParseForm()
		submit := r.FormValue("submit")
		log.Println("submit:", submit)
		log.Println("submit:", submit)
		fmt.Println(submit)
		switch submit{
			case "AddNewUser": 
				var na string = r.Form["name"][0]
				var co string = r.Form["company"][0]
				var em string = r.Form["email"][0]
				
				result := Person{}
				var check = "true"	
				iter := mongo.Select(collection, nil).Iter()
				for iter.Next(&result) {
					if na == result.NAME && co == result.COMPANY {
						w.Write([]byte("AccountFail"))
						check = "false"
						break
					}else if em == result.EMAIL{
						w.Write([]byte("EmailFail"))
						check = "false"
						break
					}
				}
				
				if check == "true" {
					var verification = smtpmail(em, r.Form["company"][0], r.Form["name"][0])
					//var verification = "verified"
					t := time.Now().Unix()
					temp := &Person{
					NAME:  r.Form["name"][0],
					PASSWORD: aes.Encrypt(r.Form["password"][0]),
					COMPANY: r.Form["company"][0],
					EMAIL: r.Form["email"][0],
					VERIFICATION: verification,
					PERMISSION: "00000000",
					DUEDATE: "1538179199",
					LEVEL: r.Form["level"][0],
					CREATED: strconv.FormatInt(t,10),
					}
					mongo.Insert(collection, temp)
					
				}
			case "CheckOccupiedUser":
				var na string = r.Form["name"][0]
				var co string = r.Form["company"][0]
				result := Person{}
				iter := mongo.Select(collection, nil).Iter()
				for iter.Next(&result) {
					if na == result.NAME && co == result.COMPANY {
						w.Write([]byte("Occupied"))
						break
					}
				}
			case "delAllDb":
				mongo.RemoveAll(collection, bson.M{})
				mongo.RemoveAll(acollection, bson.M{})
				mongo.RemoveAll(bcollection, bson.M{})
				mongo.RemoveAll(ccollection, bson.M{})
			case "SendByGolang":			//topic:  xxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxx/
				var TOPIC string = r.Form["topic"][0]
				topic := strings.Split(TOPIC, "/")
				var COMPANY string =  r.Form["company"][0]
				var NAME string =  r.Form["name"][0]
				var COMMAND string = r.Form["command"][0]
				var CONTENT string = r.Form["value"][0]
				var FROM string = r.Form["commandfrom"][0]
				result := Person{}
				iter := mongo.Select(collection,  bson.M{"company":COMPANY,"name":NAME}).Iter()
				for iter.Next(&result) {
					for i := 0; i < len(topic)-1; i++ {
						mqtt.Mqtt_pub(topic[i], aes.Encrypt(r.Form.Get("msg")))
					}
					SetLogInfo(COMPANY, NAME, TOPIC, COMMAND, CONTENT, FROM)
				}
			case "NewSendByGolang":
				var TOPIC string = r.Form["topic"][0]
				topic := strings.Split(TOPIC, "/")
				var COMPANY string =  r.Form["company"][0]
				var NAME string =  r.Form["name"][0]
				var COMM string = r.Form["comm"][0]
				var PATH string = r.Form["path"][0]
				var PARAM string = r.Form["param"][0]
				var LOGCOMMAND string = r.Form["command"][0]
				var LOGCONTENT string = r.Form["value"][0]
				var FROM string = r.Form["commandfrom"][0]
				result := Person{}
				temp := &Command{
					Comm: COMM,
					Path: PATH,
					Param: PARAM,
				}
				jsonCommand, _ := json.Marshal(temp)
				iter := mongo.Select(collection,  bson.M{"company":COMPANY,"name":NAME}).Iter()
				for iter.Next(&result) {
					for i := 0; i < len(topic)-1; i++ {
						//mqtt.Mqtt_pub(topic[i], COMM, PATH, PARAM)
						mqtt.Mqtt_pub(topic[i], aes.Encrypt(string(jsonCommand)))
					}
					SetLogInfo(COMPANY, NAME, TOPIC, LOGCOMMAND, LOGCONTENT, FROM)
				}
			case "UserLogin":
				var NAME string = r.Form["name"][0]
				var PASSWORD string = aes.Encrypt(r.Form["password"][0])
				var COMPANY string = r.Form["company"][0]
				result := Person{}
				
				iter := mongo.Select(collection, bson.M{"company":COMPANY,"name":NAME}).Iter()
				for iter.Next(&result) {
					fmt.Println("test")
					if PASSWORD == result.PASSWORD && result.VERIFICATION == "verified"{
							w.Write([]byte("success"))
							SetLogInfo(COMPANY, NAME, "", "UserLogin", "success", "user")
						break
					}else if PASSWORD == result.PASSWORD && result.VERIFICATION == "unverified"{
						fmt.Println(result.VERIFICATION)
						w.Write([]byte("unverified"))
						w.Write([]byte("/"))
						w.Write([]byte(result.EMAIL))
						break
					}else if PASSWORD != result.PASSWORD{
						SetLogInfo(COMPANY, NAME, "", "UserLogin", "Fail", "user")
						break
					}
				}
			case "UserDuedateCheck":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"company":COMPANY, "name": NAME}).Iter()
					for iter.Next(&result) {
						DueDateStatus := CheckUserDuedate(result.DUEDATE)
						w.Write([]byte(DueDateStatus))
						break
					}
			case "LoginCompany":
				var COMPANY string = r.Form["company"][0]
				result := Person{}
				fmt.Println(COMPANY)
				iter := mongo.Select(collection, nil).Iter()
				for iter.Next(&result) {
					if COMPANY == result.COMPANY {
						w.Write([]byte("success"))
						fmt.Println("success")
						break
					}
				}
			case "verified":
				na := aes.Decrypt(r.Form["name"][0])			
				co := aes.Decrypt(r.Form["company"][0])
				
				NAME := string(na)
				COMPANY := string(co)
				fmt.Println(NAME)
				fmt.Println(COMPANY)
				
				
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"verification": "verified"}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}
				
			case "SetUserEmail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var EMAIL string = r.Form["email"][0]
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"email": EMAIL}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}
			case "SendVerifyEmail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var EMAIL string = r.Form["email"][0]
				var status = VerifyEmail(EMAIL, COMPANY, NAME)
				if status == "pass"{
					w.Write([]byte("pass"))
				}else{
					w.Write([]byte("error"))
				}
			case "VerifyEmail":
				na := aes.Decrypt(r.Form["name"][0])			
				co := aes.Decrypt(r.Form["company"][0])
				em := aes.Decrypt(r.Form["email"][0])
				NAME := string(na)
				COMPANY := string(co)
				
				
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"email": em}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}
			case "GetUserEmail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				iter := mongo.Select(collection,  bson.M{"name": NAME, "company":COMPANY}).Iter()
				result := Person{}
				for iter.Next(&result) {
					w.Write([]byte(result.EMAIL))
					break
					
				}
			case "ChangeUserEmail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var EMAIL string = r.Form["email"][0]
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"email": EMAIL}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}else{
					SetLogInfo(COMPANY, NAME, "", "ChangeUserEmail", "NewEmail: "+EMAIL, "user")
				}
			case "SendResetPasswordMail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						smtpresetpass(result.EMAIL, COMPANY, NAME)
						w.Write([]byte(result.EMAIL))
						break
					}
			case "GetNumberOfUser":
				result := Person{}
					iter := mongo.Select(collection, nil).Iter()
					number:=0
					for iter.Next(&result) {
						number++
					}
					w.Write([]byte(strconv.Itoa(number)))
			case "ResetPassword":
				var NAME string = aes.Decrypt(r.Form["name"][0])
				var COMPANY string = aes.Decrypt(r.Form["company"][0])
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						w.Write([]byte("success"))
						w.Write([]byte("/"))
						w.Write([]byte(NAME))
						w.Write([]byte("/"))collection
						w.Write([]byte(COMPANY))
						break
					}
			case "ResetNewPassword":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var PASSWORD string = aes.Encrypt(r.Form["password"][0])
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"password": PASSWORD}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}else{
					w.Write([]byte("success"))
				}
			case "ResendVerifyMail":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						smtpmail(result.EMAIL, result.COMPANY, result.NAME)
						break
						
					}
				w.Write([]byte("success"))
			case "GetAllAccount":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				permissionresult:=""
				result1 := Person{}
					iter1 := mongo.Select(collection, bson.M{"company":COMPANY,"name":NAME}).Iter()
					for iter1.Next(&result1) {
						//permissionresult = GetPermission("0" ,result1.PERMISSION)
						permissionresult = result1.LEVEL
						break
					}
					if permissionresult == "1"{
						result := Person{}
						iter := mongo.Select(collection, nil).Iter()
						for iter.Next(&result) {
							w.Write([]byte(result.COMPANY))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.NAME))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.EMAIL))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.PERMISSION))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.DUEDATE))
							w.Write([]byte("***"))
							
						}
					}else{
						result := Person{}
						iter := mongo.Select(collection, bson.M{"company":COMPANY}).Iter()
						for iter.Next(&result) {
							w.Write([]byte(result.COMPANY))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.NAME))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.EMAIL))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.PERMISSION))
							w.Write([]byte("%/%"))
							w.Write([]byte(result.DUEDATE))
							w.Write([]byte("***"))
							
						}
					}
			case "GetAllUser":
				result := Person{}
				var array []Person
				w.Header().Set("Content-Type", "application/json")
				iter := mongo.Select(collection, nil).Iter()
				for iter.Next(&result) {
					array = append(array, result)
				}
				js, err := json.Marshal(array)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				w.Write(js)
			case "DeleteUser":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				mongo.RemoveAll(collection, bson.M{"company":COMPANY,"name":NAME})
				mongo.RemoveAll(ccollection, bson.M{"company":COMPANY,"name":NAME})
				w.Write([]byte("pass"))
				
				
			case "SetUserPermission":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var PERMISSION string = r.Form["permission"][0]
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"permission": PERMISSION}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}
			case "ChangeUserPermission":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var USERNAME string = r.Form["username"][0]
				var USERCOMPANY string = r.Form["usercompany"][0]
				result1 := Person{}
				permissionresult:=""
					iter1 := mongo.Select(collection, bson.M{"company":COMPANY,"name":NAME}).Iter()
					for iter1.Next(&result1) {
						permissionresult = result1.LEVEL
						break
					}
				if permissionresult == "1"{
					
					var PERMISSION string = r.Form["permission"][0]
					var NUMBER string = r.Form["number"][0]
					i, _ := strconv.Atoi(NUMBER)
					result := Person{}
						iter := mongo.Select(collection, bson.M{"name": USERNAME,"company":USERCOMPANY}).Iter()
						for iter.Next(&result) {
							var strpermission = result.PERMISSION
							s:= strings.Split(strpermission, "")
							s[i] = PERMISSION
							newstrpermission := ""
							for i := 0; i < len(s); i++ {
								newstrpermission += s[i]
							}
							selector := bson.M{"name": USERNAME, "company":USERCOMPANY}
							data := bson.M{"$set": bson.M{"permission": newstrpermission}}
							err := mongo.Update(collection, selector, data)
							if err != nil {
								panic(err)
							}
						}
				}else if permissionresult == "2"{
					var PERMISSION string = r.Form["permission"][0]
					var NUMBER string = r.Form["number"][0]
					i, _ := strconv.Atoi(NUMBER)
					result := Person{}
						iter := mongo.Select(collection, bson.M{"name": USERNAME,"company":USERCOMPANY}).Iter()
						for iter.Next(&result) {
							if result.LEVEL == "3" {
								var strpermission = result.PERMISSION
								s:= strings.Split(strpermission, "")
								s[i] = PERMISSION
								newstrpermission := ""
								for i := 0; i < len(s); i++ {
									newstrpermission += s[i]
								}
								selector := bson.M{"name": USERNAME, "company":USERCOMPANY}
								data := bson.M{"$set": bson.M{"permission": newstrpermission}}
								err := mongo.Update(collection, selector, data)
								if err != nil {
									panic(err)
								}
							}else{
								w.Write([]byte("PermissionFail"))
							}
						}
				}else{
					w.Write([]byte("PermissionFail"))
				}
			case "SearchUserByNameCompanyID":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					w.Write([]byte("result.NAME"))
				}
			case "SearchUserByName":
				var NAME string = r.Form["name"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME}).Iter()
				for iter.Next(&result) {
					w.Write([]byte("result.NAME"))
					w.Write([]byte("/"))
				}
			case "SearchUserByCompany":
				var COMPANY string = r.Form["company"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"company":COMPANY}).Iter()
				for iter.Next(&result) {
					w.Write([]byte("result.NAME"))
					w.Write([]byte("/"))
				}
			case "SetUserDuedate":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var DUEDATE string = r.Form["date"][0]
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"duedate": DUEDATE}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
				}
			case "SetPhone":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var PHONE string = r.Form["phone"][0]
				selector := bson.M{"name": NAME, "company":COMPANY}
				data := bson.M{"$set": bson.M{"phone": PHONE}}
				err := mongo.Update(collection, selector, data)
				if err != nil {
					panic(err)
					w.Write([]byte("error"))
				}else{
					w.Write([]byte("pass"))
				}
			case "GetUserDuedate":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
				for iter.Next(&result) {
					if NAME == result.NAME && COMPANY == result.COMPANY{
						w.Write([]byte(result.DUEDATE))
						break
					}
				}
				
			case "GetLevel":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"company":COMPANY, "name": NAME}).Iter()
					for iter.Next(&result) {
						
						w.Write([]byte(result.LEVEL))
						break
					}
			case "GetUserPermission":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						w.Write([]byte(result.PERMISSION))
						break
					}
			case "GetUserInfo":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						
						
						w.Header().Set("Content-Type", "application/json")
						result.PASSWORD = aes.Decrypt(result.PASSWORD)
						js, err := json.Marshal(result)
						if err != nil {
							http.Error(w, err.Error(), http.StatusInternalServerError)
							return
						}
						w.Write(js)
						
						
						break
					}
			case "GetCommandTimes":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						w.Write([]byte(result.COMMANDTIMES))
						break
					}
			case "SetCommandTimes":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var COMMANDTIMES string = r.Form["commandtimes"][0]
				result := Person{}
					iter := mongo.Select(collection, bson.M{"name": NAME,"company":COMPANY}).Iter()
					for iter.Next(&result) {
						selector := bson.M{"name": NAME, "company":COMPANY}
						data := bson.M{"$set": bson.M{"commandtimes": COMMANDTIMES}}
						err := mongo.Update(collection, selector, data)
						if err != nil {
							panic(err)
						}else{
							w.Write([]byte(COMMANDTIMES))
						}
						
						break
					}
			case "SetDevices":
				var COMPANY string = r.Form["company"][0]
				var DEVICEID string = r.Form["deviceid"][0]
				var DEVICENAME string = r.Form["devicename"][0]
				var AGENTVERSION string = r.Form["agentversion"][0]
				var DEVICEMODEL string = r.Form["devicemodel"][0]
				t := time.Now().Unix()
				result := Devices{}
				var check = "true"	
				iter := mongo.Select(acollection, nil).Iter()
				for iter.Next(&result) {
					if  DEVICEID == result.DEVICEID {
						w.Write([]byte("DeviceRepeat"))
						check = "false"
						break
					}
				}
				
				if check == "true" {
					temp := &Devices{
						COMPANY: COMPANY,
						DEVICEID: DEVICEID,	
						DEVICENAME: DEVICENAME,	
						AGENTVERSION: AGENTVERSION,	
						DEVICEMODEL: DEVICEMODEL,
						TIME: strconv.FormatInt(t,10),
					}
					mongo.Insert(acollection, temp)
					w.Write([]byte("success"))
				}	
			case "SetDeviceName":
				var NAME string = r.Form["name"][0]
				var COMPANY string = r.Form["company"][0]
				var DEVICEID string = r.Form["deviceid"][0]
				var DEVICENAME string = r.Form["devicename"][0]
				result := Devices{}
				iter := mongo.Select(acollection, bson.M{"deviceid": DEVICEID}).Iter()
				for iter.Next(&result) {
					sub := strings.Split(result.SUBSCRIBER, "/")
					for j := 0; j < len(sub)-1; j++ {
						subscriber := strings.Split(sub[j], "#")
						if subscriber[0] == COMPANY+";"+NAME{
							selector := bson.M{"deviceid": DEVICEID}
							data := bson.M{"$set": bson.M{"devicename": DEVICENAME}}
							err := mongo.Update(acollection, selector, data)
							if err != nil {
								panic(err)
							}else{
								w.Write([]byte("success"))
							}
						}
					}
				}
				
			case "SetSubscribeDevices":
				fmt.Println("SetSubscribeDevices!!!")
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var NEWSUBSCRIBE string = r.Form["subscribe"][0]  //  ex.  xxxx/xxxx/xxxx/
				// fmt.Println("-COMPANY:"+COMPANY)
				// fmt.Println("-NAME:"+NAME)
				// fmt.Println("-NEWSUBSCRIBE:"+NEWSUBSCRIBE)
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					var s string = result.SUBSCRIBE + NEWSUBSCRIBE // ex. xxxx/xxxx/xxxx/ + xxx/
					selector := bson.M{"name": NAME, "company":COMPANY}
					data := bson.M{"$set": bson.M{"subscribe": s}}
					err := mongo.Update(collection, selector, data)
					if err != nil {
						panic(err)
					}else{
						w.Write([]byte("success"))
					}
				}
				
				newsubscribe:= strings.Split(NEWSUBSCRIBE, "/")
				for i := 0; i < len(newsubscribe)-1; i++ { 
					result1 := Devices{}
					iter1 := mongo.Select(acollection, bson.M{"deviceid": newsubscribe[i]}).Iter()
					fmt.Println("Company-newsubscribe[i]:"+newsubscribe[i])
					var subscriber string ="";
					
					for iter1.Next(&result1) {
						t := time.Now().Local().Unix()
						subscriber = result1.SUBSCRIBER + COMPANY+";"+NAME +"#"+strconv.FormatInt(t,10)+"/"
						selector := bson.M{"deviceid": newsubscribe[i]}
						data := bson.M{"$set": bson.M{"subscriber": subscriber}}
						err := mongo.Update(acollection, selector, data)
						if err != nil {
							panic(err)
						}
					}
					// mqtt.Mqtt_pub(
					// 	newsubscribe[i], 
					// 	aes.Encrypt("getSubscriber-;;;"+"COMPANY:"+COMPANY+";;;NAME:"+NAME+";;;NEWSUBSCRIBE:"+newsubscribe[i]))
				
					if subscriber == ""{//Cannot find this device. 
						mqtt.Mqtt_pub(newsubscribe[i], aes.Encrypt("addDeviceEnrollManager-;;;"+"nonenrolled"))
					}else{
						fmt.Println("newsubscribe[i]:"+newsubscribe[i]+"subscriber:"+subscriber)
						mqtt.Mqtt_pub(newsubscribe[i], aes.Encrypt("addDeviceEnrollManager-;;;"+subscriber+""))
					}
				}
				
			case "UnsubscribeDevices":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var UNSUBSCRIBE string = r.Form["unsubscribe"][0]	
				result := Person{}
				s := ""
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					unsubscribe:= strings.Split(UNSUBSCRIBE, "/")
					s = result.SUBSCRIBE
					
					for i := 0; i < len(unsubscribe)-1; i++ {

						//20171017
						mqtt.Mqtt_pub(unsubscribe[i], aes.Encrypt("delDeviceEnrollManager-;;;"+COMPANY+";;;"+NAME))

						subscribe := strings.Split(s, "/")
						s = ""
						for j := 0; j < len(subscribe)-1; j++ {
							//fmt.Println(subscribe[j])
							if unsubscribe[i] !=  subscribe[j]{
								s += subscribe[j]+ "/"
								
							}
						}
						
						result1 := Devices{}
						iter1 := mongo.Select(acollection, bson.M{"deviceid": unsubscribe[i]}).Iter()
						for iter1.Next(&result1) {
							sub := strings.Split(result1.SUBSCRIBER, "/")
							var newsubscriber string = "" 
							for j := 0; j < len(sub)-1; j++ {
								subscriber := strings.Split(sub[j], "#")
								if subscriber[0] != COMPANY+";"+NAME{
									newsubscriber += sub[j]+"/"
								}
							}
							selector := bson.M{"deviceid": unsubscribe[i]}
							data := bson.M{"$set": bson.M{"subscriber": newsubscriber}}
							err := mongo.Update(acollection, selector, data)
							if err != nil {
								panic(err)
							}
						}
						
					}
					
					selector := bson.M{"name": NAME, "company":COMPANY}
					data := bson.M{"$set": bson.M{"subscribe": s}}
					err := mongo.Update(collection, selector, data)
					if err != nil {
						panic(err)
					}else{
						w.Write([]byte("success"))
					}
					
				}
			case "Uninviter":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var DEVICEID string = r.Form["deviceid"][0]
				var STATUS string = r.Form["stat"][0]
				//20171025
				if STATUS == "refuse"{
					mqtt.Mqtt_pub(DEVICEID, aes.Encrypt("RequestEnrollAccountFailure-;;;"+"beRejected;;;"+COMPANY+";"+NAME))
				}
				

				result := Person{}
				iter := mongo.Select(collection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter.Next(&result) {
					invite := strings.Split(result.INVITER, "/")
					newinviter := ""
					for i := 0; i < len(invite)-1; i++ {
						inviter := strings.Split(invite[i], "#")
						if inviter[0] != DEVICEID {
							newinviter += invite[i]+ "/"
						}
					}
					
					selector := bson.M{"company":COMPANY, "name":NAME}
					data := bson.M{"$set": bson.M{"inviter": newinviter}}
					err := mongo.Update(collection, selector, data)
					if err != nil {
						panic(err)
					}else{
						w.Write([]byte("success"))
					}
				}
				
				result1 := Devices{}
				iter1 := mongo.Select(acollection, bson.M{"deviceid":DEVICEID}).Iter()
				for iter1.Next(&result1) {
					invite := strings.Split(result1.INVITED, "/")
					newinvited := ""
					for i := 0; i < len(invite)-1; i++ {
						if invite[i] != COMPANY+";"+NAME {
							newinvited += invite[i] + "/"
						}
					}
					selector1 := bson.M{"deviceid":DEVICEID}
					data1 := bson.M{"$set": bson.M{"invited": newinvited}}
					err1 := mongo.Update(acollection, selector1, data1)
					if err1 != nil {
						panic(err1)
					}else{
						w.Write([]byte("success"))
					}
				}
				
				
			case "GetAllDevices":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
				result1 := Devices{}
				
				iter := mongo.Select(collection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter.Next(&result) {
					subscribe:= strings.Split(result.SUBSCRIBE, "/")
					if len(subscribe) == 1{
						fmt.Println("1")
						w.Write([]byte("DeviceNotFound"))
						break
					}
					var array []Devices
					w.Header().Set("Content-Type", "application/json")
					for i := 0; i < len(subscribe)-1; i++ {
						iter1 := mongo.Select(acollection, bson.M{"deviceid":subscribe[i]}).Iter()
						for iter1.Next(&result1) {
							s:= CheckDeivceStatus(result1.TIME)
							result1.STATUS = s
							array = append(array, result1)
						}
					}
					
					js, err := json.Marshal(array)
					if err != nil {
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
					w.Write(js)
					
				}
			
					
				

			case "GetDeviceDetails":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var DEVICEID string = r.Form["deviceid"][0]
				result := Person{}
				result1 := Devices{}
				iter := mongo.Select(collection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter.Next(&result) {
					iter1 := mongo.Select(acollection, bson.M{"deviceid":DEVICEID}).Iter()
					for iter1.Next(&result1) {
						var array []Devices
						w.Header().Set("Content-Type", "application/json")
						array = append(array, result1)
						js, err := json.Marshal(array)
						if err != nil {
							http.Error(w, err.Error(), http.StatusInternalServerError)
							return
						}
						w.Write(js)
						return
					}
				
				}
			case "GetDevicesName":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
				result1 := Devices{}
				iter := mongo.Select(collection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter.Next(&result) {
					subscribe:= strings.Split(result.SUBSCRIBE, "/")
					for i := 0; i < len(subscribe)-1; i++ {
						iter1 := mongo.Select(acollection, bson.M{"deviceid":subscribe[i]}).Iter()
						for iter1.Next(&result1) {
							w.Write([]byte("id:"+subscribe[i]))
							w.Write([]byte("%/%"))
							w.Write([]byte("name:"+result1.DEVICENAME))
							w.Write([]byte("***"))
						}
					}
				}
			case "GetDeviceId":
				var COMPANY string = r.Form["company"][0]
				var DEVICEID string = r.Form["deviceid"][0]
				var NAME string = r.Form["name"][0]
				result := Devices{}
				result1 := Person{}
				status := "error"
				numSubscribe := 0
				iter := mongo.Select(acollection, bson.M{"deviceid":DEVICEID}).Iter()
				for iter.Next(&result) {
					status = "success"
					break
				}
				iter1 := mongo.Select(collection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter1.Next(&result1) {
					subscribe:= strings.Split(result1.SUBSCRIBE, "/")
					numSubscribe = len(subscribe)-1
					for i := 0; i < len(subscribe)-1; i++ {
						if subscribe[i] == DEVICEID{
							status = "used"
							break
						}
					}
				}
				if COMPANY == "Guest" && numSubscribe == 3{
					status = "oversub"
				}
				w.Write([]byte(status))
			case "SetAlertMailBox":
				var COMPANY string = r.Form["company"][0]
				var EMAIL string = r.Form["email"][0]
				result := Devices{}
				iter := mongo.Select(acollection, bson.M{"emailcompany":COMPANY}).Iter()
				for iter.Next(&result) {
					selector :=bson.M{"emailcompany":COMPANY}
					data := bson.M{"$set": bson.M{"email": EMAIL}}
					err := mongo.Update(collection, selector, data)
					if err != nil {
						panic(err)
					}else{
						w.Write([]byte("Set"))
					}
					break
				}
				temp := &Devices{
					EMAILCOMPANY: COMPANY,
					EMAIL: EMAIL,
				}
				mongo.Insert(acollection, temp)
				w.Write([]byte("Add"))
				break
			case "GetLogInfo":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var DAYS string = r.Form["days"][0]
				result := Log{}
				w.Header().Set("Content-Type", "application/json")
				var array []Log
				iter := mongo.Select(bcollection, bson.M{"company":COMPANY, "name":NAME}).Iter()
				for iter.Next(&result) {
					if GetLogDays(DAYS, result.TIME) == "true"{
						//w.Write([]byte("logid:"+bson.ObjectId(result.ID).Hex()))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("name:"+result.NAME))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("target:"+result.TARGET))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("title:"+result.TITLE))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("command:"+result.COMMAND))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("content:"+result.CONTENT))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("from:"+result.FROM))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("type:"+result.TYPE))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("view:"+result.VIEW))
						//w.Write([]byte("%/%"))
						//w.Write([]byte("time:"+result.TIME))
						//w.Write([]byte("***"))
						
						array = append(array, result)
						
						
						
					}
					
				}
				js, err := json.Marshal(array)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				w.Write(js)
			case "GetLogInfoById":
				var ID string = r.Form["logid"][0]
				result := Log{}
				iter := mongo.Select(bcollection, bson.M{"_id": bson.ObjectIdHex(ID)} ).Iter()
				for iter.Next(&result) {
				
					w.Write([]byte("logid:"+bson.ObjectId(result.ID).Hex()))
					w.Write([]byte("%/%"))
					w.Write([]byte("name:"+result.NAME))
					w.Write([]byte("%/%"))
					w.Write([]byte("target:"+result.TARGET))
					w.Write([]byte("%/%"))
					w.Write([]byte("title:"+result.TITLE))
					w.Write([]byte("%/%"))
					w.Write([]byte("command:"+result.COMMAND))
					w.Write([]byte("%/%"))
					w.Write([]byte("content:"+result.CONTENT))
					w.Write([]byte("%/%"))
					w.Write([]byte("from:"+result.FROM))
					w.Write([]byte("%/%"))
					w.Write([]byte("type:"+result.TYPE))
					w.Write([]byte("%/%"))
					w.Write([]byte("view:"+result.VIEW))
					w.Write([]byte("%/%"))
					w.Write([]byte("time:"+result.TIME))
					w.Write([]byte("***"))
					
					
				}
			case "SetLogView":
				
				var ID string = r.Form["id"][0]
				selector :=bson.M{"_id": bson.ObjectIdHex(ID)}
				data := bson.M{"$set": bson.M{"view": "true"}}
				err := mongo.Update(bcollection, selector, data)
				if err != nil {
					panic(err)
				}else{
					w.Write([]byte("pass"))
				}
			case "SetSchedule":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					var STATUS string = r.Form["stat"][0]
					var SCHEDULEID string = r.Form["scheduleid"][0]
					var DEVICEID string = r.Form["deviceid"][0]
					var COMMANDTITLE string = r.Form["commandtitle"][0]
					var COMMAND string = r.Form["command"][0]
					var LOGCOMMAND string = r.Form["logcomm"][0]
					var LOGCONTENT string = r.Form["logcontent"][0]
					var USERFROM string = r.Form["userfrom"][0]
					var TIMESTART string = r.Form["time"][0]
					temp := &Schedule{
						COMPANY: COMPANY,
						NAME: NAME,
						SCHEDULEID: SCHEDULEID,
						DEVICEID: DEVICEID,
						COMMANDTITLE: COMMANDTITLE,
						COMMAND: COMMAND,
						LOGCOMMAND: LOGCOMMAND,
						LOGCONTENT: LOGCONTENT,
						USERFROM: USERFROM,
						TIMESTART: TIMESTART,
						STATUS: STATUS,
					}
					mongo.Insert(ccollection, temp)
				}
				
			case "GetSchedule":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					result1 := Schedule{}
					iter1 := mongo.Select(ccollection, bson.M{"name": NAME, "company":COMPANY}).Iter()
					for iter1.Next(&result1) {
						w.Write([]byte("scheduleid:"+result1.SCHEDULEID))
						w.Write([]byte("%/%"))
						w.Write([]byte("deviceid:"+result1.DEVICEID))
						w.Write([]byte("%/%"))
						w.Write([]byte("commandtitle:"+result1.COMMANDTITLE))
						w.Write([]byte("%/%"))
						w.Write([]byte("command:"+result1.COMMAND))
						w.Write([]byte("%/%"))
						w.Write([]byte("logcommand:"+result1.LOGCOMMAND))
						w.Write([]byte("%/%"))
						w.Write([]byte("logcontent:"+result1.LOGCONTENT))
						w.Write([]byte("%/%"))
						w.Write([]byte("userfrom:"+result1.USERFROM))
						w.Write([]byte("%/%"))
						w.Write([]byte("timestart:"+result1.TIMESTART))
						w.Write([]byte("%/%"))
						w.Write([]byte("status:"+result1.STATUS))
						w.Write([]byte("***"))
					}
				}
			case "GetScheduleById":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var SCHEDULEID string = r.Form["scheduleid"][0]
				result := Schedule{}
				iter := mongo.Select(ccollection, bson.M{"name": NAME, "company":COMPANY, "scheduleid":SCHEDULEID}).Iter()
				for iter.Next(&result) {
					fmt.Println(result)
					w.Write([]byte("scheduleid:"+result.SCHEDULEID))
					w.Write([]byte("%/%"))
					w.Write([]byte("deviceid:"+result.DEVICEID))
					w.Write([]byte("%/%"))
					w.Write([]byte("commandtitle:"+result.COMMANDTITLE))
					w.Write([]byte("%/%"))
					w.Write([]byte("command:"+result.COMMAND))
					w.Write([]byte("%/%"))
					w.Write([]byte("logcommand:"+result.LOGCOMMAND))
					w.Write([]byte("%/%"))
					w.Write([]byte("logcontent:"+result.LOGCONTENT))
					w.Write([]byte("%/%"))
					w.Write([]byte("userfrom:"+result.USERFROM))
					w.Write([]byte("%/%"))
					w.Write([]byte("timestart:"+result.TIMESTART))
					w.Write([]byte("%/%"))
					w.Write([]byte("status:"+result.STATUS))
					w.Write([]byte("***"))
				}
				
			case "EditSchedule":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var SCHEDULEID string = r.Form["scheduleid"][0]
				result := Schedule{}
				iter := mongo.Select(ccollection, bson.M{"name": NAME, "company":COMPANY, "scheduleid":SCHEDULEID}).Iter()
				for iter.Next(&result) {
					mongo.RemoveAll(ccollection,  bson.M{"name": NAME, "company":COMPANY, "scheduleid":SCHEDULEID})
					var STATUS string = r.Form["stat"][0]
					var DEVICEID string = r.Form["deviceid"][0]
					var COMMANDTITLE string = r.Form["commandtitle"][0]
					var COMMAND string = r.Form["command"][0]
					var LOGCOMMAND string = r.Form["logcomm"][0]
					var LOGCONTENT string = r.Form["logcontent"][0]
					var USERFROM string = r.Form["userfrom"][0]
					var TIMESTART string = r.Form["time"][0]
					temp := &Schedule{
						COMPANY: COMPANY,
						NAME: NAME,
						SCHEDULEID: SCHEDULEID,
						DEVICEID: DEVICEID,
						COMMANDTITLE: COMMANDTITLE,
						COMMAND: COMMAND,
						LOGCOMMAND: LOGCOMMAND,
						LOGCONTENT: LOGCONTENT,
						USERFROM: USERFROM,
						TIMESTART: TIMESTART,
						STATUS: STATUS,
					}
					mongo.Insert(ccollection, temp)
				}
			case "DeleteSchedule":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var SCHEDULEID string = r.Form["scheduleid"][0]
				
				result := Schedule{}
				iter := mongo.Select(ccollection, bson.M{"name": NAME, "company":COMPANY, "scheduleid":SCHEDULEID}).Iter()
				for iter.Next(&result) {
					mongo.RemoveAll(ccollection,  bson.M{"name": NAME, "company":COMPANY, "scheduleid":SCHEDULEID})
					w.Write([]byte("pass"))
				}
			case "SetQuestion":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var TYPE string = r.Form["type"][0]
				var QTYPE string = r.Form["qtype"][0]
				var CONTENT string = r.Form["content"][0]
				var FROM string = r.Form["from"][0]
				var STATUS string = r.Form["status"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					t := time.Now().Unix()
					temp := &Log{
						NAME:  NAME,
						COMPANY: COMPANY,
						TYPE: TYPE,
						QTYPE: QTYPE,
						CONTENT: CONTENT,
						FROM: FROM,
						STATUS: STATUS,
						TIME: strconv.FormatInt(t,10),
					}
					mongo.Insert(bcollection, temp)
				}
			case "GetQuestion":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				result := Person{}
				result1 := Log{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result){
					if result.LEVEL == "1"{
						iter1 := mongo.Select(bcollection, bson.M{"type":"question"}).Iter()
						var array []Log
						w.Header().Set("Content-Type", "application/json")
						for iter1.Next(&result1) {
							array = append(array, result1)
						}
						js, err := json.Marshal(array)
						if err != nil {
							http.Error(w, err.Error(), http.StatusInternalServerError)
							return
						}
						w.Write(js)
					}else{
						iter1 := mongo.Select(bcollection, bson.M{"name": NAME, "company":COMPANY,"type":"question"}).Iter()
						var array []Log
						w.Header().Set("Content-Type", "application/json")
						for iter1.Next(&result1) {
							array = append(array, result1)
						}
						js, err := json.Marshal(array)
						if err != nil {
							http.Error(w, err.Error(), http.StatusInternalServerError)
							return
						}
						w.Write(js)
					}
				}
			case "SetReply":
				var COMPANY string = r.Form["company"][0]
				var NAME string = r.Form["name"][0]
				var TOCOMPANY string = r.Form["tocompany"][0]
				var TONAME string = r.Form["toname"][0]
				var TYPE string = r.Form["type"][0]
				var CONTENT string = r.Form["content"][0]
				var FROM string = r.Form["from"][0]
				var STATUS string = r.Form["status"][0]
				result := Person{}
				iter := mongo.Select(collection, bson.M{"name": NAME, "company":COMPANY}).Iter()
				for iter.Next(&result) {
					if result.LEVEL == "1"{
						t := time.Now().Unix()
						temp := &Log{
							NAME:  TONAME,
							COMPANY: TOCOMPANY,
							TYPE: TYPE,
							CONTENT: CONTENT,
							FROM: FROM,
							STATUS: STATUS,
							TIME: strconv.FormatInt(t,10),
						}
						mongo.Insert(bcollection, temp)
					}
					
				}
		}
		
		
		
		
		
	}

}

func init() {
	go mqtt.Initialization("mqttConfig.txt")
	log.Println("Golang Init")

	go func(initSub string) {
		for !mqtt.IsConnect() {
			log.Println("func qtt.IsConnect")
			time.Sleep(1000 * time.Millisecond)
		}
		mqtt.Mqtt_sub(initSub)
	}("ServerAimobile20170724")
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	var session *mgo.Session
	session, collection = mongo.Init("aimobile", "person")
	defer session.Close()
	
	countNum, err := mongo.CountNum(collection)
	if err != nil {
		panic(err)
	}
	
	var asession *mgo.Session
	asession, acollection = mongo.Init("aimobile", "devices")
	defer asession.Close()
	
	acountNum, err := mongo.CountNum(acollection)
	if err != nil {
		panic(err)
	}
	
	var bsession *mgo.Session
	bsession, bcollection = mongo.Init("aimobile", "log")
	defer bsession.Close()
	
	var csession *mgo.Session
	csession, ccollection = mongo.Init("aimobile", "schedule")
	defer csession.Close()
	go SetSchedulePicker()
	
	var dsession *mgo.Session
	dsession, dcollection = mongo.Init("aimobile", "company")
	defer dsession.Close()
	
	fmt.Println("Things objects count: ", countNum)
	fmt.Println("Things objects count: ", acountNum)
	http.HandleFunc("/", login)

	errhttp := http.ListenAndServe(":9090", nil)
	if errhttp != nil {
		log.Fatal("ListenAndServe: ", errhttp)
	}
	
	
}

func getCode(data string) string{
	h := hmac.New(sha256.New, []byte("ourkey"))
	io.WriteString(h, data)
	return fmt.Sprintf("%x", h.Sum(nil))
}

func smtpmail(email string, UserCompany string, UserName string) string{
	VerifyStatus := ""
	company := aes.Encrypt(UserCompany)	
	name := aes.Encrypt(UserName)	
	//auth := LoginAuth("Chen.JimmyHY@inventec.com", "Iec+12345")
	//fromAddress :=	"Chen.JimmyHY@inventec.com"
	auth := LoginAuth("onlinebuild@163.com", "jinxin123")
	fromAddress :=	"onlinebuild@163.com"
	toAddresses	:= []string{email}
	msg := []byte("To: "+email+"\r\n" +
		"Subject: Welcome AIMoblie Industrial Android ,Please verify your email address !\r\n\r\n" +
		"Hello：\r\n" +
		"Thank you for registering AIM Android management system!\r\n" +
		"Please click on the indicated link in order to activate account.。\r\n\r\n"+ 
		"-----------------\r\n"+
		"CONFIRM BY VISITING THE LINK BELOW:\r\n\r\n"+
		"http://47.95.248.121/activiteaccount.html?n%"+string(name)+"&c%"+string(company)+"\r\n\r\n"+
		"If you cannot click the full URL above, please copy and paste it into your web browser.\r\n"+
		"After activitaion you may login to http://47.95.248.121/ using the following username and password.\r\n"+
		"Warning! If you are not the intended recipient, destroy this or notify us immediately.\r\n\r\n"+
		"Best Regards,"+
		"AIMoblie team\r\n"+
		"-----------------\r\n"+
		"AIMobile: http://47.95.248.121/\r\n"+
		"Notify us: Chen.JimmyHY@inventec.com")
		
	smtpServer:="smtp.office365.com"
    err := smtp.SendMail(smtpServer + ":587", auth, fromAddress, toAddresses, msg)
    if err != nil {
		VerifyStatus = "error"
        log.Panic(err)
    }else{
		VerifyStatus = "unverified"
	}	
	return VerifyStatus
}

func smtpresetpass(email string, UserCompany string, UserName string) string{
	VerifyStatus := ""
	company := aes.Encrypt(UserCompany)	
	name := aes.Encrypt(UserName)	
	//auth := LoginAuth("Chen.JimmyHY@inventec.com", "Iec+12345")
	//fromAddress :=	"Chen.JimmyHY@inventec.com"
	auth := LoginAuth("onlinebuild@163.com", "jinxin123")
        fromAddress :=  "onlinebuild@163.com"
	toAddresses	:= []string{email}
	msg := []byte("To: "+email+"\r\n" +
		"Subject: Welcome AIMoblie Industrial Android ,Password Reset !\r\n\r\n" +
		"Hello：\r\n" +
		"Please click on the indicated link in order to reset password.。\r\n\r\n"+ 
		"http://47.95.248.121/Login.html?n%"+string(name)+"&c%"+string(company)+"\r\n\r\n"+
		"If you cannot click the full URL above, please copy and paste it into your web browser.\r\n"+
		"Warning! If you are not the intended recipient, destroy this or notify us immediately.\r\n\r\n"+
		"Best Regards,"+
		"AIMoblie team\r\n"+
		"-----------------\r\n"+
		"AIMobile: http://47.95.248.121/\r\n"+
		"notify us: Chen.JimmyHY@inventec.com")
		
	smtpServer:="smtp.office365.com"
    err := smtp.SendMail(smtpServer + ":587", auth, fromAddress, toAddresses, msg)
    if err != nil {
		VerifyStatus = "error"
        log.Panic(err)
    }else{
		VerifyStatus = "unverified"
	}	
	return VerifyStatus
}

func VerifyEmail(email string, UserCompany string, UserName string)string{
	VerifyStatus := ""
	company := aes.Encrypt(UserCompany)	
	name := aes.Encrypt(UserName)	
	em := aes.Encrypt(email)
	//auth := LoginAuth("Chen.JimmyHY@inventec.com", "Iec+12345")
	//fromAddress :=	"Chen.JimmyHY@inventec.com"
	auth := LoginAuth("onlinebuild@163.com", "jinxin123")
        fromAddress :=  "onlinebuild@163.com"
	toAddresses	:= []string{email}
	msg := []byte("To: "+email+"\r\n" +
		"Subject: Welcome AIMoblie Industrial Android ,Chenge email !\r\n\r\n" +
		"Hello：\r\n" +
		"Please click on the indicated link in order to Chenge email.。\r\n\r\n"+ 
		"http://47.95.248.121/activiteaccount.html?n%"+string(name)+"&c%"+string(company)+"&e%"+string(em)+"&t%"+"VerifyEmail"+"\r\n\r\n"+
		"If you cannot click the full URL above, please copy and paste it into your web browser.\r\n"+
		"Warning! If you are not the intended recipient, destroy this or notify us immediately.\r\n\r\n"+
		"Best Regards,"+
		"AIMoblie team\r\n"+
		"-----------------\r\n"+
		"AIMobile: http://47.95.248.121/\r\n"+
		"notify us: Chen.JimmyHY@inventec.com")
		
	smtpServer:="smtp.office365.com"
    err := smtp.SendMail(smtpServer + ":587", auth, fromAddress, toAddresses, msg)
    if err != nil {
		VerifyStatus = "error"
        log.Panic(err)
    }else{
		VerifyStatus = "pass"
	}	
	return VerifyStatus
}

func randomString(l int) string {
    bytes := make([]byte, l)
    for i := 0; i < l; i++ {
        bytes[i] = byte(randInt(65, 90))
    }
    return string(bytes)
}

func randInt(min int, max int) int {
    return min + rand.Intn(max-min)
}

func GetPermission(numPermission string,Permission string) string {
	i, _ := strconv.Atoi(numPermission)
	s:= strings.Split(Permission, "")
	return s[i]
    
}

func CheckUserDuedate(UserDuedate string) string{

	t := time.Now()
	tmp2, _ := strconv.ParseInt(UserDuedate, 10, 64)
	tm := time.Unix(tmp2, 0)
	if tm.After(t) {
		return "success"
	}else{
		return "timeout"
	}
	
	return "false"
}

func GetLogDays(days,logtimes string) string{
	if(days == "0"){
		return "true"
	}
	tmp0, _ := strconv.Atoi(days)
	t := time.Now().Local().Add(-time.Hour * time.Duration(tmp0 * 24))

	
	i, err := strconv.ParseInt(logtimes, 10, 64)
    if err != nil {
        panic(err)
    }
    tm := time.Unix(i, 0)
	if tm.After(t) {	//true logtime > now - days
		return "true"
	}else{
		return "false"
	}
		
}

func DicimalToBinary(s string) string{
  	if v, err := strconv.ParseUint(s, 10, 64); err == nil {
  	
		b2 := []byte("")
		b2 = strconv.AppendUint(b2, v, 2)
		return string(b2)
  	}
	return s
}

func BinaryToDicimal(s string) string{
  	base, _ := strconv.ParseInt(s, 2, 10)
	v:= uint64(base)
	s10 := strconv.FormatUint(v, 10)
    return s10
}

//----mail func-------

type loginAuth struct {
  username, password string
}

func LoginAuth(username, password string) smtp.Auth {
	return &loginAuth{username, password}
}

func (a *loginAuth) Start(server *smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", []byte(a.username), nil
}

func (a *loginAuth) Next(fromServer []byte, more bool) ([]byte, error) {
	if more {
		switch string(fromServer) {
		case "Username:":
			return []byte(a.username), nil
		case "Password:":
			return []byte(a.password), nil
		default:
			return nil, errors.New("Unkown fromServer")
		}
	}
	return nil, nil
}

//----mail func ------


//----Device online----
func CheckDeivceStatus(devicetime string)string{
	t := time.Now().Local().Add(-time.Minute * time.Duration(5))
	
	i, err := strconv.ParseInt(devicetime, 10, 64)
    if err != nil {
        panic(err)
    }
    tm := time.Unix(i, 0)
	
	if tm.After(t) {
		return "online"
	}else{
		return "offline"
	}
	

}

//----Device online----

//---- Log ----
func SetLogInfo(Company, Name, Target, Command, Content, From string){
	t := time.Now().Unix()
	temp := &Log{
		NAME:  Name,
		COMPANY: Company,
		TARGET: Target,
		COMMAND: Command,
		CONTENT: Content,
		FROM: From,
		TIME: strconv.FormatInt(t,10),
	}
	mongo.Insert(bcollection, temp)
				
}

func SetMessageLogInfo(Company, Name, Target, Title, Command, Content, Type, View, Scheduleid, From string){
	t := time.Now().Unix()
	temp := &Log{
		NAME:  Name,
		COMPANY: Company,
		TARGET: Target,
		TITLE: Title,
		COMMAND: Command,
		CONTENT: Content,
		TYPE: Type,
		VIEW: View,
		SCHEDULEID: Scheduleid,
		FROM: From,
		TIME: strconv.FormatInt(t,10),
	}
	mongo.Insert(bcollection, temp)
}
	
//---- Log ----

//---- schedule picker ----
func SetSchedulePicker(){
	t := time.Now()
    sec := t.Second()
	fmt.Println(sec)
	timeChan := time.NewTimer(time.Second * time.Duration(59-sec) ).C
	tickChan := time.NewTicker(time.Second * 60)
	doneChan := false
	for {
        select {
			case <- timeChan:
				tickChan = time.NewTicker(time.Second * 60)
				doneChan = true
				GetScheduleTask()
			case <- tickChan.C:
				if doneChan{
					GetScheduleTask()
					
				}
		}
    }
}

func GetScheduleTask(){
	
	BeforeTime := time.Now().Local().Add( -time.Second * time.Duration(59))
	fmt.Println(BeforeTime.Unix())
	result := Schedule{}
	iter := mongo.Select(ccollection, bson.M{"timestart": strconv.FormatInt(BeforeTime.Unix(),10)}).Iter()
	for iter.Next(&result) {
		fmt.Println("im in")
		deviceid := strings.Split(result.DEVICEID, "/")
		command := strings.Split(result.COMMAND, "/")
		for i := 0; i < len(deviceid)-1; i++ {
			for j := 0; j < len(command)-1; j++ {
				mqtt.Mqtt_pub(deviceid[i], aes.Encrypt(command[j]))
			}
		}
		
		//SetLogInfo(result.COMPANY, result.NAME, result.DEVICEID, result.LOGCOMMAND, result.LOGCONTENT, result.USERFROM)
		SetMessageLogInfo(result.COMPANY, result.NAME, result.DEVICEID, result.COMMANDTITLE, result.LOGCOMMAND, result.LOGCONTENT, "schedule", "false", result.SCHEDULEID, result.USERFROM)
		result1 := Log{}
		iter1 := mongo.Select(bcollection, bson.M{"scheduleid": result.SCHEDULEID}).Iter()
		for iter1.Next(&result1) {
			mqtt.Mqtt_pub(result.COMPANY+";"+result.NAME+"jsAddress", "sendtaskcomplete%*%"+result.SCHEDULEID+"%*%"+"deviceid:"+result.DEVICEID+"%*%"+"devicecommand:"+result.LOGCOMMAND+"%*%"+"time:"+result.TIMESTART+"%*%"+"logid:"+bson.ObjectId(result1.ID).Hex())
		}
		selector :=bson.M{"timestart": strconv.FormatInt(BeforeTime.Unix(),10)}
		data := bson.M{"$set": bson.M{"status": "false"}}
		err := mongo.Update(ccollection, selector, data)
		if err != nil {
			panic(err)
		}
	}
}

func GetCompanyName(CompanyID string)string{

	result := Company{}
	iter := mongo.Select(dcollection, bson.M{"companyid": CompanyID}).Iter()
	for iter.Next(&result) {
		return result.COMPANYNAME
	}
	return "false"
	
}


//---- schedule picker ----

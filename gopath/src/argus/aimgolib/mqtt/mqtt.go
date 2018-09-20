package mqtt

import (
	// "aimgolib/encrypt"
	"argus/aimgolib/encrypt"
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"
	
	MQTT "github.com/eclipse/paho.mqtt.golang"
	
	//mongo
	// "aimgolib/mongo"
	"argus/aimgolib/mongo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var broker, id, user, password, topic, message, store, payload *string
var qos *int
var cleansess = false
var client MQTT.Client
var collection *mgo.Collection
var acollection *mgo.Collection
var bcollection *mgo.Collection
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
	INVITED string
	USERNAME string
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
	SUBSCRIBE_WAIT string
	INVITER string
}

type Log struct {
	COMPANY string
	NAME string
	TARGET string
	COMMAND string
	CONTENT string
	FROM string
	TYPE string
	VIEW string
	TIME string
}

func IsConnect() bool {
	if client == nil {
		return false
	}

	return client.IsConnected()
}

func readConfig(FilePath string) {
	// open file
	inputFile, err := os.Open(FilePath)

	if err != nil {
		fmt.Println("Open Error!")
		return
	}
	// Leave the file automatically when leaving
	defer inputFile.Close()

	inputReader := bufio.NewReader(inputFile)

	for {
		inputString, err := inputReader.ReadString('\n')
		if err == io.EOF {
			return
		}

		var value = strings.Split(inputString, "=")
		value[1] = strings.Replace(value[1], "\r", "", -1)
		value[1] = strings.Replace(value[1], "\n", "", -1)
		if value[0] == "broker" {
			broker = &value[1]
		} else if value[0] == "id" {
			id = &value[1]
		} else if value[0] == "user" {
			user = &value[1]
		} else if value[0] == "password" {
			password = &value[1]
		} else if value[0] == "topic" {
			topic = &value[1]
		} else if value[0] == "payload" {
			payload = &value[1]
		} else if value[0] == "message" {
			message = &value[1]
		} else if value[0] == "qos" {
			tmp, err := strconv.Atoi(value[1])
			if err != nil {
				fmt.Println(err)
			}
			qos = &tmp
		} else if value[0] == "cleansess" {
			if value[1] == "true" {
				cleansess = true
			}
		} else if value[0] == "store" {
			store = &value[1]
		}
	}
}

func Mqtt_pub(mTopic string, mMsg string) {
	client.Publish(mTopic, byte(*qos), false, mMsg)
}

func Mqtt_pubc(client MQTT.Client, mTopic string, mMsg string) {
	client.Publish(mTopic, byte(*qos), false, mMsg)
}

func Mqtt_sub(mTopic string) {
	client.Subscribe(mTopic, byte(*qos), nil)
}

func Initialization(FilePath string) {
	readConfig(FilePath)

	// if *topic == "" {
	// 	fmt.Println("Invalid setting for -topic, must not be empty")
	// 	return
	// }

	opts := MQTT.NewClientOptions()
	opts.AddBroker(*broker)
	opts.SetClientID(*id)
	opts.SetUsername(*user)
	opts.SetPassword(*password)
	opts.SetCleanSession(cleansess)
	if *store != ":memory:" {
		opts.SetStore(MQTT.NewFileStore(*store))
	}

	opts.SetDefaultPublishHandler(func(client MQTT.Client, msg MQTT.Message) {

		var receiveString = string(msg.Payload())
		fmt.Printf("RECEIVED TOPIC: %s MESSAGE: %s\n---\n", msg.Topic(), aes.Decrypt(receiveString))
		//RECEIVED TOPIC: ServerAimobile20170724 MESSAGE: getDevices;;ID=83e0acb79a611c3865cffa48=;;DevNAME=-;;ArAgentVer=0.1.3.5;;DevModel=AIM8Q
		
		token := strings.Split(aes.Decrypt(receiveString), ";;")
		for i:=0;i<len(token);i++{
			fmt.Println(token[i])
		}
		var txtsubscriber string = GetSubscriber(token[0])
		//var subscriber []string
		//if txtsubscriber != "error"{
			//sub := strings.Split(txtsubscriber, "/")
			//for i := 0; i < len(sub)-1; i++ { 
				//subscriber= strings.Split(sub[i], "#")
			//}
			
			
		//}
		subscriber:= GetSubscriberOrCompanyPersonById(token[0])
		fmt.Println(subscriber)
		if token[0] == "getDevices" {
			
			if len(token)>5{
				temp := strings.Split(token[1], "=")
				id := temp[1]
				temp = strings.Split(token[2], "=")
				company:=""
				if len(temp) <= 2{
					company = temp[1]
				}else{
					aa:=strings.SplitN(token[2], "=",2)
					if(len(aa[1]) == 24){
						company = aes.Decrypt(aa[1])
					}
				}
				temp = strings.Split(token[3], "=")
				devNAME := temp[1]
				temp = strings.Split(token[4], "=")
				arAgentVer := temp[1]
				fmt.Printf("MESSAGE: %s\n---\n", id)
				temp = strings.Split(token[5], "=")
				devModel := temp[1]
				DeviceStatus(id, devNAME, arAgentVer, devModel, company)
			}else{
				temp := strings.Split(token[1], "=")
				id := temp[1]
				temp = strings.Split(token[2], "=")
				devNAME := temp[1]
				temp = strings.Split(token[3], "=")
				arAgentVer := temp[1]
				temp = strings.Split(token[4], "=")
				devModel := temp[1]
				fmt.Printf("MESSAGE: %s\n---\n", id)
				DeviceStatus(id, devNAME, arAgentVer, devModel, "")
				
			}
		}else if len(token)>1  &&  strings.Index(token[1],"getDeviceEnrollStatus") ==0 { //id;;getDeviceEnrollStatus;;dontcare

			if txtsubscriber == "error"{//Cannot find this device. 
				Mqtt_pub(token[0], aes.Encrypt("addDeviceEnrollManager-;;;"+"nonenrolled"))
			}else{
				Mqtt_pub(token[0], aes.Encrypt("addDeviceEnrollManager-;;;"+txtsubscriber+""))
			}

		}else if len(token)>1  &&  strings.Index(token[1],"setDeviceEnrollUser") ==0 { //id;;setDeviceEnrollUser;;UserAccount
			
			RegId:=token[0];
			// Command:=token[1];
			// CommandParamCompany:=strings.Split(token[2], ";")[0];
			// CommandParamName:=strings.Split(token[2], ";")[1];
			
			
			result:=token[2]
			fmt.Println(token[2])
			var asession *mgo.Session
			asession, acollection = mongo.Init("argus", "devices")
			defer asession.Close()
			var session *mgo.Session
			session, collection = mongo.Init("argus", "person")
			defer session.Close()
			acountNum, eerr := mongo.CountNum(acollection)
			if eerr != nil {
				panic(eerr)
			}
			countNum, eerr := mongo.CountNum(collection)
			if eerr != nil {
				panic(eerr)
			}
			fmt.Println(countNum)
			fmt.Println(acountNum)
			re := strings.Split(result, ";")
			result1 := Person{}
			iter := mongo.Select(collection, bson.M{"company": re[0],"name": re[1]}).Iter()
			AccountFindInDB := false;
			for iter.Next(&result1) {
				fmt.Println(result1.COMPANY+";"+result1.NAME)
				fmt.Println(result)
				fmt.Println(result1.INVITER)
				if result == result1.COMPANY+";"+result1.NAME {
					AccountFindInDB=true;
					invite := strings.Split(result1.INVITER, "/")
					
					check:=true
					for i := 0; i < len(invite)-1; i++ {  
						inviter :=  strings.Split(invite[i], "#")
						if inviter[0] == token[0]{
							check = false;
							Mqtt_pub(RegId, aes.Encrypt("RequestEnrollAccountFailure-;;;"+"StillWaitingForConsent"))
							break
						}
					}
					subscribe := strings.Split(result1.SUBSCRIBE, "/")
					fmt.Println(subscribe)
					for i := 0; i < len(subscribe)-1; i++ {  
						if subscribe[i] == token[0]{
							check = false;
							Mqtt_pub(RegId, aes.Encrypt("RequestEnrollAccountFailure-;;;"+"StillWaitingForConsent"))
							break
						}
					}
					fmt.Println(check)
					if check == true{
						Mqtt_pub(RegId, aes.Encrypt("RequestEnrollAccountSuccess-;;;waiting;;;"+token[2]))

						result2 := Devices{}
						iter2 := mongo.Select(acollection, bson.M{"deviceid": token[0]}).Iter()
						for iter2.Next(&result2) {
							selector := bson.M{"deviceid": token[0]}
							data := bson.M{"$set": bson.M{"invited": result2.INVITED+result+"/"}}
							err := mongo.Update(acollection, selector, data)
							if err != nil {
								panic(err)
							}	
						}
						t := time.Now().Unix()
						//var nowtime string = t.Format("20060102150405")
						fmt.Println("jimmy")
						fmt.Println(t)
						Mqtt_pub(result+"jsAddress", "setDeviceEnrollUser/"+token[0]+"/"+result+"/"+strconv.FormatInt(t,10))
						fmt.Println(strconv.FormatInt(t,10))
						info := strings.Split(result, ";")
						selector1 := bson.M{"name": info[1] ,"company": info[0]}
						data1 := bson.M{"$set": bson.M{"inviter": result1.INVITER+token[0]+"#"+strconv.FormatInt(t,10)+"/"}}
						err1 := mongo.Update(collection, selector1, data1)
						if err1 != nil {
							panic(err1)
						}
					}
				}else{
					//傳回手機  查無此名稱帳號
				}
			}	
			if(AccountFindInDB==false){
				Mqtt_pub(RegId, aes.Encrypt("RequestEnrollAccountFailure-;;;"+"accountNotExist"))
			}
			
			
		}else if len(token)>1  &&  strings.Index(token[1],"checkRoot") ==0 {
			result:=token[2]
			fmt.Printf("result: %s\n", result)
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "checkRoot/"+token[0]+"/"+result)
			}
		}else if len(token)>1  &&  strings.Index(token[1],"getTopActivity") ==0 {
			result:=token[2]
			fmt.Printf("result: %s\n", result)
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "getTopActivity/"+token[0]+"/"+result)
			}
		}else if len(token)>1  &&  strings.Index(token[1],"getRunningServices") ==0 {
			result:=token[2]
			fmt.Printf("result: %s\n", result)
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "getRunningServices/"+token[0]+"/"+result)
			}
		}else if len(token)>1  &&  strings.Index(token[1],"SysAlarm") ==0 {
			result:=token[1]
			tmp:=""
			for i:=2; i< len(token); i++{
				tmp +=token[i]
			}
			fmt.Printf("result: %s\n", result)
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "SysAlarm/"+token[0]+"/"+result+"/"+tmp)
			}
		}else if len(token)>1  &&  strings.Index(token[1],"gps") ==0 {
			result:=token[2]
			fmt.Printf("result: %s\n", result)
			temp := strings.Split(result, "=")
			Latitude := strings.Split(temp[2], " ")
			Longitude := strings.Split(temp[3], " ")
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "gps/Latitude:"+Latitude[0]+"/Longitude:"+Longitude[0]+"/Device:"+token[0])
			}
		}else if len(token)>1 && strings.Index(token[1],"GetDeviceVER") ==0{
			//5b362ef2676e449965d5fae0;;GetDeviceVER:0.05-1026;;Product:   AIM8Q;;Android:   6.0.1;;Build Ver:   eng.user.20170928.100839;;Radio Ver:   SWI9X15C_05.05.58.00 r27038 carmd-fwbuild1 2015/03/04 21:30:23;;Serial:   65d5fae0;;Bootloader:   unknown
			result:=""
			for i :=1 ; i < len(token); i++ {
				result += token[i]+";;"
			}			
			for i := 0; i < len(subscriber); i++ { 
				Mqtt_pub(subscriber[i]+"jsAddress", "deviceversion/"+token[0]+"/"+result)
			}
		}else if len(token)>1 && strings.Index(token[1],"getAllPackage") ==0{
			fmt.Println("getAllPackage"+ token[2])
			for j := 0; j < len(subscriber); j++ { 
				Mqtt_pub(subscriber[j]+"jsAddress", token[1]+"/"+token[0]+"/"+token[2])
			}
		}else{
			s:=""
			for i:= 0; i< len(token); i++{
				s += token[i] + "/"
			}
			for j := 0; j < len(subscriber); j++ { 
				Mqtt_pub(subscriber[j]+"jsAddress", s)
			}
		}

		// RECEIVED TOPIC: ServerAimobile20170724 MESSAGE: b0e0f2674fae2cd5dda88eb;;SysAlarm:1.0.0.2;;@@BLUE;;Refresh:10 Sec;;@@BLACK;;CPU_Usage:9%;;CPU_Temperature_Thresh
		// old:1°C;;Current_Temperature:44°C;;@@RED;;FAIL!;;@@BLACK;;RAM_Threshold:1.95GB;;RAM_Total:1.83GB;;RAM_Available:1.32GB;;@@RED;;FAIL!;;@@BLACK;;ROM_Threshold:10.
		// 00MB;;ROM_Total:54.26GB;;ROM_Available:53.63GB;;@@GREEN;;PASS!

		// SysAlarm:1.0.0.2;;@@BLUE;;Refresh:10 Sec;;@@BLACK;;CPU_Usage:3%;;CPU_Current_Temperature_Not_Supported;;;;@@BLACK;;RAM_Threshold:1.95GB;;RAM_Total:3.45GB;;RAM_Available:1.29GB;;@@RED;;FAIL!;;@@BLACK;;ROM_Threshold:10.00MB;;ROM_Total:24.86GB;;ROM_Available:1.25GB;;@@GREEN;;PASS!

		

		// if strings.Index(string(msg.Payload()), "HelloIamJs") == 0 {
		// 	fmt.Printf("in incoming[0]")
		// 	Mqtt_pub("jsAddress0710", "IamGolang, and I sead you a msg through mqtt")
		// }

	})

	client = MQTT.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	if token := client.Subscribe(*topic, byte(*qos), nil); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}
	for {
		//Not yet
		fmt.Printf("/Lazy... IsConnect(): %t", IsConnect(), "\n")
		if token := client.Subscribe(*topic, byte(*qos), nil); token.Wait() && token.Error() != nil {
			fmt.Println(token.Error(), "\n")
			// fmt.Println("/token.Error()... IsConnect():  %t", IsConnect(), "\n")

			// MyClient = MQTT.NewClient(opts)
			// if token := MyClient.Connect(); token.Wait() && token.Error() != nil {
			// 	panic(token.Error())
			// }
			// os.Exit(1)
		}
		time.Sleep(5 * 60 * 1000 * time.Millisecond)
	}

}

func DeviceStatus(id, devicename,arAgentVer,  devModel, company string){
	fmt.Printf("# [debug] DeviceStatus: id=%s, devName=%s, version=%s, model=%s, company=%s\n", id, devicename, arAgentVer, devModel, company);
	var asession *mgo.Session
	asession, acollection = mongo.Init("argus", "devices")
	defer asession.Close()
	
	fmt.Println("Devicestaus: ", id)
	t := time.Now().Unix()
	result := Devices{}
	var device string = devicename
	iter := mongo.Select(acollection, bson.M{"deviceid":id}).Iter()
	for iter.Next(&result) {
		selector := bson.M{"deviceid":id}
		if device != "-"{
			data := bson.M{"$set": bson.M{"devicename":device, "time": strconv.FormatInt(t,10)}}
			err := mongo.Update(acollection, selector, data)
			if err != nil {
					panic(err)
			}
		}else{
			data := bson.M{"$set": bson.M{"time": strconv.FormatInt(t,10)}}
			device = result.DEVICENAME
			err := mongo.Update(acollection, selector, data)
			if err != nil {
					panic(err)
			}
		}
		if company != result.COMPANY{
			data := bson.M{"$set": bson.M{"company":company}}
			err := mongo.Update(acollection, selector, data)
			if err != nil {
					panic(err)
			}
		}
		
	}
	
	var txtsubscriber string = GetSubscriber(id)
	if txtsubscriber == "error"{		//Cannot find this device. Set device in the datatable.
		SetDevices(id, device, arAgentVer, devModel, company)
	}else{
		sub:= strings.Split(txtsubscriber, "/")
		subname := make([]string, 0)
		for i := 0; i < len(sub)-1; i++ { 
			subscriber:= strings.Split(sub[i], "#")
			subname = append(subname, subscriber[0])
			Mqtt_pub(subscriber[0]+"jsAddress", "getDevices/"+id+"/"+"devNAME:"+device+"/"+"arAgentVer:"+arAgentVer+"/"+"devModel:"+devModel)
		}
		
		if company != ""{
			Person := GetCompanyPerson(company)
			allname := GetCompanyPersonWithoutSubscriberName(Person, subname)
			for i := 0; i < len(allname); i++ { 
				
				Mqtt_pub(allname[i]+"jsAddress", "getDevices/"+id+"/"+"devNAME:"+device+"/"+"arAgentVer:"+arAgentVer+"/"+"devModel:"+devModel)
			}
		}
	}
}

func GetCompanyPersonWithoutSubscriberName(AllCompanyName []string, SubscriberName []string)[]string{
	Name := make([]string, 0)
	for i := 0; i< len(AllCompanyName)-1; i++{
		tmp := true
		for j := 0; j< len(SubscriberName)-1;j++{
			if AllCompanyName[i] == SubscriberName[j]{
				tmp = false
				break
			}
		}
		if tmp{
			Name = append(Name, AllCompanyName[i])
		}		
		
	}
	return Name
}

func GetSubscriberAndCompanyPerson(AllCompanyName []string, SubscriberName []string)[]string{
	Name := make([]string, 0)
	for i := 0; i< len(AllCompanyName)-1; i++{
		tmp := true
		for j := 0; j< len(SubscriberName)-1;j++{
			if AllCompanyName[i] == SubscriberName[j]{
				tmp = false
				break
			}
		}
		if tmp{
			Name = append(Name, AllCompanyName[i])
		}		
		
	}
	for i := 0; i<len(SubscriberName)-1; i++{
		Name = append(Name, SubscriberName[i])
	}
	
	return Name
}


func GetSubscriber(deviceid string)string{
	var asession *mgo.Session
	asession, acollection = mongo.Init("argus", "devices")
	defer asession.Close()
	
	acountNum, err := mongo.CountNum(acollection)
	if err != nil {
		panic(err)
	}
	fmt.Println("Things objects count: ", acountNum)
	result := Devices{}
	iter := mongo.Select(acollection, bson.M{"deviceid":deviceid}).Iter()
	for iter.Next(&result) {
		return result.SUBSCRIBER
	}
	return "error"
}

func GetSubscriberOrCompanyPersonById(deviceid string) []string{
	var asession *mgo.Session
	asession, acollection = mongo.Init("argus", "devices")
	defer asession.Close()
	var session *mgo.Session
	session, collection = mongo.Init("argus", "person")
	defer session.Close()
	AllSubscribe := make([]string, 0)
	result := Devices{}
	result1 := Person{}
	iter := mongo.Select(acollection, bson.M{"deviceid":deviceid}).Iter()
	for iter.Next(&result) {
		if result.COMPANY == "Guest" || result.COMPANY == ""{
			sub := strings.Split(result.SUBSCRIBER, "/")
			for i := 0; i < len(sub)-1; i++ { 
				subscriber := strings.Split(sub[i], "#")
				AllSubscribe = append(AllSubscribe, subscriber[0])
			}
		}else{
			iter1 := mongo.Select(collection, bson.M{"company": result.COMPANY}).Iter()
			for iter1.Next(&result1) {
				AllSubscribe = append(AllSubscribe, result1.COMPANY+";"+result1.NAME)
			}
		}
		
	}
	return AllSubscribe
} 

func GetCompanyPerson(CompanyName string)[]string{
	var session *mgo.Session
	session, collection = mongo.Init("argus", "person")
	defer session.Close()
	
	result := Person{}
	person := make([]string, 0)
	iter := mongo.Select(collection, bson.M{"company":CompanyName}).Iter()
	for iter.Next(&result) {
		person = append(person, result.COMPANY+";"+result.NAME)
	}
	return person
}

func SetDevices(id, devNAME, arAgentVer, devModel, company string){	
	fmt.Printf("# [debug] SetDevices, id=%s, devName=%s, version=%s, model=%s, company=%s\n", id, devNAME, arAgentVer, devModel, company);
	//[debug] SetDevices, id=1050cd59730c04741520c1d4e3168ae5, devName=3420-001, version=1.1.1.1, model=SABRESD-MX6DQ, company=Advantech
	var asession *mgo.Session
	asession, acollection = mongo.Init("argus", "devices")
	defer asession.Close()
	t := time.Now().Unix()
	temp := &Devices{
		DEVICEID: id,	
		DEVICENAME: devNAME,	
		AGENTVERSION: arAgentVer,	
		DEVICEMODEL: devModel,
		TIME: strconv.FormatInt(t,10),
		COMPANY: company,
	}
	mongo.Insert(acollection, temp)
			
}


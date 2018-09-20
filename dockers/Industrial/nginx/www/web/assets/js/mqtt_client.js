		
client = new Paho.MQTT.Client("ws2.aimobile.com.tw", Number(11880), "");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});
var DeviceID = [];

// called when the client connects
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	client.subscribe(localStorage.getItem("Company")+";"+getCookie("UserName")+"jsAddress");

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:"+responseObject.errorMessage);
	}
}

// called when a message arrives
var payload;
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString);
	getIPs(function(ip){payload = "(Ip: "+ip+", "+GetInputTimeToOriginal(new Date())+"-"+getCookie("UserName")+")"+message.payloadString;});
	payload = message.payloadString;
	navigator.webkitPersistentStorage.requestQuota(50*1024*1024, function() {
	  window.webkitRequestFileSystem(window.PERSISTENT , 50*1024*1024, SaveDatFileBro);
	})
	//getDevices/105097a64039f68bM77000221/devNAME:-/arAgentVer:1.0.0.0/devModel:AIM8I
	if(   message.payloadString.indexOf("getDevices") >=0){
		//devices information back from golang 
		//when: devices heartbeat every five minutes or update devices button from user
		if(location.pathname === "/AllDevice.html"){
			var tmp = message.payloadString;
			var MessageReceived = tmp.split("/");
			var name = MessageReceived[2].split(":");
			var version = MessageReceived[3].split(":");
			var model = MessageReceived[4].split(":");
			console.log("Mess1:"+MessageReceived[1]+",name:"+name[1]);
			UpdateDevices(MessageReceived[1],name[1]);
			if(m_Update === true){
				for(var i=0;i<Object.keys(m_devices).length;i++){
					if(MessageReceived[1] === m_devices[i][0]){
						m_devices[i][1] = true;
					}
				}
			}
		}
		
	}else if( message.payloadString.indexOf("gps") >=0){
		//command Get Coordinates (json file number:4)
		console.log(message.payloadString);
		if(location.pathname === "/googlemap3.html"){
			var devicemap = [];
			var count = 0;
			var tmp = message.payloadString;
			var MessageReceived = tmp.split("/");
			var Lat = MessageReceived[1].split(":");
			var Lng = MessageReceived[2].split(":");
			var deviceid = MessageReceived[3].split(":");
			var tmp = true;
			for (var i=0; i<devicemap.length+1; i++){
				if(devicemap[i] === deviceid[1]){
					tmp = false;
				}
				
			}
			if(tmp === true ){
				Setplace(parseFloat(Lat[1]), parseFloat(Lng[1]), deviceid[1]);
				devicemap.push(deviceid[1]);
				if(count === 0) {Panto(0, position[0], map);toggleBounce(0);}
				count++;
				document.getElementById("loading").style.display = "none";
			}
			
			if(count >= sdevice){
				document.getElementById("spin").style.display = "none";
			}
		 }else if(location.pathname === "/index.html"){
			var tmp = message.payloadString;
			var MessageReceived = tmp.split("/");
			var Lat = MessageReceived[1].split(":");
			var Lng = MessageReceived[2].split(":");
			var deviceid = MessageReceived[3].split(":");
			SetDeviceLocation(deviceid[1], parseFloat(Lat[1]), parseFloat(Lng[1]));
		 //}else{
			// var tmp = message.payloadString;
			// var MessageReceived = tmp.split("/");
			// var Lat = MessageReceived[1].split(":");
			// var Lng = MessageReceived[2].split(":");
			// var deviceid = MessageReceived[3].split(":");
			// SetNotificationBell("add");
			// var device = "'"+MessageReceived[1]+"'";var accept = "'accept'";var refuse = "'refuse'";
			// var invitecontent = SetSubscribeNotification(deviceid[0], MessageReceived[3], device, accept, refuse );
			// document.getElementById("notification_content").innerHTML += invitecontent;		
		 }
		
	}else if( message.payloadString.indexOf("checkRoot") >=0){
		//command Get root status (json file number:58)
		if(location.pathname === "/AllDevice.html"){
			var tmp = message.payloadString;
			var MessageReceived = tmp.split("/");
			if(MessageReceived[2] === "true"){
				document.getElementById("GetRoot").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-check" aria-hidden="true" style="color:green;">already root</i></p><br>';
			}else{
				document.getElementById("GetRoot").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-times" aria-hidden="true" style="color:red;">no root</i></p><br>';
			}
		}
		
	}else if( message.payloadString.indexOf("getTopActivity") >=0){
		//command Get top activity (json file number:59)
		if(location.pathname === "/AllDevice.html"){
			var tmp = message.payloadString;
			var MessageReceived = tmp.split("/");
			if(MessageReceived[2] === ""){
				document.getElementById("GetTopActivity").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-rss" aria-hidden="true" style="color:red;padding-right:5px;"></i>No Top Activity received(in a minute)</p><br>';
			}else{
				document.getElementById("GetTopActivity").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-rss" aria-hidden="true" style="color:green;padding-right:5px;"></i>'+MessageReceived[2]+'</p><br>';
			}
		}
		
	}else if( message.payloadString.indexOf("getRunningServices") >=0){
		//command Get running services (json file number:60)
		if(location.pathname === "/AllDevice.html"){
			var tmp = message.payloadString;
			var Message = tmp.split("//");
			var MessageReceived = Message[0].split("/");
			var MessageData = Message[1].split("/");
			document.getElementById("GetRunningService").innerHTML += '<p>'+MessageReceived[1]+': '+MessageData.length+'<div style="margin:5px;" class="btn-toolbar"><div class="btn-group"><button class="btn btn-default">Details</button><button data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span></button><ul class="dropdown-menu" id="run-'+MessageReceived[1]+'"></ul></div></div><br>';
			var n = 'run-'+MessageReceived[1];
			for(var i=0;i<MessageData.length;i++){
				document.getElementById(n).innerHTML += '<li style="padding-left:5px;">'+MessageData[i]+'</li>';
			}
		}
	}else if( message.payloadString.indexOf("setDeviceEnrollUser") >=0){
		//Managed request from device 
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		SetNotificationBell("add");
		var device = "'"+MessageReceived[1]+"'";var accept = "'accept'";var refuse = "'refuse'";
		var invitecontent = SetSubscribeNotification(MessageReceived[1], MessageReceived[3], device, accept, refuse );
		document.getElementById("notification_content").innerHTML += invitecontent;				
	}else if( message.payloadString.indexOf("sendtaskcomplete") >=0){
		// task completed at schedule
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("%*%");
		var time = MessageReceived[4].split(":");
		var logid = MessageReceived[5].split(":");
		SetNotificationBell("add");
		var accept = "'view'";
		var invitecontent = SetScheduleNotification("Task Completed", time[1], logid[1] );
		document.getElementById("notification_content").innerHTML += invitecontent;	
		
		if(location.pathname === "/schedule.html"){
			EditScheduleStatus(MessageReceived[1]);
			var data = vm.events;var tmp;
			for(var i=0;i<Object.keys(data).length;i++){
				if(MessageReceived[1] === data[i].scheduleid){
					var ColorPrimaryDevice = ['#808080','#006400','#FF0000'];
					var ColorsecondaryDevice = ['#DCDCDC','#99FF99','#FFCCCC'];
					data[i].color = {
						primary: ColorPrimaryDevice[0], // the primary event color (should be darker than secondary)
						secondary: ColorsecondaryDevice[0]};
					vm.events[i] = data[i];
				}
			}
			
		}				
	}else if( message.payloadString.indexOf("deviceversion") >=0){
		//command Get System Version (json file number:13)
		if(location.pathname === "/AllDevice.html"){
			var tmp = message.payloadString;
			var MessageReceived = tmp.split(";;");
			var v = MessageReceived[0].split("/");
			var DeviceVersion = v[2].split(":");
			var Product = MessageReceived[1].split(":");
			var AndroidVer = MessageReceived[2].split(":");
			var BuildVer = MessageReceived[3].split(":");
			var RadioVer = MessageReceived[4].split(":");
			var Serial = MessageReceived[5].split(":");
			var Bootloader = MessageReceived[6].split(":");
			if($("#GetDeviceVersion").attr('value') === "0"){
				document.getElementById("GetDeviceVersion").innerHTML += ''+
						'<table class="display responsive nowrap" cellspacing="0" width="100%" id="dataTables-version">'+
							'<thead>'+
								'<tr>'+
									'<th>Device id</th>'+
									'<th>Device Version</th>'+
									'<th>Product</th>'+
									'<th>Android Version</th>'+
									'<th>Build Version</th>'+
									'<th>Radio Version</th>'+
									'<th>Serial</th>'+
									'<th>Bootloader</th>'+
								'</tr>'+
						   '</thead>'+
							'<tbody>'+
									
							'</tbody>'+
						'</table>';
				$('#dataTables-version').dataTable( {
					"order": [[ 1, "asc" ]],
					rowReorder: {
						selector: 'td:nth-child(0)'
					},
					responsive: true
				} );
				var VersionTable = $('#dataTables-version').DataTable();
				var rowNode = VersionTable.row.add( [
					v[1],
					DeviceVersion[1],
					Product[1],
					AndroidVer[1],
					BuildVer[1],
					RadioVer[1],
					Serial[1],
					Bootloader[1]
				] ).draw( false ).node();
				$("#GetDeviceVersion").attr('value',1);							
			}else{
				var VersionTable = $('#dataTables-version').DataTable();
				var rowNode = VersionTable.row.add( [
					v[1],
					DeviceVersion[1],
					Product[1],
					AndroidVer[1],
					BuildVer[1],
					RadioVer[1],
					Serial[1],
					Bootloader[1]
				] ).draw( false ).node();
				$("#GetDeviceVersion").attr('value',1);		
			}
			
		}
	}else if( message.payloadString.indexOf("SysAlarm") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		
		
		if(location.pathname === "/details.html"){
			SetDeviceInfo(MessageReceived[0],"SysAlarm", JSON.parse(MessageReceived[1]));
			//SendByGolang("/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;"+GetCommand(27, "Param"), GetCommand(27, "CommTitle"), "stop", "system");	
			StopSystemRequire(MessageReceived[0]);
		}
	}else if( message.payloadString.indexOf("getAllPackage") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(location.pathname === "/details.html"){
			console.log(tmp);
			if(MessageReceived[1] === selectedDeviceId){
				var Alltopic = MessageReceived[2].split("{");
				for(var i=1;i<Alltopic.length;i++){
					var etopic = Alltopic[i].split("}");
					var topic = etopic[0].split(",");
					var AppName = "", AppPackageName = "", AppType = "";
					for(var j=0;j<topic.length;j++){
						var fin = topic[j].split(":");
						
						if(j===0){
							AppName = fin[1];
						}else if(j===1){
							AppPackageName = fin[1];
						}else if(j===2){
							AppType = fin[1];
						}
						
					}
					SetAppList(AppName,AppPackageName, AppType);
				}
				PackagesNameReceived();
			}
		}
		
		
	}else if(message.payloadString.indexOf("getLimitArray:") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		var t = tmp.split("getLimitArray:");
		var arealist = t[1].split("/");
		var strlist = "";
		for(var i=0;i<arealist.length;i++){
			if(arealist[i] !== ""){
				
				strlist += arealist[i] + " "; 
			}
		}
		if(location.pathname === "/AllDevice.html"){
			document.getElementById("GetLimitList").innerHTML += '<p>'+MessageReceived[0]+':  <i class="fa fa-rss" aria-hidden="true" style="color:green;padding-right:5px;"></i>'+strlist+'</p><br>';
		}
		
	}else if(message.payloadString.indexOf("BatteryInfo") >=0){
		
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(location.pathname === "/details.html"){
			SetBattetyInfo(MessageReceived[0],MessageReceived);
			
			SendByGolang(MessageReceived[0]+"/", GetCommand(26, "Comm")+"@%@"+GetCommand(26, "Path")+"@%@;;;requireStopApp", GetCommand(26, "CommTitle"), "Battery Disable", "system");	
		}
		
	}else if(message.payloadString.indexOf("GetDeviceStatus") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(location.pathname === "/details.html"){
			SetPeripheralInfo(MessageReceived[0], JSON.parse(MessageReceived[1]));
		}
	}else if(message.payloadString.indexOf("getAPN") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		var APNInfo = JSON.parse(MessageReceived[1]);
		if(location.pathname === "/AllDevice.html"){
			$('#GetAPN').append("Device:"+MessageReceived[0]+ ", APN name: "+APNInfo.APNName+"<br>");
		}
	}else if(message.payloadString.indexOf("GetProperty") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		$('#PropertyResult').append("Device:"+MessageReceived[0]+ ", "+MessageReceived[2]+"<br />");
	}else if(message.payloadString.indexOf("func1_startThread") >=0){
		console.log("hitQQQ");
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		var status = MessageReceived[1].split(": ");
		console.log(status);
		
		if(status[2] === "hit!!!"){
			$(".list-group-item:contains('"+MessageReceived[0]+"')").addClass('dev-warning');
			if($(".list-group-item:contains('"+MessageReceived[0]+"')").find('.fa-exclamation-triangle').length<=0){
				$(".list-group-item:contains('"+MessageReceived[0]+"')").append('<i class="fa fa-exclamation-triangle" aria-hidden="true" style="color:red;"></i>');
			}
			
		}else if (status[2] === "no hitQQQ"){
			
		}
		
	}else if(message.payloadString.indexOf("AIMSilentTest") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(MessageReceived[2] === "PASS"){
				document.getElementById("SlientTest").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-check" aria-hidden="true" style="color:green;">PASS</i></p><br>';
			}else{
				document.getElementById("SlientTest").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-times" aria-hidden="true" style="color:red;">FAIL</i></p><br>';
			}
	}else if(message.payloadString.indexOf("Test Result") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		MessageReceived[1] = MessageReceived[1].replace(/\r|\n/g,"<br>");
		console.log(MessageReceived[1]);
		$('#FlightModeTest').html(MessageReceived[1]);
	}else if(message.payloadString.indexOf("getAllList") >=0){ //105
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(location.pathname === "/details.html"){
			SetLaunchBlackWhiteList(MessageReceived[0], MessageReceived[2], MessageReceived[3]);
		}else if(location.pathname === "/AllDevice.html"){
			var MessageData = MessageReceived[3].split("||");
			

			if(MessageReceived[3] === ""){
				document.getElementById("getAllList").innerHTML += '<p>'+MessageReceived[2]+':  <i class="fa fa-rss" aria-hidden="true" style="color:red;padding-right:5px;"></i>No Lists received(in a minute)</p>';
			}else{

             if(MessageData[1] === "")
             	{
				document.getElementById("getAllList").innerHTML += '<li style="padding-left:5px;">'+MessageData[0]+'</li>';
			 }else{
				//var n = 'run-'+MessageReceived[2];
			for(var i=0;i<MessageData.length-1;i++){
                var AllowDenylist = MessageData[i].split(":");
				var List1 = "";
				var List2 = "";
				var List3 = "";
				 if(AllowDenylist[0]==1)
					List1="Install APP";
				 else if(AllowDenylist[0]==2)
				    List1="Launch APP";
                 else if(AllowDenylist[0]==3)
					List1="System APP";
				 else if(AllowDenylist[0]==4)
				 	List1="WiFi";
				 else if(AllowDenylist[0]==5)
				 	List1="BT";
				 else if(AllowDenylist[0]==6)
				 	List1="APN";
				 else
				 	List1="UNKNOWN";

				List2=AllowDenylist[1];

				if(AllowDenylist[2]==1)
				   List3="Allow";
				if(AllowDenylist[2]==0)
				   List3="Deny";
				 
			
                if(List1 === "System APP" )
                	{
				   // Not to print System APP
                	}else
                		{
				document.getElementById("getAllList").innerHTML += '<li style="padding-left:5px;">'+List1+" : "+List2+"["+List3+']</li>';
					}
				
					
				}

			 }

			}
	
			}
		
	}else if(message.payloadString.indexOf("getProhabitList") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		if(location.pathname === "/details.html"){
			SetLaunchBlackWhiteList(MessageReceived[0], MessageReceived[2], MessageReceived[3]);
		}else if(location.pathname === "/AllDevice.html"){
			var MessageData = MessageReceived[3].split("||");

			if(MessageReceived[3] === ""){
				document.getElementById("getProhabitList").innerHTML += '<p>'+MessageReceived[2]+':  <i class="fa fa-rss" aria-hidden="true" style="color:red;padding-right:5px;"></i>No Lists received(in a minute)</p>';
			}else{

             if(MessageData[1] === "")
             	{
				document.getElementById("getProhabitList").innerHTML += '<li style="padding-left:5px;">'+MessageData[0]+'</li>';
			 }else{
				//var n = 'run-'+MessageReceived[2];
			for(var i=0;i<MessageData.length;i++){
				document.getElementById("getProhabitList").innerHTML += '<li style="padding-left:5px;">'+MessageData[i]+'</li>';
				}

			 }

			}
	
			}
		
	}else if (message.payloadString.indexOf("GetRSSI") >=0){
		var tmp = message.payloadString;
		var MessageReceived = tmp.split("/");
		var RSSIInfo = JSON.parse(MessageReceived[1]);
		if(location.pathname === "/details.html"){
			if(RSSIInfo.WiFi != null){
				SetDeviceInfo(MessageReceived[0],"wifi", JSON.parse(MessageReceived[1]));
			}
			if(RSSIInfo.Bluetooth != null){
				SetDeviceInfo(MessageReceived[0],"bluetooth", JSON.parse(MessageReceived[1]));
			}
		}
		
	}
		
}	

// Send command to golang server	
//value_topic : device id (e.g. 9cc84dacd9bb8e59d4be07/dc0cffdcefef9d4be7e/ )	  
//value_msg: command (e.g. soundSet;;;20) call GetCommand(number, "comm")+";;;"+GetCommand(number, "param") from json file(assets/json/)
//command_msg: command log (for user)
//value_command: command content (for user)
//command_from: whose call this command (user or system)
function SendByGolang(value_topic ,value_msg, command_msg, value_command, command_from) {
	console.log(value_msg);
	getIPs(function(ip){payload = "(Ip: "+ip+", "+GetInputTimeToOriginal(new Date())+"-"+getCookie("UserName")+")"+value_msg;});
	navigator.webkitPersistentStorage.requestQuota(50*1024*1024, function() {
	  window.webkitRequestFileSystem(window.PERSISTENT , 50*1024*1024, SaveDatFileBro);
	})
	var postdata = {
		topic: value_topic,
		msg: value_msg,
		name: getCookie("UserName"),
		company: localStorage.getItem("Company"),
		command: command_msg,
		value: value_command,
		commandfrom: command_from,
		submit: "SendByGolang"
	}

	$.post("http://172.21.73.144:9090",
	postdata,
	function(data,status){
		if(data !== undefined){
			if(location.pathname === "/AllDevice.html"){
				//update log record
				var t = value_topic.split("/");var target="";
				for(var i=0; i<t.length-1; i++){
					target += t[i] + '<br>';
				}
				if(command_from === "user"){
					var LogTable = $('#LogTable').DataTable();
					var rowNode = LogTable.row.add( [
						GetNowTimes(),
						getCookie("UserName"),
						target,
						command_msg,
						value_command,
					] ).draw( false ).node();
				}
			}
		}
			
	});
	
}

function NewSendByGolang(value_topic ,value_comm, value_path, value_param, command_msg, value_command, command_from){
	var postdata = {
		topic: value_topic,
		comm: value_comm,
		path:value_path,
		param:value_param,
		name: getCookie("UserName"),
		company: localStorage.getItem("Company"),
		command: command_msg,
		value: value_command,
		commandfrom: command_from,
		submit: "NewSendByGolang"
	}
	$.post("http://172.21.73.144:9090",
	postdata,
	function(data,status){
		
			
	});
}
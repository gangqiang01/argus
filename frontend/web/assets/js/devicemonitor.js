var tconfig;
var myObj = "";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","devicemonitor.html"); 
	
    LoadJsonFile();
    $("#lock").on("click",function(){
        if(selectedDeviceId !== undefined){
            var checked = $(this).prop('checked');
            var Title = ""+GetCommand(5, "CommTitle")+":";
            var MsgBody= "";
            SetAlertMsgInnerHTML(Title, MsgBody);
            
            document.getElementById("AlertMsgTools").style.display = "";
            document.getElementById("EnterPassword").style.display = "";
            document.getElementById("AlertMsgBtn").style.display = "";
            document.getElementById("AlertMsgBtn").onclick = function(e) {
                var value = document.getElementById("password").value;	
                SendByGolang(selectedDeviceId+"/", GetCommand(5, "Comm")+";;;"+value, GetCommand(5, "Comm"), value, "user");
            }
        } 
    })
    $("#locktwo").on("click",function(){
        if(selectedDeviceIdtwo !== undefined){
            var Title = ""+GetCommand(5, "CommTitle")+":";
            var MsgBody= "";
            SetAlertMsgInnerHTML(Title, MsgBody);
            
            document.getElementById("AlertMsgTools").style.display = "";
            document.getElementById("EnterPassword").style.display = "";
            document.getElementById("AlertMsgBtn").style.display = "";
            document.getElementById("AlertMsgBtn").onclick = function(e) {
                var value = document.getElementById("password").value;	
                SendByGolang(selectedDeviceIdtwo+"/", GetCommand(5, "Comm")+";;;"+value, GetCommand(5, "Comm"), value, "user");
            }
        } 
    })
    
});
var company = localStorage.getItem("Company");	var type="";
if(company === "Guest"){
	type = "assets/json/lite.txt";
}else{
	type = "assets/json/pro.txt";
}

var myObj = "";
function LoadJsonFile() {
	$.getJSON( type, function( data ) {
		myObj = data;
		SetHTML("barset_display");
		GetAllDevices();
		//$("#appFilter").html(filter).selectpicker('refresh');
		var filter = [];
	});
}

var selectedDeviceId;
var selectedDeviceIdtwo
var ReturnCount=0;
function GetDeviceDetails(deviceid,cid){
    if(cid == "one"){
        selectedDeviceIdtwo = null;
        selectedDeviceId = deviceid;
    }else if(cid == "two"){
        selectedDeviceId = null;
        selectedDeviceIdtwo = deviceid;
    }
	
	
	
	//Enable System Status Monitor
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", "1;;;2000;;;10;;;10", "system");	
	
	
	//Enable Battery Info
	SendByGolang(deviceid+"/", GetCommand(25, "Comm")+"@%@"+GetCommand(25, "Path"), GetCommand(25, "CommTitle"), "Battery Enable", "system");
	
	//Get Peripheral Status
	// if(localStorage.getItem("Company") !== "Guest")
	// 	SendByGolang(deviceid+"/", GetCommand(100, "Comm")+"@%@"+GetCommand(100, "Path"), GetCommand(100, "CommTitle"), "Peripheral status", "system");		
	
	
	var sub = "GetDeviceDetails"; var postdata = {submit: sub};
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	postdata = {
		company: company,
		name: name,
		deviceid: deviceid,
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(!jQuery.isEmptyObject(data)){
            if(cid == "one"){
                document.getElementById('AgentVersion').innerHTML = data[0].AGENTVERSION;
                document.getElementById('DeviceModel').innerHTML = data[0].DEVICEMODEL;
            }else if(cid == "two"){
                document.getElementById('AgentVersiontwo').innerHTML = data[0].AGENTVERSION;
                document.getElementById('DeviceModeltwo').innerHTML = data[0].DEVICEMODEL;
            }

		}
	});
	// device management
}

function UpdateDone(deviceid){
    if(deviceid == selectedDeviceId){
        ReturnCount++;
        if(localStorage.getItem("Company") === "Guest"){
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTime').html(DateToTime(new Date()));
            }
        }else{
            if(ReturnCount >=2){
                ReturnCount = 0;
                $('#UpdateTime').html(DateToTime(new Date()));
            }
        }
    }else if(deviceid == selectedDeviceIdtwo){
        ReturnCount++;
        if(localStorage.getItem("Company") === "Guest"){
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTimetwo').html(DateToTime(new Date()));
            }
        }else{
            if(ReturnCount >=2){
                ReturnCount = 0;
                $('#UpdateTimetwo').html(DateToTime(new Date()));
            }
        }
    }

	
}

function StopSystemRequire(deviceid){
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;requireStopAPP;;;1;;;2000;;;10", GetCommand(27, "CommTitle"), "Stop", "system");	
}

function SetDeviceInfo(deviceid, data){
    var data = JSON.parse(data);
	if(selectedDeviceId === deviceid){
		$('#CPUUsage').html(data.CPU_Usage);
		$('#Temperature').html(data.Current_Temperature+"°c");
		$('#RAMTotal').html(data.RAM_Total);
		$('#RAMAvailable').html(data.RAM_Available);
		$('#ROMTotal').html(data.ROM_Total);
        $('#ROMAvailable').html(data.ROM_Available);
	}else if(selectedDeviceIdtwo === deviceid){
		$('#CPUUsagetwo').html(data.CPU_Usage);
		$('#Temperaturetwo').html(data.Current_Temperature+"°c");
		$('#RAMTotaltwo').html(data.RAM_Total);
		$('#RAMAvailabletwo').html(data.RAM_Available);
		$('#ROMTotaltwo').html(data.ROM_Total);
		$('#ROMAvailabletwo').html(data.ROM_Available);
    }
	UpdateDone(deviceid);
}

function SetBattetyInfo(deviceid, data){
	if(selectedDeviceId === deviceid){
		for(var i=0;i<data.length;i++){
			var Message = data[i].split(":");
			if(Message.length > 1){
				console.log(Message);
				if(Message[0] === "Current Power"){
					$('#BatteryPower').html(Message[1]+"%");
					if(Message[1]<=20){
						$('#battery-power').html('<i class="fa fa-battery-empty info-box-icon-white"></i>');		
					}else if(Message[1]>20 && Message[1]<=40){
						$('#battery-power').html('<i class="fa fa-battery-quarter info-box-icon-white"></i>');
					}else if(Message[1]>40 && Message[1]<=60){
						$('#battery-power').html('<i class="fa fa-battery-half info-box-icon-white"></i>');
					}else if(Message[1]>20 && Message[1]<=80){
						$('#battery-power').html('<i class="fa fa-battery-three-quarters info-box-icon-white"></i>');
					}else if(Message[1]>20 && Message[1]<=100){
						$('#battery-power').html('<i class="fa fa-battery-full info-box-icon-white"></i>');
					}
					$('#battery-power').append('<p class="info-box-icon-title">Batery</p>');
					
				}else if(Message[0] === "Battery level"){
					$('#BatteryLevel').html(Message[1]);
				}else if(Message[0] === "Current Volt"){
				
				}else if(Message[0] === "Current Curuit"){
				
				}else if(Message[0] === "Current state"){
				
				}else if(Message[0] === "Charge mode"){
					$('#BatteryCharging').html(Message[1]);
				}
			}
		}
	}else if(selectedDeviceIdtwo == deviceid){
        for(var i=0;i<data.length;i++){
			var Message = data[i].split(":");
			if(Message.length > 1){
				console.log(Message);
				if(Message[0] === "Current Power"){
					$('#BatteryPowertwo').html(Message[1]+"%");
					if(Message[1]<=20){
						$('#battery-powertwo').html('<i class="fa fa-battery-empty info-box-icon-white"></i>');		
					}else if(Message[1]>20 && Message[1]<=40){
						$('#battery-powertwo').html('<i class="fa fa-battery-quarter info-box-icon-white"></i>');
					}else if(Message[1]>40 && Message[1]<=60){
						$('#battery-powertwo').html('<i class="fa fa-battery-half info-box-icon-white"></i>');
					}else if(Message[1]>20 && Message[1]<=80){
						$('#battery-powertwo').html('<i class="fa fa-battery-three-quarters info-box-icon-white"></i>');
					}else if(Message[1]>20 && Message[1]<=100){
						$('#battery-powertwo').html('<i class="fa fa-battery-full info-box-icon-white"></i>');
					}
					$('#battery-powertwo').append('<p class="info-box-icon-title">Batery</p>');
					
				}else if(Message[0] === "Battery level"){
					$('#BatteryLeveltwo').html(Message[1]);
				}else if(Message[0] === "Current Volt"){
				
				}else if(Message[0] === "Current Curuit"){
				
				}else if(Message[0] === "Current state"){
				
				}else if(Message[0] === "Charge mode"){
					$('#BatteryChargingtwo').html(Message[1]);
				}
			}
		}
    }
	UpdateDone(deviceid);
}

function SetPeripheralInfo(deviceid, data){
	if(selectedDeviceId === deviceid){
		var Lock = data.Lock;
		if(lock === 0){
			$("lock").bootstrapToggle('off');
		}else{
			$("lock']").bootstrapToggle('on');
		}
    }else if(selectedDeviceId === deivceid){
        var Lock = data.Lock;
		if(lock === 0){
			$("#locktwo").bootstrapToggle('off');
		}else{
			$("#locktwo").bootstrapToggle('on');
		}
    }
	UpdateDone();
}

function GetAllDevices(){
	var sub = "GetAllDevices"; var postdata = {submit: sub};
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	postdata = {
		company: company,
		name: name,
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(data === "DeviceNotFound"){
		}else{
			var DeviceDetails = [];
			for(var i=0;i<data.length;i++){
				DeviceDetails.push([data[i].DEVICEID,data[i].DEVICENAME,data[i].STATUS]);
			}
			GetDevicesId(DeviceDetails);
		}
	});
}


function PackagesNameReceived(){
	var options = {
	  valueNames: [ 'name', 'born', 'type' ]
	};

	var userList = new List('app', options);
	$('#appFilter').on('changed.bs.select', function (e) {
		var FilterList = $('#appFilter').val();
		userList.filter(function(item) {
			if(jQuery.isEmptyObject(FilterList)){
				return true;
			}else{
				for(var i=0;i<FilterList.length;i++){
					if(FilterList[i] === "system"){
						if (item.values().type === "System app ") {
						   return true;
						} else {
						   return false;
						}
					}else if(FilterList[i] === "Third-party"){
						if (item.values().type === "Third-party ") {
						   return true;
						} else {
						   return false;
						}
					}
					return false;
				}
			}
			
			
		});
	});
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('%');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function GetDevicesId(data){
    var txtdevice = ""; var txtOnline="";
    var txtOffline="";
    var getDevice = getUrlVars()["d"];
    var tmpCheck=false;
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === getDevice){
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
				tmpCheck = true;
				GetDeviceDetails(data[i][0]);
            }
            else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			txtdevice = '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>'+ txtdevice;
			
		}else{
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
            }
            else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			txtdevice = txtdevice+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
		}
	}
	txtOnline = '<optgroup label="Online" class="color-green" >'+ txtOnline +'</optgroup>';
	txtOffline =  '<optgroup label="Offline" class="color-red" disabled >'+ txtOffline +'</optgroup>';
	
    txtdevice = txtOnline + txtOffline;
    // console.log($("#devIdone"))
	$("#devIdone").html(txtdevice).selectpicker('refresh');
	$("#devIdone").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedD = $(this).find('option').eq(clickedIndex).text();
		GetDeviceDetails(ChangeNametoId(data, selectedD),"one");
	});
	if(tmpCheck)
        $('#devIdtwo').selectpicker('val', ChangeIdtoName(data, getDevice));
    $("#devIdtwo").html(txtdevice).selectpicker('refresh');
    $("#devIdtwo").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
        var selectedD = $(this).find('option').eq(clickedIndex).text();
        GetDeviceDetails(ChangeNametoId(data, selectedD),"two");
    });
    if(tmpCheck)
        $('#devIdtwo').selectpicker('val', ChangeIdtoName(data, getDevice));
}

function ChangeNametoId(data, name){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][1] === name){
			return data[i][0];
		}
	}
	return false;
}

function ChangeIdtoName(data, id){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === id){
			return data[i][1];
		}
	}
	return false;
}

// function SetAppList(AppName, AppPackageName, AppType){
// 	var AllBtn;
// 	if(AppType === "System app "){
// 		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true"></i>'+
// 						'<i value="'+AppPackageName+'" class="fa fa-unlock-alt fa-2x fa-btn AppDisable" aria-hidden="true"></i>';
// 	}else if(AppType === "Third-party "){
// 		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true"></i>'+
// 					'<i value="'+AppPackageName+'" class="fa fa-trash fa-2x fa-btn AppUninstall" aria-hidden="true"></i>'+
// 					'<i value="'+AppPackageName+'" class="fa fa-unlock-alt fa-2x fa-btn AppDisable" aria-hidden="true"></i>';
// 	}
// 	document.getElementById("AllPackage").innerHTML += 
// 		'<tr value="'+AppPackageName+'">'+
// 			'<td class="col-md-1 col-sm-3 col-xs-4">'+
// 				'<img src="assets/img/icon_apk.png" class="img-btn" align="left">'+
// 			'</td >'+
// 			'<td class="col-md-6 col-sm-9 col-xs-8">'+
// 				'<div class="media">'+
// 					'<div class="media-body">'+
						
// 						'<h4 class="title name">'+
// 							AppName+
// 						'</h4>'+
// 						'<div class="table-btn pull-right">'+
// 							AllBtn+
// 						'</div>'+
// 						'<p class="summary born">'+AppPackageName+'</p>'+
						
// 					'</div>'+
// 				'</div>'+
// 			'</td>'+
// 			'<td class="hide">'+
// 				'<p class="type">'+AppType+'</p>'+
// 			'</td >'+
// 		'</tr>';
		
// 	$(".AppLaunch").on("click", function(){
// 		var appid = $(this).parents('tr').attr('value');
// 		appid = appid.trim();
// 		//SendByGolang(selectedDeviceId+"/", GetCommand(75, "Comm")+"@%@"+GetCommand(75, "Path")+"@%@;;;"+GetCommand(75, "Param")+appid, GetCommand(75, "CommTitle"), appid, "user");	
// 		SendByGolang(selectedDeviceId+"/", GetCommand(10, "Comm")+"@%@"+appid, GetCommand(10, "CommTitle"), appid, "user");
		
// 	});
// 	$(".AppUninstall").on("click", function(){
// 		var appid = $(this).parents('tr').attr('value');
// 		appid = appid.trim();
// 		var tmp = $(this).parents('tr');
// 		var appname = $(this).parents('tr').find('.title').html();
// 		var Title = 'Uninstall App';
// 		var MsgBody = 'Are you sure you want to uninstall '+appname+"?";
// 		SetAlertMsgInnerHTML(Title, MsgBody);
// 		document.getElementById("AlertMsgBtn").style.display = "";
// 		document.getElementById("AlertMsgBtn").onclick = function(e) {
// 			SendByGolang(selectedDeviceId+"/", GetCommand(86, "Comm")+"@%@"+GetCommand(86, "Path")+"@%@;;;"+GetCommand(86, "Param")+appid, GetCommand(86, "CommTitle"), appid, "user");			
// 			$(tmp).addClass('hide'); 
// 		};
		
// 	});
// 	$(".AppDisable").on("click", function(){
// 		var appid = $(this,".AppDisable").attr('value');
// 		appid = appid.trim();
// 		SendByGolang(selectedDeviceId+"/", GetCommand(37, "Comm")+"@%@"+GetCommand(37, "Path")+"@%@;;;"+"add;;2:"+appid+":0", "Disable App", appid, "user");					
// 	});
// }

//Get Json command to myObj
//e.g. GetCommand(3,"CommTitle")
function GetCommand(number, title){
	var str = ""+number+""; 
	var dd = myObj[str];
	if(title === "CommTitle"){ 
		command = dd[0].CommTitle;
	}else if(title === "Enabled"){
		command = dd[1].Enabled;
	}else if(title === "Comm"){
		command = dd[2].Comm;
	}else if(title === "Param"){
		command = dd[3].Param;
	}else if(title === "Resultdelay"){
		command = dd[4].Resultdelay;
	}else if(title === "Path"){
		command = dd[5].Path;
	}else if(title === "Icon"){
		command = dd[6].Icon;
	}
	return command;
}
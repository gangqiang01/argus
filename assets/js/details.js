var tconfig;
var myObj = "";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","details.html"); 
	
	LoadJsonFile();
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
		SetHTML("barset_management");
		GetAllDevices();
		//$("#appFilter").html(filter).selectpicker('refresh');
		var filter = [];
	});
}

var selectedDeviceId;
var ReturnCount=0;

function GetRSSIInfo(deviceid){
var delay = function(r, s) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve([r, s]);
      }, s);
    });
  };

  delay('Run RSSI Wifi', 0).then(function(v) {
	SendByGolang(deviceid+"/", GetCommand(102, "Comm")+"@%@"+GetCommand(102, "Path")+"@%@;;;"+GetCommand(102, "Param"), GetCommand(102, "CommTitle"), "Wifi", "system");
    console.log(v[0], v[1]); // Display Run RSSI Wifi 0
    return delay('Run RSSI Bluetooth', 2000); // Delay 2 sec 
  }).then(function(v) {
	SendByGolang(deviceid+"/", GetCommand(103, "Comm")+"@%@"+GetCommand(103, "Path")+"@%@;;;"+GetCommand(103, "Param"), GetCommand(103, "CommTitle"), "Bluetooth", "system");
    console.log(v[0], v[1]); // Display Run RSSI Bluetooth 1000
    return delay('Run RSSI Mobile', 4000); // Delay 4 sec 
  }).then(function(v) {
	SendByGolang(deviceid+"/", GetCommand(104, "Comm")+"@%@"+GetCommand(104, "Path")+"@%@;;;"+GetCommand(104, "Param"), GetCommand(104, "CommTitle"), "Mobile", "system");
    console.log(v[0], v[1]); // Display Run RSSI Mobile 2000
  });


}

function GetDeviceDetails(deviceid){
	$('#refresh').html('<button class="btn btn-primary btn-refresh"><i class="fa fa-spinner fa-pulse fa-fw"></i> Refresh</button>')
	$('.btn-refresh').on("click", function(){
		$('.btn-refresh').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Refresh');
		pStatus = false;
		ReturnCount=0;
		ListCheck = 0; ListType = "";
		ThirdPartyList = [];
		document.getElementById("AllPackage").innerHTML = '';
		GetDeviceDetails(deviceid);
	});
	selectedDeviceId = deviceid;
	
	
	
	
	//Enable System Status Monitor
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", "1;;;2000;;;10;;;10", "system");	
	
	
	//Enable Battery Info
	SendByGolang(deviceid+"/", GetCommand(25, "Comm")+"@%@"+GetCommand(25, "Path"), GetCommand(25, "CommTitle"), "Battery Enable", "system");
	
	SendByGolang(deviceid+"/", GetCommand(25, "Comm")+"@%@"+GetCommand(25, "Path"), GetCommand(25, "CommTitle"), "Battery Enable", "system");
	//Get Peripheral Status
	if(localStorage.getItem("Company") !== "Guest"){
		SendByGolang(deviceid+"/", GetCommand(100, "Comm")+"@%@"+GetCommand(100, "Path"), GetCommand(100, "CommTitle"), "Peripheral status", "system");	
		GetRSSIInfo(deviceid);
		//SendByGolang(deviceid+"/", GetCommand(102, "Comm")+"@%@"+GetCommand(102, "Path")+"@%@;;;"+GetCommand(102, "Param"), GetCommand(102, "CommTitle"), "Wifi", "system");
		//SendByGolang(deviceid+"/", GetCommand(103, "Comm")+"@%@"+GetCommand(103, "Path")+"@%@;;;"+GetCommand(103, "Param"), GetCommand(103, "CommTitle"), "Bluetooth", "system");
		//SendByGolang(deviceid+"/", GetCommand(104, "Comm")+"@%@"+GetCommand(104, "Path")+"@%@;;;"+GetCommand(104, "Param"), GetCommand(104, "CommTitle"), "Mobile", "system");
	}
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
			document.getElementById('AgentVersion').innerHTML = data[0].AGENTVERSION;
			document.getElementById('DeviceModel').innerHTML = data[0].DEVICEMODEL;
		}
	});
	if(company === "Guest"){
		$("a[href='#device']").addClass( "hide" );
		SendByGolang(deviceid+"/", GetCommand(97, "Comm"), GetCommand(97, "CommTitle"), "", "system");	
	}else{
		SendByGolang(deviceid+"/", GetCommand(97, "Comm")+"@%@"+GetCommand(97, "Path")+"@%@;;;"+GetCommand(97, "Param"), GetCommand(97, "CommTitle"), "", "system");	
		
		
	}
	
	//check permission , if false,  disable function button
	if(!CheckUserPermission('peripheral')){
		$('.btnFunction').attr('disabled','');
		$('.toggle').on("click",function(){
			CheckUserPermission('peripheralFail');
		})
	}
	// device management
	
	$('.btnFunction').change(function() {
		if(pStatus){
			var type = $(this,'.btnFunction').attr('value');var numCommandEnable;var numCommandDisable;
			switch(type) {
				case "wifi":
					numCommandEnable = 56;numCommandDisable = 57;
					break;
				case "bluetooth":
					numCommandEnable = 54;numCommandDisable = 55;
					break;
				case "nfc":
					numCommandEnable = 83;numCommandDisable = 84;
					break;
				case "airplane":
					numCommandEnable = 44;numCommandDisable = 45;
					break;
				case "location":
					numCommandEnable = 69;numCommandDisable = 70;
					break;
				case "mobiledata":
					numCommandEnable = 87;numCommandDisable = 88;
					break;
				case "developer":
					numCommandEnable = 73;numCommandDisable = 74;
					break;
				case "unknownsource":
					numCommandEnable = 71;numCommandDisable = 72;
					break;
				default:
					break;
			}
			var checked;
			checked = $(this).prop('checked');
			if(checked){
				SendByGolang(selectedDeviceId+"/", GetCommand(numCommandEnable, "Comm")+"@%@"+GetCommand(numCommandEnable, "Path")+"@%@;;;"+GetCommand(numCommandEnable, "Param"), GetCommand(numCommandEnable, "CommTitle"), checked, "user");
			}else{
				SendByGolang(selectedDeviceId+"/", GetCommand(numCommandDisable, "Comm")+"@%@"+GetCommand(numCommandDisable, "Path")+"@%@;;;"+GetCommand(numCommandDisable, "Param"), GetCommand(numCommandDisable, "CommTitle"), checked, "user");
			}
		}
    })
}

function UpdateDone(){
	ReturnCount++;
	if(localStorage.getItem("Company") === "Guest"){
		if(ReturnCount >=2){
			$('.btn-refresh').html('<i class=" fa fa-refresh "></i> Refresh');
			ReturnCount = 0;
			$('#UpdateTime').html(DateToTime(new Date()));
		}
	}else{
		if(ReturnCount >=3){
			$('.btn-refresh').html('<i class=" fa fa-refresh "></i> Refresh');
			ReturnCount = 0;
			$('#UpdateTime').html(DateToTime(new Date()));
		}
	}
	
}

function StopSystemRequire(deviceid){
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;requireStopAPP;;;1;;;2000;;;10", GetCommand(27, "CommTitle"), "Stop", "system");	
}

function SetDeviceInfo(deviceid,type, data){
	console.log(data);
	if(selectedDeviceId === deviceid){
		if(type === "SysAlarm"){
			$('#CPUUsage').html(data.CPU_Usage);
			$('#Temperature').html(data.Current_Temperature+"°c");
			$('#RAMTotal').html(data.RAM_Total);
			$('#RAMAvailable').html(data.RAM_Available);
			$('#ROMTotal').html(data.ROM_Total);
			$('#ROMAvailable').html(data.ROM_Available);
		}else if(type === "wifi"){
			var WifiInfo = data.WiFi;
			$('#WifiSSID').html(WifiInfo.SSID);
			$('#WifiRSSI').html(WifiInfo.RSSI);
			$('#WifiIP').html(WifiInfo.IP);
			$('#WifiMAC').html(WifiInfo.MAC);
		}else if(type === "bluetooth"){
			var BTInfo = data.Bluetooth;
			$('#BTName').html(BTInfo.Name);
			$('#BTRSSI').html(BTInfo.RSSI);
			$('#BTMAC').html(BTInfo.MAC);
		}
	}
	UpdateDone();
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
	}
	UpdateDone();
}
var pStatus = false;
function SetPeripheralInfo(deviceid, data){
	pStatus = false
	if(selectedDeviceId === deviceid){
		var Wifi = data.WiFi;var BT = data.BT;
		var NFC = data.NFC;var Airplane = data["Airplane mode"];
		var Location = data.Location;var Mobile = data["Mobile data"];
		var Developer = data["Developer options"];var Unknown = data["Unknown source"];
		if(Wifi === 0){
			$("input[value='wifi']").bootstrapToggle('off');
		}else{
			$("input[value='wifi']").bootstrapToggle('on');
		}
		if(BT === 0){
			$("input[value='bluetooth']").bootstrapToggle('off');
		}else{
			$("input[value='bluetooth']").bootstrapToggle('on');
		}
		if(NFC === 0){
			$("input[value='nfc']").bootstrapToggle('off');
		}else{
			$("input[value='nfc']").bootstrapToggle('on');
		}
		if(Airplane === 0){
			$("input[value='airplane']").bootstrapToggle('off');
		}else{
			$("input[value='airplane']").bootstrapToggle('on');
		}
		if(Location === 0){
			$("input[value='location']").bootstrapToggle('off');
		}else{
			$("input[value='location']").bootstrapToggle('on');
		}
		if(Mobile === 0){
			$("input[value='mobiledata']").bootstrapToggle('off');
		}else{
			$("input[value='mobiledata']").bootstrapToggle('on');
		}
		if(Developer === 0){
			$("input[value='developer']").bootstrapToggle('off');
		}else{
			$("input[value='developer']").bootstrapToggle('on');
		}
		if(Unknown === 0){
			$("input[value='unknownsource']").bootstrapToggle('off');
		}else{
			$("input[value='unknownsource']").bootstrapToggle('on');
		}
	}
	pStatus = true;
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
						if (item.values().type === "System app") {
						   return true;
						} else {
						   return false;
						}
					}else if(FilterList[i] === "Third-party"){
						if (item.values().type === "Third-party") {
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
	
	if(localStorage.getItem("Company") !== "Guest"){
		//Get prohibit launch list
		SendByGolang(selectedDeviceId+"/", GetCommand(93, "Comm")+"@%@"+GetCommand(93, "Path")+"@%@;;;"+GetCommand(93, "Param"), GetCommand(93, "CommTitle"), "prohibit list", "system");
		setTimeout('SendByGolang(selectedDeviceId+"/", GetCommand(94, "Comm")+"@%@"+GetCommand(94, "Path")+"@%@;;;"+GetCommand(94, "Param"), GetCommand(94, "CommTitle"), "allow list", "system");',1000);
		//Get allow launch list
			
		
	}
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
	var txtdevice = ""; var txtOnline="";var txtOffline="";
	var getDevice = getUrlVars()["d"];var tmpCheck=false;
	console.log(data);
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === getDevice){
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
				tmpCheck = true;
				GetDeviceDetails(data[i][0]);
			}else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			//txtdevice = '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>'+ txtdevice;
			
		}else{
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			//txtdevice = txtdevice+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
		}
	}
	txtOnline = '<optgroup label="Online" class="color-green" >'+ txtOnline +'</optgroup>';
	txtOffline = '<optgroup label="Offline" class="color-red" disabled>'+ txtOffline +'</optgroup>';	
	
	txtdevice = txtOnline + txtOffline;
	$("#devId").html(txtdevice).selectpicker('refresh');
	$("#devId").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedD = $(this).find('option').eq(clickedIndex).attr('data-subtext');
		console.log($(this).find('option').eq(clickedIndex));
		var x =  $(this).find('option').eq(clickedIndex).attr('data-subtext');
		console.log(x);
		console.log(selectedD);
		document.getElementById("AllPackage").innerHTML = '';
		pStatus = false;
		ListCheck = 0; ListType = "";
		ReturnCount=0;
		ThirdPartyList = [];
		GetDeviceDetails(selectedD);
	});
	if(tmpCheck)
		$('#devId').selectpicker('val', ChangeIdtoName(data, getDevice));
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

var ThirdPartyList = [];
function SetLaunchBlackWhiteList(deviceid, type, list){
	if(deviceid === selectedDeviceId){
		var BlackWhiteList = list.split("||");
		
		if(type === "getProhibitLaunchList"){
			for(var i=0;i<BlackWhiteList.length-1;i++){
				var type = $("tr[value='"+BlackWhiteList[i]+"']").find("p[class='type']").html();
				if(type === "Third-party"){
					if(BlackWhiteList[i] !== "other"){
						for(var j=0;j<ThirdPartyList.length;j++){
							if(ThirdPartyList[j][0] === BlackWhiteList[i])
								ThirdPartyList[j][1] = false;
						}
						//$("tr[value='"+BlackWhiteList[i]+"']").find(".btn-list").append('<i value="'+BlackWhiteList[i]+'" class="fa fa-unlock-alt fa-2x fa-btn AppEnable" aria-hidden="true"></i>');
					}
				}
				if(BlackWhiteList[i] === "other"){
					//Set white list
					ListType = 'white';
				}
			}
			ListCheck++;
			if(ListCheck > 1){
				SetBlackWhiteOther();
			}
		}else if(type === "getAllowLaunchList"){
			for(var i=0;i<BlackWhiteList.length-1;i++){
				var type = $("tr[value='"+BlackWhiteList[i]+"']").find("p[class='type']").html();
				if(type === "Third-party"){
					if(BlackWhiteList[i] !== "other"){
						for(var j=0;j<ThirdPartyList.length;j++){
							if(ThirdPartyList[j][0] === BlackWhiteList[i])
								ThirdPartyList[j][1] = true;
						}
						//ThirdPartyList.push([BlackWhiteList[i], true]);
						//$("tr[value='"+BlackWhiteList[i]+"']").find(".btn-list").append('<i value="'+BlackWhiteList[i]+'" class="fa fa-lock fa-2x fa-btn AppDisable" aria-hidden="true"></i>');					
					}
				}
				if(BlackWhiteList[i] === "other"){
					//Set black list
					ListType = 'black';
				}
			}
			ListCheck++;
			if(ListCheck > 1){
				SetBlackWhiteOther();
			}
		}
		
		
	}
}

var ListCheck = 0; var ListType = "";
function SetBlackWhiteOther(){
	console.log(ThirdPartyList);
	console.log(ListCheck);
	if(ListType === 'white'){	//other app will launch disable
		for(var i=0;i<ThirdPartyList.length;i++){
			if(ThirdPartyList[i][1] === ""){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-unlock fa-2x fa-btn AppDisable" data-toggle="tooltip" data-placement="bottom" title="Enable app"></i>');
			}else if(ThirdPartyList[i][1] === true){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-ban fa-2x fa-btn AppEnable" data-toggle="tooltip" data-placement="bottom" title="Disable app"></i>');
			}else if(ThirdPartyList[i][1] === false){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-unlock fa-2x fa-btn AppDisable" data-toggle="tooltip" data-placement="bottom" title="Enable app"></i>');
			}
		}
	}else if(ListType === 'black'){		//other app will launch enable
		for(var i=0;i<ThirdPartyList.length;i++){
			if(ThirdPartyList[i][1] === ""){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-ban fa-2x fa-btn AppEnable" data-toggle="tooltip" data-placement="bottom" title="Disable app"></i>');
			}else if(ThirdPartyList[i][1] === true){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-ban fa-2x fa-btn AppEnable" data-toggle="tooltip" data-placement="bottom" title="Disable app"></i>');
			}else if(ThirdPartyList[i][1] === false){
				$("tr[value='"+ThirdPartyList[i][0]+"']").find(".btn-list").append('<i value="'+ThirdPartyList[i][0]+'" class="fa fa-unlock fa-2x fa-btn AppDisable" data-toggle="tooltip" data-placement="bottom" title="Enable app"></i>');
			}
		}
	}
	$(".AppDisable").on("click", function(){
		if(CheckUserPermission(37)){
			var appid = $(this,".AppDisable").attr('value');
			SetBlackWhiteLaunchStatus(appid, 'enable');
		}
		
	});
	$(".AppEnable").on("click", function(){
		if(CheckUserPermission(37)){
			var appid = $(this,".AppDisable").attr('value');
			SetBlackWhiteLaunchStatus(appid, 'disable');
		}
	});
}

function SetBlackWhiteLaunchStatus(appid, status){
	if(status === "disable"){
		SendByGolang(selectedDeviceId+"/", GetCommand(37, "Comm")+"@%@"+GetCommand(37, "Path")+"@%@;;;"+"add;;2:"+appid+":0", "Disable App", appid, "user");
		$("tr[value='"+appid+"']").find('.AppEnable').removeClass('fa-ban');
		$("tr[value='"+appid+"']").find('.AppEnable').addClass('fa-unlock');
		$("tr[value='"+appid+"']").find('.AppEnable').addClass('AppDisable');
		$("tr[value='"+appid+"']").find('.AppEnable').attr('title', 'Enable app');
		$("tr[value='"+appid+"']").find('.AppEnable').removeClass('AppEnable');
		$("tr[value='"+appid+"']").find('.AppDisable').on("click", function(){
			SetBlackWhiteLaunchStatus(appid, 'enable');
			console.log(appid+": enable");
		});
	}else if(status === "enable"){
		SendByGolang(selectedDeviceId+"/", GetCommand(37, "Comm")+"@%@"+GetCommand(37, "Path")+"@%@;;;"+"add;;2:"+appid+":1", "Enable App", appid, "user");
		$("tr[value='"+appid+"']").find('.AppDisable').addClass('fa-ban');
		$("tr[value='"+appid+"']").find('.AppDisable').addClass('AppEnable');
		$("tr[value='"+appid+"']").find('.AppDisable').removeClass('fa-unlock');
		$("tr[value='"+appid+"']").find('.AppDisable').attr('title', 'Disable app');
		$("tr[value='"+appid+"']").find('.AppDisable').removeClass('AppDisable');
		$("tr[value='"+appid+"']").find('.AppEnable').on("click", function(){
			SetBlackWhiteLaunchStatus(appid, 'disable');
			console.log(appid+": disable");
		});
	}
}

function SetAppList(AppName, AppPackageName, AppType){
	var AllBtn;
	AppType = AppType.trim();
	AppPackageName = AppPackageName.trim();
	if(AppType === "System app"){
		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Launch app"></i>';
	}else if(AppType === "Third-party"){
		ThirdPartyList.push([AppPackageName, ""])
		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Launch app"></i>'+
					'<i value="'+AppPackageName+'" class="fa fa-trash fa-2x fa-btn AppUninstall" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Uninstall app"></i>';
	}
	document.getElementById("AllPackage").innerHTML += 
		'<tr value="'+AppPackageName+'">'+
			'<td class="col-md-1 col-sm-3 col-xs-4">'+
				'<img src="assets/img/icon_apk.png" class="img-btn" align="left">'+
			'</td >'+
			'<td class="col-md-6 col-sm-9 col-xs-8">'+
				'<div class="media">'+
					'<div class="media-body">'+
						
						'<h4 class="title name">'+
							AppName+
						'</h4>'+
						'<div class="table-btn pull-right btn-list">'+
							AllBtn+
						'</div>'+
						'<p class="summary born">'+AppPackageName+'</p>'+
						
					'</div>'+
				'</div>'+
			'</td>'+
			'<td class="hide">'+
				'<p class="type">'+AppType+'</p>'+
			'</td >'+
		'</tr>';
		
	$(".AppLaunch").on("click", function(){
		if(CheckUserPermission(10)){
			var appid = $(this).parents('tr').attr('value');
			appid = appid.trim();
			//SendByGolang(selectedDeviceId+"/", GetCommand(75, "Comm")+"@%@"+GetCommand(75, "Path")+"@%@;;;"+GetCommand(75, "Param")+appid, GetCommand(75, "CommTitle"), appid, "user");	
			SendByGolang(selectedDeviceId+"/", GetCommand(10, "Comm")+"@%@"+appid, GetCommand(10, "CommTitle"), appid, "user");
		}	
	});
	$(".AppUninstall").on("click", function(){
		if(CheckUserPermission(86)){
			var appid = $(this).parents('tr').attr('value');
			appid = appid.trim();
			var tmp = $(this).parents('tr');
			var appname = $(this).parents('tr').find('.title').html();
			var Title = 'Uninstall App';
			var MsgBody = 'Are you sure you want to uninstall '+appname+"?";
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				SendByGolang(selectedDeviceId+"/", GetCommand(86, "Comm")+"@%@"+GetCommand(86, "Path")+"@%@;;;"+GetCommand(86, "Param")+appid, GetCommand(86, "CommTitle"), appid, "user");			
				$(tmp).addClass('hide'); 
			};
		}
	});
	
}

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
var tconfig;
var myObj = "";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","wificontrol.html"); 
	
    LoadJsonFile();
    
    $("#ssienableone").change(function(){
        var checked = $(this).prop('checked');
        var SSIDName = $("#wifiblockone").val().trim();
        if(checked){
            SendByGolang(selectedDeviceId+"/", GetCommand(29, "Comm")+"@%@"+GetCommand(29, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':1', GetCommand(29, "CommTitle"), "Allow", "user");
        }else{
            var msg = "Make sure this SSID is added to the blacklist?"
            if(confirm(msg)){
                 SendByGolang(selectedDeviceId+"/", GetCommand(30, "Comm")+"@%@"+GetCommand(30, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':0', GetCommand(30, "CommTitle"), "Deny", "user");
            }else{
                 $("#ssienableone").bootstrapToggle('on');
            }
        }
    })

    $("#ssienabletwo").change(function(){
        var checked = $(this).prop('checked');
        var SSIDName = $("#wifiblocktwo").val().trim();
        if(checked){
            SendByGolang(selectedDeviceIdtwo+"/", GetCommand(29, "Comm")+"@%@"+GetCommand(29, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':1', GetCommand(29, "CommTitle"), "Allow", "user");
        }else{   
            var msg = "Make sure this SSID is added to the blacklist?"
            if(confirm(msg)){
                SendByGolang(selectedDeviceIdtwo+"/", GetCommand(30, "Comm")+"@%@"+GetCommand(30, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':0', GetCommand(30, "CommTitle"), "Deny", "user");
            }else{
                 $("#ssienabletwo").bootstrapToggle('on');
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
var selectedDeviceIdtwo;
var ReturnCount = 0;
var AllOptions = "";
function GetDeviceDetails(deviceid,cid){
    if(cid == "one"){
        selectedDeviceIdtwo = null;
        selectedDeviceId = deviceid;
    }else if(cid == "two"){
        selectedDeviceId = null;
        selectedDeviceIdtwo = deviceid;
    }	
    SendByGolang(deviceid+"/", GetCommand(102, "Comm")+"@%@"+GetCommand(102, "Path")+"@%@;;;"+GetCommand(102, "Param"), GetCommand(102, "CommTitle"), "Wifi", "system");
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

function SetDeviceInfo(deviceid, type,data){
	if(selectedDeviceId === deviceid){
        $("#ssidone").val(data.WiFi.SSID)
		$('#rssione').val(data.WiFi.RSSI);
		$('#ipone').val(data.WiFi.IP);
		$('#macone').val(data.WiFi.MAC);
	}else if(selectedDeviceIdtwo === deviceid){
        $("#ssidtwo").val(data.WiFi.SSID)
		$('#rssitwo').val(data.WiFi.RSSI);
		$('#iptwo').val(data.WiFi.IP);
		$('#mactwo').val(data.WiFi.MAC);;
    }
	UpdateDone(deviceid);
}

function emptyApplist(deviceid){
    if(deviceid == selectedDeviceId){
        document.getElementById("appinstalledone").options.length = 0;
        document.getElementById("lanunchone").options.length = 0;
    }else if(deviceid == selectedDeviceIdtwo){
        document.getElementById("appinstalledtwo").options.length = 0;
        document.getElementById("lanunchtwo").options.length = 0;
    }
}	
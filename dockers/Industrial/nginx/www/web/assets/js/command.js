		
function SetCommandItem(sub,purpose) {
	var Title = ""+GetCommand(sub, "CommTitle")+":";
	var CommandTitltName = GetCommand(sub, "CommTitle");
	var AllDevicesID = "";
	if (CheckUserPermission(sub)){
		switch (sub) {
			case 1:
				var MsgBody = 'Do you want to get all your devices?';
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}	
					if(purpose === "device-management"){
						
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "", "user");
						
							
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
				};
				break;
			case 2:
				var MsgBody = 'Please Set Volume :<br>'+'<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="255" data-slider-step="1" data-slider-value="0" style="display:none"/>';
				SetAlertMsgInnerHTML(Title, MsgBody);
				SliderShow();
				
				document.getElementById("ex1Slider").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
						
					var value = document.getElementById("ex1").value;
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i]+"/"; 
					}	
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user");
						//NewSendByGolang(AllDevicesID, GetCommand(sub, "Comm"), "", value, GetCommand(sub, "CommTitle"), value, "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				};
				break;
			case 3:
				
				var MsgBody= "Do you want to set volume to minimum? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;0", GetCommand(sub, "CommTitle"), "0", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;0", GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 4:
				var MsgBody= "Do you want to get coordinates? ";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
				document.getElementById("AlertMsgFooter").innerHTML = '<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
					var items = GetDeviceTag();
					var device = "";
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							for (var i = 0; i < items.length; i++) {
								device += items[i] + "###";
							}
							window.location.href = "googlemap3.html?devices%"+device+"&";
						}
						
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
				}
				break;
			case 5:
				var MsgBody= "";
				SetAlertMsgInnerHTML(Title, MsgBody);
				
				document.getElementById("AlertMsgTools").style.display = "";
				document.getElementById("EnterPassword").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var value = document.getElementById("password").value;
					var items = GetDeviceTag();
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 6:
				var MsgBody= "Do you want to reset your device?";	
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "factory reset", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "reset", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 7:
				//var MsgBody= '<form id="DownloadType"><label style="margin-right:5px;"><input onclick="selectDownloadType()" name="platform" type="radio" value="GoogleDrive" checked>GoogleDrive</label><label><input onclick="selectDownloadType()" name="platform" type="radio" value="URL">URL</label></form>Select file from Google drive, and download to your cellphone. <div class="fatooltip" style="color:red;">*<span class="falargetooltiptext">In order to make sure file can be downloaded,  please click <i class="fa fa-link" aria-hidden="true"></i> when uploading or downloading.</span></div><br>';		
				//MsgBody += '<div class="btn-group"><button class="btn btn-black" onclick="initPicker();" data-dismiss="modal"><img style="padding-right:3px;"height="20" weight="20" src="https://avatars3.githubusercontent.com/u/3708359?v=4&s=200">Google Drive</button></button><button type="button"  class="btn btn-black dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul id="GoogledriveSelect" class="dropdown-menu"></ul></div><br>';							
				
				
				var MsgBody = 'Enter your download URL and file name<br><input id="download_url" class="form-control" type="url" placeholder="download url"><input id="download_filename" class="form-control" type="text" placeholder="file name(e.g. example.png)">';
				SetAlertMsgInnerHTML(Title, MsgBody);	
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = GetDeviceTag();
				
				//var value = document.getElementById("DownloadURL").value;
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}		
					
								console.log("url");
								var url = document.getElementById("download_url").value;
								var filename = document.getElementById("download_filename").value;
								if(purpose === "device-management"){
									SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+url+";;;"+filename, GetCommand(sub, "CommTitle"), "", "user");	
								}else if(purpose === "schedule"){
									CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+url+";;;"+filename, GetCommand(sub, "CommTitle"), "url:"+url+"<br>File name:"+filename, "user", true]);
									SetCommandAction(GetCommand(sub, "CommTitle"));
								}
					
					
				}
				break;
			case 8:
				var MsgBody= ' Please enter Apk information<br>Dowload path: <input id="DownloadPath" class="form-control" type="text" placeholder="e.g. https://inventeccorp-my.sharepoint.com/personal/chen_jimmyhy_inventec_com/Documents/evie-launcher-2-7-7-10.apk?csf=1&e=14dd76806f2348709ed78e4f8ac84896">'+
								'<br>Download file name: <input id="DownloadFileName" class="form-control" type="text" placeholder="e.g. example.apk">';
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var DownloadPath = $('#DownloadPath').val();
					var DownloadFileName = $('#DownloadFileName').val();
					if(DownloadPath === "" || DownloadFileName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter apk information.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+DownloadPath+";;;"+DownloadFileName, GetCommand(sub, "CommTitle"), DownloadFileName, "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 9:
				var MsgBody= ' Please enter app package name<br>Package name: <input id="PackageName" class="form-control" type="text">';
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var PackageName = $('#PackageName').val();
					if(PackageName === "" ){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter package name.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@;;;"+PackageName, GetCommand(sub, "CommTitle"), PackageName, "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@;;;"+PackageName, GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 11:
				var MsgBody= 'Please change APN by setting following value.<span style="color:red;">*</span>=required field';
			 
				MsgBody += '<form role="form" id="APN-form" method="post">'+
					'<div class="form-group" >'+
						'<label>APN name<font color="red">*</font></label>'+
						'<input class="form-control" type="text" id="APNName" required=""/>'+
							
					'</div>'+
					'<div class="form-group">'+
						'<label>setapn<font color="red">*</font></label>'+
						'<input class="form-control" type="text" id="SetAPN" required=""/>'+
						
					'</div>'+
					'<div class="form-group">'+
						'<label>APN Proxy</label>'+
						'<input class="form-control" type="text" id="APNProxy"/>'+
					'</div>'+
					'<div class="form-group">'+
						'<label>APN Port</label>'+
						'<input class="form-control" type="text" id="APNPort"/>'+
					'</div>'+
					'<div class="form-group">'+
						'<label>APN user</label>'+
						'<input class="form-control" type="text" id="APNUser"/>'+
					'</div>'+
					'<div class="form-group">'+
						'<label>APN Password</label>'+
						'<input class="form-control" type="text" id="APNPassword"/>'+
					'</div>'+
					'<div class="form-group">'+
						'<label>APN MCC<font color="red">*</font></label>'+
						'<input class="form-control" type="text" id="APNMCC" required=""/>'+
					'</div>'+
					'<div class="form-group">'+
						'<label>APN MNC<font color="red">*</font></label>'+
						'<input class="form-control" type="text" id="APNMNC" required=""/>'+
					'</div>'+
					'<div class="text-right">'+
						'<button type="submit" class="btn btn-info">Send</button>'+
					'</div>'+
				'</form>';
				SetAlertMsgInnerHTML(Title, MsgBody);
				//document.getElementById('AlertMsgFooter').style.display = "none";
				document.getElementById("APN-form").onsubmit = function() {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					var APNName = document.getElementById("APNName").value;
					var SetAPN = document.getElementById("SetAPN").value;
					var APNProxy=" ", APNPort=" ", APNUser=" ", APNPassword=" ", APNMCC=" ", APNMNC=" ";
					var APNMCC = document.getElementById("APNMCC").value;
					var APNMNC = document.getElementById("APNMNC").value;
					if(document.getElementById('APNProxy').value !== "")
						APNProxy = document.getElementById("APNProxy").value;
					if(document.getElementById('APNPort').value !== "")
						APNPort = document.getElementById("APNPort").value;
					if(document.getElementById('APNUser').value !== "")
						APNUser = document.getElementById("APNUser").value;
					if(document.getElementById('APNPassword').value !== "")
						APNPassword = document.getElementById("APNPassword").value;
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;setting;;"+APNName+";;"+SetAPN+";;"+APNProxy+";;"+APNPort+";;"+APNUser+";;"+APNPassword+";;"+APNMCC+";;"+APNMNC, GetCommand(sub, "CommTitle"), APNMNC, "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), PropertyName, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
				};
				
				break;
			case 12:
				var MsgBody= 'Do you want to get APN? <br><div id="GetAPN"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				
				break;
			case 13:
				var MsgBody= 'Do you want to get system version? <br><div id="GetDeviceVersion" value=0></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "0", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 14:
				var MsgBody= "Do you want to Enable location Monitor? ";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
				document.getElementById("AlertMsgFooter").innerHTML = '<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
					
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 15:
				var MsgBody= 'Please add Restrict Area? <br> <label for="inputAddress2">Restrict area</label>'+
								'<input type="text" class="form-control" id="inputAddress2" placeholder="Country, city, or floor">';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					
					var items = GetDeviceTag();
					var address = $('#inputAddress2').val();
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+"addLimitArray:"+address, GetCommand(sub, "CommTitle"), address, "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+"addLimitArray:"+address, GetCommand(sub, "CommTitle"), address, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 16:
				var MsgBody= 'Please delete Restrict Area? <br> <label for="inputAddress2">Restrict area</label>'+
								'<input type="text" class="form-control" id="inputAddress2" placeholder="Country, city, or floor">';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					
					var items = GetDeviceTag();
					var address = $('#inputAddress2').val();
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+"delLimitArray:"+address, GetCommand(sub, "CommTitle"), address, "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+"delLimitArray:"+address, GetCommand(sub, "CommTitle"), address, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 17:
				var MsgBody= "Do you want to Disable location Monitor? ";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
				}
				break;
			case 18:
				var MsgBody= "Do you want to get restrict area? <br><div id='GetLimitList'></div>";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "get", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "get", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
				}
				break;
			case 19:
				var MsgBody= "Please select Time Zone? <br>";		
				MsgBody+= '<select id="TimeZone" class="form-control"></select>';
				
				SetAlertMsgInnerHTML(Title, MsgBody);
				var buildings = [];
				buildings = ['Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Tijuana', 'America/Phoenix', 'America/Chihuahua', 'America/Denver', 'America/Costa_Rica', 'America/Chicago', 'America/Mexico_City', 'America/Regina', 'America/Bogota', 'America/New_York', 'America/Caracas', 'America/Barbados', 'America/Halifax', 'America/Manaus', 'America/Santiago', 'America/St_Johns', 'America/Recife', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Godthab', 'America/Montevideo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Africa/Casablanca', 'Europe/London', 'Europe/Amsterdam', 'Europe/Belgrade', 'Europe/Brussels', 'Europe/Madrid', 'Europe/Sarajevo', 'Africa/Windhoek', 'Africa/Brazzaville', 'Asia/Amman', 'Europe/Athens', 'Europe/Istanbul', 'Asia/Beirut', 'Africa/Cairo', 'Europe/Helsinki', 'Asia/Jerusalem', 'Europe/Minsk', 'Africa/Harare', 'Asia/Baghdad', 'Europe/Moscow', 'Asia/Kuwait', 'Africa/Nairobi', 'Asia/Tehran', 'Asia/Baku', 'Asia/Tbilisi', 'Asia/Yerevan', 'Asia/Dubai', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Oral', 'Asia/Yekaterinburg', 'Asia/Calcutta', 'Asia/Colombo', 'Asia/Katmandu', 'Asia/Almaty', 'Asia/Rangoon', 'Asia/Krasnoyarsk', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Irkutsk', 'Asia/Kuala_Lumpur', 'Australia/Perth', 'Asia/Taipei', 'Asia/Seoul', 'Asia/Tokyo', 'Asia/Yakutsk', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Brisbane', 'Australia/Hobart', 'Australia/Sydney', 'Asia/Vladivostok', 'Pacific/Guam', 'Asia/Magadan', 'Pacific/Noumea', 'Pacific/Majuro', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Tongatapu'];
				$.each(buildings, function (index, value) {
					$('#TimeZone').append($('<option/>', { 
						value: value,
						text : value 
					}));
				});  
		
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var timezone = $( "#TimeZone" ).val();
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetZone;;"+timezone, GetCommand(sub, "CommTitle"), timezone, "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetZone;;"+timezone, GetCommand(sub, "CommTitle"), timezone, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 20:
				var MsgBody= "Please select Time? <br>";		
				
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgTools").style.display = "";
				document.getElementById("timepicker").style.display = "";
				
				
		
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
					angular.module('ui.bootstrap.demo').controller('TimepickerDemoCtrl', function ($scope, $log) {
						console.log($scope.dt);
						console.log($scope.mytime);
					});
					var dt = angular.element('[ng-controller=TimepickerDemoCtrl]').scope().dt;
					var mytime = angular.element('[ng-controller=TimepickerDemoCtrl]').scope().mytime;
					var year = dt.getFullYear();
					var month = dt.getMonth()+1;
					var day = dt.getDate();
					var hour = mytime.getHours();
					var minute = mytime.getMinutes();
					var second = mytime.getSeconds();
					//SetData;;2017/1/10;;SetTime;;12:59:33
					var SetData = "SetData;;"+year+"/"+month+"/"+day+";;SetTime;;"+hour+":"+minute+":"+second;
					var time = year+"/"+month+"/"+day+"  "+hour+":"+minute+":"+second;
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+SetData, GetCommand(sub, "CommTitle"), time, "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+SetData, GetCommand(sub, "CommTitle"), time, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					document.getElementById("AlertMsgTools").style.display = "none";
					document.getElementById("timepicker").style.display = "none";
				}
				break;
			case 22:
				var MsgBody = 'Please Set brightness :<br>'+'<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="255" data-slider-step="1" data-slider-value="0" style="display:none"/>';
				SetAlertMsgInnerHTML(Title, MsgBody);
				SliderShow();
				document.getElementById("ex1Slider").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					var value = document.getElementById("ex1").value;
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user");				
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				};
				break;
			case 21:
				var MsgBody= "Do you want to unlock the device?";
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;reset", GetCommand(sub, "CommTitle"), "reset", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;reset", GetCommand(sub, "CommTitle"), "reset", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				}
				break;
			case 23:
				var MsgBody= 'Do you want to start flight mode test? <br><div id="FlightModeTest"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					$('#FlightModeTest').html('<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i> wait about thirty sec');
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "test", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "test", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 24:
				var MsgBody= 'Do you want to start silent test? <br><div id="SlientTest"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "test", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "CommTitle"), "test", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 27:
				var MsgBody= "Do you want to view device information? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 28:
				var MsgBody= "Do you want to disable system status monitor? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 29:
				var MsgBody= 'Please input Wifi SSID.<br>SSID: <input id="SSIDName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var SSIDName = $('#SSIDName').val();
					if(SSIDName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter wifi ssid.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':1', GetCommand(sub, "CommTitle"), "Allow", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':1', GetCommand(sub, "CommTitle"), "Allow", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 30:
				var MsgBody= 'Please input Wifi SSID.<br>SSID: <input id="SSIDName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var SSIDName = $('#SSIDName').val();
					if(SSIDName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter wifi ssid.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':0', GetCommand(sub, "CommTitle"), "Deny", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;4:'+SSIDName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 31:
				var MsgBody= 'Please input BT Name or MAC Address.<br>MAC Address:AA-BB-CC-DD-EE-FF <input id="MACName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var MACName = $('#MACName').val();
					if(MACName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter BT Name or MAC address.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;5:'+MACName+':1', GetCommand(sub, "CommTitle"), "Allow", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;5:'+MACName+':1', GetCommand(sub, "CommTitle"), "Allow", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 32:
				var MsgBody= 'Please input BT Name or MAC Address.<br>MAC Address:AA-BB-CC-DD-EE-FF <input id="MACName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var MACName = $('#MACName').val();
					if(MACName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter BT Name or MAC address.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;5:'+MACName+':0', GetCommand(sub, "CommTitle"), "Deny", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;5:'+MACName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 37:
				var MsgBody= ' Please enter app package name.<br>Package name: <input id="PackageName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var PackageName = $('#PackageName').val();
					if(PackageName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter package name.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':1', GetCommand(sub, "CommTitle"), "Allow", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':1', GetCommand(sub, "CommTitle"), "Allow", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 38:
				var MsgBody= ' Please enter app package name.<br>Package name: <input id="PackageName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var PackageName = $('#PackageName').val();
					if(PackageName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter package name.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 39:
				var MsgBody= ' Please enter app package name.<br>Package name: <input id="PackageName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var PackageName = $('#PackageName').val();
					if(PackageName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter package name.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;1:'+PackageName+':1', GetCommand(sub, "CommTitle"), "Allow", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;1:'+PackageName+':1', GetCommand(sub, "CommTitle"), "Allow", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 40:
				var MsgBody= ' Please enter app package name.<br>Package name: <input id="PackageName" class="form-control" type="text">';			
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var PackageName = $('#PackageName').val();
					if(PackageName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter package name.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;1:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;1:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 41:
				var MsgBody= "Do you want to get IMEI? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "CommTitle"), "", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 42:
				var MsgBody= "Do you want to shutdown device? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 43:
				var MsgBody= "Do you want to reboot device? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 44:
				var MsgBody= "Do you want to enable flight mode? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 45:
				var MsgBody= "Do you want to disable flight mode? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 46:
				var MsgBody= "Do you enable device admin? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 47:
				var MsgBody= "Do you disable device admin? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 48:
				var MsgBody= "Do you enable adb? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 49:
				var MsgBody= "Do you disable adb? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 50:
				var MsgBody= "Do you want to hide widget page? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");					
							SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 51:
				var MsgBody= "Do you want to display widget page? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");					
							SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 52:
				document.getElementById("AlertMsgEvent").style.display = "none";
				var MsgBody = 'Please Set Device name :<br>';		
				var DeviceID=[];var strDevice = "";
				var table = $('#dataTables-example').DataTable();
				document.getElementById("AlertMsgBtn").style.display = "";
				for (var i = 0; i < table.rows('.selected').data().length; i++) {
					DeviceID.push( table.rows('.selected').data()[i][1]);
					MsgBody += '<p>'+DeviceID[i]+'  :   <input type="text" class="pull-right"style="margin-right: 100px;" id="DeviceName'+i+'"></p>';
					strDevice+=DeviceID[i]+"/";
				}
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					for (var i = 0; i < table.rows('.selected').data().length; i++) {
						var device = "DeviceName"+i;
						var devicenvalue = document.getElementById(device).value
						if(localStorage.getItem("Company") === "Guest"){
							SetDeviceName(DeviceID[i], devicenvalue);
						}else{
							SendByGolang(DeviceID[i]+"/", GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param")+devicenvalue, GetCommand(sub, "CommTitle"), devicenvalue, "user");		
							SetDeviceName(DeviceID[i], devicenvalue);
						
							
						}
					}
								
				}
				break;
			case 53:
				var MsgBody = 'Send Message :<br>';		
				var DeviceID=[];
				MsgBody += '<p><input type="text"style="margin-right: 5px;" id="txtMsg"><button class="btn btn-primary" id="btnSendMessage"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></p>';
				document.getElementById("AlertMsgBtn").style.display = "none";
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("btnSendMessage").onclick = function(e){
					var value = document.getElementById("txtMsg").value;
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "CommTitle"), value, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					
					document.getElementById("txtMsg").value = "";
				}
				break;
			case 54:
				var MsgBody= "Do you want to Enable Bluetooth? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");			
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 55:
				var MsgBody= "Do you want to Disable Bluetooth? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");			
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 56:
				var MsgBody= "Do you want to Enable wifi? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");		
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 57:
				var MsgBody= "Do you want to Disable wifi? \r\n";		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 58:
				var MsgBody= 'Do you want to get root status? <br><div id="GetRoot"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 59:
				var MsgBody= 'Do you want to get top activity? <br> <div id="GetTopActivity"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 60:
				var MsgBody= 'Do you want to get running service? <br> <div id="GetRunningService"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
			case 61:
				var MsgBody= 'Do you want to terminate process? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "terminate top activity", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "terminate top activity", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
									
				};
				break;
			case 62:
				var MsgBody= 'Do you want to restart agent? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "restart agent", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "restart agent", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 63:
				var MsgBody= 'Do you want to Enable camera? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;1", GetCommand(sub, "CommTitle"), "enable", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;1", GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 64:
				var MsgBody= 'Do you want to disable camera? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;888", GetCommand(sub, "CommTitle"), "disable", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;888", GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 65:
				var MsgBody= ' Please enter ftp information<br>Ftp account: <input id="FtpAccount" class="form-control" type="text">'+
								'<br>Ftp password: <input id="FtpPassword" class="form-control" type="text">'+
								'<br>Ftp host: <input id="FtpHost" class="form-control" type="text">'+
								'<br>File name: <input id="FileName" class="form-control" type="text">';
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var FtpAccount = $('#FtpAccount').val();
					var FtpPassword = $('#FtpPassword').val();
					var FtpHost = $('#FtpHost').val();
					var FileName = $('#FileName').val();
					if(FtpAccount === "" || FtpPassword === "" || FtpHost === "" || FileName === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter ftp information.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+FtpAccount+';;;'+FtpPassword+';;;'+FtpHost+';;;'+FileName, GetCommand(sub, "CommTitle"), "Deny", "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+'add;;2:'+PackageName+':0', GetCommand(sub, "CommTitle"), "Deny", "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 66:
				var MsgBody= 'Do you want to get coordinates continuously ? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 67:
				var MsgBody= 'Do you want to stop getting coordinates? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");	
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 69:
				var MsgBody= 'Do you want to enable gps? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 70:
				var MsgBody= 'Do you want to disable gps? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 71:
				var MsgBody= 'Do you want to enable unknown sources? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 72:
				var MsgBody= 'Do you want to disable unknown sources? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 73:
				var MsgBody= 'Do you want to enable developer option? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 74:
				var MsgBody= 'Do you want to disable DeveloperOption? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 77:
				var MsgBody= 'Do you want to enable auto time? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 78:
				var MsgBody= 'Do you want to disable auto time? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 79:
				var MsgBody= 'Do you want to enable auto time zone? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 80:
				var MsgBody= 'Do you want to disable auto time zone? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 81:
				var MsgBody= 'Do you want to enable home button? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
							setTimeout(function(){ 
								//SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
							}, 3000);
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 82:
				var MsgBody= 'Do you want to disable home button? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
							setTimeout(function(){ 
								SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
							}, 3000);
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 83:
				var MsgBody= 'Do you want to enable NFC? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 84:
				var MsgBody= 'Do you want to disable NFC? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 87:
				var MsgBody= 'Do you want to enable mobile data? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 88:
				var MsgBody= 'Do you want to disable mobile data? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 89:
				var MsgBody= 'Do you want to enable data roaming? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 90:
				var MsgBody= 'Do you want to disable data roaming? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 91:
				var MsgBody= 'Prohibit install app list: <br> <div id="getProhabitList"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					document.getElementById("ShowInfoBtn").style.display = "none";			
				};
				break;
			case 92:
				var MsgBody= 'Allow install app list: <br> <div id="getProhabitList"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					document.getElementById("ShowInfoBtn").style.display = "none";			
				};
				break;
			case 93:
				var MsgBody= 'Prohibit Launch App List: <br> <div id="getProhabitList"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}

						document.getElementById("ShowInfoBtn").style.display = "none";
				};
				break;
			case 94:
				var MsgBody= 'Allow launch app list: <br> <div id="getProhabitList"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					document.getElementById("ShowInfoBtn").style.display = "none";			
				};
				break;
			case 95:
				var MsgBody= 'Please set property name and value. <br>Property: <input id="PropertyName" class="form-control" type="text"><br>value: <input id="Value" class="form-control" type="text">';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					var PropertyName = document.getElementById("PropertyName").value;
					var PropertyValue = document.getElementById("Value").value;
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetProperty;;"+PropertyName+";;"+PropertyValue, PropertyName, PropertyValue, "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), PropertyName, "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 96:
				var MsgBody= 'Please enter property name. <br>Property: <input id="PropertyName" class="form-control" type="text"><br>result: <div id="PropertyResult"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					var PropertyName = document.getElementById("PropertyName").value;
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param")+PropertyName, GetCommand(sub, "CommTitle"), "", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param")+PropertyName, GetCommand(sub, "CommTitle"), "", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 97:
				var MsgBody= 'Do you want to get all package name? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 98:
				var MsgBody= 'Do you want to Hide back button? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "hide", "user");					
							setTimeout(function(){ 
								SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
							}, 3000);
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 99:
				var MsgBody= 'Do you want to Show back button? <br>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length)){
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "show", "user");					
							setTimeout(function(){ 
								SendByGolang(AllDevicesID, GetCommand(43, "Comm")+"@%@"+GetCommand(43, "Path")+"@%@;;;"+GetCommand(43, "Param"), "reboot", "true", "system");
							}, 3000);
						}
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
								
				};
				break;
			case 101:
				var MsgBody= ' Please enter Broker information<br>Broker address: <input id="BrokerAddress" class="form-control" type="text">'+
								'<br>Broker port: <input id="BrokerPort" class="form-control" type="text">'+
								'<br>Svr topic: <input id="SvrTopic" class="form-control" type="text">'+
								'<br>Cln topic: <input id="ClnTopic" class="form-control" type="text">';
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					var BrokerAddress = $('#BrokerAddress').val();
					var BrokerPort = $('#BrokerPort').val();
					var SvrTopic = $('#SvrTopic').val();
					var ClnTopic = $('#ClnTopic').val();
					if(BrokerAddress === "" || BrokerPort === "" || SvrTopic === "" || ClnTopic === ""){
						document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
								 '<strong>Warning:</strong> Please enter broker information.'+
							 ' </div>';
					}else{
						for (var i = 0; i < items.length; i++) {
								AllDevicesID += items[i] +"/"; 
						}
						if(purpose === "device-management"){
							if(noTagSelect(items.length))
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;ChangeBroker;;"+BrokerAddress+';;'+BrokerPort+';;'+SvrTopic+';;'+ClnTopic, GetCommand(sub, "CommTitle"), BrokerAddress, "user");					
						}else if(purpose === "schedule"){
							CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;ChangeBroker;;"+BrokerAddress+';;'+BrokerPort+';;'+SvrTopic+';;'+ClnTopic, GetCommand(sub, "CommTitle"), BrokerAddress, "user", true]);
							SetCommandAction(GetCommand(sub, "CommTitle"));
						}
						$('#myModal').modal('hide');
					}
				}
				break;
			case 102:
				var MsgBody= 'Get WiFi RSSI';
								
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 103:
				var MsgBody= 'Get BT RSSI';
								
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 104:
				var MsgBody= 'Get Mobile RSSI';
								
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e) {
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user");					
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), GetCommand(sub, "Param"), "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
				}
				break;
			case 105:
				var MsgBody= 'All Allow/Deny list: <br> <div id="getAllList"></div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgBtn").style.display = "none";
				document.getElementById("ShowInfoBtn").style.display = "";
				document.getElementById("ShowInfoBtn").onclick = function(e){
					var items = GetDeviceTag();
					
					for (var i = 0; i < items.length; i++) {
							AllDevicesID += items[i] +"/"; 
					}
					if(purpose === "device-management"){
						if(noTagSelect(items.length))
							SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user");
					}else if(purpose === "schedule"){
						CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "0", "user", true]);
						SetCommandAction(GetCommand(sub, "CommTitle"));
					}
					
					document.getElementById("ShowInfoBtn").style.display = "none";
				}
				
				break;
		}
	}
}




//this file is used in all pagination 
//function used commonly can write down here. 

//check out if user due date expired or not	
var LogoutInterval;
function LoginStatus(sub, page) {
	if (sub === "UserDuedateCheck") {
		var company = localStorage.getItem("Company");
		var UserName = getCookie("UserName");
		postdata = {
				name: UserName,
				company: company,
				submit: sub
		}
		$.post("/golang",
		postdata,
			function(data,status){
				if(data === "timeout"){
					window.location.href = "Login.html";
				}else if(data === "success"){
				}else{
					window.location.href = "Login.html";
				}
			});
	}
	var logout = 30;
	if(localStorage.getItem("LogoutTime") !== null)
		logout = localStorage.getItem("LogoutTime");
	var time = parseInt(logout);
	setCookie("UserName", getUserCookie("UserName"), time);
	setCookie("Password", getUserCookie("Password"), time);
	SetLogoutInterval(time);
	if (checkCookie('UserName') === true || checkCookie('Password') === true) {
		window.location.href = "Login.html";
		setCookie("page", page , 30);
	}
	
	document.getElementById("CookieListener").addEventListener("click", function(){
		setCookie("UserName", getUserCookie("UserName"), time);
		setCookie("Password", getUserCookie("Password"), time);
		SetLogoutInterval(time);
	});
}

function SetLogoutInterval(time){
	window.clearInterval(LogoutInterval);
	if(time !== -1)
		LogoutInterval = setInterval(function() { alert("Your cookie is about to timeout due to inactivity");window.location.href = "Login.html"; }, time* 60 * 1000);
}

		
//get user cookie and decrypt		
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			var cvalue = c.substring(name.length, c.length);
			var decryptedPassword = CryptoJS.AES.decrypt(cvalue, "AIM Secret Passphrase");
			return decryptedPassword.toString(CryptoJS.enc.Utf8);
		}
	}
	return "";
}

//get user cookie without decrypt		
function getUserCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

//check out cookie exist or not
//if cookie is null then return true
function checkCookie(cname) {
	var username = getCookie(cname);
	if (username == "" || username == null) {
		return true;
	} else {
		return false;
	}
}

//set cookie with cookie name ,value and timeout
function setCookie(cname, cvalue, exmins) {
	if(exmins === -1)
		exmins = 10000000000000;
	var d = new Date();
	d.setTime(d.getTime() + (exmins * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// delete user cookies 
function DeleteCookie() {
	setCookie('UserName', '000', 0);
	setCookie('Password', '000', 0);
}
	
//set HTML (notification bell, profile card)	
var AllDevices = [];
var ProfileInfo;
function SetHTML(html){
	SetNavbar();
	SetFooterContent();
	SetAlertNotification();
	SetNotificationBell(0);
	var UserName = getCookie('UserName');
	if(localStorage.getItem("Company") === "Guest"){
		document.getElementById("dropdown-management").style.display = "none";
	}
	/*if (localStorage.getItem("col") === "in"){
		$("#collapse").addClass("in");
	}else{
		$("#collapse").removeClass("in");
	}
	$("#btnCollapse").on("click", function(){
		
		if (localStorage.getItem("col") === "in"){
			localStorage.removeItem("col");
		}else{
			localStorage["col"] = "in";
		}
	});*/
	$('.navbar-fixed-top').hover(function() {
		$("#collapse").collapse('show');
	}, function(){
		$("#collapse").collapse('hide');
	});
	$('.notification-body').css( 'cursor', 'pointer' );
	//document.getElementById(html).className = "menu-top-active";
	$('#'+html).addClass('menu-top-active');
	var company = localStorage.getItem("Company");
	console.log("GetUserInfo");
	var sub = "GetUserInfo"; var postdata = {submit: sub};
	postdata = {
			company: company,
			name: UserName,
			submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		ProfileInfo = data;
		document.getElementById("card-email").innerHTML+=data.EMAIL;
		document.getElementById("card-name").innerHTML='<h1>'+data.NAME+'</h1>';
		if(company === "Guest")
			if(data.SUBSCRIBE === ""){
				document.getElementById("card-deives").innerHTML+='0';
			}else{
				var d = data.SUBSCRIBE.split("/");
				document.getElementById("card-deives").innerHTML+=d.length-1;
			}
		if(data.INVITER === ""){
			//SetNotificationBell(0);
		}else{
			var invite = data.INVITER.split("/");
			for(var j=0;j<invite.length-1;j++){
				var inviter = invite[j].split("#");
				var device = "'"+inviter[0]+"'";var accept = "'accept'";var refuse = "'refuse'";
				var invitecontent = SetSubscribeNotification(inviter[0], inviter[1], device, accept, refuse );
				document.getElementById("notification_content").innerHTML += invitecontent;							
			}
			var count = inviter.length-1;
			SetNotificationBell(count);	
		}
		
		if(location.pathname === "/profile.html"){
			if(company === "Guest")
				GetAccountInfo();
		}else if(location.pathname === "/management.html"){
			//SetPermissionContent();
			MenuShow();
		}else if(location.pathname === "/contact-us.html"){
			GetQuestion();
		}else if(location.pathname === "/AllDevice.html"){
			//SetGroupFilter(data.GROUPS);
			//GetAllDevices();
		}
		
		
	});
	
	console.log("GetLoginLog");
	var sub = "GetLoginLog"; var postdata = {submit: sub};
	postdata = {
			company: company,
			name: UserName,
			days: 365,
			submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(data !== undefined && data != null){
				var times = [];
					console.log(data);
				for(var i=0;i<Object.keys(data).length;i++){
					if(data[i].FROM === "user" && data[i].COMMAND === "UserLogin"){
						times.push(data[i].TIME);
					}
					if(data[i].TYPE === "schedule" && data[i].VIEW === "false"){
						SetNotificationBell("add");
						var LogsId = data[i].ID;
						var invitecontent = SetScheduleNotification("Task Completed", data[i].TIME, LogsId );
						document.getElementById("notification_content").innerHTML += invitecontent;	
					}
				}
				times.sort(function(a, b){return b-a});
				if(times.length === 1){
					document.getElementById("card-login").innerHTML = '<p>Last Accessed : '+UnixToTime(times[0])+'</p>';
				}else{
					document.getElementById("card-login").innerHTML = '<p>Last Accessed : '+UnixToTime(times[1])+'</p>';
				}
			}
	});
	console.log("GetDevicesName");
	var sub = "GetDevicesName"; var postdata = {submit: sub};
	postdata = {
			company: company,
			name: UserName,
			submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(company === "Guest"){
			
			AllDevices = data;
			console.log(data);
		}else{
			console.log(data);
			AllDevices = data;
			if(data === "null"){
				document.getElementById("card-deives").innerHTML+="0";
			}else{
				document.getElementById("card-deives").innerHTML+=AllDevices.length;
			}
		}
		if(location.pathname === "/profile.html"){
			if(company !== "Guest")
				GetAccountInfo();
		}else if(location.pathname === "/index.html"){
			
			GetCoordinate(AllDevices);
		}
	});
	
}

//date to time (e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to time(2017/9/24 10:18:17))	
function DateToTime(date){
	var d = date;
	var time = "";
	var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;var Month = (d.getUTCMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getUTCSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getUTCFullYear()+"/"+Month+"/"+Day+" "+Hours+":"+Min+":"+Sec;	
	return time;
}

//date to ori time(e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to ori(20170924101817))
function GetInputTimeToOriginal(date){
	
	var d = date;
	var time = "";
	var Day = d.getDate();if(Day<10) Day = "0"+Day;var Month = (d.getMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getFullYear()+""+Month+""+Day+""+Hours+""+Min+""+Sec;	
	return time;

}

//time stamp to time (e.g. unix(1511489897579) to time(2017/9/24 10:18:17))		
function UnixToTime(unix){
	var date = new Date(parseInt(unix)*1000);
	return DateToTime(date);
}

//time stamp to date (e.g. unix(1511489897579) to date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)])		
function UnixToDate(unix){
	var date = new Date(parseInt(unix)*1000);
	return date;
}

//date to time stamp(e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to unix(1511489897579))
function DateToUnix(date){
	var d = new Date(moment(date).seconds(0).milliseconds(0).toString());
	return Math.round((d.getTime() / 1000));
}

//get time stamp(e.g. unix(1511489897579))
function GetNowUnix(){
	var d = new Date();
	return Math.round((d.getTime() / 1000));
}
		
		
//set notification bell		
function SetNotificationBell(value){
	if(value === "add"){
		var el = document.querySelector('.notification');
		var count = Number(el.getAttribute('data-count')) || 0;
		el.setAttribute('data-count', count + 1);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count === 0){
			el.classList.add('show-count');
			$( ".notification_content" ).remove( ":contains('No New Notifications!')" );
		}
		
	}else if(value === "subtract"){
		var el = document.querySelector('.notification');
		var count = Number(el.getAttribute('data-count')) || 0;
		el.setAttribute('data-count', count - 1);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count-1 === 0){
			el.classList.remove('show-count');
			$( ".notification_content" ).remove( ":contains('No New Notifications!')" );
			var invitecontent = SetNoneNotification();	
			document.getElementById("notification_content").innerHTML += invitecontent;	
		}
	}else{
		var el = document.querySelector('.notification');
		var count = value;
		el.setAttribute('data-count', count);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count !== 0){
			el.classList.add('show-count');
			$( ".notification_content" ).remove( ":contains('No New Notifications!')" );
		}else if(count === 0){
			el.classList.remove('show-count');
			var invitecontent = SetNoneNotification();
			document.getElementById("notification_content").innerHTML += invitecontent;	
		}
	}
	
}

//Accept or Refuse button click event
function SetSubscribe(device, value){
	var company = localStorage.getItem("Company");
	var UserName = getCookie("UserName");
	if(value === "accept"){
		
		var subscribe = device + "/";
		var postdata = {
				name: UserName,
				company: company,
				subscribe: subscribe, 
				submit: "SetSubscribeDevices"
		}
		$.post("/golang",
		postdata,
			function(data,status){
				if(data === "success"){
					var d = "'"+device+"'";
					var s = ':contains('+d+')';
					$( ".notification_content" ).remove( s );
					SetNotificationBell("subtract");
					if(location.pathname === "/AllDevice.html"){
						GetAllDevices();
					}
					
					
				}
			});
	}else if(value === "refuse"){
		SetNotificationBell("subtract");
		var d = "'"+device+"'";
		var s = ':contains('+d+')';
		$( ".notification_content" ).remove( s );
	}
	
	var postdata1 = {
			name: UserName,
			company: company,
			deviceid: device,
			stat: value,
			submit: "Uninviter"
	}
	$.post("/golang",
	postdata1,
		function(data,status){
			if(data === "success"){
				
			}
		});
	
}

//write notification bell content 		
function SetSubscribeNotification(inviter, unix, device, accept, refuse){
	var content = '<li class="notification_content">'+
		'<div class="notification_content-icon">'+
			'<i class="fa fa-rss-square fa-2x" aria-hidden="true"></i>'+
		'</div>'+
		'<div class="notification_content-title">'+
			'<h4>'+inviter+'</h4>'+
			'<p>'+UnixToTime(unix)+'</p>'+
		'</div>'+
		'<div class="notification_content-button">'+
			'<button class="btn btn-success" style="width:50%;" onclick="SetSubscribe('+device+','+accept+')"><i class="fa fa-check" style="padding-right:5px;" aria-hidden="true"></i>accept</button>'+
			'<button class="btn btn-danger" style="width:50%;"  onclick="SetSubscribe('+device+','+refuse+')"><i class="fa fa-times" style="padding-right:5px;" aria-hidden="true"></i>refuse</button>'+
		'</div>'+
	'</li>';	
	return content;
}
		
function SetNoneNotification(){
	var content = '<li class="notification_content">'+
			'<div class="notification_content-icon">'+
				'<i class="fa fa-bell fa-2x" aria-hidden="true"></i>'+
			'</div>'+
			'<div class="notification_content-title">'+
				'<h3>No New Notifications!</h3>'+
				'<p>all caught up</p>'+
			'</div>'+
		'</li>';	
	return content;
}
		
function SetScheduleNotification(title, unix, id){
	var logid = "'"+id+"'";
	var content = '<li class="notification_content">'+
		'<div class="notification_content-icon">'+
			'<i class="fa fa-rss-square fa-2x" aria-hidden="true"></i>'+
		'</div>'+
		'<div class="notification_content-title">'+
			'<h4>'+title+'</h4>'+
			'<a href="javascript: void(0)" onclick="GetLogDetailById('+logid+')" style="margin:0px;color:#a94442;">View Details <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></a>'+
			'<p>'+UnixToTime(unix)+'</p>'+
		'</div>'+
		'<div class="notification_content-button">'+
			'<button class="btn btn-primary" style="width:100%;" onclick="SetLogsView('+logid+')"><i class="fa fa-check" style="padding-right:5px;" aria-hidden="true"></i>ok</button>'+
			
		'</div>'+
	'</li>';	
	return content;
}
		
function GetLogDetailById(id){
	var postdata = {
			logid: id,
			submit: "GetLogInfoById"
	}
	$.post("/golang",
	postdata,
		function(data,status){
			if(data !== undefined){
				
				var logs = data.split("***");
				var times = [];
				for(var i=0;i<logs.length-1;i++){
					var LogsInfo = logs[i].split("%/%");
					var LogsName= "", LogsTarget= "", LogsTitle= "", LogsCommand= "", LogsContent= "",LogsFrom= "", LogsTime = "", LogsId = "", LogsType = "", LogsView = "";
					for(var j=0;j<LogsInfo.length;j++){
						var LogsDetails = LogsInfo[j].split(":");
						if(LogsDetails[0] === "name") {LogsName = LogsDetails[1];}
						else if(LogsDetails[0] === "target") {LogsTarget = LogsDetails[1];}
						else if(LogsDetails[0] === "title") {LogsTitle = LogsDetails[1];}
						else if(LogsDetails[0] === "command") {LogsCommand = LogsDetails[1];}
						else if(LogsDetails[0] === "content") {LogsContent = LogsDetails[1];}
						else if(LogsDetails[0] === "from") {LogsFrom = LogsDetails[1];}
						else if(LogsDetails[0] === "time") {LogsTime = LogsDetails[1];}
						else if(LogsDetails[0] === "type") {LogsType = LogsDetails[1];}
						else if(LogsDetails[0] === "logid") {LogsId = LogsDetails[1];}
						else if(LogsDetails[0] === "view") {LogsView = LogsDetails[1];}
					}
					
					document.getElementById("AlertMsgEvent").innerHTML = '<i class="fa fa-tags" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Devices target:<br><input type="text" id="devicetag" />';
					document.getElementById("AlertMsgEvent").style.display = "";
					$('#devicetag').tagsinput({
						tagClass: function(item) {
							return 'label label-primary';
						},
						itemValue: 'value',
						itemText: 'text',
					});
					var target = LogsTarget.split("/");
				
					for(var j=0;j<target.length-1;j++){
						var name = GetDevicesName(target[j]);
						$('#devicetag').tagsinput('add', { "value": target[j] , "text": name});
					}
					
					var Title = 'Schedule detail';
					var MsgBody= '<i class="fa fa-tags" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Command selected:<br><input type="text" id="commandtag" />';;
					SetAlertMsgInnerHTML(Title, MsgBody);
					$('#commandtag').tagsinput({
						tagClass: function(item) {
							return 'label label-primary';
						},
						itemValue: 'value',
						itemText: 'text',
					});
					var t = LogsTitle.split("/");
					var cont = LogsContent.split("/");
					for(var j=0;j<t.length-1;j++){
						if(cont[j] !== ""){
							$('#commandtag').tagsinput('add', { "value": t[j] , "text": t[j]+" : "+cont[j]});
						}else{
							$('#commandtag').tagsinput('add', { "value": t[j] , "text": t[j]});
						}
						
					}
					$('.bootstrap-tagsinput').find('.tag').removeClass('tag');
					
				}
				
			}
		});
}
		
function GetDevicesName(id){
	
	// for(var i=0;i<Object.keys(AllDevices).length;i++){
		// if(AllDevices[i][0] === id)
			// if(AllDevices[i][1] === "-"){
				// return AllDevices[i][0];
			// }else{
				// return AllDevices[i][1];
			// }
			
	// }
	for(var i=0;i<AllDevices.length;i++){
		if(AllDevices[i].DEVICEID === id)
			if(AllDevices[i].DEVICENAME === "-"){
				return AllDevices[i].DEVICEID;
			}else{
				return AllDevices[i].DEVICENAME;
			}
			
	}
	return id;
}

function GetOriDevicesName(id){

	for(var i=0;i<AllDevices.length;i++){
		if(AllDevices[i].DEVICEID === id)
			return AllDevices[i].DEVICENAME;
			
	}
	return id;
}
		
function SetLogsView(id){
	var company = localStorage.getItem("Company");
	var name = getCookie("UserName");
	var postdata = {
			name: name,
			company: company,
			id: id,
			submit: "SetLogView"
	}
	$.post("/golang",
	postdata,
		function(data,status){
			$( "button[onclick*='"+id+"']").parent( ".notification_content-button" ).parent( ".notification_content" ).remove();
			SetNotificationBell("subtract");
		});
}
		
		
function SetAlertMsgInnerHTML(myModalLabel, AlertMsgBody){
	document.getElementById("AlertMsgTools").style.display = "none";
	document.getElementById("ShowInfoBtn").style.display = "none";
	document.getElementById("AlertMsgBtn").style.display = "none";
	document.getElementById("timepicker").style.display = "none";
	document.getElementById("CancelBtn").style.display = "";
	document.getElementById("myModalLabel").innerHTML = "";
	document.getElementById("AlertMsgBody").innerHTML = "";
	document.getElementById("myModalLabel").innerHTML = myModalLabel;
	document.getElementById("AlertMsgBody").innerHTML = AlertMsgBody;
	$('#myModal').modal('toggle');
}

function SetNavbar(){
	$('.navbar-fixed-top').append( ' <div class="navbar navbar-inverse set-radius-zero " >'+
			'<div class="container">'+
				'<div class="navbar-header">'+
					'<a class="navbar-brand" href="index.html">'+

						'<img src="assets/img/AIMobile-Logo-3.png" />'+
					'</a>'+
					
					'<ul class="nav navbar-nav navbar-right">'+
						'<button id="btnCollapse" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" style="margin-top:25px;">'+
						'<span class="icon-bar"></span>'+
						'<span class="icon-bar"></span>'+
						'<span class="icon-bar"></span>'+
					'</button>'+
						
						'<li class="card-body" style="padding-top:18px;margin-right:5px;float:right;" >'+
							'<button id="user-circle" class="btn btn-info" style="background-color: Transparent;border: none;"><i class="fa fa-user-circle-o" aria-hidden="true"	style="color:#337ab7;font-size:2.5em;" ></i></button>'+
							
							'<div class="card dropdown-menu" id="card">'+
								'<div class="card-pic">'+
								'<img src="/assets/img/face_black.png" style="width:120px;">'+
								'</div>'+
								'<div class="card-info">'+
									'<div class="card-name" id="card-name">'+
										'<h1></h1>'+
									'</div>'+
									'<div class="card-title">'+
										'<a href="#" id="card-email"><i class="fa fa-envelope"></i></a> '+
										'<p id="card-deives">device bound : </p>'+
									'</div>'+
								'</div>'+
								
								'<div id="card-login">'+
									'<p>Last Accessed :</p>'+
									
								'</div>'+
								'<div class="card-bottom">'+
									'<a href="profile.html" class="btn btn-primary card-bottom-left">PROFILE</a>'+
									'<a href="Login.html" class="btn btn-danger card-bottom-right" onclick="DeleteCookie();">LOG ME OUT</a>'+
								'</div>'+
							'</div>'+
						'</li>'+
						'<li class="notification-body" style="padding-top:25px;float:right;padding-right:10px;" >'+
							
							'<div class="container-bell">'+
								'<div class="notification" ></div>'+
							'</div>'+
							'<ul class="dropdown-menu scrollable-menu" id="notification_content">'+
							'</ul>'+
							
						'</li>'+
					'</ul>'+
					
					

				'</div>'+

				
				
			'</div>'+
		'</div>'+
		
		'<section class="menu-section">'+
			'<div class="container">'+
				'<div class="row ">'+
					'<div class="col-md-12">'+
						'<div id="collapse" class="navbar-collapse collapse">'+
							'<ul id="menu-top" class="nav navbar-nav navbar-right">'+
								'<li><a id="barset_index" href="index.html">MainPage</a></li>'+
							   
								'<li>'+
									'<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="barset_management">Management<i class="fa fa-angle-down"></i></a>'+
									'<ul class="dropdown-menu" role="menu" aria-labelledby="ddlmenuItem">'+
										'<li id="dropdown-management" role="presentation"><a role="menuitem" tabindex="-1" href="management.html">Account Managemnet</a></li>'+
										'<li id="dropdown-alldevice" role="presentation"><a role="menuitem" tabindex="-1" href="AllDevice.html">Device Managemnet</a></li>'+
										'<li id="dropdown-alldevice" role="presentation"><a role="menuitem" tabindex="-1" href="details.html">Device Details</a></li>'+
									'</ul>'+
									
								'</li>'+
								'<li>'+
									
									'<a id="barset_analysis" href="analysis.html">Analysis</a></li>'+
									
								'</li>'+
								'<li><a id="barset_schedule" href="schedule.html">Schedule</a></li>'+
								'<li><a id="barset_instructions" href="index.html">Instructions</a></li>'+
								'<li><a id="barset_contact" href="contact-us.html">Contact Us</a></li>'+
								
							'</ul>'+
						'</div>'+
						
					'</div>'+

				'</div>'+
			'</div>'+
		'</section>');
		$('#user-circle').click(function(e) {
			$(this).parent().toggleClass('open');
		});
		$('.container-bell').click(function(e) {
			$(this).parent().toggleClass('open');
		});
		$('html').on('click', function (e) {
			if (!$('#user-circle').is(e.target) 
				&& $('div.card').has(e.target).length === 0 
				&& $('li.card-body').has(e.target).length === 0
			) {
				$('li.card-body').removeClass('open');
			}
			if (!$('.notification').is(e.target) 
				&& $('#notification_content').has(e.target).length === 0 
			) {
				$('li.notification-body').removeClass('open');
			}
		});
}

function SetAlertNotification(){
	$.fn.numpad.defaults.gridTpl = '<table class="table modal-content"></table>';
	$.fn.numpad.defaults.backgroundTpl = '<div class="modal-backdrop in"></div>';
	$.fn.numpad.defaults.displayTpl = '<input type="text" class="form-control" />';
	$.fn.numpad.defaults.buttonNumberTpl =  '<button type="button" class="btn btn-default"></button>';
	$.fn.numpad.defaults.buttonFunctionTpl = '<button type="button" class="btn" style="width: 100%;"></button>';
	$.fn.numpad.defaults.onKeypadCreate = function(){$(this).find('.done').addClass('btn-primary');};
	$('#BootstrapAlert').append(
		'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">'+
			'<div class="modal-dialog">'+
				'<div class="modal-content">'+
					'<div class="modal-header">'+
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
						'<h4 class="modal-title" id="myModalLabel"></h4>'+
					'</div>'+
					'<div id="AlertMsgEvent" class="modal-event" style = "display:none">'+
					'</div>'+
					'<div id="AlertMsgTools" class="modal-tools" style = "display:none">'+
						'<div id="EnterPassword" class="form-group" style="display:none;">'+
							'<input type="password" class="form-control" id="password" placeholder="Please enter the password :">'+
						'</div>'+
						'<div id="timepicker" style="display:none;" ng-app="mwl.calendar.docs">'+
							'<div ng-controller="TimepickerDemoCtrl">'+
								'<p class="input-group">'+
								  '<input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="dt" is-open="popup.opened" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />'+
								  '<span class="input-group-btn">'+
									'<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>'+
								  '</span>'+
								'</p>'+
								'<uib-timepicker ng-model="mytime" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></uib-timepicker>		'+											
							'</div>'+
						'</div>'+
						
					'</div>'+
					'<div id="AlertMsgBody" class="modal-body">'+
					
					'</div>'+
					'<div class="modal-footer" id="AlertMsgFooter">'+
						'<button id="CancelBtn" type="button" class="btn btn-default" data-dismiss="modal">cancel</button>'+
						'<button id="AlertMsgBtn"type="button" style = "display:none" class="btn btn-primary" data-dismiss="modal" >ok</button>'+
						'<button id="ShowInfoBtn"type="button" class="btn btn-primary" style = "display:none">ok</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>');
		
		$('#password').numpad({
			displayTpl: '<input class="form-control" type="password" />',
			hidePlusMinusButton: true,
			hideDecimalButton: true	
		});
		
}

function SetFooterContent(){
	$('#footer-content').html('Copyright &copy; 2018 <a href="http://www.aimobile.com.tw/" target="_blank" style="color:blue" >AIMobile Co.,Ltd </a> |	<a href="javascript: void(0)" onclick="GetReleaseNotes()" >Version: 0.3.2.5, Update: 2018.09.10 </a>');
	/*
		version a.b.c.d 
		- a: architecture change
		- b: new features
		- c: maintenance, e.g. performance improvement 
		- d: bug fixes
		
	*/
}

function GetReleaseNotes(){
	var file = "assets/ReleaseNote/ReleaseNote.txt";
	$.get(file,{ "_": $.now() }, function(data) {
		console.log(data);
		var Title = 'Release Note!';
		var Msg = data.replace(/\n/g,"<br />");
		Msg = Msg.replace(/-/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	    SetAlertMsgInnerHTML(Title, Msg)
	});
}

function SliderShow(){
	// Without JQuery
	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}


function CheckUserPermission(sub){
	if(ProfileInfo == undefined)
		return true;
	var permission = ProfileInfo.PERMISSION.split("");
	var PermissionName = ['', 'Register', 'Install', 'APP', 'Peripheral', 'Download', 'Tracking', 'Timer']
	switch (sub) {
		//Download permission
		case 7:
		case 65:
			if(permission[5] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[5]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		
		case 8:
		case 9:
		case 85:
		case 86:
		case 101:
			if(permission[2] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[2]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		
		case 10:
		case 37:
		case 38:
		case 39:
		case 40:
			if(permission[3] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[3]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		
		case 2:
		case 3:
		case 11:
		case 12:
		case 22:
		case 29:
		case 30:
		case 31:
		case 32:
		case 44:
		case 45:
		case 46:
		case 47:
		case 48:
		case 49:
		case 54:
		case 55:
		case 56:
		case 57:
		case 63:
		case 64:
		case 69:
		case 70:
		case 71:
		case 72:
		case 73:
		case 74:
		case 75:
		case 76:
		case 77:
		case 78:
		case 79:
		case 80:
		case 81:
		case 82:
		case 83:
		case 84:
		case 87:
		case 88:
		case 89:
		case 90:
		case 'peripheralFail':
			if(permission[4] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[4]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		
		case 'peripheral':	
			if(permission[4] == 0){
				return false;
			}else{
				return true;
			}
			
		case 4:
		case 14:
		case 15:
		case 16:
		case 17:
		case 66:
		case 67:
			if(permission[6] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[6]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
			
		case 'schedule':
			if(permission[7] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[7]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		case 'register':
			if(permission[1] == 0){
				var Title = 'Error! ';
				var MsgBody= '<div class="alert alert-danger">'+
                             "<strong>Warning:</strong> You don't have <strong>"+PermissionName[1]+"</strong> permission to send this command!"+
                         ' </div>';		
				SetAlertMsgInnerHTML(Title, MsgBody);
				document.getElementById("AlertMsgEvent").style.display = "none";
				return false;
			}else{
				return true;
			}
		
	}
	return true;
}

//get the IP addresses associated with an account
function getIPs(callback){
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];

        //remove duplicates
        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice){

        //skip non-candidate events
        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 1000);
}

function SaveDatFileBro(localstorage) {
  localstorage.root.getFile("info.txt", {create: true}, function(DatFile) {
    DatFile.createWriter(function(DatContent) {
		DatContent.seek(DatContent.length);
      var blob = new Blob([payload+"\n"], {type: "text/plain"});
      DatContent.write(blob);
    });
  });
}
		

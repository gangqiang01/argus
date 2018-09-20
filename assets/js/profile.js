//onload page
$(function() {
	LoginStatus("UserDuedateCheck","profile.html"); 
	SetHTML("barset_management");
	$('[data-toggle="tooltip"]').tooltip();   
	var logout = localStorage.getItem("LogoutTime");
	var s = GetTimesString(logout);
		
	
	$('#LogoutTime').html('<i class="fa fa-clock-o" aria-hidden="true"></i>'+s+'<span class="caret"></span>');
	$('#LogoutMenu').html('<li><a href="javascript:void(0)" value="5">Five minutes</a></li>'+
							'<li><a href="javascript:void(0)" value="10">Ten minutes</a></li>'+
							'<li><a href="javascript:void(0)" value="30">Thirty minutes</a></li>'+
							'<li><a href="javascript:void(0)" value="60">One hour</a></li>'+
							'<li><a href="javascript:void(0)" value="120">Two hour</a></li>'+
							'<li><a href="javascript:void(0)" value="240">Four hour</a></li>'+
							'<li><a href="javascript:void(0)" value="360">Six hour</a></li>'+
							'<li><a href="javascript:void(0)" value="720">Helf a day</a></li>'+
							'<li><a href="javascript:void(0)" value="1440">One day</a></li>'+
							'<li><a href="javascript:void(0)" value="-1">Never</a></li>');
							
	$('#LogoutMenu').find('li').on("click", function(){
		var time = GetTimesString($(this).find('a').attr("value"));
		localStorage["LogoutTime"] = $(this).find('a').attr("value");
		$('#LogoutTime').html('<i class="fa fa-clock-o" aria-hidden="true"></i>'+time+'<span class="caret"></span>');
	})						
});

function GetTimesString(logout){
	var s="";
	if(logout === "5"){
		s+="Five minutes";
	}else if(logout === "10"){
		s+="Ten minutes";
	}else if(logout === "30"){
		s+="Thirty minutes";
	}else if(logout === "60"){
		s+="One hour";
	}else if(logout === "120"){
		s+="Two hour";
	}else if(logout === "240"){
		s+="Four hour";
	}else if(logout === "360"){
		s+="Six hour";
	}else if(logout === "720"){
		s+="Helf a day";
	}else if(logout === "1440"){
		s+="One day";
	}else if(logout === "-1"){
		s+="Never";
	}else{
		s+="Thirty minutes";
	}
	
	return s;	
}

function GetAccountInfo(){
	document.getElementById("profile-name").innerHTML+= '<h1>'+ProfileInfo.NAME+'</h1>';
	var level="";
	if(ProfileInfo.LEVEL==="1"){level = "Super user";}else if(ProfileInfo.LEVEL==="2"){level = "Manager";}else if(ProfileInfo.LEVEL==="3"){level = "User";}
	document.getElementById("profile-level").innerHTML+= level;

	document.getElementById("profile-created").innerHTML= 'Dated:'+UnixToTime(ProfileInfo.CREATED);

	document.getElementById("profile-email").innerHTML = ProfileInfo.EMAIL;

	document.getElementById("profile-duedate").innerHTML = UnixToTime(ProfileInfo.DUEDATE);

	if(ProfileInfo.PHONE !== ""){
		document.getElementById("profile-phone").innerHTML = ProfileInfo.PHONE;
	}

	var p = ProfileInfo.PASSWORD.split(""); var pass=""; for(var i=0;i<p.length;i++){pass += "*" ;}
	document.getElementById("profile-password").innerHTML += pass;
	if(localStorage.getItem("Company") === "Guest"){
		var d = ProfileInfo.SUBSCRIBE.split("/");
		for(var i=0;i<d.length-1;i++){
			document.getElementById("profile-device-title").innerHTML += '<p>'+d[i]+'</p>';
		}
	}else{
		console.log(AllDevices);
		if(AllDevices !== "null")
			for(var i=0;i<AllDevices.length;i++){
				document.getElementById("profile-device-title").innerHTML += '<p>'+GetDevicesName(AllDevices[i].DEVICEID)+'</p>';
			}
	}

	var permission = ProfileInfo.PERMISSION.split("");
	var PermissionName = ["Super user", "Register permission", "Install permission", "APP permission", "Peripheral permission", "Download", "Tracking permission", "Timer permission"];
	for(var i=0;i<PermissionName.length;i++){
		if(permission[i] === "0"){
			document.getElementById("profile-permission").innerHTML += '<tr><th class="col-md-1">'+PermissionName[i]+'</th><td class="col-md-2" ><i class="fa fa-times" aria-hidden="true" style="color:rgba(255,0,0,0.6);"></i></td></tr>';
		}else{
			document.getElementById("profile-permission").innerHTML += '<tr><th class="col-md-1">'+PermissionName[i]+'</th><td class="col-md-2" ><i class="fa fa-check" aria-hidden="true" style="color:rgba(0,255,0,0.6);"></i></td></tr>';
		}							
	}	
}

function Proselect(){
	$('#getpro a[href="#pro"]').tab('show');
	$('html, body').animate({
		scrollTop: $("#tab-content").offset().top
	}, 2000);
}

function ChangeInfo(type){
	if(type === "email"){
		var Title = 'Change email';
		var MsgBody = 'Please enter new email:<br><form onsubmit="return SendEmail()" method="post"><div class="input-group"><input type="email" class="form-control" id="NewEmail"><span class="form-group input-group-btn"><button class="btn btn-default" type="submit"><i class="fa fa-envelope-o" aria-hidden="true" style="padding-right:5px;"></i>verify</button></span></div></form>';
		SetAlertMsgInnerHTML(Title, MsgBody);	
	}else if(type === "phone"){
		var Title = 'change phone number';
		var MsgBody = 'Please enter new phone number:<br><form onsubmit="return SendPhone()" method="post"><div class="input-group"><input type="number" class="form-control" id="NewPhone"><span class="form-group input-group-btn"><button class="btn btn-default" type="submit"><i class="fa fa-check" aria-hidden="true" style="padding-right:5px;color:green;"></i>ok</button></span></div></form>';
		SetAlertMsgInnerHTML(Title, MsgBody);
	}else if(type === "password"){
		var Title = 'change password';
		var MsgBody = '<br><form onsubmit="return SendPassword()" method="post">Please enter old password:<input type="password" class="form-control" id="OldPassword"><br>Please enter new password:<input type="password" class="form-control" id="NewPassword"><br>Please enter new password again:<input type="password" class="form-control" id="NewPasswordAgain"><br><div style="text-align:right;"><div id="txtPasswordStatus" style="color:red;"><p ></p></div><button type="button" class="btn btn-default" data-dismiss="modal" style="margin-right:5px;">cancel</button><button class="btn btn-primary" type="submit" >ok</button></div></form>';
		SetAlertMsgInnerHTML(Title, MsgBody);
		document.getElementById("AlertMsgFooter").style.display = "none";
	}					
	
}
function SendPhone(){
	var company = localStorage.getItem("Company");
	var UserName = getCookie('UserName');
	var phone = document.getElementById("NewPhone").value;
	var postdata = {
			name: UserName,
			company: company,
			phone: phone,
			submit: "SetPhone"
	}
	$.post("/golang",
	postdata,
		function(data,status){
			if(data === "pass"){
				window.location.href = "profile.html";
			}
		});
	return false;
}
function SendEmail(){
	var company = localStorage.getItem("Company");
	var UserName = getCookie('UserName');
	var email = document.getElementById("NewEmail").value;
	var postdata = {
			name: UserName,
			company: company,
			email: email,
			submit: "SendVerifyEmail"
	}
	$.post("/golang",
	postdata,
		function(data,status){
			if(data === "pass"){
				
			}
		});
	return false;
}

function SendPassword(){
	var oldpass = document.getElementById("OldPassword").value;
	var newpass = document.getElementById("NewPassword").value;
	var newpassagain = document.getElementById("NewPasswordAgain").value;
	if(newpass !== newpassagain){
		document.getElementById("txtPasswordStatus").innerHTML = "Repeat New Password must be repeated exactly.";
		return false;
	}
	if(newpass === "" || newpassagain === "" || oldpass === "" ){
		document.getElementById("txtPasswordStatus").innerHTML = "All information must be entered exactly.";
		return false;
	}
	console.log("jimmrw");
	return false;
}

function SetAlertMsgInnerHTML(myModalLabel, AlertMsgBody){
	document.getElementById("myModalLabel").innerHTML = "";
	document.getElementById("AlertMsgBody").innerHTML = "";
	document.getElementById("myModalLabel").innerHTML = myModalLabel;
	document.getElementById("AlertMsgBody").innerHTML = AlertMsgBody;
	$('#myModal').modal('toggle');
}

function DeleteAccount(){
	var Title = 'Delete Message';
	var MsgBody = 'Are you sure you want to delete this account?';
	SetAlertMsgInnerHTML(Title, MsgBody);
	document.getElementById("AlertMsgBtn").style.display = "";
	document.getElementById("AlertMsgBtn").onclick = function() {
		var company = localStorage.getItem("Company");
		var UserName = getCookie('UserName');
		var sub = "DeleteUser"; var postdata = {submit: sub};
		var postdata = {
				company: company,
				name: UserName,
				submit: sub
		}
		$.post("/golang",
		postdata,
		function(data,status){
			if(data === "pass"){
				window.location.href = "Login.html";
			}
		});
	}
	
}
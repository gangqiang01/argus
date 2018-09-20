//onload page
$(function() {
	//reset password
	if(getUrlVars()["n"]!==undefined && getUrlVars()["n"]!==undefined ){
		var postdata;
		var name = getUrlVars()["n"];
		var company = getUrlVars()["c"];
		postdata = {
				name: name,
				company: company,
				submit: "ResetPassword"
		   }
		$.post("/golang",
		postdata,
		function(data,status){
			var ss = data.split("/");
			if(ss[0] === "success"){
				ResetPasswordForm(ss[1], ss[2]);
			}else{
				window.location.href = "Login.html";
			}
			
		})
	}
	GetCompany();
	RememberMe();
});

//form request(UserLogin, LoginCompany, AddNewUser, VerificationCode, ResetNewPassword)
function submitDB(sub) {
	var postdata = {submit: sub};
	if ( sub === "UserLogin" ) {
		postdata = {
			name: document.getElementById("UserName").value,
			password: document.getElementById("Password").value,
			company: document.getElementById("Company").value,
			submit: sub
		}
		$.post("/golang",
		postdata,
		function(data,status){
			var ss = data.split("/");
			console.log(ss[0])
			if (data === "success"){
				var UserName = document.getElementById("UserName").value;
				var Password = document.getElementById("Password").value;
				var encryptedUserName = CryptoJS.AES.encrypt(UserName, "AIM Secret Passphrase");
				var encryptedPassword = CryptoJS.AES.encrypt(Password, "AIM Secret Passphrase");
			
				var checkboxstatus = document.getElementById("check");
				console.log(checkboxstatus.checked);
				if(checkboxstatus.checked){
					localStorage["isCheck"] = "true";
					localStorage["UserName"] = encryptedUserName;
					localStorage["Password"] = encryptedPassword;
				}else{
					localStorage.removeItem("UserName");
					localStorage.removeItem("Password");
				}
				document.getElementById("result").innerHTML = "";
				//window.location.href = "index.html";
				if(localStorage.getItem("LogoutTime") === null)
					localStorage["LogoutTime"] = "30";
				setCookie("UserName", encryptedUserName, parseInt(localStorage.getItem("LogoutTime")));
				setCookie("Password", encryptedPassword, parseInt(localStorage.getItem("LogoutTime")));
				SetLogoutInterval(parseInt(localStorage.getItem("LogoutTime")));
				if(getCookie("page") === ""){
					window.location.href = "index.html";
				}else{
					window.location.href = getCookie("page");
				}
			
				setCookie("page", "", 0);
			}else if(ss[0] === "unverified"){
				var Username = "'"+document.getElementById("UserName").value+"'";
				
				var Usercompany = "'"+document.getElementById("Company").value+"'";
				var farepeat = '<a herf="#" onclick="ResendVerifyMail('+Username+', '+Usercompany+')"><i class="fa fa-repeat fa-2x" >Resend Email</i></a>';
				document.getElementById("myModalLabel").innerHTML = "Error Message!"
				document.getElementById("AlertMsgBody").innerHTML = "Please check your email : "+ss[1]+"<br /> We need to verify that this email address belongs to you<br />If you do not receive your verification email,click 'Resend Email' <br />";
				document.getElementById("AlertMsgFooter").innerHTML = farepeat;
				$('#myModal').modal('toggle');
				//document.getElementById("result").innerHTML = "Please check your email : "+ss[1]+"<br /> We need to verify that this email address belongs to you<br />If you do not receive your verification email,<br />click 'Resend Email' <br /><a>"+farepeat+"</a>";
				//Verif(Username, Usercompany, ss[1]);
				
			}else{
				document.getElementById("result").innerHTML = "Invalid user name or password";
				document.getElementById("UserName").value = "";
				document.getElementById("Password").value = "";
				console.log("false");
			}
		});
	}else if(sub === "LoginCompany"){
		postdata = {
					company: document.getElementById("CompanyName").value,
					submit: sub
			}
			$.post("/golang",
		postdata,
		function(data,status){
	
			if (data === "success"){
				
				localStorage["Company"] = document.getElementById("CompanyName").value;
				document.getElementById("loginresult").innerHTML = "";
				GetCompany();
				
			}else{
				document.getElementById("loginresult").innerHTML = "Invalid company name";
				document.getElementById("CompanyName").value = "";
			}
		});
	}else if(sub === "AddNewUser"){
		document.getElementById("SignUpLoading").style.display="";
		var UserName = document.getElementById("SignUserName").value;
		var UserPassword = document.getElementById("SignPassword").value;
		var UserCompany = document.getElementById("SignCompany").value;
		var UserEmail = document.getElementById("SignEmail").value;
		postdata = {
					name: UserName,
					password: UserPassword,
					company: UserCompany,
					email: UserEmail,
					level: "3",
					submit: sub
			}
			$.post("/golang",
		postdata,
		function(data,status){
			document.getElementById("SignUpLoading").style.display="none";
			if (data === "AccountFail"){
				document.getElementById("repeat").innerHTML = "This Account has been used! ";
				
			}else if(data === "EmailFail"){
				document.getElementById("repeat").innerHTML = "This Email has been used! ";
			}else{
				document.getElementById("myModalLabel").innerHTML = "Verify your account"
				document.getElementById("AlertMsgBody").innerHTML = 'Thanks for signing up !!!<br>Confirm your email address is <font color="red">'+UserEmail+'</font> to activite your account.';
				document.getElementById("AlertMsgBtn").style.display = "";
				document.getElementById("AlertMsgBtn").onclick = function() {window.location.href = "Login.html"};
				$('#myModal').modal('toggle');
			}
		});
	}else if(sub === "VerificationCode"){
		var UserName =  document.getElementById("VerUserName").value;
		var UserCompany = document.getElementById("VerCompany").value;
		postdata = {
					name: UserName,
					company: UserCompany,
					verification: document.getElementById("Verification").value,
					submit: sub
			}
			$.post("/golang",
		postdata,
		function(data,status){
	
			if (data === "success"){
				Verified(UserName, UserCompany);
				window.location.href = "index.html";
			}else{
				document.getElementById("VerStatus").innerHTML = "Verification Code is wrong! ";
			}
		});
	}else if(sub === "ResetNewPassword"){
		if(document.getElementById("RPasswordAgain").value === document.getElementById("RPassword").value){
			var UserName =  document.getElementById("RPUserName").value;
			var UserCompany = document.getElementById("RPCompany").value;
			postdata = {
						name: UserName,
						company: UserCompany,
						password: document.getElementById("RPasswordAgain").value,
						submit: sub
				}
				$.post("/golang",
			postdata,
			function(data,status){
		
				if (data === "success"){
					document.getElementById("myModalLabel").innerHTML = "Success!"
					document.getElementById("AlertMsgBody").innerHTML = "Password reset successfully";
					document.getElementById("AlertMsgBtn").style.display = "";
					document.getElementById("AlertMsgBtn").onclick = function() {window.location.href = "Login.html"};
					$('#myModal').modal('toggle');
				}else{
					document.getElementById("RPStatus").innerHTML = "Error occurred! ";
				}
			});
		}else{
			document.getElementById("RPStatus").innerHTML = "Password wrong! ";
			
		}
		
	}

	
	return false;
}

function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				var cvalue = c.substring(name.length, c.length);
				return cvalue;
			}
		}
		return "";
	}

// remember user name 
function RememberMe(){
	
	if(localStorage["UserName"]!==null && localStorage["Password"]!==null && localStorage["UserName"] !=="" && localStorage["Password"] !=="" && localStorage["Password"] !==undefined && localStorage["UserName"] !== undefined){
		var decryptedUserName = CryptoJS.AES.decrypt(localStorage["UserName"], "AIM Secret Passphrase");
	var decryptedPassword = CryptoJS.AES.decrypt(localStorage["Password"], "AIM Secret Passphrase");
	document.getElementById("UserName").value = decryptedUserName.toString(CryptoJS.enc.Utf8);
	document.getElementById("Password").value = decryptedPassword.toString(CryptoJS.enc.Utf8);
	}
	
	if(localStorage["isCheck"]==="true"){
		var checkboxstatus = document.getElementById("check");
		checkboxstatus.checked = true;
	}
	
}

//enterprise
function SetCompany(){
	document.getElementById("loginform").style.display="none";
	document.getElementById("signupform").style.display="none";
	document.getElementById("verificationform").style.display="none";
	document.getElementById("ResetPasswordform").style.display="none";
	document.getElementById("btnBack").style.display="none";
	document.getElementById("companyform").style.display="";
}

function GetCompany(){
	if (localStorage.getItem("Company") === null || localStorage.getItem("Company") === "") {
			FormSet("CheckCompanyform");
			document.getElementById("btnBack").style.display="none";
	}else{
		if (localStorage.getItem("Company") !==  "Guest") {
			document.getElementById("funcSignup").style.display="none";
			document.getElementById("subcompany").style.display="";
		}else{
			document.getElementById("funcSignup").style.display="";
			document.getElementById("subcompany").style.display="none";
		}
		FormSet("loginform");
		
		document.getElementById("btnBack").style.display="";
		document.getElementById("Company").value = localStorage.getItem("Company");
		document.getElementById("Company").disabled=true;
	}
	
}

function CheckCompany(status){
	if(status === "company"){
		FormSet("companyform");
		document.getElementById("subcompany").style.display="";
		document.getElementById("btnBack").style.display="";
	}else{
		localStorage["Company"] = "Guest";
		document.getElementById("subcompany").style.display="none";
		document.getElementById("btnBack").style.display="";
		GetCompany();
	}
}

//delete company cookie
function DeleteCompany(){
	localStorage.removeItem("Company");
	document.getElementById("result").innerHTML = "";
	GetCompany();
}

//set register form
function SignUp() {
	document.getElementById("companyform").style.display="none";
	document.getElementById("loginform").style.display="none";		
	document.getElementById("verificationform").style.display="none";
	document.getElementById("signupform").style.display="";
	if (localStorage.getItem("Company") !== null){
		document.getElementById("SignCompany").value = localStorage.getItem("Company");
	//}else{
	//	document.getElementById("SignCompany").value = getCookie('Company');
	}
	document.getElementById("SignCompany").disabled=true;
	
}


function Verified(UserName, UserCompany){
	var sub = "verified";
	postdata = {
					name: UserName,
					company: UserCompany,
					submit: sub
			}
			$.post("/golang",
		postdata,
		function(data,status){
	
			if (data === "success"){
				
			}else{
				
			}
		});
}

function ResetPasswordWarning(){
	var UserName = document.getElementById("UserName").value;
	var UserCompany = document.getElementById("Company").value;
	
	if(UserName === "" || UserName === null){
		document.getElementById("myModalLabel").innerHTML = "Error Message!"
		document.getElementById("AlertMsgBody").innerHTML = "Please enter your User Name";
		document.getElementById("AlertMsgFooter").innerHTML = "";
		$('#myModal').modal('toggle');
		alert("Please enter your User Name");
	}else{
		
		document.getElementById("myModalLabel").innerHTML = "Notice!"
		document.getElementById("AlertMsgBody").innerHTML = "Do you sure you want to reset your password?";
		
		document.getElementById("AlertMsgBtn").onclick = function() {ResetPassword()};
		document.getElementById("AlertMsgBtn").style.display="";
		$('#myModal').modal('toggle');
	}
	
}

function ResetPassword(){
	document.getElementById("AlertMsgFooter").innerHTML = '<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
	var sub = "SendResetPasswordMail";
	postdata = {
		name: document.getElementById("UserName").value,
		company: document.getElementById("Company").value,
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		console.log(data);
		
		document.getElementById("AlertMsgFooter").innerHTML ="";
		document.getElementById("myModalLabel").innerHTML = "Notice!"
		document.getElementById("AlertMsgBody").innerHTML = "Check your email:"+data;
		document.getElementById("AlertMsgFooter").innerHTML = '<i class="fa fa-check">Aimobile</i>';
		
	});
}

function ResetPasswordForm(UserName, UserCompany){
	document.getElementById("companyform").style.display="none";
	document.getElementById("signupform").style.display="none";
	document.getElementById("verificationform").style.display="none";
	document.getElementById("ResetPasswordform").style.display="";
	document.getElementById("loginform").style.display="none";
	document.getElementById("btnBack").style.display="";
	document.getElementById("RPCompany").value = UserCompany;
	document.getElementById("RPCompany").disabled=true;
	document.getElementById("RPUserName").value = UserName;
	document.getElementById("RPUserName").disabled=true;
}

function ResendVerifyMail(UserName, UserCompany){
	var fafinish = '<i class="fa fa-spinner"></i>';
	document.getElementById("AlertMsgFooter").innerHTML = fafinish+'Please wait just a minute';
	var sub = "ResendVerifyMail";
	postdata = {
					name: UserName,
					company: UserCompany,
					submit: sub
			}
			$.post("/golang",
		postdata,
		function(data,status){
	
			if (data === "success"){
				fafinish = '<i class="fa fa-check"></i>';
				document.getElementById("AlertMsgFooter").innerHTML = fafinish+'Check your email again!';
			}else{
				document.getElementById("AlertMsgFooter").innerHTML = "An error occurred while trying to send your email!"
			}
		});
}

function FormSet(FormName){
	document.getElementById("companyform").style.display="none";
	document.getElementById("signupform").style.display="none";
	document.getElementById("verificationform").style.display="none";
	document.getElementById("loginform").style.display="none";
	document.getElementById("ResetPasswordform").style.display="none";
	document.getElementById("CheckCompanyform").style.display="none";
	document.getElementById(FormName).style.display="";
	
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
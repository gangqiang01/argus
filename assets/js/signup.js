//onload page
$(function() {
	LoginStatus("UserDuedateCheck","signup.html");
	SetHTML("barset_management");
	document.getElementById("addCompany").value = localStorage.getItem("Company");
	var company = localStorage.getItem("Company");
	var UserName = getCookie("UserName");
	postdata = {
			name: UserName,
			company: company,
			submit: "GetLevel"
	}
	$.post("/golang",
	postdata,
		function(data,status){
			if(data === "1"){
				$("#level").append(''+
					'<label>Level<font color="red">*</font></label>'+
					'<select class="form-control" id="addLevel">'+
						'<option>Super User</option>'+
						'<option>Manager</option>'+
						'<option selected="true">User</option>'+
					'</select>');
				
			}else if(data === "2"){
				document.getElementById("addCompany").disabled=true;
			}else{
				
			}
		});
});

function SendtoDatatable(){
	if(CheckUserPermission('register')){
		var x = document.getElementById("addLevel");
		var i = x.selectedIndex;
		document.getElementById("SignUpLoading").style.display="";
		var UserCompany = document.getElementById("addCompany").value;
		var UserName = document.getElementById("addName").value;
		var UserPassword = document.getElementById("addPassword").value;
		var UserEmail = document.getElementById("addEmail").value;
		var UserLevel = parseInt(i+1);
		var postdata = {
					company: UserCompany,
					name: UserName,
					password: UserPassword,
					email: UserEmail,
					level:	UserLevel,
					submit: "AddNewUser"
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
				document.getElementById("repeat").innerHTML = "";
				document.getElementById("addName").value = "";
				document.getElementById("addPassword").value= "";
				document.getElementById("addEmail").value = "";
				var table = $('#dataTables-add').DataTable();
			
				table.row.add( [
					UserName,
					UserEmail,
				] ).draw( false );
				}
		});
	}
	
	return false;	
}
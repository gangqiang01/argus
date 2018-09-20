//onload page
$(function() {
	LoginStatus("UserDuedateCheck","management.html");
	//avoid Guest user come in
	if(localStorage.getItem("Company") === "Guest" ){
		window.location.href = "Login.html";
	}
	SetHTML("barset_management");
	$('#datepickid div').datepicker({
		startDate: "+1d",
		todayHighlight: true
	}).on('changeDate', function(e){
		$('#dt_due').val(e.format('yyyy/mm/dd'))
	});
	$('#dataTables-example').dataTable( {
	  "columnDefs": [ {
		"targets": 3,
		"data": null,
		"render": function ( data, type, full, meta ) {
			var permission = data[3].split("");
			var fa = '';
			var PermissionName = ["Super user", "Register permission", "Install permission", "APP permission", "Peripheral permission", "Download", "Tracking permission", "Timer permission"];
			//var PermissionName = ["Timer permission", "Tracking permission", "Download", "Peripheral permission", "APP permission", "Install permission", "Guest", "Super user"];
			for(k = 0; k < permission.length; k++){
				var UserName = "'"+data[1]+"'";
				var UserCompany = "'"+data[0]+"'";
				if(permission[k] === "0"){
					var btnSwitch = "'On'";
					fa +='<div class="fatooltip"><i class="fa fa-minus-square-o fa-border" onclick="PermissionSwitch('+UserCompany+','+UserName+','+k+','+btnSwitch+')" ><span class="fatooltiptext">'+PermissionName[k]+'</span></i></div>';	
				}else{
					var btnSwitch = "'Off'";
					fa +='<div class="fatooltip"><i class="fa fa-check-square-o fa-border" onclick="PermissionSwitch('+UserCompany+','+UserName+','+k+','+btnSwitch+')" ><span class="fatooltiptext">'+PermissionName[k]+'</span></i></div>';
				}
			}
		  return fa;
		}
	  } ,{
		orderable: false,
		className: 'select-checkbox',
		targets:   5
	}],select: {
		style:    'os',
		selector: 'td:first-child'
	}
	} );
	
	var table = $('#dataTables-example').DataTable();
	$('#dataTables-example tbody').on( 'click', 'tr', function () {
		$(this).toggleClass('selected');
		
	} );
	
	GetAllAccount();
});

function SetPermissionContent(){
	if(ProfileInfo.LEVEL === "1"){
		document.getElementById("userduedate").style.display="";
		document.getElementById("duedatepicker").style.display="";
	}else if(ProfileInfo.LEVEL === "2"){
		document.getElementById("userduedate").style.display="";
		document.getElementById("duedatepicker").style.display="";
	}

	var permission = ProfileInfo.PERMISSION.split("");
	if(permission[1]=== "1"){
		document.getElementById("register").style.display="";
		document.getElementById("deleteaccount").style.display="";
	}
}

function CheckItemSelect(sub){
	var table = $('#dataTables-example').DataTable();
	if(table.rows('.selected').data().length === 0){
		document.getElementById("myModalLabel").innerHTML = "Error Message!"
		document.getElementById("AlertMsgBody").innerHTML = "Please select rows by click the table";
		$('#myModal').modal('toggle');
	}else{
		
		document.getElementById("myModalLabel").innerHTML = "Warning!";
		if(sub === "multiDeleteAccount"){
			document.getElementById("AlertMsgBtn").style.display="";
			document.getElementById("AlertMsgBody").innerHTML = "Are you sure you want to delete Account? ";
			document.getElementById("AlertMsgBtn").onclick = function() {multiDeleteAccount()};
			$('#myModal').modal('toggle');
			
		}else if(sub === "SetUserDuedate"){
			document.getElementById("myModalLabel").innerHTML = "Please set expiration date!!";
			document.getElementById("AlertMsgBtn").style.display="";
			document.getElementById("AlertMsgBtn").onclick = function() {SetUserDuedate()};
			$('#myModal').modal('toggle');
		}
	}
	
}

function multiDeleteAccount(){
		var postdata = {submit: sub};
		var sub = "DeleteUser";
		for (var i = 0; i < table.rows('.selected').data().length; i++) {
			var UserCompany = table.rows('.selected').data()[i][0];
			var UserName = table.rows('.selected').data()[i][1];
			postdata = {
				company: UserCompany,
				name: UserName,
				submit: sub
			}
			$.post("/golang",
			postdata,
			function(data,status){
			});
		}
	
		GetAllAccount();
}

function PermissionSwitch(UserCompany, UserName, numPermission, status){
	if(status === "On"){
		var permission = "1";
	}else{
		var permission = "0";
	}
	var company = localStorage.getItem("Company");
	var postdata = {submit: sub};
	var sub = "ChangeUserPermission";
	var name = getCookie('UserName');
	postdata = {
		//使用者資訊
		company: company,
		name: name,
		
		//點擊的資訊
		username: UserName,
		usercompany: UserCompany,
		
		permission: permission,
		number: numPermission,
		submit: sub
	}
	$.post("/golang",
		postdata,
		function(data,status){
			if (data !== "PermissionFail")
				GetAllAccount();
		});
}

function SetUserDuedate(){
		var postdata = {submit: sub};
		var sub = "SetUserDuedate";
		var DueDate = document.getElementById("dt_due").value;
		var due = DueDate.split("/");
		var d = new Date();
		d.setFullYear(parseInt(due[0]), parseInt(due[1]), parseInt(due[2]));
		d.setHours(23);d.setMinutes(59);d.setSeconds(59);
		var table = $('#dataTables-example').DataTable();
		for (var i = 0; i < table.rows('.selected').data().length; i++) {
			var UserCompany = table.rows('.selected').data()[i][0];
			var UserName = table.rows('.selected').data()[i][1];
			postdata = {
				company: UserCompany,
				name: UserName,
				date: DateToUnix(d),
				submit: sub
			}
			$.post("/golang",
				postdata,
				function(data,status){
					GetAllAccount();
				});
		}
}

function GetAllAccount() {
	var company = localStorage.getItem("Company");
	var UserName = getCookie('UserName');
	var sub = "GetAllAccount";
	var postdata = {submit: sub};
	
	postdata = {
			company: company,
			name: UserName,
			submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		var EachUser = data.split("***");
		var table = $('#dataTables-example').DataTable();
		 //table.row.add( ["qwdqwdqw","qqqqqq","dwqdqw","qcvvrr","wdqqwqdqwd"] ).draw( false );
		table.clear(); 
		for(i = 0; i < EachUser.length-1; i++)
		{
			var ss = EachUser[i].split("%/%");
			table.row.add( [
				ss[0],
				ss[1],
				ss[2],
				ss[3],
				UnixToTime(ss[4]),
				"",
			] ).draw( false );
		}
		
	});
	
}
var CommandTitle = [];
var CommandIcon = [];
var AllCommand = [];  // [CommandNumber, CommandTitle, CommandIcon]...

var ArrayDevice = [];
var ArrayDevicename = [];
var CommandSelected = []; //two dimension array [CommandNumber, CommandTitle, DeviceSelected, CommandComm;;;CommandParam, LogCommandComm, LogCommandContent, CommandFrom , (selected true/false)]
var ItemOnClick = false;
var myObj = "";
//function RCPCommand(number, title){
$(function() {
	LoginStatus("UserDuedateCheck","profile.html"); 
	SetHTML("barset_schedule");
	LoadJsonFile();
});
var company = localStorage.getItem("Company");	var type="";
if(company === "Guest"){
	type = "assets/json/lite.txt";
}else{
	type = "assets/json/pro.txt";
}

function LoadJsonFile() {
	$.getJSON( type, function( data ) {
		//---- load command Json ----
		myObj = data;
		var CommandNumber = [];
		var objlength = Object.keys(myObj).length;
		for(var i=1; i< objlength+1; i++){
			var tmp = GetCommand(i, "CommTitle");
			var icon = GetCommand(i, "Icon");
			if(tmp !== "false"){
				CommandTitle.push(tmp);
				CommandIcon.push(icon);
				CommandNumber.push(i);
			}
		}
		for(var i=0;i<CommandTitle.length;i++){
			var t = [CommandNumber[i],CommandTitle[i],CommandIcon[i]];
			AllCommand.push(t);
		}
		//---- load command Json ----
		
		//---- command list search ----
		$("#searchText").on( "trigger", function () {
			$("#autocompleteTest").autocomplete("search", ""); 
			if ($( "#searchText" ).val()==''){
				$('#autocompleteTest').empty();
			}
			return false;
		} );
		$("#autocompleteTest").empty();
		
		$('#searchText').autocomplete({
			search: function(event, ui) {
				$('#autocompleteTest').empty();
			},
			close:function(event){
				console.log(event);
				setTimeout(function(){
					if(!ItemOnClick){
						if ($('#searchText').val()==''){
							$('#autocompleteTest').empty();
						}
						console.log(ItemOnClick);
					}else{
						ItemOnClick = false;
						console.log(ItemOnClick);
					}
				}, 200);
				
			},
			minLength: 0,
			source: function (request, response) {
				var result = $.ui.autocomplete.filter(CommandTitle, request.term);
				result.push("abcdefghijklmnopqrstuvwxyz0123456789")
				response(result);
			}
		}).focus(function () {
			$(this).autocomplete("search", "");
		}).data('ui-autocomplete')._renderItem = function(ul, item) {
			if(item.label === "abcdefghijklmnopqrstuvwxyz0123456789"){
				CommandListAction();
				return $('<div/>')
					.data('ui-autocomplete-item', item)
					.append("")
					.appendTo($('#list-group-selected'));
			}else{
				//var i = jQuery.inArray( item.value, CommandTitle );
				var i;
				var k = item.value;
				for(var j=0; j<Object.keys(AllCommand).length;j++){
					if(AllCommand[j][1] === k) i = j;
				}
				return $('<div/>')
					.data('ui-autocomplete-item', item)
					.append("<li class='list-group-item list-item' value='"+AllCommand[i][1]+"'> <div class='row'> <div class='col-md-12'> <div class='media-left media-middle'> <a href='#'> <i class='fa "+AllCommand[i][2]+" fa-2x' aria-hidden='true'></i> </a> </div> <div id='center'>" + item.value + "<div id='center' class='checkboxFive pull-right'> <input type='checkbox' value='1' id='checkboxFiveInput' name='someSwitchOption001i' class='checkboxFiveInput'/><label for='checkboxFiveInput'></label> </div> </div> </div> </div> </li>")
					.appendTo($('#autocompleteTest'));
			}
			
		};
		$( "#autocompleteTest" ).addClass("fixedHeight");
		//$("#autocompleteTest").autocomplete("search", ""); 
		$('.has-clear input[type="text"]').on('input propertychange', function() {
		  var $this = $(this);
		  var visible = Boolean($this.val());
		  //$this.siblings('.form-control-clear').toggleClass('hidden', !visible);
		}).trigger('propertychange');
		$('.form-control-clear').click(function() {
		  $(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
			$("#autocompleteTest").empty();
		});
		//CommandListAction();
		//---- command list search ----
		
		//---- get devices ----
		var postdata = {
			company: localStorage.getItem("Company"),
			name: getCookie("UserName"),
			submit: "GetAllDevices"
		}
		$.post("/golang",
		postdata,
		function(data,status){
			for(var i=0;i<Object.keys(data).length;i++){
				var deviceid , devicename = "";
				deviceid = data[i].DEVICEID;
				devicename = data[i].DEVICENAME;
				ArrayDevice.push([deviceid,devicename]);
				ArrayDevicename.push(deviceid+"("+devicename+")");
			}
				
			//devices.push(['over','over']);ArrayDevicename.push('over');
			//---- get devices list search ----
			$("#searchDevices").on( "trigger", function () {
				$("#autocompleteDevices").autocomplete("search", "");
				if ($( "#searchDevices" ).val()==''){
					$('#autocompleteDevices').empty();
				}
				return false;
			} );
			$("#autocompleteDevices").empty();
			
			$('#searchDevices').autocomplete({
				search: function(event, ui) {
					$('#autocompleteDevices').empty();
				},
				close:function(event){
					console.log(event);
					setTimeout(function(){
						if(!ItemOnClick){
							if ($('#searchDevices').val()==''){
								$('#autocompleteDevices').empty();
							}
						}else{
							ItemOnClick = false;
						}
					}, 200);
					
				},
				minLength: 0,
				source: function (request, response) {
					var result = $.ui.autocomplete.filter(ArrayDevicename, request.term);
					result.push("abcdefghijklmnopqrstuvwxyz0123456789");
					response(result);
				}
			}).focus(function () {
				$(this).autocomplete("search", "");
			}).data('ui-autocomplete')._renderItem = function(ul, item) {
				if(item.label === "abcdefghijklmnopqrstuvwxyz0123456789"){
					DevicesListAction();
					return $('<div/>')
						.data('ui-autocomplete-item', item)
						.append("")
						.appendTo($('#list-group-selected'));
				}else{
					var i;
					var k = item.value.split("(");
					for(var j=0; j<Object.keys(ArrayDevice).length;j++){
						if(ArrayDevice[j][0] === k[0]) i = j;
					}
					return $('<div/>')
						.data('ui-autocomplete-item', item)
						.append("<li class='list-group-item list-devices-item' value='"+ArrayDevice[i][0]+"'> <div class='row'> <div class='col-md-12'> <div class='media-left media-middle'> <a href='#'> <i class='fa fa-hdd-o fa-2x' aria-hidden='true'></i> </a> </div> <div id='center'>" + item.value + "<div id='center' class='checkboxFive pull-right'> <input type='checkbox' value='1' id='checkboxFiveInput' name='someSwitchOption001i' class='checkboxDeviceInput'/><label for='checkboxDeviceInput'></label> </div> </div> </div> </div> </li>")
						.appendTo($('#autocompleteDevices'));
				}
				
			};
			$( "#autocompleteDevices" ).addClass("fixedHeight");
			$( "#list-group-devices-selected" ).addClass("fixedHeight");
			$('.has-clear input[type="text"]').on('input propertychange', function() {
			  var $this = $(this);
			  var visible = Boolean($this.val());
			  //$this.siblings('.form-control-devices-clear').toggleClass('hidden', !visible);
			}).trigger('propertychange');
			$('.form-control-devices-clear').click(function() {
			  $(this).siblings('input[type="text"]').val('')
				.trigger('propertychange').focus();
				$("#autocompleteDevices").empty();
			});
			DevicesListAction();
			//---- get devices list search ----
			
		});
		//---- get devices ----
	});
}

// ---- command list search ----
function CommandListAction(){
	$( "#list-group-selected" ).addClass("fixedHeight");
	$('.list-item').prop('onclick',null).off('click');
	$('.list-select').prop('onclick',null).off('click');
	$(".list-group-item").hover(function () {
        $(this,".list-group-item").css('background-color','rgba(172, 172, 172, 0.11)');
		$(this,".checkboxFive").addClass('itemlisthover');
		$( "style" ).remove( ':contains("opacity")' );
		$(this,".checkboxFive label").append("<style>.itemlisthover .checkboxFive label::after{ opacity: 0.5; }</style>");
    },function () {
        $(this,".list-group-item").css('background-color','white');
		$(this,".checkboxFive").removeClass('itemlisthover');
		$( "style" ).remove( ':contains("opacity")' );
		$(this,".checkboxFive label").append("<style>.itemlisthover .checkboxFive label::after{ opacity: 0.2; }</style>");
    });
		
	$(".list-item").on("click", function(){
		ItemOnClick = true;
		var removeItem = $(this,".list-item").attr('value');
		
		SetCommand(GetCommandNumber(removeItem));
		// if(SetCommand(GetCommandNumber(removeItem)) !== false){
			// $(this,'.checkboxFiveInput').prop('checked', true);
			// $('<li class="list-group-item list-select" value="'+removeItem+'">'+$(this,'.list-item').html()+'</li>').appendTo('#list-group-selected');
			// var d = "'"+removeItem+"'";
			// var s = 'li:contains('+d+')';
			// $( '.checkboxFiveInput', s ).prop('checked', true);
			// CommandListAction();
			// $(this,".list-item").addClass('hide');
		// }
		
		
	});
	
	$(".list-select").on("click", function(){
		var removeItem = $(this,".list-item").attr('value');
		var d = "'"+removeItem+"'";
		var s = 'li:contains('+d+')';
		if(!$( '.checkboxFiveInput', s ).is(':checked')){
			$( '.checkboxFiveInput', s ).prop('checked', true);
			for(var i=0;i< Object.keys(CommandSelected).length;i++){
				if(CommandSelected[i][1] === removeItem)
					CommandSelected[i][7] = true;
			}
		}else{
			$( '.checkboxFiveInput', s ).prop('checked', false);
			for(var i=0;i< Object.keys(CommandSelected).length;i++){
				if(CommandSelected[i][1] === removeItem)
					CommandSelected[i][7] = false;
			}
		}
		console.log(CommandSelected);
	});
}

function SetCommandAction(removeItem){
	console.log(removeItem);
	CommandTitle = jQuery.grep(CommandTitle, function(value) {
	  return value != removeItem;
	});
	var d = "'"+removeItem+"'";
	var s = 'div:contains('+d+')';
	$('<li class="list-group-item list-select" value="'+removeItem+'"><div class="row">'+$(s, '.list-item').html()+'</div></li>').appendTo('#list-group-selected');
	var s = ':contains('+d+')';
	//$(".list-item",s).addClass('x');
	$( ".list-item" ).remove( s );
	var s = 'li:contains('+d+')';
	$( '.checkboxFiveInput', s ).prop('checked', true);
	CommandListAction();
	
}
var DevicesSelected = [];
// ---- devices list search ----
function DevicesListAction(){
	$( "#list-group-devices-selected" ).addClass("fixedHeight");
	$('.list-devices-item').prop('onclick',null).off('click');
	$('.list-devices-select').prop('onclick',null).off('click');
	$(".list-group-item").hover(function () {
        $(this,".list-group-item").css('background-color','rgba(172, 172, 172, 0.11)');
		$(this,".checkboxFive").addClass('itemlisthover');
		$( "style" ).remove( ':contains("opacity")' );
		$(this,".checkboxFive label").append("<style>.itemlisthover .checkboxFive label::after{ opacity: 0.5; }</style>");
    },function () {
        $(this,".list-group-item").css('background-color','white');
		$(this,".checkboxFive").removeClass('itemlisthover');
		$( "style" ).remove( ':contains("opacity")' );
		$(this,".checkboxFive label").append("<style>.itemlisthover .checkboxFive label::after{ opacity: 0.2; }</style>");
    });
	
	
	$(".list-devices-item").on("click", function(){
		ItemOnClick = true;
		var removeItem = $(this,".list-devices-item").attr('value');
		ArrayDevicename = jQuery.grep(ArrayDevicename, function(value) {
			var t = value.split("(");
		  return t[0] != removeItem;
		});
		$('<li class="list-group-item list-devices-select" value="'+removeItem+'">'+$(this,'.list-devices-item').html()+'</li>').appendTo('#list-group-devices-selected');
		var d = "'"+removeItem+"'";
		var s = 'li:contains('+d+')';
		$( '.checkboxDeviceInput', s ).prop('checked', true);
		DevicesListAction();
		DevicesSelected.push(removeItem);
		$(this,".list-devices-item").addClass('hide');
		console.log(DevicesSelected);
	});
	$(".list-devices-select").on("click", function(){
		var removeItem = $(this,".list-devices-item").attr('value');
		var d = "'"+removeItem+"'";
		var s = 'li:contains('+d+')';
		if(!$( '.checkboxDeviceInput', s ).is(':checked')){
			$( '.checkboxDeviceInput', s ).prop('checked', true);
			DevicesSelected.push(removeItem);
			console.log(DevicesSelected);
		}else{
			$( '.checkboxDeviceInput', s ).prop('checked', false);
			DevicesSelected = jQuery.grep(DevicesSelected, function(value) {
			  return value != removeItem;
			});
		}
	});
	
	
}
function EditScheduleStatus(scheduleid){
	
} 
var EditStatus = false;
var EditCalendarEventId;
var EditScheduleId;
function EditSchedule(data){
	document.getElementById("AddEvent").innerHTML = 'Edit';
	document.getElementById("CancelEvent").style.display = '';
	document.getElementById("event-editor").innerHTML = 'Edit events';
	$("#CancelEvent").click(function() {
		ClearAll();
		document.getElementById("event-editor").innerHTML = 'Add events';
		document.getElementById("AddEvent").innerHTML = 'Add';
		document.getElementById("CancelEvent").style.display = 'none';
	});
	EditStatus = true;
	EditCalendarEventId = data.calendarEventId;
	EditScheduleId = data.scheduleid;
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	var scheduleid = data.scheduleid;
	var command = data.command.split("/");
	var devices = data.device.split("/");
	console.log(devices);
	for(var i=0;i<devices.length-1;i++){
		
		for(var j=0;j<ArrayDevicename.length;j++){
			var dev = ArrayDevicename[j].split("(");
			if(dev[0] === devices[i] ){
				$('<li class="list-group-item list-devices-select" value="'+devices[i]+'">'+"<div class='row'> <div class='col-md-12'> <div class='media-left media-middle'> <a href='#'> <i class='fa fa-hdd-o fa-2x' aria-hidden='true'></i> </a> </div> <div id='center'>" + ArrayDevicename[j] + "<div id='center' class='checkboxFive pull-right'> <input type='checkbox' value='1' id='checkboxFiveInput' name='someSwitchOption001i' class='checkboxDeviceInput'/><label for='checkboxDeviceInput'></label> </div> </div> </div> </div> "+'</li>').appendTo('#list-group-devices-selected');
				var d = "'"+devices[i]+"'";
				var s = 'li:contains('+d+')';
				$( '.checkboxDeviceInput', s ).prop('checked', true);
				DevicesSelected.push(devices[i]);
			}
		}
		ArrayDevicename = jQuery.grep(ArrayDevicename, function(value) {
			var t = value.split("(");
		  return t[0] != devices[i];
		});
		
	}
	
	
	var postdata = {
		name: name,
		company: company,
		scheduleid: scheduleid,
		submit: "GetScheduleById"
	}
	$.post("/golang",
	postdata,
	function(data,status){
		console.log(data);
		var AllInfo = data.split("***");
		for(var i=0;i<AllInfo.length-1;i++){
			var task = AllInfo[i].split("%/%");
			var deviceid, scheduleid, title, comm, logcomm, logcontent, userfrom, timestart, stat = "";
			for(var j=0;j<task.length;j++){
				var SchedueDetails = task[j].split(":");
				if(SchedueDetails[0] === "deviceid") {deviceid = SchedueDetails[1];}
				else if(SchedueDetails[0] === "scheduleid") {scheduleid = SchedueDetails[1];}
				else if(SchedueDetails[0] === "commandtitle") {title = SchedueDetails[1];}
				else if(SchedueDetails[0] === "command") {comm = SchedueDetails[1];}
				else if(SchedueDetails[0] === "logcommand") {logcomm = SchedueDetails[1];}
				else if(SchedueDetails[0] === "logcontent") {logcontent = SchedueDetails[1];}
				else if(SchedueDetails[0] === "userfrom") {userfrom = SchedueDetails[1];}
				else if(SchedueDetails[0] === "timestart") {timestart = SchedueDetails[1];}
				else if(SchedueDetails[0] === "status") {stat = SchedueDetails[1];}
			}
			
			var EachTitle = title.split("/");
			var EachDeviceid = deviceid.split("/");
			var EachComm = comm.split("/");
			var EachLogcomm = logcomm.split("/");
			var EachLogcontent = logcontent.split("/");
			var EachUserfrom = userfrom.split("/");
			for(var i=0;i<EachTitle.length-1;i++){
				console.log(EachTitle[i]);
				var d = "'"+EachTitle[i]+"'";
				var s = 'div:contains('+d+')';
				var k;
				for(var j=0; j<Object.keys(AllCommand).length;j++){
					if(AllCommand[j][1] === EachTitle[i]) k = j;
				}
				$('<li class="list-group-item list-select" value="'+EachTitle[i]+'">'+"<div class='row'> <div class='col-md-12'> <div class='media-left media-middle'> <a href='#'> <i class='fa "+AllCommand[k][2]+" fa-2x' aria-hidden='true'></i> </a> </div> <div id='center'>" + AllCommand[k][1] + "<div id='center' class='checkboxFive pull-right'> <input type='checkbox' value='1' id='checkboxFiveInput' name='someSwitchOption001i' class='checkboxFiveInput'/><label for='checkboxFiveInput'></label> </div> </div> </div> </div> "+'</li>').appendTo('#list-group-selected');
				var s = ':contains('+d+')';
				//$(".list-item",s).addClass('x');
				$( ".list-item" ).remove( s );
				var s = 'li:contains('+d+')';
				$( '.checkboxFiveInput', s ).prop('checked', true);
				CommandTitle = jQuery.grep(CommandTitle, function(value) {
				  return value != EachTitle[i];
				});
				CommandSelected.push([GetCommandNumber(EachTitle[i]), EachTitle[i], deviceid, EachComm[i], EachLogcomm[i], EachLogcontent[i], EachUserfrom[i], true]);
			}
			
			console.log(CommandSelected);

		}
		CommandListAction();
	});
	
	DevicesListAction();
	//DevicesSelected.push(removeItem);
	
}

function DeleteSchedule(data){
	ClearAll();
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	var scheduleid = data.scheduleid;
	
	var postdata = {
		name: name,
		company: company,
		scheduleid: scheduleid,
		submit: "DeleteSchedule"
	}
	$.post("/golang",
	postdata,
	function(data,status){
		var Title = "Success Message!"
		var MsgBody = "Delete successfully.";
		document.getElementById("myModalLabel").innerHTML = Title;
		document.getElementById("AlertMsgBody").innerHTML = MsgBody;
		document.getElementById("AlertMsgEvent").style.display = "none";
		document.getElementById("AlertMsgBtn").style.display = "none";
		document.getElementById("ShowInfoBtn").style.display = "none";
	});
}

function ClearAll(){
	$("#autocompleteTest").empty();
	$("#autocompleteDevices").empty();
	CommandTitle = [];
	for(var i=0;i<Object.keys(AllCommand).length;i++){
		CommandTitle.push(AllCommand[i][1]);
	}
	
	ArrayDevicename = [];
	for(var i=0;i<Object.keys(ArrayDevice).length;i++){
		ArrayDevicename.push(ArrayDevice[i][0]+"("+ArrayDevice[i][1]+")");
	}
	CommandSelected = [];
	DevicesSelected = [];
	$( "#list-group-selected" ).empty();
	$("#list-group-devices-selected").empty();
	$('#searchText').val('');
	$('#searchDevices').val('');
}

function SetCommand(sub){
	document.getElementById("AlertMsgEvent").innerHTML = '<i class="fa fa-tags" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Devices selected:<br><input type="text" id="devicetag" />';
	var AllDevicesID = "";
	$('#devicetag').tagsinput({
		tagClass: function(item) {
			return 'label label-primary';
		},
		itemValue: 'value',
		itemText: 'text',
		tagChar: 'o',
	});
	
	if(DevicesSelected.length === 0){
		var Title = "Error Message!"
		var MsgBody = "Please select devices before adding command";
		SetAlertMsgInnerHTML(Title, MsgBody);
		document.getElementById("AlertMsgEvent").style.display = "none";
		document.getElementById("AlertMsgBtn").style.display = "none";
		return false;
	}else{
		for (var i = 0; i < DevicesSelected.length; i++) {
			var name = GetDevicesName(DevicesSelected[i]);
			$('#devicetag').tagsinput('add', { "value": DevicesSelected[i] , "text": name});
			
			
		}
		$('.bootstrap-tagsinput').find('.tag').removeClass('tag');
		document.getElementById("AlertMsgEvent").style.display = "";
		document.getElementById("devicetag").disabled = true;
		
		SetCommandItem(sub, "schedule");		
		 
		 return false;
	}
	
		
	
		

		

}


function GetDevicesName(id){
	console.log(ArrayDevice);
	for(var i=0;i<Object.keys(ArrayDevice).length;i++){
		if(ArrayDevice[i][0] === id){
			if(ArrayDevice[i][1] === "-"){
				return id;
			}else{
				return ArrayDevice[i][1];
			}
		}
			
	}
	return id;
}

function GetCommandNumber(command){
	for(var i=0;i<Object.keys(AllCommand).length;i++){
		if(AllCommand[i][1] === command)
			return AllCommand[i][0];
	}	
	return false;	
}

function SliderShow(){
	// Without JQuery
	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
}

function GetDeviceTag(){
	//var device = [];
	var items = $('#devicetag').tagsinput('items');
	
	return items;
}


function GetCommand(number, title){
	var str = ""+number+""; 
	var dd = myObj[str];
	var command="";
	if(dd[1].Enabled === "false"){
		return "false";
	}
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
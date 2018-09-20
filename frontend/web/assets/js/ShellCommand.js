//onload page
var demo4Rows = [];
var datatimes;

//for GetAllDevices
var GetUpdateDevice = ""; var m_Update = false;var m_devices = []; 

$(function() {
	//LoginStatus("UserDuedateCheck","AllDevice.html");
	//SetHTML("barset_management");
	
		
});

function setup() {
	//loadJSON(type, drawData);
}
var myObj = "";
var DeviceTable = "";
function drawData(data) {
	myObj = data;
	//---- device table ----//
	$('#dataTables-example').dataTable( {
	  "columnDefs": [ {
		"targets": 5,
		"className": "dt-center",
		"data": null,
		"render": function ( data, type, full, meta ) {
			if(data[5] === "online"){
				var fa ='<i class="fa fa-child" style="color:green">'+data[5]+'</i>';
			}else if(data[5] === "offline"){
				var fa ='<i class="fa fa-minus-circle" style="color:red">'+data[5]+'</i>';
			}
			
		  return fa;
		}
	  },{
		"targets": 2,
		"className": "dt-center",
		"data": null,
		"render": function ( data, type, full, meta ) {
			var fa = '';
			if(data[5] === "online"){
				var id = "'"+data[1]+"'";
				fa =data[2]+'<a href="javascript: void(0)" onclick="DeviceNameUpdate('+id+')"><i class="fa fa-pencil-square-o pull-right" align="right"></i></a>';			
			}else{
				fa = data[2];
			}
			
			
		  return fa;
		}
	  },{
		"targets": 6,
		"className": "dt-center",
		"data": null,
		"render": function ( data, type, full, meta ) {
			var fa = '';
			
			var id = "'"+data[1]+"'";
			if(data[5] === "online"){
				fa = '<a href="/details.html?d%'+data[1]+'" <i class="fa fa-eye" align="center"></i></a>';		
			}else{
				fa = '<i class="fa fa-eye-slash" align="center"></i>';
			}
				
			
		  return fa;
		}
	  },{
		orderable: false,
		className: 'select-checkbox',
		targets:   0
	} ],select: {
		style:    'os',
		selector: 'td:first-child'
	}, "order": [[ 1, "asc" ]],
	rowReorder: {
		selector: 'td:nth-child(0)'
	},
	responsive: true
	} );

	DeviceTable = $('#dataTables-example').DataTable();
	$('#dataTables-example tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
		
		 var Data = DeviceTable.rows( this ).data().toArray();
		 var rowData = (Data[0]);
		 // if(rowData[5] === "offline"){
			// var Title = "Warning!"
			// var MsgBody = "Your device is offline.";
			// SetAlertMsgInnerHTML(Title, MsgBody);
			// document.getElementById("AlertMsgEvent").style.display = "none";
			// document.getElementById("AlertMsgBtn").style.display = "none";
		 // }else{
			$(this).toggleClass('selected');
		 //}
	} );
	
	$('#dataTables-example tbody').on( 'contextmenu', 'tr', function (e, dt, type, indexes) {
		$(this).addClass('selected');
		
	} );
	//---- device table ----//
	
	//---- log table ----//
	 $('#LogTable').DataTable( {
		"scrollY":        "200px",
		"scrollCollapse": true,
		"paging":         false,
		"order": [[ 0, "desc" ]]
	} );
	
	//---- log table ----//
	var subCare = "";
	var numCare = [2,3,7,8,9,10,11,19,20,22,23,33,34,35,36,44,45,48,49,50,51,53];
	//var fafaicon = ["fa-tablet","fa-tasks","fa-thermometer-three-quarters"];
	for(var i=0; i< numCare.length; i++){
		var command = GetCommand(numCare[i], "CommTitle");
		if(command !== "false"){
			subCare += '<li><a href="javascript: void(0)" onclick="SendCommand('+numCare[i]+')">'+command+'</a></li>';
		}
		//var commandTitle = "'"+numCare[i]+"'";
		
	}
	document.getElementById("subCare").innerHTML = subCare;
	
	var subManage = "";
	var numManage = [1,4,12,13,14,18,24,25,26,29,31,32,37,38,39,40,41,42,52,54,55,56,57,59,60,61,62,63,64];
	for(var i=0; i< numManage.length; i++){
		var command = GetCommand(numManage[i], "CommTitle");
		if(command !== "false"){
			subManage += '<li><a href="javascript: void(0)" onclick="SendCommand('+numManage[i]+')">'+command+'</a></li>';
		}
		//var commandTitle = "'"+numManage[i]+"'";
	}
	document.getElementById("subManage").innerHTML = subManage;
	
	var subSecure = "";
	var numSecure = [5,6,15,16,17,21,27,28,43,46,47,58];
	for(var i=0; i< numSecure.length; i++){
		var command = GetCommand(numSecure[i], "CommTitle");
		if(command !== "false"){
			subSecure += '<li><a href="javascript: void(0)" onclick="SendCommand('+numSecure[i]+')">'+command+'</a></li>';
		}
		//var commandTitle = "'"+numSecure[i]+"'";
		
	}
	document.getElementById("subSecure").innerHTML = subSecure;
	
	var subExtend = "";
	var numExtend = [];
	for(var i=0; i< numExtend.length; i++){
		var command = GetCommand(numExtend[i], "CommTitle");
		if(command !== "false"){
			subExtend += '<li><a href="javascript: void(0)" onclick="SendCommand('+numExtend[i]+')">'+command+'</a></li>';
		}
		//var commandTitle = "'"+numExtend[i]+"'";
		
	}
	document.getElementById("subExtend").innerHTML = subExtend;
	
	//--------------
	var AllAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var Alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var AlphBig = 'Alphabet-'+AllAlphabet[i];
	var Alpha = 'Alphabet-'+Alphabet[i];
	
	var objlength = Object.keys(myObj).length;
	for(var i=1; i< objlength+1; i++){
		var command = GetCommand(i, "CommTitle");
		if(command !== "false"){
			var ss = command.split("");
			switch (ss[0]) {
				case "a":
				case "A":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-a").innerHTML += sub;
					document.getElementById("panel-A").style.display = "";
					break;
				case "c":
				case "C":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-c").innerHTML += sub;
					document.getElementById("panel-C").style.display = "";
					break;
				case "d":
				case "D":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-d").innerHTML += sub;
					document.getElementById("panel-D").style.display = "";
					break;
				case "e":
				case "E":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-e").innerHTML += sub;
					document.getElementById("panel-E").style.display = "";
					break;
				case "f":
				case "F":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-f").innerHTML += sub;
					document.getElementById("panel-F").style.display = "";
					break;
				case "g":
				case "G":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-g").innerHTML += sub;
					document.getElementById("panel-G").style.display = "";
					break;
				case "h":
				case "H":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-h").innerHTML += sub;
					document.getElementById("panel-H").style.display = "";
					break;
				case "l":
				case "L":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-l").innerHTML += sub;
					document.getElementById("panel-L").style.display = "";
					break;
				case "m":
				case "M":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-m").innerHTML += sub;
					document.getElementById("panel-M").style.display = "";
					break;
				case "r":
				case "R":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-r").innerHTML += sub;
					document.getElementById("panel-R").style.display = "";
					break;
				case "s":
				case "S":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-s").innerHTML += sub;
					document.getElementById("panel-S").style.display = "";
					break;
				case "t":
				case "T":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-t").innerHTML += sub;
					document.getElementById("panel-T").style.display = "";
					break;
				case "u":
				case "U":
					var sub = '<li><a href="javascript: void(0)" onclick="SendCommand('+i+')">'+command+'</a></li>';
					document.getElementById("Alphabet-u").innerHTML += sub;
					document.getElementById("panel-U").style.display = "";
					break;
				
			}
		}
		
	}
	
	//--------------
	//ex. 10/13/1/4/...
	var postdata = {
		name: getCookie('UserName'),
		company: localStorage.getItem("Company"),
		submit: "GetCommandTimes"
	}
		
	
	$.post("/golang",
	postdata,
	function(data,status){
		var scores = []; 
		console.log(data);
		datatimes = data;
		document.getElementById("frequencyused").innerHTML = "";
		var t = datatimes.split("/");
		console.log(t.length);
		for(var i=0; i<t.length-1; i++){
			var a = t[i].split(":");
			scores.push({item:a[0],times:parseInt(a[1])});
			
		}
		scores.sort(function (a, b) {
			return a.times < b.times ? 1 : -1;
			});
		if(t.length-1 >= 10){
			for(var i=0; i< 10;i++){
				var fa = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="javascript: void(0)" onclick="SendCommand('+scores[i].item+')">'+GetCommand(scores[i].item, "CommTitle")+'<label class="pull-right">'+scores[i].times+'</label></a></h4></div></div>';
				document.getElementById("frequencyused").innerHTML += fa;
			}
		}else{
			for(var i=0; i< t.length-1;i++){
				var fa = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="javascript: void(0)" onclick="SendCommand('+scores[i].item+')">'+GetCommand(scores[i].item, "CommTitle")+'<label class="pull-right">'+scores[i].times+'</label></a></h4></div></div>';
				document.getElementById("frequencyused").innerHTML += fa;
			}
		}
		
		
	});
	GetAllDevices();
	GetLogInfo(3);		
}
function GetLogInfo(days){
	document.getElementById("log-spinner").style.display = "block";
	var tmp = true;
	document.getElementById("daysRecord").value = days;
	if(days === 3){
		document.getElementById("daysRecord").innerHTML = 'Three days ago<span class="caret"></span>';
	}else if(days === 7){
		document.getElementById("daysRecord").innerHTML = 'One week ago<span class="caret"></span>';
	}else if(days === 30){
		document.getElementById("daysRecord").innerHTML = 'One month ago<span class="caret"></span>';
	}else if(days === 182){
		document.getElementById("daysRecord").innerHTML = 'Half a year ago<span class="caret"></span>';
	}else{tmp = false; document.getElementById("daysRecord").innerHTML = 'Three days ago<span class="caret"></span>';
	document.getElementById("daysRecord").value = 3;}
	
	if(tmp){
		var postdata = {
			company: localStorage.getItem("Company"),
			name: getCookie("UserName"),
			days: days,
			submit: "GetLogInfo"
		}


		$.post("/golang",
		postdata,
		function(data,status){
			if(data !== undefined){
				var logtable = $('#LogTable').DataTable();
				logtable.clear(); 
				for(var i=0;i<Object.keys(data).length;i++){
					var LogsName, LogsTarget,LogsCommand, LogsContent,LogsFrom, LogsTime = "";
					LogsName = data[i].NAME;LogsTarget = data[i].TARGET;
					LogsCommand = data[i].COMMAND;LogsContent = data[i].CONTENT;
					LogsFrom = data[i].FROM;LogsTime = data[i].TIME;
					var t = LogsTarget.split("/");var target="";
					for(var j=0;j<t.length-1;j++)
						target += t[j]+"<br>";
						if(LogsFrom === "user"){
							var rowNode = logtable.row.add( [
								UnixToTime(LogsTime),
								LogsName,
								target,
								LogsCommand,
								LogsContent,
							] ).draw( false ).node();
						}
				}
				
					
			}
			document.getElementById("log-spinner").style.display = "none";
		})
	}
	$($.fn.dataTable.tables(true)).DataTable()
      .columns.adjust()
      .responsive.recalc();
}

function GetNowTimes(){
	var d = new Date();
	var time = "";
	var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;var Month = (d.getUTCMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getUTCSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getUTCFullYear()+"/"+Month+"/"+Day+" "+Hours+":"+Min+":"+Sec;	
	return time;
}


function SetAlertMsgInnerHTML(myModalLabel, AlertMsgBody){
	document.getElementById("AlertMsgTools").style.display = "none";
	document.getElementById("ShowInfoBtn").style.display = "none";
	document.getElementById("myModalLabel").innerHTML = "";
	document.getElementById("AlertMsgBody").innerHTML = "";
	document.getElementById("myModalLabel").innerHTML = myModalLabel;
	document.getElementById("AlertMsgBody").innerHTML = AlertMsgBody;
	$('#myModal').modal('toggle');
}
function ExpandMore(){
	if($(".expand").val() === '1'){
		$(".expand").val('0');
		$(".expand").slideUp();
	}else{
		$(".expand").val('1');
		$(".expand").slideDown();
	}
}
function SendCommand(sub){
	
	// if(DeviceTable.rows('.selected').data().length === 0){
		// var Title = "Error Message!"
		// var MsgBody = "Please select rows by click the table";
		// SetAlertMsgInnerHTML(Title, MsgBody);
		// document.getElementById("AlertMsgEvent").style.display = "none";
		// document.getElementById("AlertMsgBtn").style.display = "none";
	// }else{
		document.getElementById("AlertMsgEvent").innerHTML = '<i class="fa fa-tags" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Devices selected:<br><input type="text" id="devicetag" />'+
																 '<br><a href="javascript: void(0)" onclick="ExpandMore()"><i class="fa fa-plus" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Add more devices:</a><br><div class="expand"><input type="text" id="moretag" /></div>';
		
		var devicetag = $('#devicetag').tagsinput({
			tagClass: function(item) {
				switch (item.continent) {
				  case 'online'   : return 'label label-success';
				  case 'offline'  : return 'label label-danger label-important';
				}
			},
			itemValue: 'value',
			itemText: 'text',
		});
		var moretag = $('#moretag').tagsinput({
			tagClass: function(item) {
				switch (item.continent) {
				  case 'online'   : return 'label label-success more';
				  case 'offline'  : return 'label label-danger label-important more';
				}
			},
			itemValue: 'value',
			itemText: 'text',
		});
		var container = moretag[0].$container;
		container[0].className += " taginputHide" ;
		var indexes = DeviceTable.rows().eq( 0 ).filter( function (rowIdx) {
			var data = DeviceTable.cell(rowIdx, 5 ).data();
			if(data[5] === "online"){
				var tmp = true;
				for (var i = 0; i < DeviceTable.rows('.selected').data().length; i++) {
					if(data[1] === DeviceTable.rows('.selected').data()[i][1]){
						tmp = false;
					}
				}
				if(tmp === true){
					var cell = DeviceTable.row( rowIdx ).data();
					if(cell[2] !== "-"){
						$('#moretag').tagsinput('add', { "value": cell[1] , "text": cell[2], "continent": cell[5]});
					}else{
						$('#moretag').tagsinput('add', { "value": cell[1] , "text": cell[1], "continent": cell[5]});
					}
				}
				
				
				
			}
		} );
		
		
		for (var i = 0; i < DeviceTable.rows('.selected').data().length; i++) {
			if(DeviceTable.rows('.selected').data()[i][5] === "online")
				if(DeviceTable.rows('.selected').data()[i][2] !== "-"){
					$('#devicetag').tagsinput('add', { "value": DeviceTable.rows('.selected').data()[i][1] , "text": DeviceTable.rows('.selected').data()[i][2], "continent": DeviceTable.rows('.selected').data()[i][5]});
				}else{
					$('#devicetag').tagsinput('add', { "value": DeviceTable.rows('.selected').data()[i][1] , "text": DeviceTable.rows('.selected').data()[i][1], "continent": DeviceTable.rows('.selected').data()[i][5]});
				}
		}
		var container = devicetag[0].$container;
		container[0].className += " device-taginput" ;
		
		document.getElementById("AlertMsgEvent").style.display = "";
		document.getElementById("devicetag").disabled = true;
		TagRemoveEvent();
		SetCommandItem(sub,"device-management");
		
		//setcommandtimes
		console.log(datatimes);
		var newrecord = "";
		var tmp = false;
		var t = datatimes.split("/");
		for(var i=0; i<t.length-1; i++){
			var a = t[i].split(":");
			if(parseInt(a[0]) === sub){
				a[1]++; t[i] = a[0]+":"+a[1];
				tmp = true;
			}
			newrecord += t[i]+"/";
				//newrecord += parseInt(sub)+":"+"1"+"/";
			
				
			
		}
		if(tmp === false){
				newrecord += parseInt(sub)+":"+"1"+"/";
		}
		datatimes = newrecord;
		console.log(newrecord);
		var postdata = {
			name: getCookie('UserName'),
			company: localStorage.getItem("Company"),
			commandtimes: datatimes,
			submit: "SetCommandTimes"
		}
			

		$.post("/golang",
		postdata,
		function(data,status){
			var scores = []; 
			console.log(data);
			datatimes = data;
			document.getElementById("frequencyused").innerHTML = "";
			var t = datatimes.split("/");
			console.log(t.length);
			for(var i=0; i<t.length-1; i++){
				var a = t[i].split(":");
				scores.push({item:a[0],times:parseInt(a[1])});
				
			}
			scores.sort(function (a, b) {
				return a.times < b.times ? 1 : -1;
				});
			
			if(t.length-1 >= 10){
				for(var i=0; i< 10;i++){
					var fa = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="javascript: void(0)" onclick="SendCommand('+scores[i].item+')">'+GetCommand(scores[i].item, "CommTitle")+'<label class="pull-right">'+scores[i].times+'</label></a></h4></div></div>';
					document.getElementById("frequencyused").innerHTML += fa;
				}
			}else{
				for(var i=0; i< t.length-1;i++){
					var fa = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="javascript: void(0)" onclick="SendCommand('+scores[i].item+')">'+GetCommand(scores[i].item, "CommTitle")+'<label class="pull-right">'+scores[i].times+'</label></a></h4></div></div>';
					document.getElementById("frequencyused").innerHTML += fa;
				}
			}
		});
	//}
		
	
		
	
}

function TagRemoveEvent(){
	$('.more').css( 'cursor', 'pointer' );
	
	
	var $dragging = null;
	// 滑鼠按下：拖曳效果啟動
	var h,w;
	$(".more").on("mousedown", function (e) {
	  
		$(".device-taginput").addClass('tag-blink');
	  // 這行最重要，將要被拖曳的元素，存進 $dragging 變數當中。
	  $dragging = $(e.target);
	  
	  h = $(e.target).height();
	  w = $(e.target).width();
	$dragging.offset({
		  top:e.pageY-(h/2),
		  left: e.pageX-(w/2)
		});
	});
	$(document.body).on("mousemove", function(e) {
	  if ($dragging) {
		$("body").addClass("-body-dragging");

		// 這行最重要，表示 $dragging 的位置跟著滑鼠，至於 +5 是因為我想讓該元素在滑鼠的右下角。
		$dragging.offset({
		  top: e.pageY-(h/2),
		  left: e.pageX-(w/2)
		});
	  }
	});
	$(document.body).on("mouseup", function (e) {
		$(".device-taginput").removeClass('tag-blink');
		var tagpos = $( e.target ).position();
		var tagposleft = tagpos.left;
		var tagpostop = tagpos.top;
		var tagwidth = $( e.target ).width();
		var tagheight = $( e.target ).height();
		var areapos = $( '.device-taginput' ).position();
		var areaposleft = areapos.left;
		var areapostop = areapos.top;
		var areawidth = $( '.device-taginput' ).width();
		var areaheight = $( '.device-taginput' ).height();
		
	  if($dragging){
		
		if( tagpostop < areapostop-(tagheight/2) || tagpostop > areapostop+areaheight+(tagheight/2) 
			|| tagposleft < areaposleft-(tagwidth/2) || tagposleft > areaposleft+areawidth+(tagwidth/2)){
			$dragging.animate({
				top: 0,
				left: 0
			});
		}else{
			
			var k = $(".device-taginput").find("input");
			var newtag = $( $dragging ).insertBefore( k );
			$dragging.offset({
			  top: e.pageY-(tagheight/2),
			  left: e.pageX-(tagwidth/2)
			});
			$dragging.animate({
				top: 0,
				left: 0
			});
			
			$(newtag).removeClass('more');
			$(newtag).prop('mousedown',null).off('mousedown');
			//$(".device-taginput").append($dragging);
		}
		$("body").removeClass("-body-dragging");
		$($dragging).remove();
		console.log(mousedown);
		$('#devicetag').tagsinput('add', mousedown);
		$('#moretag').tagsinput('remove', mousedown);
		
		//$($dragging).fadeOut(function(){ $(this).remove() });
		
		// 這行最重要，$dragging 重新設定成 null，表示該元素拖曳結束，以上程式碼都可以自行客製化。
		$dragging = null;
	  }
	});
	$('#devicetag').on('itemRemoved', function(event) {
		console.log("value:"+ event.item.value + " text:"+ event.item.text+ "  continent:"+event.item.continent);
		$('#moretag').tagsinput('refresh');
	  $('#moretag').tagsinput('add', { "value": event.item.value , "text": event.item.text, "continent":event.item.continent});
	  //$('#moretag').tagsinput('add', { "value": "jimmy" , "text": "koala", "continent":"offline"});
	  TagRemoveEvent();
	});
}

var UserName = getCookie('UserName');
function LogRecord(deviceid, command, content){
	var d = new Date();var m = d.getMinutes();var s = d.getSeconds();var h = d.getHours();var y = d.getUTCFullYear();var day = d. getUTCDate();var mon = d.getMonth()+1;
	var LogTable = $('#LogTable').DataTable();
	var rowNode = LogTable.row.add( [
		y+"/"+mon+"/"+day+" "+h+":"+m,
		UserName,
		deviceid,
		command,
		content,
	] ).draw( false ).node();
		
	
}

function SendMsgToDevices(){
	var AllDevicesID = "";
	for (var i = 0; i < DeviceTable.rows('.selected').data().length; i++) {
		var value = document.getElementById("txtMsg").value;
		var items = $('#devicetag').tagsinput('items');
		for (var i = 0; i < items.length; i++) {
			AllDevicesID += items[i].value +"/"; 
		}
		SendByGolang(AllDevicesID, GetCommand(53, "Comm")+";;;"+value, GetCommand(53, "Comm"), value, "user");	
	}
	document.getElementById("txtMsg").value = "";
}
function DeviceNameUpdate(id){
	document.getElementById("AlertMsgEvent").style.display = "none";
	document.getElementById("myModalLabel").innerHTML = "Please Set Device name :\r\n";
	document.getElementById("AlertMsgBtn").style.display = "";
	var input = '';
	input += '<p>'+id+'  :   <input type="text" class="pull-right"style="margin-right: 100px;" id="DeviceName"></p>';
	document.getElementById("AlertMsgBody").innerHTML = "";
	document.getElementById("AlertMsgBody").innerHTML = input;
	$('#myModal').modal('toggle');
	document.getElementById("AlertMsgBtn").onclick = function() {
		var devicevalue = document.getElementById("DeviceName").value;
		
		if(localStorage.getItem("Company") === "Guest"){
			SetDeviceName(id, devicevalue);
		}else{
			
			SendByGolang(id+"/", GetCommand(52, "Comm")+"@%@"+GetCommand(52, "Path")+"@%@;;;"+GetCommand(52, "Param")+devicevalue , GetCommand(52, "CommTitle"), GetCommand(52, "Param")+devicevalue, "user");			
			SetDeviceName(id, devicevalue);
		}
	};
}

function SetDeviceName(id, devicevalue){
	
	var postdata = {
		name: getCookie('UserName'),
		company: localStorage.getItem("Company"),
		deviceid: id,
		devicename: devicevalue,
		submit: "SetDeviceName"
	}
	$.post("/golang",
	postdata,
	function(data,status){
			GetAllDevices();
	});
}

function AddNewDevice(){
	var Title = "Add your device";
	document.getElementById("AlertMsgEvent").innerHTML = '<input type="text" id="devicetag" />';
	
	$('#devicetag').tagsinput({
		itemValue: 'value',
		itemText: 'text',
	});
	document.getElementById("devicetag").disabled = true;
	$("#devicetag").parent().find('.bootstrap-tagsinput').addClass('taginputHide');
	document.getElementById("AlertMsgEvent").style.display = "";
	var MsgBody= 'Enter the identification code which you received on your phone.<br><font color="red"><label id="result"></label></font><br><input type="text" id="txtDeviceName" placeholder="Identification Code" style="margin-right:20px;"><button id="btnAddNewDevice" type="button" class="btn btn-primary" >add</button>';
	SetAlertMsgInnerHTML(Title, MsgBody);
	var x = 0;			
	document.getElementById("btnAddNewDevice").onclick = function() {
		var postdata = {
			name: getCookie('UserName'),
			company: localStorage.getItem("Company"),
			deviceid: document.getElementById("txtDeviceName").value,
			submit: "GetDeviceId"
		}
		$.post("/golang",
		postdata,
		function(data,status){
			document.getElementById("result").innerHTML = "";
			var items = $('#devicetag').tagsinput('items');
			//if(items.length === 3) data = "oversub";
			if(data === "success"){
				$('#devicetag').tagsinput('add', { "value":  document.getElementById("txtDeviceName").value, "text": document.getElementById("txtDeviceName").value}); x++;						
			}else if(data === "error"){
				document.getElementById("result").innerHTML = "Oops , your device id is wrong!<br>";
			}else if(data === "used"){
				document.getElementById("result").innerHTML = "Oops , your device id is already add in your list!<br>";
			}else if(data === "oversub"){
				document.getElementById("result").innerHTML = "Oops , your account subscribes too many devices!<br>";
			}
			document.getElementById("txtDeviceName").value = "";
		});
		
		
	}
	
	document.getElementById("AlertMsgBtn").style.display = "";
	document.getElementById("AlertMsgBtn").onclick = function() {
		
		var items = $('#devicetag').tagsinput('items');
		var subscribe = "";
		for (var i = 0; i < items.length; i++) {
			subscribe += items[i].value + "/"; 
		}
		var postdata = {
			name: getCookie('UserName'),
			company: localStorage.getItem("Company"),
			subscribe: subscribe,
			submit: "SetSubscribeDevices"
		}
		$.post("/golang",
		postdata,
		function(data,status){
			if (data === "success"){
				GetAllDevices();
				window.location.href = "AllDevice.html";
			}
			
		});
	}
}

function Unsubscribe(topic){
	var unsubscribe = "";
	for (var i = 0; i < DeviceTable.rows('.selected').data().length; i++) {
		unsubscribe += DeviceTable.rows('.selected').data()[i][1]	+ "/";	 
	}

	var postdata = {
		name: getCookie('UserName'),
		company: localStorage.getItem("Company"),
		unsubscribe: unsubscribe,
		submit: "UnsubscribeDevices"
	}
		$.post("/golang",
		postdata,
		function(data,status){
			if (data === "success"){
				GetAllDevices();
			}
		});
}

function selectDownloadType(){
	var form = document.getElementById("DownloadType");
	//取得radio的值
	for (var i=0; i<form.platform.length; i++)
	{
		if (form.platform[i].checked)
		{
			var platform = form.platform[i].value;
			
			if(platform === "GoogleDrive"){
				var MsgBody= '<form id="DownloadType"><label style="margin-right:5px;"><input onclick="selectDownloadType()" name="platform" type="radio" value="GoogleDrive" checked>GoogleDrive</label><label><input onclick="selectDownloadType()" name="platform" type="radio" value="URL">URL</label></form>';
				MsgBody += 'Select file from Google drive, and download to your cellphone. <div class="fatooltip" style="color:red;">*<span class="falargetooltiptext">In order to make sure file can be downloaded,  please click <i class="fa fa-link" aria-hidden="true"></i> when uploading or downloading.</span></div><br>';		
				MsgBody += '<div class="btn-group"><button class="btn btn-black" onclick="initPicker();" data-dismiss="modal"><img style="padding-right:3px;"height="20" weight="20" src="https://avatars3.githubusercontent.com/u/3708359?v=4&s=200">Google Drive</button></button><button type="button"  class="btn btn-black dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul id="GoogledriveSelect" class="dropdown-menu"></ul></div><br>';						
				document.getElementById("AlertMsgBody").innerHTML = MsgBody;
			}else if(platform === "URL"){
				var MsgBody= '<form id="DownloadType"><label style="margin-right:5px;"><input onclick="selectDownloadType()" name="platform" type="radio" value="GoogleDrive">GoogleDrive</label><label><input onclick="selectDownloadType()" name="platform" type="radio" value="URL" checked>URL</label></form>';
				MsgBody += 'Enter your download URL and file name<br><input id="download_url" class="form-control" type="url" placeholder="download url"><input id="download_filename" class="form-control" type="text" placeholder="file name(e.g. example.png)">';
				document.getElementById("AlertMsgBody").innerHTML = MsgBody;
			}
			break;
		}
	}
}

function AllSelect(){
	$("#dataTables-example tbody tr").addClass("selected");
}

function AllCancel(){
	$("#dataTables-example tbody tr").removeClass("selected");
}

function MenuShow(){
		var menu = new BootstrapMenu('.demo4TableRow', {
	  fetchElementData: function($rowElem) {
		var rowId = $rowElem.data('rowId');
		return demo4Rows[rowId];
	  },
	  /* group actions by their id to make use of separators between
	   * them in the context menu. Actions not added to any group with
	   * this option will appear in a default group of their own. */
	 
	  /* you can declare 'actions' as an object instead of an array,
	   * and its keys will be used as action ids. */
	  actions: {
		addRow: {
		  name: 'Add New devices',
		  iconClass: 'fa-pencil',
		  onClick: function(row) {
			AddNewDevice();
		  }
		},
		deleteRow: {
		  name: 'Delete device',
		  iconClass: 'fa-trash-o',
		  onClick: function(row) {
			Unsubscribe(row.deviceid);
			console.log("'Delete device' clicked on '" + row.deviceid + "'");
		  }
		  
		},
		AddGroup: {
		  name: 'Add in Group',
		  iconClass: 'fa-users',
		  onClick: function(row) {
			AddToGroup();
		  }
		  
		},
		DeleteGroup: {
		  name: 'Delete Group',
		  iconClass: 'fa-users',
		  onClick: function(row) {
			DeleteGroup();
		  }
		  
		}
	  }
	});
}


function GetAllDevices() {
	var postdata = {
			company: localStorage.getItem("Company"),
			name: getCookie("UserName"),
			   submit: "GetAllDevices"
		}

		console.log("deviceid:");
		$.post("/golang",
		postdata,
		function(data,status){
			var table = $('#dataTables-example').DataTable();
			table.clear(); 
			if(data === "DeviceNotFound"){
				table.clear().draw(); 
			}
			for(var i=0;i<Object.keys(data).length;i++){
				var deviceid, devicename, agentversion,devicemodel,stat, time = "";
				var Group = "";
				deviceid = data[i].DEVICEID;devicename = data[i].DEVICENAME;
				agentversion = data[i].AGENTVERSION;devicemodel = data[i].DEVICEMODEL;
				stat = data[i].STATUS;time = data[i].TIME;
				Group = data[i].GROUP;
				console.log(data[i].GROUP);
				var Gr = "";
				if(!jQuery.isEmptyObject(Group)){
					for(var j=0;j<Group.length;j++)
						Gr += Group[j]+'<br>';
				}
				
				GetUpdateDevice += deviceid +"/";
				m_devices.push([deviceid,false]);
					var rowNode = table.row.add( [
						"",
						deviceid,
						devicename,
						agentversion,
						devicemodel,
						stat,
						"",
						Gr,
					] ).draw( false ).node();
					$( rowNode ).addClass('demo4TableRow');
					$( rowNode ).attr('data-row-id',i);
					demo4Rows.push({ deviceid: deviceid });
					var tmp;
			}	
			$($.fn.dataTable.tables(true)).DataTable()
			 .columns.adjust()
			 .responsive.recalc();
			MenuShow();
			if(m_Update === true){
				SendByGolang(GetUpdateDevice, GetCommand(1, "Comm"), GetCommand(1, "Comm"), "", "system");
				var timer = setTimeout(function(){ 
					for(var i=0;i<Object.keys(m_devices).length;i++){
						if(m_devices[i][1] === false){
							console.log("deviceid:"+m_devices[i][0]+"status:"+m_devices[i][1]);
							UpdateDevicesStatus(m_devices[i][0], "offline");
						}
					}
					m_Update = false;
				}, 10000);
				
			}
				
		});
}

function AddToGroup(){
	var postdata = {
		company: localStorage.getItem("Company"),
		name: getCookie("UserName"),
		submit: "GetGroupInfo"
	}
	$.post("/golang",
	postdata,
	function(data,status){
		var Title = "Set device group"
		var MsgBody= 'Please select group<br><select id="group" class="selectpicker" multiple data-width="fit" title="select group"></select>'+
						'<button class="btn btn-primary" id="AddNewGroup"><i class="fa fa-folder-open-o"></i> Add New Group</button>'+
						'<div class="table-responsive"><table class="table">'+
							'<thead><tr><th>Group</th><th>member</th><th>Action</th></tr></thead>'+
								'<tbody id="Groups-table"></tbody></table></div>';
								  
								
													
					
		SetAlertMsgInnerHTML(Title, MsgBody);
		var Grouptag;var GroupOrig;
		$('#AddNewGroup').on("click",function(){
			var s = 1; var NewGroupName=""; var Re = true;
			do {
				var tmp = false;
				for(var i=0;i<AllGroupName.length;i++){
					if(AllGroupName[i] === ("Group"+s)){
						tmp = true;
						break;
					}
						
				}	
				if(tmp){
					Re = true;
					s+=1;
				}else{
					Re = false;
				}
				
			}
			while (Re);
			NewGroupName = "Group"+s;
			AllGroupName.push(NewGroupName);
			var content = '<tr><td>'+NewGroupName+'</td><td></td><td></td></tr>';
			document.getElementById("Groups-table").innerHTML += content;
			
			var group = document.getElementById("group").innerHTML;
			group += '<option>'+NewGroupName+'</option>';
			$('#group').html(group).selectpicker('refresh');
			
		});
		$('#group').on('changed.bs.select', function (event, clickedIndex, newValue, oldValue) {
			
			var selectedD = $(this).find('option').eq(clickedIndex).text();
			
			
			if(newValue){
				
				
			}else{
				
			}
			
		});
		var obj = JSON.parse(data); var opt = "";
		var TableContent = "";
		var AllGroupName = [];
		for(var i=0;i<Object.keys(obj).length;i++){
			console.log(obj[i]);
			var GroupName = obj[i].GROUPNAME;
			var GroupMember = obj[i].GROUPMEMBER;var strGroupMember = "";
			var s ="";
			for(var j=0;j<GroupMember.length;j++){
				s+= '<li class="list-group-item" >'+"<div class='row'> <div class='col-md-12'> <div class='media-left media-middle'> <i class='fa fa-hdd-o fa-2x' aria-hidden='true'></i></div> <div id='center'>"+GroupMember[j]+"<i class='fa fa-times btnDeleteMember pull-right'></i>  </div> </div> </div></li>";
			}
			opt += '<option>'+GroupName+'</option>';	
			TableContent = '<tr><td>'+GroupName+'</td>'+
			'<td><div class="panel panel-default">'+
				'<ul id="autolist" class="list-group">'+
					'<div class="fixedHeight">'+
						s+
					'</div>'+
				'</ul>'+
			'</div></td>'+
			'<td><i class="fa fa-folder-open-o"></i></td></tr>';
			document.getElementById("Groups-table").innerHTML += TableContent;
			
			$('#group').html(opt).selectpicker('refresh');
			
			
			
		}
		DrawGroupmember();
		
	});
}

function DrawGroupmember(){
	
	$(".btnDeleteMember").hover(function () {
       
		$(this).addClass('del-red');
		
    },function () {
        $(this).removeClass('del-red');
    });
}

function DeleteGroup(){
	
	// var postdata = {
		// company: localStorage.getItem("Company"),
		// name: getCookie("UserName"),
		// groupname: "test01",
		// submit: "DeleteGroup"
	// }
	// $.post("/golang",
	// postdata,
	// function(data,status){
	
	// });
	var GroupMember = ['b0e0f2674fae2cd5dda88eb','388055998788b7d265cffa48'];
	var postdata = {
		company: localStorage.getItem("Company"),
		name: getCookie("UserName"),
		groupname: "test02",
		groupmember: GroupMember,
		submit: "AddDevicetoGroup"
	}
	$.post("/golang",
	postdata,
	function(data,status){
	
	});
}

function UpdateDevicesStatus(id,stat){
	var table = $('#dataTables-example').DataTable();
	var indexes = table.rows().eq( 0 ).filter( function (rowIdx) {
		return table.cell( rowIdx, 1 ).data() === id ? true : false;
	} );
	var cell = table.row( indexes ).data();
	cell[5] = stat;
	table.row( indexes ).data( cell ).draw();
	var postdata = {
		company: localStorage.getItem("Company"),
		name: getCookie("UserName"),
		deviceid: id,
		status: stat,
		submit: "SetDevicesStatus"
		
	}
	$.post("/golang",
	postdata,
	function(data,status){
	
	});
}

function UpdateDevices(id,name){
	var table = $('#dataTables-example').DataTable();
	var indexes = table.rows().eq( 0 ).filter( function (rowIdx) {
		return table.cell( rowIdx, 1 ).data() === id ? true : false;
	} );
	var cell = table.row( indexes ).data();
	cell[5] = "online";cell[2] = name;
	table.row( indexes ).data( cell ).draw();
}

function UpdateDevicesName(id,name){
	var table = $('#dataTables-example').DataTable();
	var indexes = table.rows().eq( 0 ).filter( function (rowIdx) {
		return table.cell( rowIdx, 1 ).data() === id ? true : false;
	} );
	var cell = table.row( indexes ).data();
	cell[2] = name;
	table.row( indexes ).data( cell ).draw();
}

var notag=true;
function noTagSelect(length){
	if(length === 0){
		document.getElementById("AlertMsgBody").innerHTML+='<div class="alert alert-danger">'+
                             '<strong>Warning:</strong> Please select more than one device.'+
                         ' </div>';
		$("#AlertMsgBtn").removeAttr("data-dismiss");
		notag = false;
	}else{
		if(!notag)
			$("#AlertMsgBtn").attr("data-dismiss","modal");
		notag = true;
	}
	return notag;
	
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
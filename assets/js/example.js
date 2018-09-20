var vm;
var calendar = angular.module('mwl.calendar.docs', ['mwl.calendar', 'ngAnimate', 'ui.bootstrap']);
calendar //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('KitchenSinkCtrl', function(moment, alert, calendarConfig, $scope) {
    vm = this;
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
		ClearAll();
		$('#getevent a[href="#event"]').tab('show');
		$('html, body').animate({
			scrollTop: $("#tab-content").offset().top
		}, 500);
		EditSchedule(args.calendarEvent);
		$scope.startsAt = args.calendarEvent.startsAt;
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
		var Title = "Error Message!"
		var MsgBody = "Are you sure you want to delete this schedule?";
		SetAlertMsgInnerHTML(Title, MsgBody);
		document.getElementById("AlertMsgEvent").style.display = "none";
		document.getElementById("AlertMsgBtn").style.display = "none";
		document.getElementById("ShowInfoBtn").style.display = "";
		document.getElementById("ShowInfoBtn").onclick = function() {
			vm.events.splice(args.calendarEvent.calendarEventId,1);
			DeleteSchedule(args.calendarEvent);
		};
		  
      }
    }];
	//var ColorPrimaryDevice = ['#d82020','#20d82c','#2093d8','#9620d8','#d820be','#ffa418'];
	//var ColorsecondaryDevice = ['#fdf1ba','#d1e8ff','#fae3e3'];
	//var ColorPrimaryDevice = ['#FF0000','#FF5511','#FFFF00','#00FF00','#00FFFF','#0000FF','#7700FF','#FF00FF'];
	//var ColorsecondaryDevice = ['#FFCCCC','#FFC8B4','#FFFFBB','#99FF99','#99FFFF','#CCCCFF','#D1BBFF','#FFB3FF'];
	var ColorPrimaryDevice = ['#808080','#006400','#FF0000'];
	var ColorsecondaryDevice = ['#DCDCDC','#99FF99','#FFCCCC'];
	//var ColorUsed = []; // ['id',number of color]
	
	
	vm.events = [];
	var postdata = {
		name: getCookie('UserName'),
		company: localStorage.getItem("Company"),
		submit: "GetSchedule"
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

			var eachtitle = title.split("/"); 
			var alltitle = "";
			for(var j=0;j<eachtitle.length-1;j++){
				if(j === eachtitle.length-2){
					alltitle += eachtitle[j] + " ";
				}else{
					alltitle += eachtitle[j] + ", ";
				}
			}
			
			var device = deviceid.split("/");var date = UnixToDate(timestart);
			var alldevice = "";
			for(var j=0;j<device.length-1;j++){
				
				if(j === device.length-2){
					alldevice += device[j] + " ";
				}else{
					alldevice += device[j] + ", ";
				}
				
			}
			var nowtime = new Date();
			var time = moment(date).add(1, 'm').toDate();
			var ColorChoose;
			// 0 = done ;  1 = wait; 2 = fail;
			if(DateToUnix(time) >= GetNowUnix() && stat === "true"){
				ColorChoose = 1;
			}else if(DateToUnix(time) <= GetNowUnix() && stat === "false"){
				ColorChoose = 0;
			}else{
				ColorChoose = 2;
			}
			vm.events.push({
				title: "<span style='color:red;margin-left:5px;'>Devices </span>: "+alldevice+" ,<span style='color:red;margin-left:5px;'>Command </span>: "+alltitle,
				startsAt: date,
				endsAt: moment(date).add(1, 'm').toDate(),
				color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
				  primary: ColorPrimaryDevice[ColorChoose], // the primary event color (should be darker than secondary)
				  secondary: ColorsecondaryDevice[ColorChoose] // the secondary event color (should be lighter than primary)
				},
				scheduleid: scheduleid,
				device: deviceid,
				command: title,
				draggable: false,
				resizable: true,
				actions: actions
			});
			
		}
		
		
		
		
		
		
	});
    // vm.events = [
      // {
        // title: 'An event',
        // color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
		  // primary: ColorPrimaryDevice[3], // the primary event color (should be darker than secondary)
		  // secondary: ColorsecondaryDevice[3] // the secondary event color (should be lighter than primary)
		// },
        // startsAt:  new Date(2013,5,1,1,4),
        // endsAt:  new Date(2014,5,1,1),
        // draggable: false,
        // resizable: true,
        // actions: actions
      // }, {
        // title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
         // color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
		  // primary: ColorPrimaryDevice[4], // the primary event color (should be darker than secondary)
		  // secondary: ColorsecondaryDevice[4] // the secondary event color (should be lighter than primary)
		// },
        // startsAt: moment().subtract(1, 'day').toDate(),
        // endsAt: moment().add(5, 'days').toDate(),
        // draggable: false,
        // resizable: true,
        // actions: actions
      // }, {
        // title: 'This is a really long event title that occurs on every year',
         // color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
		  // primary: ColorPrimaryDevice	[5], // the primary event color (should be darker than secondary)
		  // secondary: ColorsecondaryDevice[5] // the secondary event color (should be lighter than primary)
		// },
        // startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        // endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        // recursOn: 'year',
        // draggable: false,
        // resizable: true,
        // actions: actions
      // }
    // ];

    vm.cellIsOpen = true;

	$scope.startsAt = new Date();
	$scope.startOpen = true;
    vm.addEvent = function() {
		
		var lenDevicesSelected = DevicesSelected.length;
		console.log("lenDevicesSelected:"+lenDevicesSelected);
		if(lenDevicesSelected <= 0){
			var Title = "Error Message!"
			var MsgBody = "Please select devices before adding schedule";
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgEvent").style.display = "none";
			document.getElementById("AlertMsgBtn").style.display = "none";
		}else if(Object.keys(CommandSelected).length <= 0){
			var Title = "Error Message!"
			var MsgBody = "Please select command before adding schedule";
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgEvent").style.display = "none";
			document.getElementById("AlertMsgBtn").style.display = "none";
		}else{
			var alldevice = "";var d = "";
			for (var i=0; i<lenDevicesSelected; i++) {
				d += DevicesSelected[i]+"/";
				if(i === lenDevicesSelected-1){
					alldevice += GetDevicesName(DevicesSelected[i]) + " ";
				}else{
					alldevice += GetDevicesName(DevicesSelected[i]) + ", ";
				}
			}
			var content = ""; var c ="";
			for(var i=0;i< Object.keys(CommandSelected).length;i++){
				c += CommandSelected[i][1]+"/";
				if(i === Object.keys(CommandSelected).length-1){
					content += CommandSelected[i][1] + " ";
				}else{
					content += CommandSelected[i][1] + ", ";
				}
				
			}
			
			var t = moment($scope.startsAt).add(1, 'm').toDate();
			var ColorChoose;
			// 0 = done ;  1 = wait; 2 = fail;
			if(DateToUnix(t) >= GetNowUnix()){
				ColorChoose = 1;
			}else if(DateToUnix(t) <= GetNowUnix()){
				ColorChoose = 2;
			}
			console.log("EditStatus:"+EditStatus);
			if(EditStatus === false){
				var scheduleid = localStorage.getItem("Company")+";"+getCookie('UserName')+";"+GetNowUnix();
				vm.events.push({
					title: "<span style='color:red;margin-left:5px;'>Devices </span>: "+alldevice+" ,<span style='color:red;margin-left:5px;'>Command </span>: "+content,
					startsAt: $scope.startsAt,
					endsAt: moment($scope.startsAt).add(1, 'm').toDate(),
					color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
					  primary: ColorPrimaryDevice[ColorChoose], // the primary event color (should be darker than secondary)
					  secondary: ColorsecondaryDevice[ColorChoose] // the secondary event color (should be lighter than primary)
					},
					scheduleid: scheduleid,
					device: d,
					command: c,
					draggable: false,
					resizable: true,
					actions: actions
				});
				var title="", comm="", logcomm="", logcontent="", userfrom = "";
				for(var i=0;i<Object.keys(CommandSelected).length;i++){
					if(CommandSelected[i][7] === true){
						title += CommandSelected[i][1] + "/";
						comm += CommandSelected[i][3] + "/";
						logcomm += CommandSelected[i][4] + "/";
						logcontent += CommandSelected[i][5] + "/";
						userfrom += CommandSelected[i][6] + "/";
					}
				}
				var time =$scope.startsAt;
				var postdata = {
					name: getCookie('UserName'),
					company: localStorage.getItem("Company"),
					scheduleid: scheduleid,
					deviceid: d,
					commandtitle: title,
					command: comm, 
					logcomm: logcomm,
					logcontent: logcontent,
					userfrom: userfrom,
					time: DateToUnix(time),
					stat: "true",
					submit: "SetSchedule"
				}
				$.post("/golang",
				postdata,
				function(data,status){
				
					var MsgBody= "Add New task successfully! \r\n";	
					var Title = "Success";
					SetAlertMsgInnerHTML(Title, MsgBody);
					document.getElementById("AlertMsgEvent").style.display = "none";
					document.getElementById("AlertMsgBtn").style.display = "none";
					document.getElementById("CancelBtn").style.display = "none";
					document.getElementById("ShowInfoBtn").style.display = "";
					document.getElementById("ShowInfoBtn").onclick = function() {
						$('#myModal').modal('hide');
					};
					ClearAll();
				});
			}else if(EditStatus === true){
				vm.events.splice(EditCalendarEventId,1);
				vm.events.push({
					title: "<span style='color:red;margin-left:5px;'>Devices </span>: "+alldevice+" ,<span style='color:red;margin-left:5px;'>Command </span>: "+content,
					startsAt: $scope.startsAt,
					endsAt: moment($scope.startsAt).add(1, 'm').toDate(),
					color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
					  primary: ColorPrimaryDevice[ColorChoose], // the primary event color (should be darker than secondary)
					  secondary: ColorsecondaryDevice[ColorChoose] // the secondary event color (should be lighter than primary)
					},
					scheduleid: EditScheduleId,
					device: d,
					command: c,
					draggable: false,
					resizable: true,
					actions: actions
				});
				var title="", comm="", logcomm="", logcontent="", userfrom = "";
				for(var i=0;i<Object.keys(CommandSelected).length;i++){
					if(CommandSelected[i][7] === true){
						title += CommandSelected[i][1] + "/";
						comm += CommandSelected[i][3] + "/";
						logcomm += CommandSelected[i][4] + "/";
						logcontent += CommandSelected[i][5] + "/";
						userfrom += CommandSelected[i][6] + "/";
					}
				}
				var time =$scope.startsAt;
				var postdata = {
					name: getCookie('UserName'),
					company: localStorage.getItem("Company"),
					scheduleid: EditScheduleId,
					deviceid: d,
					commandtitle: title,
					command: comm, 
					logcomm: logcomm,
					logcontent: logcontent,
					userfrom: userfrom,
					time: DateToUnix(time),
					stat: "true",
					submit: "EditSchedule"
				}
				$.post("/golang",
				postdata,
				function(data,status){
				
					var MsgBody= "Edit New task successfully! \r\n";	
					var Title = "Success"
					SetAlertMsgInnerHTML(Title, MsgBody);
					document.getElementById("AlertMsgEvent").style.display = "none";
					document.getElementById("AlertMsgBtn").style.display = "none";
					ClearAll();
					document.getElementById("event-editor").innerHTML = 'Add events';
					document.getElementById("AddEvent").innerHTML = 'Add';
					document.getElementById("CancelEvent").style.display = 'none';
				});
				EditStatus = false;
			}
			
			
		}
		
	
      
    };
	
	vm.editEvent = function(event){
	};

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };
	

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function() {
		$scope.Open = true;
    };

    vm.timespanClicked = function(date, cell) {

      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      }

    };
	

  });
  
calendar.controller('TimepickerDemoCtrl', function ($scope, $log) {
$scope.today = function() {
	$scope.dt = new Date();
};
$scope.today();

$scope.clear = function() {
	$scope.dt = null;
};


  // Disable weekend selection
function disabled(data) {
	var date = data.date,
	  mode = data.mode;
	return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
}



$scope.open = function() {
	$scope.popup.opened = true;
};



$scope.setDate = function(year, month, day) {
	$scope.dt = new Date(year, month, day);
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];
$scope.altInputFormats = ['M!/d!/yyyy'];

$scope.popup = {
	opened: false
};



function getDayClass(data) {
	var date = data.date,
	  mode = data.mode;
	if (mode === 'day') {
	  var dayToCheck = new Date(date).setHours(0,0,0,0);

	  for (var i = 0; i < $scope.events.length; i++) {
		var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

		if (dayToCheck === currentDay) {
		  return $scope.events[i].status;
		}
	  }
	}

	return '';
}
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
	$scope.ismeridian = ! $scope.ismeridian;
  };

  var a = new Date("2016-02-29T15:30:11.758Z");
  var day = new Date()
  var hours = a.getHours()
  var minutes = a.getMinutes()
  day.setHours(hours)
  day.setMinutes(minutes)
  $scope.min = day;
  
  $scope.update = function() {
	var d = new Date();
	d.setHours( 14 );
	d.setMinutes( 0 );
	$scope.mytime = d;
  };

  $scope.changed = function () {
	$log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
	$scope.mytime = null;
  };
});
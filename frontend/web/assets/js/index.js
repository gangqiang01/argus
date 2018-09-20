//onload page
var map;
$(function() {
	LoginStatus("UserDuedateCheck","index.html");
	SetHTML("barset_index");
	if(localStorage.getItem("Company") === "Guest"){
		document.getElementById("account").innerHTML = '<a class="alert-a" href="profile.html" style="color:#3c763d;">View Details <i class="fa fa-arrow-circle-right"></i></a>';
	}else{
		document.getElementById("account").innerHTML = '<a class="alert-a" href="management.html" style="color:#3c763d;">View Details <i class="fa fa-arrow-circle-right"></i></a>';
	}
	$('.alert').css( 'cursor', 'pointer' );
	$(".alert").hover(function () {
		$(this,".alert").addClass("bw");
	},function () {
		$(this,".alert").removeClass("bw");
		
	});
	$(".alert").on("click", function(){
		window.location.href = $(this).find( ".alert-a" ).attr('href');
	});
	
	map = new GMaps({
		el: '#map',
		lat: 25.0855542,
		lng: 121.5230126
	});
	
	$('#GetCoordinate').bootstrapToggle();
	if(localStorage.getItem("Company") !== "Guest"){
		$('#AreaMonitor').bootstrapToggle();
	}else{
		$('#AreaMonitor').bootstrapToggle('disable')
	}
	if(localStorage.getItem("CoordinateStatus")==="false"){
		$('#GetCoordinate').bootstrapToggle('off');
	}else if(localStorage.getItem("CoordinateStatus")==="true"){
		$('#GetCoordinate').bootstrapToggle('on');
	}else{
		$('#GetCoordinate').bootstrapToggle('off');
	}
	if(localStorage.getItem("Company") !== "Guest"){
		if(localStorage.getItem("LocationMonitorStatus")==="false"){
			$('#AreaMonitor').bootstrapToggle('off');
		}else if(localStorage.getItem("LocationMonitorStatus")==="true"){
			$('#AreaMonitor').bootstrapToggle('on');
		}else{
			$('#AreaMonitor').bootstrapToggle('off');
		}
	}
	$('#GetCoordinate').change(function() {
		var s="";
		if($(this).prop('checked')){
			for(var i=0;i<AllDevicesID.length;i++){
				s += AllDevicesID[i].DEVICEID+ "/";
			}
			SendByGolang(s, "gpsHistory-;;;5;;;5", "", "enable", "system");
		}else{
			for(var i=0;i<AllDevicesID.length;i++){
				s += AllDevicesID[i].DEVICEID+ "/";
			}
			SendByGolang(s, "gpsHistory-;;;0;;;5", "", "disable", "system");
		}
		localStorage["CoordinateStatus"] =   $(this).prop('checked');
	})
	if(localStorage.getItem("Company") !== "Guest"){
		$('#AreaMonitor').change(function() {
			var s="";
			if($(this).prop('checked')){
				for(var i=0;i<AllDevicesID.length;i++){
					s += AllDevicesID[i].DEVICEID+ "/";
				}
				SendByGolang(s, "launchAPP-@%@com.aimobile.locationarealimit@%@com.aimobile.locationarealimit.MainActivity@%@;;;start:10:5", "", "enable", "system");
			}else{
				for(var i=0;i<AllDevicesID.length;i++){
					s += AllDevicesID[i].DEVICEID+ "/";
				}
				SendByGolang(s, "launchAPP-@%@com.aimobile.locationarealimit@%@com.aimobile.locationarealimit.MainActivity@%@;;;stop", "", "disable", "system");
			}
			localStorage["LocationMonitorStatus"] =   $(this).prop('checked');
		})
	}
});
var DeviceStatus = [];
function SetDeviceLocation(deviceid, lat, lng){ 
	var NowTime = new Date();
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var tmp = true; var SameLocation = false;
	var OriLat = 0; var OriLng = 0;
	for(var i=0;i<DeviceStatus.length;i++){
		if(deviceid === DeviceStatus[i][0]){
			if(DeviceStatus[i][1] === lat && DeviceStatus[i][2] === lng)
				SameLocation = true;
			OriLat = DeviceStatus[i][1];
			OriLng = DeviceStatus[i][2];
			DeviceStatus[i][1] = lat;
			DeviceStatus[i][2] = lng;
			tmp = false;
			
		}
	}
	if(tmp){
		SameLocation = true;
		DeviceStatus.push([deviceid, lat, lng]);
		OriLat = lat;
		OriLng = lng;
		$('.gmap-list').append('<a class="list-group-item">'+GetDevicesName(deviceid)+'</a>');
		
		
		map.addMarker({
			icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
			lat: lat,
			lng: lng,
			title: GetDevicesName(deviceid),
			infoWindow: {
				content : DateToTime(NowTime)+'<br><h5>'+GetDevicesName(deviceid)+'</h5>'
			},
			click: function(e) {
				
			}
		});
		
		$('.list-group-item').on("click", function(){
			map.setCenter(lat, lng);
		});
		
	}
	
	if(!SameLocation){
		map.addMarker({
			icon: 'http://maps.google.com/mapfiles/ms/icons/green.png',
			lat: lat,
			lng: lng,
			title: GetDevicesName(deviceid),
			infoWindow: {
				content : DateToTime(NowTime)+'<br><h5>'+GetDevicesName(deviceid)+'</h5>'
			},
			click: function(e) {
				
			}
		});
		
		$('.list-group-item').on("click", function(){
			map.setCenter(lat, lng);
		});
		
		map.travelRoute({
			origin: [OriLat, OriLng],
			destination: [lat, lng],
			travelMode: 'driving',
			step: function(e){
			// $('#instructions').append('<li></li>');
			  $('#instructions').delay(450*e.step_number).fadeIn(200, function(){
				map.drawPolyline({
				  path: e.path,
				  strokeColor: '#131540',
				  strokeOpacity: 0.6,
				  strokeWeight: 6
				});  
			  });
			}
		});
	  
	}
	  console.log(DeviceStatus);
    
}

var AllDevicesID;
function GetCoordinate(AllDevices){
	var s = "";
	for(var i=0;i<AllDevices.length;i++){
		s += AllDevices[i].DEVICEID+ "/";
	}
	if($('#GetCoordinate').prop('checked')){
		SendByGolang(s, "gpsHistory-;;;5;;;5", "", "enable", "system");
	}
	if(localStorage.getItem("Company") !== "Guest"){
		if($('#AreaMonitor').prop('checked')){
			SendByGolang(s, "launchAPP-@%@com.aimobile.locationarealimit@%@com.aimobile.locationarealimit.MainActivity@%@;;;start:10:5", "", "enable", "system");
		}
	}
	AllDevicesID = AllDevices;
}
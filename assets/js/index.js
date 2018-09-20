//onload page
var map;
var LocationMonitorInterval;
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
	
	if(localStorage.getItem("CoordinateStatus")==="false"){
		$('#GetCoordinate').bootstrapToggle('off');
		$('#li-update-freq').addClass('hide');
	}else if(localStorage.getItem("CoordinateStatus")==="true"){
		$('#GetCoordinate').bootstrapToggle('on');
		$('#li-update-freq').removeClass('hide');
	}else{
		$('#GetCoordinate').bootstrapToggle('off');
	}
	if(localStorage.getItem("CoordinateFrequency")!== null){
		$('#update-select').val(localStorage.getItem("CoordinateFrequency"));
	}
	
	var time = 5;
	console.log($('#update-select').find('li'));
	$('#update-select').change(function(){
		SetLocationInterval();
		localStorage["CoordinateFrequency"] = $('#update-select').val();
	})
	$('#GetCoordinate').change(function() {
		
		if($(this).prop('checked')){
			$('#li-update-freq').removeClass('hide');
			SetLocationInterval();
			
		}else{
			$('#li-update-freq').addClass('hide');
			window.clearInterval(LocationMonitorInterval);
		}
		localStorage["CoordinateStatus"] =   $(this).prop('checked');
	})
	
	
	$('#dropdown-settings').on("click", function(){
		$(this).parent().addClass('open');
		
	})
	$('body').on("click", function(e){
		var target = $( e.target );
		//console.log(target.is( "#dropdown-settings" ));
		if ( (!target.parents().is( ".dropdown-menu" )) ) {
			if(!target.is( "#dropdown-settings" )){
				$('#dropdown-settings').parent().removeClass('open');
			}
		}
	})
});

var DeviceStatus = [];var MarkerIndex = 1; var MarkerColorIndex = 0;
function SetDeviceLocation(deviceid, lat, lng){ 
	var NowTime = new Date();
	var MarkerColor = ['red', 'black', 'blue', 'green', 'grey', 'orange', 'purple', 'white', 'yellow'];
	
	var tmp = true; var SameLocation = false;
	var OriLat = 0; var OriLng = 0; var tmpMarkerColorIndex = 0; var tmpMarkerIndex = 0;
	for(var i=0;i<DeviceStatus.length;i++){
		if(deviceid === DeviceStatus[i][0]){
			if(DeviceStatus[i][1] === lat && DeviceStatus[i][2] === lng)
				SameLocation = true;
			OriLat = DeviceStatus[i][1];
			OriLng = DeviceStatus[i][2];
			tmpMarkerColorIndex = DeviceStatus[i][3];
			tmpMarkerIndex = DeviceStatus[i][4];
			DeviceStatus[i][1] = lat;
			DeviceStatus[i][2] = lng;
			tmp = false;
			
		}
	}
	if(tmp){
		SameLocation = true;
		DeviceStatus.push([deviceid, lat, lng, MarkerColorIndex, MarkerIndex]);
		
		OriLat = lat;
		OriLng = lng;
		$('.gmap-list').append('<a class="list-group-item" value="'+deviceid+'"><img src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+MarkerColor[MarkerColorIndex]+MarkerIndex+'.png">    '+GetDevicesName(deviceid)+'</a>');
		
		
		map.addMarker({
			icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+MarkerColor[MarkerColorIndex]+MarkerIndex+'.png',
			lat: lat,
			lng: lng,
			title: GetDevicesName(deviceid),
			infoWindow: {
				content : DateToTime(NowTime)+'<br><h5>'+GetDevicesName(deviceid)+'</h5>'
			},
			click: function(e) {
				
			}
		});
		
		$( "a[value*='"+deviceid+"']" ).on("click", function(){
			$(this).unbind();
			map.setCenter(lat, lng);
		});
		if(MarkerColorIndex > 8){
			MarkerIndex++;
			MarkerColorIndex = 0;
		}
		if(MarkerIndex >= 100)
			MarkerIndex = 0;
		MarkerColorIndex++;	
	}
	
	if(!SameLocation){
		map.addMarker({
			icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+MarkerColor[tmpMarkerColorIndex]+tmpMarkerIndex+'.png',
			lat: lat,
			lng: lng,
			title: GetDevicesName(deviceid),
			infoWindow: {
				content : DateToTime(NowTime)+'<br><h5>'+GetDevicesName(deviceid)+'</h5>'
			},
			click: function(e) {
				
			}
		});
		$( "a[value*='"+deviceid+"']" ).unbind();
		$( "a[value*='"+deviceid+"']" ).on("click", function(){
			map.setCenter(lat, lng);
		});
		
		
		// Device route
		// map.travelRoute({
			// origin: [OriLat, OriLng],
			// destination: [lat, lng],
			// travelMode: 'driving',
			// step: function(e){
			  // $('#instructions').delay(450*e.step_number).fadeIn(200, function(){
				// map.drawPolyline({
				  // path: e.path,
				  // strokeColor: '#131540',
				  // strokeOpacity: 0.6,
				  // strokeWeight: 6
				// });  
			  // });
			// }
		// });
	  
	}
	  console.log(DeviceStatus);
    
}

var AllDevicesID;
function GetCoordinate(AllDevices){
	if(AllDevices !== null){
		AllDevicesID = AllDevices;
		if($('#GetCoordinate').prop('checked')){
			SetLocationInterval();
		}
	}
}

function SetLocationInterval(){
	if(CheckUserPermission(4)){
		window.clearInterval(LocationMonitorInterval);
		var s = "";var time = parseInt($('#update-select').val());
		for(var i=0;i<AllDevicesID.length;i++){
			if(AllDevicesID[i].STATUS === "online"){
				s += AllDevicesID[i].DEVICEID+ "/";
				console.log(s);
			}
		}
		console.log(s);
		SendByGolang(s, "gps-", "Get Coordinates" , "index get location","system");
		LocationMonitorInterval = setInterval(function() {
			SendByGolang(s, "gps-", "Get Coordinates" , "index get location","system");
		}, time * 1000);
	}else{
		$('#GetCoordinate').bootstrapToggle('off');
		$('#li-update-freq').addClass('hide');
		localStorage["CoordinateStatus"] =  "false";
	}
}
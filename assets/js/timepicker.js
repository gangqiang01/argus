var timepic = angular.module('mwl.calendar.docs', ['ngAnimate', 'ui.bootstrap']);
timepic.controller('TimepickerDemoCtrl', function ($scope, $log) {
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
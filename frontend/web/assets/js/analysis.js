var tconfig;
var myObj = "";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","analysis.html"); 
	SetHTML("barset_analysis");
	$('[data-toggle="tooltip"]').tooltip();   
});

var company = localStorage.getItem("Company");	var type="";
if(company === "Guest"){
	type = "assets/json/lite.txt";
}else{
	type = "assets/json/pro.txt";
}
function setup() {
	//load json file (path: assets/json/)
	loadJSON(type, drawData);
}
var myObj = "";
function drawData(data) {
	myObj = data;
	//doughnut
	var config = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: [
					
				],
				backgroundColor: [
					
				],
				label: 'Dataset 1'
			}],
			labels: [
				
			]
		},
		options: {
			responsive: true,
			boxWidth: 30,
			legend: {
				position: 'left',
				labels:{
					fontSize: 10
				}
			},
			title: {
				display: true,
				text: 'Command used Chart'
			},
			animation: {
				animateScale: true,
				animateRotate: true
			}
		}
	};
	var ctx = document.getElementById("chart-area").getContext("2d");
	window.myDoughnut = new Chart(ctx, config);
	var colorNames = Object.keys(window.chartColors);
	//--------------
	var postdata = {
		name: getCookie('UserName'),
		company: localStorage.getItem("Company"),
		submit: "GetCommandTimes"
	}
		
	var datatimes;
	$.post("/golang",
	postdata,
	function(data,status){
		var scores = []; 
		console.log(data);
		datatimes = data;
		var t = datatimes.split("/");
		console.log(t.length);
		var numAllCommand = 0;
		for(var i=0; i<t.length-1; i++){
			var a = t[i].split(":");
			scores.push({item:a[0],times:parseInt(a[1])});
			numAllCommand += parseInt(a[1]);
		}
		if (config.data.datasets.length > 0) {
			for(var i=0; i< t.length-1;i++){
				var percent = (scores[i].times/numAllCommand)*100;
				if(percent >=1 ){
					config.data.labels.push(GetCommand(scores[i].item, "CommTitle")+" "+formatFloat(percent, 2)+"%");

					var colorName = colorNames[config.data.datasets[0].data.length % colorNames.length];;
					var newColor = window.chartColors[colorName];

					config.data.datasets.forEach(function(dataset) {
						dataset.data.push(scores[i].times);
						dataset.backgroundColor.push(newColor);
					});
				}
				
					window.myDoughnut.update();
			}
		
		}
		
		
	});
	//default get log
	GetLogInfo(1);
}

//Get Json command to myObj
//e.g. GetCommand(3,"CommTitle")
function GetCommand(number, title){
	var str = ""+number+""; 
	var dd = myObj[str];
	if(title === "CommTitle"){ 
		command = dd[0].CommTitle;
	}else if(title === "Enabled"){
		command = dd[1].Enabled;
	}else if(title === "Comm"){
		command = dd[2].Comm;
		console.log(command);
	}else if(title === "Param"){
		command = dd[3].Param;
	}else if(title === "Resultdelay"){
		command = dd[4].Resultdelay;
	}
	return command;
}

//choose days 1(24Hour), 30(a month), 365(one year)
//Draw Command times chart 
function DrawCommandTimes(data, days){
	if(days === 1){
		document.getElementById("Axis-x").innerHTML = "Hours";
		let devices = [];
		for(var i=0;i<Object.keys(data).length;i++){
			var LogsName, LogsTarget,LogsCommand, LogsContent,LogsFrom, LogsTime = "";
			LogsName = data[i].NAME;LogsTarget = data[i].TARGET;
			LogsCommand = data[i].COMMAND;LogsContent = data[i].CONTENT;
			LogsFrom = data[i].FROM;LogsTime = data[i].TIME;
			var t = LogsTarget.split("/");
			if(LogsFrom === "user"){
				for(var j=0;j<t.length-1;j++){
					if(devices.length=== 0 ){
						devices[0] = [];
						devices[0][24] = t[j];
						for(var m=0;m<24;m++){
							devices[0][m] = 0;
						}
					}
					var tmp = false;
					for(var k=0;k<devices.length;k++){
						//有發現Device
						if(devices[k].length >=25){
							if(t[j] === devices[k][24]){
								var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
								var times = timeformat.split("");
								if(times[8] === "0"){
									devices[k][parseInt(times[9])]+=1;
								}else if(times[8] === "1"){
									devices[k][parseInt(times[9])+10]+=1;
								}else if(times[8] === "2"){
									devices[k][parseInt(times[9])+20]+=1;
								}
								tmp = true;
							}
						}
					}
						//目前無Device
						if(tmp === false){
							devices[devices.length] = [];
							console.log(devices.length);
							devices[devices.length-1][24] = t[j];
							for(var m=0;m<24;m++){
								devices[devices.length-1][m] = 0;
							}
							var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
							var times = timeformat.split("");
							if(times[8] === "0"){
								devices[k][parseInt(times[9])]+=1;
							}else if(times[8] === "1"){
								devices[k][parseInt(times[9])+10]+=1;
							}else if(times[8] === "2"){
								devices[k][parseInt(times[9])+20]+=1;
							}
						}
				}
			}	
		}
		
		document.getElementById("daysRecord").innerHTML = 'Hour<span class="caret"></span>'; // 1.2.3 ... 24
		var d = new Date();
		var Hour = d.getHours();
		for(var i=Hour+1;i<=23;i++){
			tconfig.data.labels.push(i);
		}
		for(var i=0;i<=Hour;i++){
			tconfig.data.labels.push(i);
		}
		
		for(var i=0;i<devices.length;i++){
			var colorNames = Object.keys(window.chartColors);
			var colorName = colorNames[tconfig.data.datasets.length % colorNames.length];
			var newColor = window.chartColors[colorName];
			var newDataset = {
				label: devices[i][24],
				backgroundColor: newColor,
				borderColor: newColor,
				data: [],
				fill: false
			};
			
			for(var j=Hour+1;j<=23;j++){
				newDataset.data.push(devices[i][j]);
			}
			for(var j=0;j<=Hour;j++){
				newDataset.data.push(devices[i][j]);
			}

			tconfig.data.datasets.push(newDataset);
		}
		window.myLine.update();
	}else if(days === 30){
		document.getElementById("Axis-x").innerHTML = "Dates";
		var d = new Date();
		var dt1 = new Date(d.getUTCFullYear(), d.getUTCMonth(), 0);
		var lastmonday = dt1.getDate();
		let devices = [];
		for(var i=0;i<Object.keys(data).length;i++){
			var LogsName, LogsTarget,LogsCommand, LogsContent,LogsFrom, LogsTime = "";
			LogsName = data[i].NAME;LogsTarget = data[i].TARGET;
			LogsCommand = data[i].COMMAND;LogsContent = data[i].CONTENT;
			LogsFrom = data[i].FROM;LogsTime = data[i].TIME;
			var t = LogsTarget.split("/");
			if(LogsFrom === "user"){
				for(var j=0;j<t.length-1;j++){
					if(devices.length=== 0 ){
						devices[0] = [];
						devices[0][0] = t[j];
						for(var m=1;m<lastmonday+1;m++){
							devices[0][m] = 0;
						}
					}
					var tmp = false;
					for(var k=0;k<devices.length;k++){
						//有發現Device
						if(devices[k].length >=lastmonday+1){
							if(t[j] === devices[k][0]){
								var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
								var times = timeformat.split("");
								if(times[6] === "0"){
									devices[k][parseInt(times[7])]+=1;
								}else if(times[6] === "1"){
									devices[k][parseInt(times[7])+10]+=1;
								}else if(times[6] === "2"){
									devices[k][parseInt(times[7])+20]+=1;
								}else if(times[6] === "3"){
									devices[k][parseInt(times[7])+30]+=1;
								}
								tmp = true;
							}
						}
					}
						//目前無Device
						if(tmp === false){
							devices[devices.length] = [];
							console.log(devices.length);
							devices[devices.length-1][0] = t[j];
							for(var m=1;m<lastmonday+1;m++){
								devices[devices.length-1][m] = 0;
							}
							var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
							var times = timeformat.split("");
							if(times[6] === "0"){
								devices[k][parseInt(times[7])]+=1;
							}else if(times[6] === "1"){
								devices[k][parseInt(times[7])+10]+=1;
							}else if(times[6] === "2"){
								devices[k][parseInt(times[7])+20]+=1;
							}else if(times[6] === "3"){
								devices[k][parseInt(times[7])+30]+=1;
							}
						}
				}
			}
		}
		
		document.getElementById("daysRecord").innerHTML = 'Day<span class="caret"></span>'; // 1.2.3 ... 24
		var nowtime = d.getDate();
		if(nowtime > lastmonday){
			for(var i=1;i<=nowtime;i++){
				tconfig.data.labels.push((d.getMonth()+1)+"/"+i);
			}
		}else{
			for(var i=nowtime+1;i<=lastmonday;i++){
				tconfig.data.labels.push(d.getMonth()+"/"+i);
			}
			for(var i=1;i<=nowtime;i++){
				tconfig.data.labels.push((d.getMonth()+1)+"/"+i);
			}
		}
		
		for(var i=0;i<devices.length;i++){
			var colorNames = Object.keys(window.chartColors);
			console.log(tconfig.data.datasets.length % colorNames.length);
			console.log(tconfig.data.datasets.length);
			var colorName = colorNames[tconfig.data.datasets.length % colorNames.length];
			var newColor = window.chartColors[colorName];
			var newDataset = {
				label: devices[i][0],
				backgroundColor: newColor,
				borderColor: newColor,
				data: [],
				fill: false
			};
			if(nowtime > lastmonday){
				for(var j=1;j<=nowtime;j++){
					newDataset.data.push(devices[i][j]);
				}
			}else{
				for(var j=nowtime+1;j<=lastmonday;j++){
					newDataset.data.push(devices[i][j]);
				}
				for(var j=1;j<=nowtime;j++){
					newDataset.data.push(devices[i][j]);
				}
			}
			tconfig.data.datasets.push(newDataset);
		}
		window.myLine.update();
	}else if(days === 365){
		document.getElementById("Axis-x").innerHTML = "Month";
		var d = new Date();
		var month = d.getMonth()+1;
		
		let devices = [];
		for(var i=0;i<Object.keys(data).length;i++){
			var LogsName, LogsTarget,LogsCommand, LogsContent,LogsFrom, LogsTime = "";
			LogsName = data[i].NAME;LogsTarget = data[i].TARGET;
			LogsCommand = data[i].COMMAND;LogsContent = data[i].CONTENT;
			LogsFrom = data[i].FROM;LogsTime = data[i].TIME;
			var t = LogsTarget.split("/");
			if(LogsFrom === "user"){
				for(var j=0;j<t.length-1;j++){
					if(devices.length=== 0 ){
						devices[0] = [];
						devices[0][0] = t[j];
						for(var m=1;m<13;m++){
							devices[0][m] = 0;
						}
					}
					var tmp = false;
					for(var k=0;k<devices.length;k++){
						//有發現Device
						if(devices[k].length >=13){
							if(t[j] === devices[k][0]){
								var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
								var times = timeformat.split("");
								if(times[4] === "0"){
									devices[k][parseInt(times[5])]+=1;
								}else if(times[4] === "1"){
									devices[k][parseInt(times[5])+10]+=1;
								}
								tmp = true;
							}
						}
					}
						//目前無Device
						if(tmp === false){
							devices[devices.length] = [];
							console.log(devices.length);
							devices[devices.length-1][0] = t[j];
							for(var m=1;m<13;m++){
								devices[devices.length-1][m] = 0;
							}
							var timeformat = GetInputTimeToOriginal(UnixToDate(LogsTime));
							var times = timeformat.split("");
							if(times[4] === "0"){
								devices[k][parseInt(times[5])]+=1;
							}else if(times[4] === "1"){
								devices[k][parseInt(times[5])+10]+=1;
							}
						}
				}
			}
		}
		
		document.getElementById("daysRecord").innerHTML = 'Month<span class="caret"></span>'; // 1.2.3 ... 24
		var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if(month === 12){
			for(var i=1;i<=month;i++){
				tconfig.data.labels.push(m[i-1]);
			}
		}else{
			for(var i=month+1;i<=12;i++){
				tconfig.data.labels.push(m[i-1]);
			}
			for(var i=1;i<=month;i++){
				tconfig.data.labels.push(m[i-1]);
			}
		}
		
		for(var i=0;i<devices.length;i++){
			var colorNames = Object.keys(window.chartColors);
			var colorName = colorNames[tconfig.data.datasets.length % colorNames.length];
			var newColor = window.chartColors[colorName];
			var newDataset = {
				label: devices[i][0],
				backgroundColor: newColor,
				borderColor: newColor,
				data: [],
				fill: false
			};
			if(month === 12){
				for(var j=1;j<=month;j++){
					newDataset.data.push(devices[i][j]);
				}
			}else{
				for(var j=month+1;j<=12;j++){
					newDataset.data.push(devices[i][j]);
				}
				for(var j=1;j<=month;j++){
					newDataset.data.push(devices[i][j]);
				}
			}
			tconfig.data.datasets.push(newDataset);
		}
		window.myLine.update();
	}
}

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

function GetLogInfo(days){
	tconfig = {
		type: 'line',
		data: {
			
		},
		options: {
			
		}
	};
	var ctxp = document.getElementById("canvas").getContext("2d");
	if(window.myLine != null){
		window.myLine.destroy();
	}
	window.myLine = new Chart(ctxp, tconfig);

	var tmp = true;
	document.getElementById("daysRecord").value = days;
	var d = new Date();
	var MONTHS = [];
	if(days === 1){
		
	}else if(days === 30){
		
	}else if(days === 365){
		
	}else{tmp = false; document.getElementById("daysRecord").innerHTML = 'Hour<span class="caret"></span>';
	document.getElementById("daysRecord").value = 1;}
	
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
				DrawCommandTimes(data, days);
			}
		})
	}
	
}
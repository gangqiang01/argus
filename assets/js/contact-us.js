//onload page
$(function() {
	LoginStatus("UserDuedateCheck","contact-us.html");
	SetHTML("barset_contact");	//userpermission.js
	var qtype = [];
	qtype = ['Account', 'Command', 'Device', 'Web', 'Suggest', 'Other'];
	$.each(qtype, function (index, value) {
		$('#qtype').append($('<option/>', {
			value: value,
			text : value
		}));
	});
	
   
});
var AllQuestion;
function GetQuestion(){
	
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	var sub = "GetQuestion"; var postdata = {submit: sub};
	postdata = {
		company: company,
		name: name,
		type: "question",
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		AllQuestion = data;
		var person = [];
		for(var i=0;i<Object.keys(data).length;i++){
			if(person.length === 0){
				person.push(data[i].COMPANY+"/"+data[i].NAME);
			}else{
				var tmp = true;
				for(var j=0;j<person.length;j++){
					if(person[j] === data[i].COMPANY+"/"+data[i].NAME ){
						tmp = false;
					}
				}
				if(tmp){
					person.push(data[i].COMPANY+"/"+data[i].NAME);
				}
			}
			if(ProfileInfo.LEVEL != "1"){
				if(data[i].FROM === "user"){
					document.getElementById("chat").innerHTML += '<li class="right clearfix"><span class="chat-img pull-right"><img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(data[i].TIME)+'</small><strong class="pull-right primary-font">'+data[i].NAME+'</strong></div><p>'+data[i].CONTENT+'</p></div></li>';
				}else{
					document.getElementById("chat").innerHTML += '<li class="left clearfix"><span class="chat-img pull-left"><img src="assets/img/cropped-AIMobile-icon-1.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(AllQuestion[i].TIME)+'</small><strong class="pull-right primary-font">Aimboile Service</strong></div><p>'+AllQuestion[i].CONTENT+'</p></div></li>';
				}
			}
			
		}
		if(ProfileInfo.LEVEL === "1"){
			$("#question").html('<div class="form-group">'+
									'<label>Question Type</label>'+
									'<select id="person" class="form-control" onchange="QuestionSelected()"><option selected disabled hidden>Choose here</option></select>'+
									
								'</div>');
			
			$.each(person, function (index, value) {
				$('#person').append($('<option/>', {
					value: value,
					text : value
				}));
			});
			document.getElementById("chat-send").innerHTML = '<p style="margin-top:20px;margin-bottom:20px;color:#C0C0C0;">Please selected person name</p>';
		}
	});
}
function SetQuestion(){
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	var question = document.getElementById("content").value;
	var sub = "SetQuestion"; var postdata = {submit: sub};
	postdata = {
		company: company,
		name: name,
		type: "question",
		qtype: document.getElementById("qtype").value,
		content: question,
		from: "user",
			status: "true",
			submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		document.getElementById("content").value = '';
		document.getElementById("chat").innerHTML += '<li class="right clearfix"><span class="chat-img pull-right"><img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(new Date().getTime() / 1000)+'</small><strong class="pull-right primary-font">'+name+'</strong></div><p>'+question+'</p></div></li>';
		var Title = "Has been sent";
		var MsgBody= "Thank you for contacting us!<br> We will get back to you will reply as soon as possible";		
		SetAlertMsgInnerHTML(Title, MsgBody);
	});
	return false;
}


function QuestionSelected(){
	
	var selectBox = document.getElementById("person");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	console.log(AllQuestion);
	document.getElementById("chat").innerHTML = '';
	var ToCompany, ToName;
	for(var i=0;i<Object.keys(AllQuestion).length;i++){
		console.log(AllQuestion[i].COMPANY+ "/"+ AllQuestion[i].NAME);
		console.log(selectedValue);
		if (AllQuestion[i].COMPANY+ "/"+ AllQuestion[i].NAME === selectedValue){
			ToCompany = AllQuestion[i].COMPANY; ToName = AllQuestion[i].NAME;
			if(AllQuestion[i].FROM === "user"){
				console.log("user");
				document.getElementById("chat").innerHTML += '<li class="right clearfix"><span class="chat-img pull-right"><img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(AllQuestion[i].TIME)+'</small><strong class="pull-right primary-font">'+AllQuestion[i].NAME+'</strong></div><p>'+AllQuestion[i].CONTENT+'</p></div></li>';
			}else{
				document.getElementById("chat").innerHTML += ' <li class="left clearfix"><span class="chat-img pull-left"><img src="assets/img/cropped-AIMobile-icon-1.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(AllQuestion[i].TIME)+'</small><strong class="pull-right primary-font">Aimboile Service</strong></div><p>'+AllQuestion[i].CONTENT+'</p></div></li>';
			}
		}
	}
	
	
      
  
	document.getElementById("chat-send").innerHTML = '<div class="input-group"><input id="txtReply" type="text" class="form-control" placeholder="Reply here">'+
															'<span class="form-group input-group-btn"><button class="btn btn-primary" id="btnReply"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></span>'+
														'</div>';    
	$("#btnReply").on("click", function(){
		var txtReply = document.getElementById("txtReply").value;
		var company = localStorage.getItem("Company");
		var name = getCookie('UserName');
		var sub = "SetReply"; var postdata = {submit: sub};
		postdata = {
			company: company,
			name: name,
			tocompany: ToCompany,
			toname: ToName,
			type: "question",
			content: txtReply,
			from: "system",
			status: "true",
			submit: sub
		}
		$.post("/golang",
		postdata,
		function(data,status){
			document.getElementById("txtReply").value = '';
			document.getElementById("chat").innerHTML += ' <li class="left clearfix"><span class="chat-img pull-left"><img src="assets/img/cropped-AIMobile-icon-1.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+UnixToTime(new Date().getTime()/ 1000)+'</small><strong class="pull-right primary-font">Aimboile Service</strong></div><p>'+txtReply+'</p></div></li>';
		});
	});
}
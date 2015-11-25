
//------------------ load result data from json file----------------------
//------------------------------------------------------------------------
var resultSet;
var getResultSet = function(data){
	$.ajax({
	url: 'data/u4result.json',
	dataType: 'json',
	async: false,
	success: function(resultJson) {
		resultSet = resultJson;
		getBackgroundItems(data);
	}
	});
	
}



//------------------ Get the result of the tasks that have set days schedule type----------------------
//-----------------------------------------------------------------------------------------------------

var getTaskResult_setDays = function(resultList,taskId){
	
	var checkDays = [];
	var i=0;
	for (var j = 0; j < resultList.length; j++) {
		
			if (taskId ===resultList[j]["Task ID"] ){
			
			checkDays.push(
			{
			  date:resultList[j]["Result date"],
			  missed:resultList[j]["Missed result"]
			});
			}
	}
	return checkDays;		

}

//------------------ Get and calculate average of the result of the tasks -----------------------------
//-----------------------------------------------------------------------------------------------------


var getTaskResult = function(resultList,dataItem,repetition){
	
	
	var numberOfResult=0;
	var startItem= new Date(dataItem.start);
	var endItem= new Date (dataItem.end );
	var currentDate= new Date ();
	var setDays=0;// to check how many days are in the set days intervention needs to be marked
	
	if (dataItem.id.indexOf("_") != -1 ){ 
		var itemid=  dataItem.id.split('_');
		var id=itemid[0];		
	}// get the result of the item until the current date 
	else {
		var flag="True";
		var id=dataItem.id;
	}
	
	if (endItem > currentDate ){
		var numberOfDays= getDiffDay(dataItem.start,currentDate.setHours(23,59,59,999)); }
	else {
		numberOfDays= getDiffDay(dataItem.start,endItem.setHours(23,59,59,999));
	}
	
		for (var j = 0; j < resultList.length; j++) {
	
			var resultDate= new Date(resultList[j]["Result date"]);
	
			if (id ===resultList[j]["Task ID"] ){
				if (dataItem.subgroup === 'SET_DAYS'){ setDays+=1;}
				if (resultDate.getTime() >= startItem.getTime() &&  resultDate.getTime() <= endItem.getTime() && resultList[j]["Missed result"]=='0'){
				numberOfResult+=1; }
			}
		}
		var subgroup = dataItem.subgroup.replace(/[0-9]/g, '');
		switch (subgroup) {
					
					case "ANYTIME":
									var diffPercent= numberOfDays;
									var progressColor=numberOfResult;										
									break;
					case "EVERY_DAY": 
									var diffPercent = ((numberOfResult / numberOfDays) * 100).toFixed(0);
									var progressColor= getProgressColor(diffPercent);						
									
									break;
					case "N_TIMES_PER_WEEK":
									if (flag ==="True"){ 
									var diffPercent= (numberOfResult* 100)/((numberOfDays/7)* repetition);
									var progressColor= getProgressColor(diffPercent);															
									}else{
									var diffPercent = ((numberOfResult / repetition) * 100).toFixed(0);
									var progressColor= getProgressColor(diffPercent);
									}								
									break;
					
					case "SET_DAYS":
									var diffPercent = ((numberOfResult / setDays) * 100).toFixed(0);
									var progressColor= getProgressColor(diffPercent);
									break;
					
					case "SET_WEEKDAYS":
									if (flag ==="True"){ 
									var diffPercent= (numberOfResult* 100)/((numberOfDays/7)* repetition);
									var progressColor= getProgressColor(diffPercent);															
									}else{
									var diffPercent = ((numberOfResult / repetition) * 100).toFixed(0);
									var progressColor= getProgressColor(diffPercent);										
									}
									break;
	
	}
	if (diffPercent>100){diffPercent=100;}
	return [diffPercent,progressColor,numberOfResult] ;
	}
	
	

//------------------ Adding colors to the progress bars depending on the percentage -----------------------------
//---------------------------------------------------------------------------------------------------------------	

var getProgressColor = function(progressPercentage){
var color="";
var n = Number(progressPercentage);
if (n < 25){color="#f63a0f";} 
//if (n> 10 && n<= 25){ color="#f27011";}
//if (n> 25 && n<= 50){ color="#f2b01e";}						
if ( n>= 25 && n< 50 ){ color="#f2d31b";}
if ( n>= 50 ){ color="#86e01e";}
		
					
return color;
}		

		  
//----------------------- function makes groups in the timeline depend of the task type -------------------------
//---------------------------------------------------------------------------------------------------------------
var names = [];
var getGroups = function(list){

var name;
var groups = new vis.DataSet();
for (var i = 0; i < list.length; i++) {
	name = list[i]["Task type"];
	if(names.indexOf(name) == -1){
		names.push(name);
	}
}

for (var g = 0; g < names.length; g++) {
	groups.add({id: names[g], content: ''});
}
return groups;
};


//-------------------------------- Function to detect URLs in text -----------------------------------
//----------------------------------------------------------------------------------------------------

var changeText_to_Link= function(text){
// The Regular Expression filter
reg_exUrl = /((http|https|ftp|ftps)\:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?|(\w\w\w\.)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

return text.replace(reg_exUrl, function(url) {
	return "<a target='_blank' href='" + url + "'>" + url + "</a>";
})
}




//--------------------function to get the tasks and put the them the their group as a background items-----------------------
//---------------------------------------------------------------------------------------------------------------------------

var getBackgroundItems = function(list){
		
		// create a dataset with items
		var items = new vis.DataSet();
		
		for (var i = 0; i < list.length; i++) {
			// To make a class name to each task type
			var endTime= new Date(list[i]["Task end time"]);
			var start= new Date (list[i]["Task start time"]);
			switch (list[i]["Task type"]) {
				case "ACTIVITY_TRACKER":
					C_Name = 'silver';
					Task_lego = 'img/ACTIVITY_TRACKER.png';
					groupId ="ACTIVITY_TRACKER";
					break;
				case "JUST_DO_IT":
					C_Name = 'lightskyblue';
					Task_lego = 'img/JUST_DO_IT.png';
					groupId ="JUST_DO_IT";
					break;
				case "FOOD_DIARY":
					C_Name = 'lightgreen';
					Task_lego = 'img/FOOD_DIARY.png';
					groupId ="FOOD_DIARY";
					break;
				case "GENERIC":
					C_Name = 'lemonchiffon';
					Task_lego = 'img/GENERIC.png';
					groupId ="GENERIC";
					break;
				case "STEP_COUNTER":
					C_Name = 'Cyan';
					Task_lego = 'img/STEP_COUNTER.png';
					groupId ="STEP_COUNTER";
					break;
			}
			
			items.add({
				id: list[i]["Task ID"],
				group: groupId,
				content: '<img src="' + Task_lego + '" style="width:20px; height:20px;vertical-align:middle;">'
				+ " " +list[i]["Task name"]+": "+list[i]["Task repetition type"].toLowerCase()+ getDateformat(list[i]["Task start time"],list[i]["Task end time"])+'\n<div class="progress"> <div class="progress-bar" style=" background-color: #6495ed; width: 75%;" ></div></div>',
				start: start.setHours(0,0,0,999),
				end: endTime.setHours(23,59,59,999),
				//title: list[i]["Task name"] + ':\n\n' + list[i]["Task Description"],
				className: C_Name,
				subgroup: list[i]["Task repetition type"],
				type: 'range',
				style:"border-bottom-color:"+C_Name+";"
			});
			
			
			var taskDescription=changeText_to_Link(list[i]["Task Description"]); //Detect URLs in Task Description
			
			var thisItem = items.get(list[i]["Task ID"]);
			var itemsProgress= getTaskResult(resultSet,thisItem,list[i]["Task repetition count"]);
			var itemsWidth_progress= Number(itemsProgress[0]);
			var itemsColor_progress= itemsProgress[1];
			var SchedulingType=list[i]["Task repetition type"].toLowerCase();
			if (list[i]["Task repetition type"]==="N_TIMES_PER_WEEK" ||  list[i]["Task repetition type"]==="SET_WEEKDAYS"){
				
				if (list[i]["Task repetition count"]== 1){SchedulingType= 'Do 1 time'; }
					else {SchedulingType= list[i]["Task repetition count"]+ " Time(s) / week";}
					
			} else {if (list[i]["Task repetition type"]==="SET_DAYS") {SchedulingType= " On specific days ";}}
			
			if (list[i]["Task repetition type"]==="ANYTIME" ){
			items.update({id:list[i]["Task ID"] , 
						content:'<div class="ttooltip" data-title="'+list[i]["Task name"]+'" data-content="'+taskDescription+'"><img src="' + Task_lego + '" style="width:30px; height:30px;vertical-align:middle;">'
				+ " " +'<span style="font-weight: bold;">'+ list[i]["Task name"]+": </span>"+'<span > When ever you want </span>'+ getDateformat(list[i]["Task start time"],list[i]["Task end time"])
				+'<span > Done '+itemsColor_progress+' time(s) </span></div>'});
			}else{
			items.update({id:list[i]["Task ID"] , 
						content:'<div class="ttooltip" data-title="'+list[i]["Task name"]+'" data-content="'+taskDescription+'"><img src="' + Task_lego + '" style="width:30px; height:30px;vertical-align:middle;">'
				+ " " +'<span style="font-weight: bold;">'+list[i]["Task name"]+":  </span>"+SchedulingType + getDateformat(list[i]["Task start time"],list[i]["Task end time"])
				+'\n<div class="progress" style="vertical-align: middle;"> <div class="progress-bar" style=" background-color: '+itemsColor_progress+'; width: '+ itemsWidth_progress +'%;margin-bottom: 10px;" ></div></div></div>'});
			}
			// call to divide the task into weekly progress	
			getSubItem(groupId,items,C_Name, list[i]);
		}		
		
return items;
};
	
	// --------------Get the starting date and the end date in the format DD.MM.YY, or DD.MM if the item period less than one year-----------
	//---------------------------------------------------------------------------------------------------------------------------------------
	
	var getDateformat = function(startTime,endTime){
			var firstDate = new Date(startTime);
			var endDate = new Date(endTime);
			var diffDays = Math.floor(Math.abs((endDate.getTime() - firstDate.getTime() ))/(1*24*60*60*1000));
			
			if (diffDays < 365){
					return ' ('+ firstDate.getDate() +"."+ (firstDate.getMonth()+1)+' - '+endDate.getDate() +"."+ (endDate.getMonth()+1)+')';
			} else { 
				var startYear =firstDate.getFullYear().toString().substr(2,2);
				var endYear = endDate.getFullYear().toString().substr(2,2);
				return ' ('+ firstDate.getDate() +"."+ (firstDate.getMonth()+1)+"."+ startYear+' - '+endDate.getDate() +"."+ (endDate.getMonth()+1)+"."+endYear+')';
			}
	}
	
//----------- Function to get the weekly progress items or the daily progress in case of SET_DAYS ---------------
//---------------------------------------------------------------------------------------------------------------

var getSubItem = function(idGroup,itemsdata,color,list){

	var firstDate = new Date(list["Task start time"]);
	firstDate.setHours(0,0,0,999);
	var secondDate = new Date(list["Task end time"]);
	secondDate.setHours(0,0,0,999);
	var diffDays=getDiffDay(list["Task start time"],list["Task end time"]);
	var begining = new Date(list["Task start time"]);
	var d = new Date();
	var m=0;
	// Geting the daily progress here
	if (list["Task repetition type"]=== 'SET_DAYS'){
		
		var checkBox = getTaskResult_setDays(resultSet,list["Task ID"]);
		var content='';
		for (var j = 0; j <= diffDays; j++) {
			var ID= list["Task ID"] +'_'+(m++);
			begining.setHours(0,0,0,999);
			
			for (var a = 0; a < checkBox.length; a++) {
					
					var resultDate= new Date(checkBox[a]["date"]);
					resultDate.setHours(0,0,0,999);
					if (resultDate.getTime() === begining.getTime() && checkBox[a]["missed"] ==='0'){
						content='<div style="display: inline-block; height: 25px; width:40px;"> <input type="checkbox" value="" onclick="return false" checked>  </div>';
						break;
					}else if (resultDate.getTime() === begining.getTime() && checkBox[a]["missed"]==='1'){
								content='<div style="display: inline-block; height: 25px; width:40px;"> <input type="checkbox" onclick="return false" value="">  </div>';
								break;
					}else {content='<div style="display: inline-block;"> </div>';}
			
			}
			
itemsdata.add({
				subgroup: list["Task repetition type"],
				group: idGroup,
				id: ID,
				content: content,
				start: begining.setHours(0,0,0,999),
				end: begining.setHours(23,59,0,0),
				style:" background-color: "+color+"; border-color:"+color+"; border-bottom-color:#97B0F8; height: 25px; margin-top: 10px; box-shadow: 2px 2px 150px rgba(128, 128, 128, 0.5);  ",
				type: 'range',
				className:'aa'
			});
		
		begining = addDays(begining, 1);
		}// get the weekly progress here
		}else{ 
			for (var j = 0; j <=diffDays; j++) {
		
			var newDate = addDays(firstDate, j);
			newDate.setHours(0,0,0,999);
			
			
			// end of the week or the end of the intervention
			if (newDate.getDay()=== 0 || newDate.getTime()=== secondDate.getTime() ){
				
				var ID= list["Task ID"] +'_'+(m++);
				//var endDate = addDays(newDate, 1);					
				
				itemsdata.add({
					subgroup: list["Task repetition type"],
					group: idGroup,
					id: ID,
					content: '<div style="display: inline-block;"> W'+':</div>',
					start: begining.setHours(0,0,0,999),
					end: newDate.setHours(23,59,59,999),
					style:" border-color:#97B0F8; border-bottom-color:#97B0F8; height: 25px; margin-top: 10px;",
					type: 'range',
					className:color
				});
				
				
				
				var thisItem = itemsdata.get(ID);
				var itemsProgress= getTaskResult(resultSet,thisItem,list["Task repetition count"]);
				var itemsWidth_progress= Number(itemsProgress[0]);
				var itemsColor_progress= itemsProgress[1];
				var no_of_result= itemsProgress[2];
				
				// to get the no of rep. inside the progress bar in case of the number is more than the required repetition
				if ((list["Task repetition type"]==="N_TIMES_PER_WEEK" ||  list["Task repetition type"]==="SET_WEEKDAYS")&& no_of_result>list["Task repetition count"]){ 
				var show_ProgressNumber=no_of_result}
				else{ var show_ProgressNumber="";}
				
				if (begining > d){
				itemsdata.update({id:ID , 
								content:'<div style="display: inline-block;"></div>',
								className:'past'});
				}else{
						if (list["Task repetition type"]==="ANYTIME" ){ 
								
								itemsdata.update({id:ID , 
								content:'<div class="ttooltip" data-title="Weekly result " data-content="This number shows how many time have you done this task in this week" > <div style="display: inline-block; width:250px; vertical-align: middle; ">'+no_of_result+'</div></div>'});
								}
								else{
								itemsdata.update({id:ID , 
								content:'<div class="ttooltip" data-title="Weekly progress " data-content="This bar shows your progress of this task in this week" ><div style="display: inline-block;">'+'</div><div class="progress"> <div class="progress-bar" style=" background-color: '+itemsColor_progress+'; width: '+ itemsWidth_progress +'%;margin-bottom: 10px;" ><div style= "text-align:center; position: relative; top: 50%; transform: translateY(-50%);">'+show_ProgressNumber+'</div></div></div></div>'});
								}
				}
				
				// get the next
				begining = addDays(newDate, 1);
			
				}
				
			}	
			
	}
	return itemsdata;
	
};

//----------------------- Getting numbers of days between two dates----------------------------
//---------------------------------------------------------------------------------------------
	var getDiffDay = function(startTime,endTime){
		var firstDate = new Date(startTime);
		firstDate.setHours(0,0,0,999);
		var endDate = new Date(endTime);
		endDate.setHours(0,0,0,999);
		var diffDays = Math.round((endDate.getTime() - firstDate.getTime() )/(1*24*60*60*1000));
		
		return diffDays;
	};

		
//------------------------------- adding days to a date	---------------------------------------
//---------------------------------------------------------------------------------------------
function addDays(theDate, days) { 
		return new Date(theDate.getTime() + days*24*60*60*1000);
};
		
		

//-------------------------- load data via an ajax request. When the data is in, load the timeline ---------------
//----------------------------------------------------------------------------------------------------------------
function  startTimeline(Hg1,Hg2,C){
$.ajax({
	url: 'data/u4data.json',
	success: function (data) {
	
		getResultSet(data);
		// hide the "loading..." message
		document.getElementById('loading').style.display = 'none';
		
		// DOM element where the Timeline will be attached
		var container = document.getElementById('visualization');

		
		// Configuration for the Timeline
		var options = {
			min: new Date(2013, 0, 8),                // lower limit of visible range
			max: new Date(2016, 0, 1),                // upper limit of visible range
			showCurrentTime: true,
		   // showCustomTime: true ,
			selectable: false,
			start: new Date(Date.now() ),
			end: new Date(Date.now() ) ,
			zoomMin: 1000 * 60 * 60 * 24*7,             // Seven days in milliseconds
			zoomMax: 1000 * 60 * 60 * 24 * 31* 3 ,        // about three months in milliseconds};
			
			maxHeight:'330px',
			Height:'40%',
			stack: false,
			margin: {
				item: {
					vertical: 30,
					horizontal:1
				},
				axis:9
			}
		};
		
		//-------------- Create a Timeline--------------------------
		//----------------------------------------------------------
		
		var timeline = new vis.Timeline(container,null, options);
		timeline.setGroups(getGroups(data));
		
		// put the items(tasks) in the timeline
		var timelineItems = getBackgroundItems(data);
		timeline.setItems(timelineItems);
		
		var g = timeline.getVisibleItems();
		var time= new Date()
		
		// add the word 'Today' to the current time bar
		$( ".currenttime" ).append( "<div style=' font-size: 80%; text-align: center; position: relative; top: 95%; left: -25px; height: 5%; width: 50px; background: white;'>Today</div>" );
		// adding the tooltips to the items
		timeline.on('rangechanged', function (properties) {
		
		$('.ttooltip').ttooltip({
					trigger    :'click', 
					followmouse: false,
					closebutton:true
					});
					
					
			});
		$('.ttooltip').ttooltip({
					trigger    :'click', 
					followmouse: false,
					closebutton:true
					});
		
		timeline.on('rangechange', function (properties) {
		var str = $( ".minor" ).text();
		if ( str.indexOf("Mon") != -1){
		$( ".minor.tuesday" ).css("color", "#4D4D4D");
		$( ".minor.wednesday" ).css("color", "#4D4D4D");
		$( ".minor.thursday" ).css("color", "#4D4D4D");
		$( ".minor.friday" ).css("color", "#4D4D4D");
		$( ".minor.saturday" ).css("color", "#4D4D4D");
		$( ".minor.sunday" ).css("color", "#4D4D4D");
		$( ".minor.monday" ).css("color", "blue");
		} else{$( ".minor" ).css("color", "#4D4D4D");}
		
		
		});
		//timeline.addCustomTime(time.getTime() + 24*60*60*1000,'customtime1');
		//Add second CustomTime
		time = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1);
		timeline.addCustomTime(time, 'customtime2');
		timeline.addCustomTime(time *1000 * 60 * 60 * 24, 'customtime1');
		////////
		
		var counter=1;
		var id;
		$(".customtime").each(function(){
		id='customtime'+counter;
		$(this).attr("id",id);
		counter++;
		});
		
		$( "#customtime1 div" ).first().append( "<span style=' font-size:70%; text-align: left; position:absolute; top: 96%; left: 20px; height: 5%; width: 50px;  '>Time A</span>");
		
		$( "#customtime2 div" ).first().append( "<span style=' font-size: 70%; text-align: left; position:absolute; top: 96%; left: 20px; height: 5%; width: 50px;  '>Time B</span>");
		$( "#customtime2" ).css({"border": "0", "border-left": "3px","border-style": "dotted","border-color": "#6E94FF","background-color":"transparent"});
		
		
		
		
		
		// -------------- Move to specific date -------------------------
		// ----------------------------------------------------------------------------
		function moveFunction() {
		var input1 = document.getElementById("move1").value;
		var m = moment.utc(input1,'DD-MM-YYYY');
		var choosenDate= new Date(m);
		var range = timeline.getWindow();
		var interval=getDiffDay(range.start,range.end);
		var windowsEnd= addDays(choosenDate, interval);
			timeline.setWindow({
				start: choosenDate.setDate(choosenDate.getDate() - 3),
				end:   windowsEnd
			});	
		
		};
		document.getElementById('move').addEventListener("click", moveFunction);	 
		
		
		// -------------- Zoom In, Zoom Out, Weekly, Monthly -------------------------
		// ----------------------------------------------------------------------------
		document.getElementById('zoomIn').onclick    = function () { zoom(-0.3); };
		document.getElementById('zoomOut').onclick   = function () { zoom( 0.3); };
		
		function zoom (percentage) {
			var range = timeline.getWindow();
			var interval = range.end - range.start;

			timeline.setWindow({
				start: range.start.valueOf() - interval * percentage,
				end:   range.end.valueOf()   + interval * percentage
			});
		}
		
		document.getElementById('Weekly').onclick   = function () { var range = timeline.getWindow();
		var windowsEnd= addDays(range.start,7);
		timeline.setWindow({
				start: range.start,
				end:   windowsEnd
			});	
		};
		document.getElementById('Monthly').onclick   = function () { var range = timeline.getWindow();
		var windowsEnd= addDays(range.start,30);
		timeline.setWindow({
				start: range.start,
				end:   windowsEnd
			});	
		};
		
		
		// -------------- Changing the text box values of the Time A and B when changing the time of the customtime bars -------------------------
		// ----------------------------------------------------------------------------
		timeline.on('timechanged', function (properties) {
			
			var timestamp = parseInt(properties.time.getTime() / 1000);
			
			// console.log("nice timestamp : " + timestamp);
		
			var m = properties.time;
			
			var MyDateString = ('0' + m.getDate()).slice(-2) + '-'
				+ ('0' + (m.getMonth()+1)).slice(-2) + '-'
				+ m.getFullYear();
		
			if (properties.id =='customtime1'){
			$(".tb").val(MyDateString);
			
			Hg2.update(timestamp);
			C.moveCustomLineB( timestamp );
			
			}else{$(".ta").val(MyDateString);
			Hg1.update(timestamp);
			C.moveCustomLineA( timestamp );
			}	
		  });
		
		// -------------- Move the customtime bars by choosing specific dates -------------------------
		// ----------------------------------------------------------------------------
		document.getElementById('move').onclick    = function () { 
					var input1 = document.getElementById("move1").value;
					var m = moment.utc(input1,'DD-MM-YYYY');
					var choosenDate= new Date(m);
					//choosenDate.setDate(choosenDate.getDate() + 3);
					
					// console.log("another nice timestamp: " + (choosenDate.getTime()/1000));
					
					timeline.setCustomTime(choosenDate,'customtime2'); 
					
					Hg1.update(choosenDate.getTime()/1000);
					
					C.moveCustomLineA( choosenDate.getTime()/1000 );
					
					};
					
		document.getElementById('moveB').onclick    = function () { 
					var input1 = document.getElementById("timeB").value;
					var m = moment.utc(input1,'DD-MM-YYYY');
					var choosenDate= new Date(m);
					
					// console.log("another nice timestamp2: " +(choosenDate.getTime()/1000));
					
					timeline.setCustomTime(choosenDate,'customtime1'); 
					
					Hg2.update(choosenDate.getTime()/1000);					
					C.moveCustomLineB( choosenDate.getTime()/1000 );
					
					};	
	},
	error: function (err) {
		console.log('Error', err);
		if (err.status === 0) {
			alert('Failed to load data/u2data.json.\nPlease run this example on a server.');
		}
		else {
			alert('Failed to load data/u2data.json.');
		}
	}

});	}

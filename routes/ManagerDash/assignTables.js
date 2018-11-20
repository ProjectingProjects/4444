$(".assignButton").on("click", colorProcessing);
$(".InfoCol>.confirmButton").on("click", sendData);

//keeps track of first button pushed for every pair of buttons
var frstButton = "NONE";
var frstClass   = "NONE";
//changes color of svrButtons based on which section button was pushed in the pair
function colorProcessing(event){
  var thisElem   = $(event.target);
  var thisButton = $(event.target).closest("button");//get thisButton
  
  var thisClass   = "";
  if(thisButton.hasClass("sectionButton")){
    thisClass = "sectionButton";
  }
  else if(thisButton.hasClass("svrButton")){
    thisClass = "svrButton";
  }
  else{
    console.log("Error finding button class");
  }
  
  //~~~ERROR CHECKING
  if(frstButton != "NONE"){
    console.log("frstButton:"+frstButton.attr("id"));
    console.log("frstClass:"+frstClass);
  }
  else{
    console.log("frstButton:NONE");
  }
  console.log("thisButton:"+thisButton.attr("id"));
  console.log("thisClass:"+thisClass);
  //~~~END ERROR CHECKING
    
  if(frstButton == "NONE"){//if no other button pushed yet
    frstButton = thisButton;
    frstClass  = thisClass;
  }
  else if(frstClass=="sectionButton"){//else if already pushed sectionButton
    if(thisClass != frstClass){
      var sectionColor = frstButton.css("background-color");
      thisButton.css("background-color", sectionColor);

      frstButton = "NONE";
      frstClass  = "NONE";
    }
    else{
      frstButton = thisButton;
      frstClass  = thisClass;
    }
  }
  else if(frstClass=="svrButton"){//else if already pushed svrButton
    if(thisClass != frstClass){
      var sectionColor = thisButton.css("background-color");
      frstButton.css("background-color", sectionColor);
      
      frstButton = "NONE";
      frstClass  = "NONE";
    }
    else{
      frstButton = thisButton;
      frstClass  = thisClass;
    }
  }
  else{
    console.log("Error with frstClass");
  }
    
  //~~~ERROR CHECKING
  if(frstButton != "NONE"){
    console.log("frstButton2:"+frstButton.attr("id"));
    console.log("frstClass2:"+frstClass);
  }
  else{
    console.log("frstButton2:NONE");
  }
  console.log("thisButton2:"+thisButton.attr("id"));
  console.log("thisClass2:"+thisClass);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  //~~~END ERROR CHECKING
}//end colorProcessing


//send section assignment data to server
function sendData(event){
  console.log("sending assignment data...");
  var socket = io({transports: ['websocket']});
  
  //get assign states
  var svr1Color = $("#server1").css("background-color");
  var svr2Color = $("#server2").css("background-color");
  var svr3Color = $("#server3").css("background-color");
  
  var secColors = [];
  var currColor = $("#section1").css("background-color");
      secColors.push(currColor);
      
      currColor = $("#section2").css("background-color");
      secColors.push(currColor);
      
      currColor = $("#section3").css("background-color");
      secColors.push(currColor);
  //END get assign states
  
  //make array of assignments
  var assignments = {}
      assignments.s1 = (secColors.indexOf(svr1Color))+1;
      assignments.s2 = (secColors.indexOf(svr2Color))+1;
      assignments.s3 = (secColors.indexOf(svr3Color))+1;
  
  socket.emit('managerAssign', assignments);
}//end sendData



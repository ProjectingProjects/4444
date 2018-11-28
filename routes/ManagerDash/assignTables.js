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
      
      var secID = frstButton.attr("id");
      thisButton.toggleClass(secID, true);
      if(secID == 'section1'){
        thisButton.toggleClass('section2 section3', false);
      }
      else if(secID == 'section2'){
        thisButton.toggleClass('section1 section3', false);
      }
      else if(secID == 'section3'){
        thisButton.toggleClass('section1 section2', false);
      }
      else{
        console.log("ERROR getting section number from sectionButton.class");
      }

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

      var secID = thisButton.attr("id");
      frstButton.toggleClass(secID, true);
      if(secID == 'section1'){
        frstButton.toggleClass('section2 section3', false);
      }
      else if(secID == 'section2'){
        frstButton.toggleClass('section1 section3', false);
      }
      else if(secID == 'section3'){
        frstButton.toggleClass('section1 section2', false);
      }
      else{
        console.log("ERROR getting section number from sectionButton.class");
      }
      
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
  

  var svr1 = $(".section1").text();
  var svr2 = $(".section2").text();
  var svr3 = $(".section3").text(); 

  var assignment = [svr1, svr2, svr3];  

  console.log(assignment);
  socket.emit('managerAssign', assignment);

}

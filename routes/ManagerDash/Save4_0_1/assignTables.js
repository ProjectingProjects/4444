$(".assignButton").on("click", colorProcessing);

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
    thisClass = "svrbutton";
  }
  else{
    console.log("Error finding button class");
  }
  
  if(frstButton == "NONE"){//if no other button pushed yet
    frstButton = thisButton;
    frstClass  = thisClass;
  }
  else if(frstClass=="sectionButton"){//else if already pushed sectionButton
    if(thisClass != frstClass){
      var sectionColor = frstButton.css("background-color");
      thisButton.css("background-color", sectionColor);

      frstButton = "NONE";
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
    }
    else{
      frstButton = thisButton;
      frstClass  = thisClass;
    }
  }
}//end colorProcessing
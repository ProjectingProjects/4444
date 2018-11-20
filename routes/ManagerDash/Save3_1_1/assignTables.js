$(".assignButton").on("click", colorProcessing);

//keeps track of first button pushed for every pair of buttons
var frstButton = "NONE";
//changes color of svrButtons based on which section button was pushed in the pair
function colorProcessing(event){
  var thisElem = $(event.target);
  var thisButton = $(event.target).closest("button");//get thisButton
  
  if(frstButton == "NONE"){//if no other button pushed yet
    frstButton = thisButton;
  }
  else if(frstButton.hasClass("sectionButton")){//else if already pushed sectionButton
    var sectionColor = frstButton.css("background-color");
    thisButton.css("background-color", sectionColor);
      
    frstButton = "NONE";
  }
  else if(frstButton.hasClass("svrButton")){//else if already pushed svrButton
    var sectionColor = thisButton.css("background-color");
    frstButton.css("background-color", sectionColor);
      
    frstButton = "NONE";
  }
}//end colorProcessing
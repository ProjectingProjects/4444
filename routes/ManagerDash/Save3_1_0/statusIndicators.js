//$(document).onload(setup);
$(document).ready($("button.paymentIndicator").on("click", chngPymntColor));
$(document).ready($("button.helpIndicator").on("click", chngHelpColor));

function chngPymntColor(event){
  var clkdElem = $(event.target);
  var pymntWheel = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
  //var bgcolor = $(this).css("background-color");
  var bgcolor = clkdElem.css("background-color");
    console.log("background-color: " + bgcolor);
    
  if(bgcolor == pymntWheel[0])
    clkdElem.css("background-color", pymntWheel[1]);
  else if(bgcolor == pymntWheel[1])
    clkdElem.css("background-color", pymntWheel[2]);
  else if(bgcolor == pymntWheel[2])
    clkdElem.css("background-color", pymntWheel[0]);
  else
    console.log("Error: indicator colors");
    
    //$(this).css()
    //$(event.target).css()
  /*
  switch(bgcolor){
    case pymntWheel[0]:
      $(this).css("background", pymntWheel[1]);
      break;
    case pymntWheel[1]:
      $(this).css("background", pymntWheel[2]);
      break;
    case pymntWheel[2]:
      $(this).css("background", pymntWheel[0]);
      break;
    default:
      break;
  }//end switch on bgcolor
  */
}//end chngPymntColor()

function chngHelpColor(event){
  var helpWheel = ["rgb(100,0,0)", "rgb(0,100,0)", "rgb(0,0,100)"];
  var bgcolor = $(this).css("background");
  /*
  switch(bgcolor){
    case helpWheel[0]:
      $(this).css("background", helpWheel[1]);
      break;
    case helpWheel[1]:
      $(this).css("background", helpWheel[2]);
      break;
    case helpWheel[2]:
      $(this).css("background", helpWheel[0]);
      break;
    default:
      break;
  }//end switch on bgcolor
    */
}//end chngPymntColor()
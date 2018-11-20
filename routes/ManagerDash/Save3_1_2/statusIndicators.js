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
}//end chngPymntColor()

function chngHelpColor(event){
  var clkdElem = $(event.target);
  var helpWheel = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
  //var bgcolor = $(this).css("background-color");
  var bgcolor = clkdElem.css("background-color");
  console.log("background-color: " + bgcolor);
    
  if(bgcolor == helpWheel[0])
    clkdElem.css("background-color", helpWheel[1]);
  else if(bgcolor == helpWheel[1])
    clkdElem.css("background-color", helpWheel[2]);
  else if(bgcolor == helpWheel[2])
    clkdElem.css("background-color", helpWheel[0]);
  else
    console.log("Error: indicator colors");
}//end chngPymntColor()
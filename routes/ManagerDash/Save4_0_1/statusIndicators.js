//$(document).onload(setup);
$(document).ready($("button.paymentIndicator").on("click", chngPymntColor));
$(document).ready($("button.helpIndicator").on("click", chngHelpColor));

function chngPymntColor(event){
  var clkdElem = $(event.target);
  var pymntWheel = ["rgb(160, 160, 160)", "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
  //var bgcolor = $(this).css("background-color");
  var bgcolor = clkdElem.css("background-color");
  console.log("background-color: " + bgcolor);
    
  //LOOP THRU colorWheel
  for(var i = 0; i < pymntWheel.length; ++i){
    if(bgcolor == pymntWheel[i])
      clkdElem.css("background-color", pymntWheel[(i+1)%(pymntWheel.length)]);
  }//END LOOP THRU colorWheel
    
  //if color didn't change
  if(bgcolor == clkdElem.css("background-color"))
    console.log("Error: indicator colors");
}//end chngPymntColor()

function chngHelpColor(event){
  var clkdElem = $(event.target);
  var helpWheel = ["rgb(160, 160, 160)", "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
  //var bgcolor = $(this).css("background-color");
  var bgcolor = clkdElem.css("background-color");
  console.log("background-color: " + bgcolor);
  
  //LOOP THRU colorWheel
  for(var i = 0; i < helpWheel.length; ++i){
    if(bgcolor == helpWheel[i])
      clkdElem.css("background-color", helpWheel[(i+1)%(helpWheel.length)]);
  }//END LOOP THRU colorWheel
    
  //if color didn't change
  if(bgcolor == clkdElem.css("background-color"))
    console.log("Error: indicator colors");
}//end chngPymntColor()
//$(document).onload(setup);
$(document).ready($("button.paymentIndicator").on("click", chngPymntColor));
$(document).ready($("button.helpIndicator").on("click", chngHelpColor));

function chngPymntColor(event){
  var clkdElem = $(event.target);
  var status   = event.status;
  
  var EMPTY=0, ORDERED=1, COOKING=2, FINISHED=3, CASH=4, CARD=5;
  var pymntWheel = ["rgb(160, 160, 160)",//grey(empty)
                    "rgb(198, 46, 0)",//red(not started)
                    "rgb(255, 139, 30)",//orange(food started)
                    "rgb(251, 255, 35)",//yellow(finished being made)
                    "rgb(86, 226, 68)",//green(selected cash)
                    "rgb(114, 245, 255)"];//blue(selected card)
  var bgcolor = clkdElem.css("background-color");
  console.log("background-color: " + bgcolor);
    
  console.log("status="+status);
  if(status === "ORDERED"){
    clkdElem.toggleClass("ORDERED",true);
    
    //if not waiting to pay, set color to order status
    if(!(clkdElem.hasClass("CASH"))&&!(clkdElem.hasClass("CARD"))){
      clkdElem.css("background-color", pymntWheel[ORDERED]);
    }
    return;//!!!EXIT FUNC HERE!!!//
  }
  else if(status === "COOKING"){
    clkdElem.toggleClass("COOKING",true);
    
    //if not waiting to pay, set color to order status
    if(!(clkdElem.hasClass("CASH"))&&!(clkdElem.hasClass("CARD"))){
      clkdElem.css("background-color", pymntWheel[COOKING]);
    }
    return;//!!!EXIT FUNC HERE!!!//
  }
  else if(status === "FINISHED"){
    clkdElem.toggleClass("FINISHED",true);
    
    //if not waiting to pay, set color to order status
    if(!(clkdElem.hasClass("CASH"))&&!(clkdElem.hasClass("CARD"))){
      clkdElem.css("background-color", pymntWheel[FINISHED]);
    }
    
    //if already paid, set color to EMPTY
    if(clkdElem.hasClass("PAID")){
      clkdElem.css("background-color", pymntWheel[EMPTY]);
      clkdElem.toggleClass("ORDERED COOKING FINISHED CASH CARD PAID",false);
    }
    return;//!!!EXIT FUNC HERE!!!//
  }
  else if(status === "CASH"){
    clkdElem.css("background-color", pymntWheel[CASH]);
    clkdElem.toggleClass("CASH",true);
    return;//!!!EXIT FUNC HERE!!!//
  }
  else if(status === "CARD"){
    clkdElem.css("background-color", pymntWheel[CARD]);
    clkdElem.toggleClass("CARD",true);
    return;//!!!EXIT FUNC HERE!!!//
  }
  
  //else someone clicked indicator
  //if indicator was CASH or CARD
  if((bgcolor == pymntWheel[4])||(bgcolor == pymntWheel[5])){
    if(clkdElem.hasClass("FINISHED")){
      clkdElem.css("background-color", pymntWheel[EMPTY]);
      clkdElem.toggleClass("ORDERED COOKING FINISHED CASH CARD PAID",false);
      return;
    }
    else if(clkdElem.hasClass("COOKING")){
      clkdElem.css("background-color", pymntWheel[COOKING]);
      clkdElem.toggleClass("PAID",true);
      clkdElem.toggleClass("CASH CARD",false);
      return;
    }
    else if(clkdElem.hasClass("ORDERED")){
      clkdElem.css("background-color", pymntWheel[ORDERED]);
      clkdElem.toggleClass("PAID",true);
      clkdElem.toggleClass("CASH CARD",false);
      return;
    }
    else{//else was EMPTY before
      console.log("~~Error with pymntInd classes");
    }
  }
}//end chngPymntColor()

function chngHelpColor(event){
  var clkdElem = $(event.target);
  var needed   = event.needed;
  
  var helpWheel = ["rgb(160, 160, 160)", "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
  
  console.log("needed="+needed);
  if(needed === "HELP"){
    clkdElem.css("background-color", helpWheel[1]);//set color to help
    return;//!!!EXIT FUNC HERE!!!//
  }
  else if(needed === "REFILL"){
    clkdElem.css("background-color", helpWheel[2]);//set color to refill
    return;//!!!EXIT FUNC HERE!!!//
  }
  
  clkdElem.css("background-color", helpWheel[0]);//set color back to none
}//end chngHelpColor()

$(document).ready(function(){
var socket = io({transports: ['websocket']});

//get svrID
var svrID = getCookie("svrID");
console.log("svrID="+svrID);

var myTables = [];
//request assigned table numbers
$.ajax({
  type: "POST",
  url: "http://45.56.67.103:80/service",
  data: { "id":svrID },
  success: function(response){
    console.log(response);
    console.log("length:"+Object.keys(response).length);
    responseLen = Object.keys(response).length;
    //LOOP THRU RESPONSE
    for(var i = 1; i <= responseLen; ++i){
      myTables.push(response["table"+i]);
      console.log("myTables:=$="+myTables);
    }//END LOOP THRU RESPONSE
    
console.log(response.table1);
  }//end response function
});//end of request assigned table numbers

socket.on('manHelp', function(tableNum) {
  console.log("help sent from " + tableNum);
  
  if(!myTables.includes(parseInt(tableNum))){return;}
  
  var myNum = (((tableNum%8)-1)%8)+1;
  var helpIndID = "#Tbl"+myNum+"StatusInd > .helpIndicator";
  var fakeEvent = {target:helpIndID, needed:"HELP"};
  chngHelpColor(fakeEvent);
  
  //var alertTXT = document.getElementsByClassName("alert");
  //$(alertTXT).html("Table " + tableNum + " requests help!");
  //$("#f911Alert").modal();
});

socket.on('manRefill', function(tableNum) {
  console.log("refills sent from " + tableNum);
  
  if(!myTables.includes(parseInt(tableNum))){return;}
  
  var myNum = (((tableNum%8)-1)%8)+1;
  var helpIndID = "#Tbl"+myNum+"StatusInd > .helpIndicator";
  var fakeEvent = {target:helpIndID, needed:"REFILL"};
  chngHelpColor(fakeEvent);
  
  //var alertTXT = document.getElementsByClassName("alert");
  //$(alertTXT).html("Table " + tableNum + " requests refills!");
  //$("#f911Alert").modal();
});

socket.on('tableOrd', function(tableNum) {
  console.log("Table " + tableNum + " has ordered");
  
  if(!myTables.includes(parseInt(tableNum))){return;}
  
  var myNum = (((tableNum%8)-1)%8)+1;
  var pymntIndID = "#Tbl"+myNum+"StatusInd > .paymentIndicator";
  
  console.log("myNum:"+myNum);
  console.log("pymntIndID:"+pymntIndID);
  
  var fakeEvent = {target:pymntIndID, status:"ORDERED"};
  chngPymntColor(fakeEvent);
});

socket.on('prepWait', function(tableNum) {
  console.log("Food prepared for " + tableNum);
  
  if(!myTables.includes(parseInt(tableNum))){return;}

  var myNum = (((tableNum%8)-1)%8)+1;
  var pymntIndID = "#Tbl"+myNum+"StatusInd > .paymentIndicator";
  var fakeEvent = {target:pymntIndID, status:"COOKING"};
  chngPymntColor(fakeEvent);
});

socket.on('readyWait', function(tableNum) {
  console.log("Food ready for " + tableNum);
  
  if(!myTables.includes(parseInt(tableNum))){return;}

  var myNum = (((tableNum%8)-1)%8)+1;
  var pymntIndID = "#Tbl"+myNum+"StatusInd > .paymentIndicator";
  var fakeEvent = {target:pymntIndID, status:"FINISHED"};
  chngPymntColor(fakeEvent);
});

socket.on('payCard', function(tableNum) {
  console.log("Table " + " paid with card");
  
  if(!myTables.includes(parseInt(tableNum))){return;}
  
  var myNum = (((tableNum%8)-1)%8)+1;
  var pymntIndID = "#Tbl"+myNum+"StatusInd > .paymentIndicator";
  var fakeEvent = {target:pymntIndID, status:"CARD"};
  chngPymntColor(fakeEvent);
}); 

socket.on('payCash', function(tableNum) {
  console.log("Table " + " paid with cash");
  
  if(!myTables.includes(parseInt(tableNum))){return;}
  
  var myNum = (((tableNum%8)-1)%8)+1;
  var pymntIndID = "#Tbl"+myNum+"StatusInd > .paymentIndicator";
  var fakeEvent = {target:pymntIndID, status:"CASH"};
  chngPymntColor(fakeEvent);
}); 
});//END $(document).ready()
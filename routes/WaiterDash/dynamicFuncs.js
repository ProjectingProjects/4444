//returns value of cname cookie
function getCookie(cname) {
  var name = cname + "=";
  console.log("name="+name);
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  console.log("ca="+ca);
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      console.log("c="+c);
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        console.log("c.subStr="+c.substring(name.length, c.length));
          return c.substring(name.length, c.length);
      }
  }
  console.log("BIG PROBLEM");
  return "";
}

$(document).ready(function() {
    var socket = io({transports: ['websocket']});
  
    //get svrID
    var svrID = getCookie("svrID");
    console.log("svrID="+svrID);
    
    //query for name from svrID
    //socket.emit('nameFromID'
    
    //request assigned table numbers
		$.ajax({
			type: "POST",
			url: "http://45.56.67.103:80/service",
			data: {"id":parseInt(svrID)},
	    success: function(response){
				console.log(response);
				console.log("length:"+Object.keys(response).length);
        responseLen = Object.keys(response).length;
        //LOOP THRU RESPONSE
        for(var i = 1; i <= responseLen; ++i){
          $("#TableLabel"+i).html("Table "+response["table"+i]);
          console.log("TableLabel"+i+"="+$("#TableLabel"+i).text());
        }//END LOOP THRU RESPONSE
        
 		console.log(response.table1);
 			}//end response function
 		});//end of request assigned table numbers
		
		socket.on('manHelp', function(tableNum) {
                        console.log("help sent from " + tableNum);
                        //var alertTXT = document.getElementsByClassName("alert");
			//$(alertTXT).html("Table " + tableNum + " requests help!");
                        //$("#f911Alert").modal();
                });

		socket.on('manRefill', function(tableNum) {
                        console.log("refills sent from " + tableNum);
                        //var alertTXT = document.getElementsByClassName("alert");
                        //$(alertTXT).html("Table " + tableNum + " requests refills!");
                        //$("#f911Alert").modal();
                });

		socket.on('tableOrd', function(tableNum) {
			console.log("Table " + tableNum + " has ordered");
		});

		socket.on('prepWait', function(tabletab) {
			
			console.log("Food prepared for " + tabletab);

		});

		socket.on('readyWait', function(tabletab) {
			
			console.log("Food ready for " + tabletab);

		});

		socket.on('payCard', function(tableT) {
			console.log("Table " + " paid with card");
		}); 

		socket.on('payCash', function(tableT) {
			console.log("Table " + " paid with cash");
		}); 
});
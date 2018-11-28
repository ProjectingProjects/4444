$(document).ready(function() {

		var dailySales = Cookies.get('sales');

		var dailyGrat = Cookies.get('grat');

		var expires;

		//if no gratuity is made this day
		if (dailySales == undefined)
                {
                        //create cookie
                        // Making a cookie for the order
                        var d = new Date();
                        d.setTime(d.getTime()+(24*60*60*1000));
                        expires = "expires="+d.toUTCString();

                        document.cookie = "grat= 0.00;" + expires + ";path=/";
                	dailyGrat = Cookies.get('grat');
		}
                else
                {
                        var gratEl = document.getElementsByClassName("gratuity");
                        $(gratEl).empty();
                        $(gratEl).text("$"+parseFloat(dailyGrat).toFixed(2));
                }



		//if no sales are made this day
		if (dailySales == undefined)
		{
			//create cookie
			// Making a cookie for the order
                        var d = new Date();
                        d.setTime(d.getTime()+(24*60*60*1000));
                        expires = "expires="+d.toUTCString();

                        document.cookie = "sales= 0.00;" + expires + ";path=/";			
			dailySales = Cookies.get('sales');
			console.log(dailySales);
		}
		else
		{
			var salesEl = document.getElementsByClassName("sales");
                        $(salesEl).empty();
                        $(salesEl).text("$"+parseFloat(dailySales).toFixed(2));
		}

		var close = document.getElementsByClassName("ok");

    $(close).on("click", function(){ $("#f911Alert").modal("hide"); });

    var socket = io({transports: ['websocket']});
///////////////////////
////////TESTING////////
///////////////////////
    socket.on('manHelp', function(tableNum) {
  console.log("help sent from " + tableNum);
  
  /*var helpIndID = "#Tbl"+tableNum+"StatusInd > .helpIndicator";
  var fakeEvent = {target:helpIndID, needed:"HELP"};
  chngHelpColor(fakeEvent);*/
  
  //var alertTXT = document.getElementsByClassName("alert");
  //$(alertTXT).html("Table " + tableNum + " requests help!");
  //$("#f911Alert").modal();
});

socket.on('manRefill', function(tableNum) {
  console.log("refills sent from " + tableNum);
  
  /*var helpIndID = "#Tbl"+tableNum+"StatusInd > .helpIndicator";
  var fakeEvent = {target:helpIndID, needed:"REFILL"};
  chngHelpColor(fakeEvent);*/
  
  //var alertTXT = document.getElementsByClassName("alert");
  //$(alertTXT).html("Table " + tableNum + " requests refills!");
  //$("#f911Alert").modal();
});
///////////////////////
////////TESTING////////
///////////////////////
		socket.on('sendSales', function(sumTot) {

			dailySales = Cookies.get('sales');

			console.log(sumTot);
			var value = parseFloat(dailySales).toFixed(2);

			console.log(value);			

			value = (parseFloat(value) + parseFloat(sumTot));
			
			console.log(value);

			var salesEl = document.getElementsByClassName("sales");
			$(salesEl).empty();
			$(salesEl).text("$"+parseFloat(value).toFixed(2));
			
			Cookies.set('sales', parseFloat(value).toFixed(2));

		});


		socket.on('sendGratuity', function(sumGratuity) {

			dailyGrat = Cookies.get('grat');
		
			console.log(sumGratuity);
			var value = parseFloat(dailyGrat).toFixed(2);
			
			value = (parseFloat(value) + parseFloat(sumGratuity));

			var gratEl = document.getElementsByClassName("gratuity");
                        $(gratEl).empty();
                        $(gratEl).text("$"+parseFloat(value).toFixed(2));

			Cookies.set('grat', parseFloat(value).toFixed(2));

		});

});//end ready()

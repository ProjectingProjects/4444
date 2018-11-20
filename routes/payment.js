$(document).ready(function(){

	var socket = io({transports: ['websocket']});
	var tableCookie = Cookies.get('table');
	var orderCookie = Cookies.get('order');

	console.log(orderCookie);

	//gratuity
	var gratuity = 0.0;


	//check if gratuity is added already
	var gratAdded = 0;

        console.log(tableCookie);

	//sales
	var sumPrices = 0.0;
	var total;

	console.log("payment page online!");
  //click applyCoupon
  $("#applyCoupon-btn").on("click", function(){  
    socket.emit('couponCheck', $("#couponCode").val());
    socket.on('checking', function(work){
      if (work==1){
	//if card button is pressed
	      $("#applyCoupon-btn").on("click", function() {
    		document.getElementById("demo").innerHTML = "Your coupon has been applied.";

		console.log("coupon data sent");
		});
	}
	else{
	//if card button is pressed
	      $("#applyCoupon-btn").on("click", function() {
    		document.getElementById("demo").innerHTML = "Your coupon is invalid.";


		console.log("coupon rejected");

		});
	}
	});
});


//click on applycoupon
	$(".applyCoupon").on("click", function() {
	
	//send to 

    
    console.log("textBox.val()="+$("#couponCode").val());
  });//end applyCoupon
  
	//click yes for bonus game
	$(".yes").on("click", function() {

		//send to bonus game page
		window.location.href = "BonusGame.html";

	});

	//click no for bonus game
	$(".nope").on("click", function() {


		//send alert to index
		socket.emit('thanks', "Thank you for Coming! Have a Nice Day!");

		//send to index page
		window.location.href = "index.html";

	});


	//send compliment
	$(".comp").on("click", function() {
		var compliment = [];
		compliment.push(tableCookie);
		compliment.push($(this).text());
		console.log(compliment);
		socket.emit('compChef', compliment);
	});


	//if card button is pressed
	$("#submitPayment-btn").on("click", function() {
    document.getElementById("demo").innerHTML = "Your payment is processing.";


		console.log("card data sent");

		//clear order
		socket.emit('paid', 0);

		//remove order cookie
	        document.cookie = 'order= none; expires=Fri, 3 Aug 2001 20:47:11 UTC; path=/';

		orderCookie = Cookies.get('order');

        	console.log(orderCookie);

		//send manager data of new sales + gratuity
		socket.on('paidAck', function(msg){

		console.log(msg);

		socket.emit('gratuity', gratuity);

		socket.emit('sales', sumPrices);
	
		});

		console.log("sales: " + sumPrices);

		//show bonus game modal
		$("#bonusAlert").modal();

	});


	//if cash button is pressed
	$(".cash-btn").on("click", function() {
		
		//send notification to server
		socket.emit('paid', 1);
		
		//remove order cookie
                document.cookie = 'order= none; expires=Fri, 3 Aug 2001 20:47:11 UTC; path=/';

		//show bonus game modal
		$("#bonusAlert").modal();
	});
	

	//if 10% gratuity is clicked
	$("div.col.order").on("click", ".10p", function() {

		console.log("ten percent added");
		gratuity = $(".10p").val();
		console.log(gratuity);	
		var gratEl = "<p>TIPS..........."+gratuity+"</p>";
		$(".gratuity").empty();
		$(".gratuity").append(gratEl);
		$(".total").empty();
		var newTotal = parseFloat(total);
		newTotal += parseFloat(gratuity);
		console.log("total = " + newTotal);
		$(".total").append("<p class=\" flex-grow-1 flex-fill\">TOTAL.........."+parseFloat(newTotal).toFixed(2)+"</p></div>");
	});


	//if 15% gratuity is clicked
        $("div.col.order").on("click", ".15p", function() {

		//grab value
                gratuity = $(".15p").val();

		//create Gratuity element
                var gratEl = "<p>TIPS..........."+gratuity+"</p>";
		$(".gratuity").empty();
                $(".gratuity").append(gratEl);
                
		//add new Total
		$(".total").empty();
                var newTotal = parseFloat(total);
                newTotal += parseFloat(gratuity);
                $(".total").append("<p class=\" flex-grow-1 flex-fill\">TOTAL.........."+parseFloat(newTotal).toFixed(2)+"</p></div>");
        });


	  //if 20% gratuity is clicked
        $("div.col.order").on("click", ".20p", function() {

                //grab value
                gratuity = $(".20p").val();

                //create Gratuity element
                var gratEl = "<p>TIPS..........."+gratuity+"</p>";
                $(".gratuity").empty();
                $(".gratuity").append(gratEl);
                
                //add new Total
                $(".total").empty();
                var newTotal = parseFloat(total);
                newTotal += parseFloat(gratuity);
                $(".total").append("<p class=\" flex-grow-1 flex-fill\">TOTAL.........."+parseFloat(newTotal).toFixed(2)+"</p></div>");
        });


	//if user enters custom amount
	$("div.col.order").on("click", ".custom", function() {
		console.log("custom amount sent");
		
		//grab value
		var customdat = $("#custom").val();
		console.log(customdat);

		//create Gratuity element
                var gratEl = "<p>TIPS..........."+customdat+"</p>";
                $(".gratuity").empty();
                $(".gratuity").append(gratEl);

                //add new Total
                $(".total").empty();
                var newTotal = parseFloat(total);
                newTotal += parseFloat(customdat);
                $(".total").append("<p class=\" flex-grow-1 flex-fill\">TOTAL.........."+parseFloat(newTotal).toFixed(2)+"</p></div>");

	});


	var close = document.getElementsByClassName("ok");

                $(close).on("click", function(){ $("#f911Alert").modal("hide"); });

		console.log(tableCookie);

		if (tableCookie != undefined)	
                	socket.emit('payTable', tableCookie);
		
		socket.on('confPaytable', function(jsonTable) {

			//create DOM Elements for each item
			var item = JSON.parse(jsonTable);
			console.log(item);
			for (var i = 0; i < item.table.length; i++)
			{
				var food = "<p class=\" flex-grow-1 flex-fill food"+i+"\">"+item.table[i].menuItem+"..........."+item.table[i].menuPrice+"</p>";
				$("div.col.order").append(food);				


				//add price to total
				sumPrices += parseFloat(item.table[i].menuPrice);
	
			}	
			

			//tax
			var tax = parseFloat(sumPrices) * 0.0625;	
			var taxEl = "<p class=\" flex-grow-1 flex-fill tax\">TAX.........."+parseFloat(tax).toFixed(2)+"</p>";

			sumPrices += parseFloat(tax);
			//total price
			total = parseFloat(sumPrices).toFixed(2);


			//GRATUITY
			var tenp = parseFloat(total) * 0.10;
			tenpEl = "<button value=\""+parseFloat(tenp).toFixed(2)+"\" class=\" btn btn-primary 10p\">Add 10% Gratuity: " + parseFloat(tenp).toFixed(2) + "</button>";
			var fifteenp = parseFloat(total) * 0.15;
			fifteenpEl = "<div><button value=\""+parseFloat(fifteenp).toFixed(2)+"\" class=\" btn btn-primary 15p\">Add 15% Gratuity: " + parseFloat(fifteenp).toFixed(2) + "</button></div>";
			var twentyp = parseFloat(total) * 0.2;
			var twentypEl = "<button value=\""+parseFloat(twentyp).toFixed(2)+"\" class=\" btn btn-primary 20p\">Add 20% Gratuity: " + parseFloat(twentyp).toFixed(2) + "</button>";
			var custompEl = "<p>Enter custom gratuity:</p><input id=\"custom\" type=\"text\" size=\"6\"><button class=\"btn btn-primary custom\">OK</button>";
		

			var totalEl = "<div class=\"total\"><p class=\" flex-grow-1 flex-fill\">TOTAL.........."+total+"</p></div>";

			$("div.col.order").append(taxEl);
			$("div.col.order").append(tenpEl);
			$("div.col.order").append(fifteenpEl);
			$("div.col.order").append(twentypEl);
			$("div.col.order").append(custompEl);
			$("div.col.order").append("<div class=\"gratuity\"></div>");
			$("div.col.order").append(totalEl);
		});

});

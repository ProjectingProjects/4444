$(document).ready(function() {

	let currentOrder = [];			//table's order
	let ind = 0;				//index
	let bill = 0.0;				//total bill
	let totalBill = 0.0;
	let tax = 0.0;

	//booleans to check if no items are highlighted
	var hItems = 0;
	var alertExists = 0;

	//close btns for modals
	var close = document.getElementsByClassName("ok");
	var modClose = document.getElementsByClassName("okMod");

	var modItem;				//save modded item
	var modID;				//mod div's id
	var v;					//modify div itself
	var modBtns = [];			//modify buttons for specific item

	//close alert modal
	$(close).on("click", function(){ $("#f911Alert").modal("hide");	});

	//close modify modal
	$(modClose).on("click", function(){
		
		$(v).css('display', 'none');	
	
		var noMods = 0;					//find default button modifications			
		var defvar = "<td id=\"defTxt\">";
		var tMods = [];	
		modItemID = $(modItem).attr('id');		//get id of modded item

		var modifierButtonIDs = [];			//place modifiers in array

		arrID = $(modItem).attr('id');			//get order no

		//console.log(currentOrder[arrID]);	
		while (currentOrder[arrID].length > 3)
			currentOrder[arrID].pop();

		//save button changes to item
		$(v).find("button").each(function() {
			if ($(this).hasClass("modEnabled"))
			{
				//add mod text to item
				var mod = $(this).text();
				tMods.push(" " + mod);
				currentOrder[arrID].push(mod);
				noMods++;
				modifierButtonIDs.push($(this).attr('id'));
			}
		});

		modBtns.splice(modItemID, 1, modifierButtonIDs);		//place mods in array
		
		if (noMods > 0)							//if there are default button mods
		{
			defvar = defvar + tMods.toString() + "</div>";		//create element to store modifications
			//add to row
			if ($(modItem).find("#defTxt").length > 0)
			{
				$(modItem).find("#defTxt").empty();
                                $(modItem).find("#defTxt").append(tMods.toString());
			}
			else
				$(modItem).append(defvar);
			
		}
		else if (noMods == 0)						//if no default mods are added
		{
			//check if row exists
			if ($(modItem).find("#defTxt").length > 0)
				//delete it
                                $(modItem).find("#defTxt").remove();
		}

		//save text changes to item
		if ($("#txt-mod").val() != '')
		{
			var tval = $("#txt-mod").val();				//get text and place in new element
			currentOrder[arrID].push(tval);
			var textvar = "<td id=\"modTxt\">"+tval+"</td>";
			if ($(modItem).find("#modTxt").length > 0)
			{
				$(modItem).find("#modTxt").empty();
				$(modItem).find("#modTxt").append(tval);
			}
			else
				$(modItem).append(textvar);
			
		}
		else if (!$("#txt-mod").val())				//if initially empty or if text mods are removed
		{
			//check for modTxt element
			if ($(modItem).find("#modTxt").length > 0)
				//remove it
				$(modItem).find("#modTxt").remove();
		}

		//RESET EVERYTHING
		$(modItem).toggleClass('highlighted');				//remove highlight from item
                $(".modify-Food").find("button").removeClass("modEnabled");	//remove enabled buttons
		$("#txt-mod").val('');						//clear input data
                $("#modFood").modal("hide");					//hide modal

		console.log(currentOrder[arrID]);

        });


	//select a menu item
	$(".item").each(function(){
		$(this).on("click", function(){
			
			//get food item's data and place in array/HTML DOM
			var itemName = $(this).children(".name").text();
			var itemPrice = $(this).children(".price").text();		
			var itemId = $(this).children(".name").attr('id');
	
			currentOrder.push([itemName, itemPrice, ind]);

			updateOrder(itemName, itemPrice, itemId, null, null);
		})
	}
);

	//food 911
	$(".f911").on("click", function() { 
	
	var tableCookie = Cookies.get('table');

	//send message to waiter/manager
	var socket = io({transports: ['websocket']});
	socket.emit('food911', tableCookie);
	console.log("sending help...");
	$("#f911Alert").modal();

	});


	//refill button
	$(".refill").on("click", function() {
	
	var tableCookie = Cookies.get('table');
	
	//send message to waiter/manager
        var socket = io({transports: ['websocket']});
        socket.emit('refill', tableCookie);
        console.log("requesting refill...");
        alert("Requesting your refills!");

	});

	//highlight food item
	$("tbody").on("click", "tr", function() { $(this).toggleClass('highlighted');});

	//click mod button
	$(".modify-Food").on("click", "button", function() {
		
		$(this).toggleClass('modEnabled');
		
		/*/disable button's opposite (no v xt)
		var btnID = $(this).attr('id');
		if (btnID.includes("no"))
			var oppID = "#xt" + btnID[btnID.length-1];
		else
			var oppID = "#no" + btnID[btnID.length-1];

		*/
	});


	//repeat highlighted food items
	$(".rptItem").on("click", function() {
		var i = 0;
		$(".food").each(function() {
			//if item is highlighted, repeat
			var selectedItem = $('#' + i + '.food');
			i++;

			if ($(selectedItem).hasClass("highlighted"))	
			{
				itemName = $(selectedItem).find("td.itN").text();
				itemPrice = $(selectedItem).find("td.itP").text();
				itemID = $(selectedItem).find("td.itN").attr('id');
				
				var defMods, txtMods;		
		
				//check for button mods
				if ($(selectedItem).find("#defTxt").length > 0)
					defMods = $(selectedItem).find("#defTxt").text();
				else		
					defMods = null;
			
				//check text mods
				if ($(selectedItem).find("#modTxt").length > 0)
					txtMods = $(selectedItem).find("#modTxt").text();
				else
                                        txtMods = null;
				
	
				currentOrder.push([itemName, itemPrice, ind]);
			
				updateOrder(itemName, itemPrice, itemID, defMods, txtMods);
                        
				$(selectedItem).toggleClass('highlighted');
				hItems++;
			}	
		});

		//if no items were highlighted, send alert to user	
		if (hItems == 0)
		{
			console.log("alert");
			createAlert("Please highlight any item(s) you wish to repeat!");
		}

		hItems = 0;		//set number of items highlighted back to 0
	})


	//delete highlighted food items
	$(".rmvItem").on("click", function() {
		var i = 0;
		var removed = 0;
		$(".food").each(function() {
			
			var selectedItem = $('#' + i + '.food');
			
			if ($(selectedItem).hasClass("highlighted"))
			{
				//delete from array first
				currentOrder.splice(i, 1);
				//change indexes of other elements
				for (z = 0;  z < currentOrder.length; z++)
					currentOrder[z][2]--;
				//get price to remove			
				itemPrice = selectedItem.find("td.itP").text();
				bill = bill - parseFloat(itemPrice);
				tax = bill * 0.0625;
				totalBill = parseFloat(bill) + parseFloat(tax);
                                if(totalBill == "-0.00"){
                                  totalBill = "0.00";
                                }

				//update bill element
                	        var sumBill = document.getElementsByClassName("totalPrice");
				 var taxBill = document.getElementsByClassName("calcTax");
		
                	        $(taxBill).empty();
                       		$(taxBill).append("+ $"+parseFloat(tax).toFixed(2));

	                        $(sumBill).empty();
        	                $(sumBill).append("$"+parseFloat(totalBill).toFixed(2));
				

				//update HTML DOM
				selectedItem.remove();

				ind--;
				removed++;

				hItems++;
			}
			else
			{
				//update elements id
				var newID = i - removed;
				selectedItem.attr('id', newID); 
				var head = selectedItem.find("th");
				head.empty();
				head.append(newID+1);
			}


			i++;	//next item on order
		});

		//if no items were highlighted, send alert to user      
                if (hItems == 0)
                        createAlert("Please highlight any item(s) on your order that you wish to remove!");

                hItems = 0;


	});


	//modify highlighted food item
	$(".modItem").on("click", function() {

		i = 0;

		var modIndex;

		$(".food").each(function() 
		{
			
			var selectedItem = $('#' + i + '.food');

                        if ($(selectedItem).hasClass("highlighted"))
                        {
				hItems++;
				var el = $(selectedItem).find("td");
				modID = "mod" + $(el).attr('id');
				modItem = selectedItem;
				modIndex = $(modItem).attr('id');
			}
			
			i++;
			
		});
		if(hItems == 0)
			createAlert("Please highlight an item before performing modifications!");
		else if (hItems > 1)
			createAlert("Please select ONLY ONE element before performing modifications!");
		else
		{
			//get buttons from name id
			v = document.getElementsByClassName(modID);
			$(v).css('display', 'block');
			
			//check for enabled mods
			if (modBtns[modIndex] != null)
			{
				var buttons = modBtns[modIndex];
				console.log(buttons);
				for (var j = 0; j < buttons.length; j++)
				{
					var btnID = "#" + buttons[j];
					$(v).find(btnID).addClass("modEnabled");
				}
			}
			//txt mod
			if ($(modItem).find("#modTxt").length > 0)
			{
				var txt = $(modItem).find("#modTxt").text();
				$("#txt-mod").val(txt);			
			}

			$("#modFood").modal("show");
		}


		hItems = 0;

	});


	//confirm order button
	$(".confirm").on("click", function() 
	{
		var orderJSON;

		if (currentOrder.length == 0)
		{
			console.log("no items added");
			createAlert("Please add one or more items to your order before confirming!");
		}
		else
		{
		//convert order to json file
		orderJSON = "{\"order\" : [";		
		for(var i = 0; i < currentOrder.length; i++)
		{
			orderJSON = orderJSON + " { \"menuItem\": \"" + currentOrder[i][0] + "\",";
			orderJSON = orderJSON + " \"menuPrice\": \"" + currentOrder[i][1] + "\",";

			var j = 3;
			orderJSON = orderJSON + " \"mods\": \"";
			while (j < currentOrder[i].length)
			{
				orderJSON = orderJSON + currentOrder[i][j] + " ";
				j++;
			}

			orderJSON = orderJSON + "\" }";
			
			if ((i+1) != currentOrder.length)
				orderJSON = orderJSON + ",";
			
		}
		orderJSON = orderJSON + "] }";
				
console.log(orderJSON);

		var tableCookie = Cookies.get('table');

		//grab socket
		var socket = io({transports: ['websocket']});
		socket.emit('tableFFF', tableCookie);

		socket.on('order', function(order) {
			console.log("Order: " + order);

			// Making a cookie for the order
			var d = new Date();
			d.setTime(d.getTime()+(7*24*60*60*1000));
			var expires = "expires="+d.toUTCString();	

			document.cookie = "order=" + order + ";" + expires + ";path=/";
			
			var x = document.cookie;
			console.log(x);

                        socket.emit('confirm', orderJSON);

		});

		socket.on('response', function(resp) {
			socket.emit('confirm', orderJSON);
			console.log(resp);
		});
		
		//send customer back to index
                socket.on('orderAck', function(msg) {
			alert("Order Received!");
			window.location.href = "index.html";
		});
	

		//send to client that table has placed order
		socket.emit('placed', tableCookie);
		
	}

	});


	//function to add food item to order list and update the total price
	var updateOrder = function(name, price, index, defMods, txtMods) {

			//create element in table
                        var orderList = document.getElementsByTagName("tbody");
                        var tabElement = document.createElement("tr");
                        tabElement.classList.add("food");
                        tabElement.setAttribute("id", ind);
                        var th = "<th scope=\"row\">" + (ind+1) + "</th>";
                        var tdName = "<td id=\""+index+"\" class=\"itN\">"+name+"</td>";
                        var tdPrice = "<td align=\"right\" class=\"itP\">"+price+"</td>";

                        tabElement.innerHTML += th + tdName + tdPrice;

			if (defMods != null)
				tabElement.innerHTML += "<td id=\"defTxt\">" + defMods + "</td>";
			if (txtMods != null)
				tabElement.innerHTML += "<td id=\"modTxt\">" + txtMods + "</td>";

                        $(orderList).append(tabElement);

			//add to total bill
                        var itPrice = parseFloat(price);
                        bill += itPrice;
				
			tax = parseFloat(bill) * 0.0625;
			tax = parseFloat(tax).toFixed(2);
	
			totalBill = parseFloat(bill) + parseFloat(tax);

			//update bill and tax elements
                        var sumBill = document.getElementsByClassName("totalPrice");
			var taxBill = document.getElementsByClassName("calcTax");

			$(taxBill).empty();
			$(taxBill).append("+ $"+parseFloat(tax).toFixed(2));

                        $(sumBill).empty();
                        $(sumBill).append("$"+parseFloat(totalBill).toFixed(2));

			ind++;

	}


	

	//create alert to user
	var createAlert = function(err_txt) {

	//if no alert object is created, create one
	if (alertExists === 0)
	{
		var bodyEl = document.getElementsByTagName("body");
		var alertEl = document.createElement("div");
		alertEl.classList.add("alert");
		var hdEl = "<h5 class=\"alert-title\">ERROR</h5>";
		var spanEl = "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span>";
		var text = "<div class=\"alert-text\">"+ err_txt +"</div>";
		alertEl.innerHTML += spanEl + hdEl + text;
		
		$(bodyEl).prepend(alertEl);	
		alertExists++;
	}
	else		//get div and add specified text to it
	{
		var alertEl = document.getElementsByClassName("alert");
		var alEl = $(alertEl).find(".alert-text");
		$(alEl).empty();
		$(alEl).append(err_txt);
		$(alertEl).css('display','block');
	}
}

});

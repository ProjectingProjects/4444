const express  = require('express')
var bodyParser = require('body-parser')
var Decimal    = require('decimal.js');
var _          = require('underscore');
//var userLogin = require('./routes/login');
var getOrder = require('./routes/order');
var menuUp = require('./routes/menuCall');

var app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("IO Server waiting");

io.on('connection', function(socket){

//When client first connects, 'arrival', it finds an available table number and sends it to the table
		var table;
		var order;
		var waiter;

	socket.on('arrival', function(msg) {
    console.log('Table connected.\nFind them an order and table');
    if(msg == 'Takeout'){//if takeout kiosk
      var tablenum = 99;
      getOrder.tableRes(tablenum);//mark table as occupied
      console.log("Open Table: " + tablenum);
      socket.emit('table', tablenum)//emit the opened tableNum
      table = tablenum;
    }
    else{//else actual table
      getOrder.tableFind(function(tablenum) {
        getOrder.tableRes(tablenum);//mark table as occupied
        console.log("Open Table: " + tablenum);
        socket.emit('table', tablenum)//emit the opened tableNum
        table = tablenum;
      });//end find table
    }
	});//end on('arrival')
  
	// The client responds with the tableAck and server.js finds the next available order number
	socket.on('tableAck', function(tableAck) {
		console.log("Waiter: " + table);

		getOrder.reserver(table, function(waiter) {
	        	        console.log("Table " + table + " reserved with waiter " + waiter); 
				socket.emit('waiter', waiter)
			});

	});

	var tableNum;
	socket.on('tableFFF', function(tableN) {
		console.log("Table number in js: " + tableN);
		tableNum = tableN;

		getOrder.orderCreate(tableNum, function(ordernum) {
			console.log("In server.js " + ordernum);
			ordernum++;
			console.log("New Order: " + ordernum);
			socket.emit('order', ordernum)
			order = ordernum;
		});

	});

	socket.on('food911', function(tableNum) {
		console.log("send help for " + tableNum);
		
		io.emit('manHelp', tableNum);

	});

	socket.on('confirm', function(jsonOrder) {
		//console.log("TableNumber: " + tableNum + " with order number: " + order);
		console.log(jsonOrder);

		

    console.log("about to send order to DB orderNum:"+order);
		getOrder.sendOrder(order, tableNum, jsonOrder, function(stuff) {
			var size = stuff.order.length;

			for(var i = 0; i < size; i++)
			{
				var item = stuff.order[i];
				console.log("Server: ", item);
        console.log("orderNum: ", order);
        console.log("tableNum: ", tableNum);
				io.emit('kitchenOrderNum', order);
				io.emit('orderItem', item);	
				io.emit('tableOrd', tableNum);
			}

		});

		// The client responds with orderAck, acknowledging it's recieved the order number
		socket.emit('orderAck', "Order received");

	});	

	socket.on('foodPrepOrder', function(orderNN) {
		getOrder.getTableByOrder(orderNN, function(tabletab) {
			console.log(tabletab);
			io.emit('prepWait', tabletab);
		});
		
	});

	socket.on('foodReadyOrder', function(orderNN) {
		getOrder.getTableByOrder(orderNN, function(tabletab) {
			io.emit('readyWait', tabletab);
		});
	});
	
	var payTableNum;
	socket.on('payTable', function(table) {
		console.log(table);
		payTableNum = table;
		getOrder.tableGet(table, function(jsonTable) {
			socket.emit('confPaytable', jsonTable);
		});
	});

	socket.on('paid', function(pay) {
		if(pay == 0)
		{
			console.log("Paid with card");
			getOrder.payGet(payTableNum);
			io.emit('payCard', payTableNum);
		}
		else 
		{	
			console.log("Paid with cash");
			getOrder.payGet(payTableNum);
			io.emit('payCash', payTableNum);

		}

		socket.emit('paidAck', "got it!"); 
	});

	socket.on('compChef', function(compliment) {

		io.emit('sendComp', compliment);

	});

	socket.on('refill', function(table) {

		//send table number to index
		io.emit('manRefill', table);

	});


	socket.on('sales', function(sumTot) {

		console.log("sending sales to manager");

		//send sales to manager
		io.emit('sendSales', sumTot);

	});	

	socket.on('coupon', function(discount) {
		console.log("Coupon: " + discount);
		getOrder.addCoupon(discount);

	});

	// If verity == 1, coupon is good, if 0, it's bad
	socket.on('couponCheck', function(discount) {
		console.log(discount);
		getOrder.checkCoupon(discount, function(verity) {
			socket.emit('checking', verity);
		});
	});

	socket.on('couponUse', function(discount) {
		getOrder.useCoupon(discount);
	});

	//Sending them as an array
	socket.on('managerAssign', function(groupServ) {
		getOrder.assignTables(groupServ);
		console.log(groupServ.s1);		
		console.log(groupServ.s2);
		console.log(groupServ.s3);


	});

	
	socket.on('menuLoad', function(msg) {
		console.log(msg);
		menuUp.menuUpdate(msg);
	});

  //gets order history, and adds up the sales by day,
  //returning an array of objects, 1 object per day in the order history
  //the objects in the returned array contain a Date obj and a cost property
  //
  //the cost property represents the total sales for that day as reflected by
  //the order history
  socket.on('requestSalesHistory', function(callback){
    getOrder.getOrderHistory(function(sortedHist){
      var salesHistByDay = [];
      
      //this block for printing out the sortedHist array
      console.log("sortedHist=");
      for(var i = 0; i < sortedHist.length; ++i){
        console.log(sortedHist[i]);
      }
      
      
      //LOOP THRU ADDING UP SALES BY DAY//
      for(var i = 0; i < sortedHist.length; ++i){
        //get index of this date in salesHistByDay
        var thisDate = sortedHist[i].date.getTime();
        var indexOfThsDate = _.findIndex(salesHistByDay, function isSame(lstEl){
          var lstElJSON = JSON.stringify(lstEl);
          console.log("lstElJSON="+lstElJSON);
          return (lstEl.date.getTime() == thisDate);
        });
        
        if(indexOfThsDate == -1){//if no entry for this date, make one
          salesHistByDay.push(sortedHist[i]);
        }
        else if(indexOfThsDate > -1){//else if already an entry, add to it
          salesHistByDay[indexOfThsDate].cost =
            Decimal.add(salesHistByDay[indexOfThsDate].cost, sortedHist[i].cost);
        }
      }//END LOOP THRU ADDING UP SALES BY DAY
      
      /*//stringify object to be able to print to console.log()
      var salesHistByDayJSON = JSON.stringify(salesHistByDay);
      console.log("salesHistByDay="+salesHistByDayJSON);
      */
      
      callback(salesHistByDay);
    });//end getOrderHistory
  });//end socket.on(requestSalesHistory)
  
  //socket.on('chngAvail', itemName, isAvail);
  
  //tell menuUp to make itemName the new specialItem
  socket.on('makeSpecial', function(itemName, callback){
    console.log("makeSpecial_itemName="+itemName);
    menuUp.updateSpecial(itemName, function(success){//call the function to update the DB
      if(success){
        callback("success");
      }
      else{
        callback("Couldn't update special in dataBase");
      }
    });//end updateSpecial
    
  });//end on('makeSpecial')
  
  socket.on('isSpecial', function(itemName, callback){
    console.log("isSpecial_itemName="+itemName);
    menuUp.getSpecial(function(currSpecial){
      console.log("isSpecial.currSpecial="+currSpecial);
      
      if(currSpecial == itemName){//if itemName isSpecial
        callback(1);//send true
      }
      else{//else itemName NOT special
        callback(0);//send false
      }
    });//end updateSpecial
    
  });//end on('makeSpecial')
});//end catch signals

http.listen(5000, () => console.log('Node listening on 5000\n'))

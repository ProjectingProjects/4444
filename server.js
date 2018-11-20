const express = require('express')
var bodyParser = require('body-parser')
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
	
		

     	   getOrder.tableFind(function(tablenum) {
			getOrder.tableRes(tablenum);
  	              console.log("Open Table: " + tablenum);
 	               socket.emit('table', tablenum)
		table = tablenum;
 	       });

	});
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

		


		getOrder.sendOrder(order, tableNum, jsonOrder, function(stuff) {
			var size = stuff.order.length;

			for(var i = 0; i < size; i++)
			{
				var item = stuff.order[i];
				console.log("Server: ", item);
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
		//getOrder.assignTables(groupServ)
		console.log(groupServ.s1);		
		console.log(groupServ.s2);
		console.log(groupServ.s3);


	});

	
	socket.on('menuLoad', function(msg) {
		console.log(msg);
		menuUp.menuUpdate(msg);
	});

});

http.listen(5000, () => console.log('Node listening on 5000\n'))

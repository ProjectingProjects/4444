var mysql = require('mysql');
var connection = mysql.createConnection({
        connectionLimit : 10,
	host 	 : 'localhost',
	user 	 : 'root',
	password : 'Easier1',
	database : 'restInfo'
});

connection.connect(function(err){
	if (!err) {
	console.log("Order Database connected");

console.log("Waiting for Order call");

}
        else {
        console.log("Error Connecting to database");
        }
});



module.exports= 
{
	// Function called from server.js that finds the next available order
	orderCreate: function(tableN, callback) {

		connection.query('SELECT ordernum FROM orders ORDER BY ordernum DESC LIMIT 1;', function(error, results, fields) {
        		if(error) throw error;
//			console.log(results);
			var order = results[0].ordernum;
			console.log("In order.js: " + order);
			callback(order);
		});

	},

	// Function called from server.js that finds the next available table
	tableFind: function(callback) {
		// Chooses empty table from table list
		var tableJ;
		connection.query('SELECT tableNum FROM tableOrg WHERE occupied IS NULL LIMIT 1;', function(error, results, fields) {
			if(error) throw error;
			else
			{
				tableJ = results[0].tableNum;
				console.log("Available table: " + tableJ);

				callback(tableJ);

			}
		});
	},

	tableRes: function(tableJ) {
		console.log("CAllback : " + tableJ);

		connection.query('UPDATE tableOrg SET occupied = ? WHERE tableNum = ?;', [1, tableJ], function(error, results, fields) {
			if(error) throw error;
			else
			{
				console.log("Table changing: " + tableJ);
				//console.log(results);

			}
		});	

		console.log("CAllback : " + tableJ);

	},

	// Function called from server.js that reservers the table and order previously found
	reserver: function(tableN, callback) {

		// Find which waiter has that table
		console.log("Table " + tableN);
		var staff;

		connection.query('SELECT server FROM tableOrg WHERE tableNum = ?;',[tableN], function(error, results, fields) {
			if(error) throw error;
			else
			{
				console.log(results);
				staff = results[0].server;
				console.log("Waiter " + staff + " on table " + tableN);
				callback(staff);

			}
		});
	},

	 sendOrder: function(order, tableNum, jsonOrder, callback) 
	{

                console.log("Placing Order on DB Table ");

		// Converts json string into object to be manipulated
		var data = JSON.parse(jsonOrder);

		// Gets the size of the object's order length to count how many items have been ordered
		var len= data.order.length;
		var total = 0;
		console.log("Items: " + len);		

		console.log("Queries");

		// Iterates through the the order items to put them on the table
		for(var i = 0; i < len; i++)
		{
			// If you try to access any of these more than once, it has a heart attack
			var item = data.order[i].menuItem;
			var price = data.order[i].menuPrice;
			var options = data.order[i].mods;

			// Stores the info of the table into its DB table		
			console.log(item + " cost: " + price + " with mods of " + options);
                	connection.query('INSERT INTO table' + tableNum + ' (menuItem, menuPrice, stat, orderNum) VALUES (?,?,0,?);', [item, price, 0, order], function(error, results, fields) {
                        if(error) throw error;
			//else {
			//	console.log(item + " added to table's table");
			//}
			});
			//total += price;
		} // End of for loop

		console.log("Sending Order to Kitchen");

		callback(data);

		console.log("Placing Order into orders table");

		connection.query('UPDATE orders SET tableNum = ? WHERE orderNum = ?;', [tableNum, order], function(error, results, fields) {
		if(error) throw error;
		else
		{
			console.log("Add table number " + tableNum);
		}
		});

		connection.query('INSERT INTO orders(tableNum, date, cost, paid) VALUES (?,CURTIME(), 0, 0);',[tableNum], function(error, results, fields) {
			if(error) throw error;
			else
			{
				console.log("Reserved order number " + order);
			}
		});
	
        },

	tableGet: function(table, callback) 
	{
	
		connection.query('SELECT * FROM table' + table + ';', function(error, results, fields) {
		if (error) throw error;
		else {
			var string = "{\"table\":" +  JSON.stringify(results) + "}";
				
			console.log(string);
		}
		//console.log(data);
		callback(string);
		});
	},

	payGet: function(table) {
	
		// Empty table table
		connection.query('TRUNCATE TABLE table' + table + ';', function(error, results, fields) {
		if(error) throw error;
		else 
		{
			console.log("Table " + table + " cleared.");
		}
	
		});

		// Update tableOrg to paid
		connection.query('UPDATE tableOrg SET paid = 1, occupied = NULL WHERE tableNum = ?;',[table], function(error, results, fields) {
		if(error) throw error;
		else
			{
				console.log("Table " + table + " has paid");
			}
		});

		// Update order to paid
		connection.query('UPDATE orders SET paid = 1 WHERE tableNum = ?;',[table], function(error, results, fields) {
		if(error) throw error;
		else
		{
			console.log("Setting order to paid in Orders");
		}
		});

	},

	addCoupon: function(code) {
	
		connection.query('INSERT INTO coupons (code) VALUES (?);',[code], function(error, results, fields) {
		if(error) throw error;
		else 
		{
			console.log("Coupon created");
		}
		});
	},

	checkCoupon: function(code, callback) {

		connection.query('SELECT code FROM coupons WHERE code = ?;',[code], function(error, results, fields) {
		if(error) throw error;
		else
		{
			if(results.length > 0)	{	
				callback(1);
			}
			else
			{
				callback(0);
			}

		}
		});

	},

	useCoupon: function(code) {
		connection.query('DELETE FROM coupons WHERE code = ?;',[code], function(error, results, fields) {
		if(error) throw error;
		else {
			console.log("Deleted " + code);
		}
		});
	},

	getTableByOrder: function(order, callback) {
		connection.query('SELECT tableNum FROM orders WHERE ordernum = ?;', [order], function(error, results, fields) {
		if(error) throw error;
		else {
			var table = results[0].tableNum;
			console.log("That order is for table" + table);
			callback(table);
		}
		});
	},
	
	assignTables: function(groupServ) {
		var tabBeg;
		var tabEnd;

		var server1 = 'Victor';
		var server2 = 'Eddie';
		var server3 = 'Louise';

		var sec1 = groupServ.s1; // Victor 2
		var sec2 = groupServ.s2; // Eddie 3 
		var sec3 = groupserv.s3; // Louise 1

		if(sec1 == 1)
		{
			tabBeg = 1;
			tabEnd = 9;
		}
		else if(sec1 = 2)
		{
			tabBeg = 10;
			tabEnd = 17;
		}
		else
		{
			tabBeg = 18;
			tabEnd = 25;
		}
		console.log("Victor getting tables " + tabBeg + " to " + tabEnd);
		for(tabBeg; tabBeg < tabEnd; tabBeg++)
			{
				connection.query('UPDATE tableOrg SET server = ? WHERE tableNum = ?;', ['Victor', tabBeg], function(error, results, fields) {
				if(error) throw error;
				else {
					console.log("Table " + tableNum + " switched");
				}
				});
			}
		

		if(sec2 == 1)
		{
			tabBeg = 1;
			tabEnd = 9;
		}
		else if(sec2 = 2)
		{
			tabBeg = 10;
			tabEnd = 17;
		}
		else
		{
			tabBeg = 18;
			tabEnd = 25;
		}
		
		for(tabBeg; tabBeg < tabEnd; tabBeg++)
			{
				connection.query('UPDATE tableOrg SET server = ? WHERE tableNum = ?;', ['Eddie', tabBeg], function(error, results, fields) {
				if(error) throw error;
				else {
					console.log("Table " + tableNum + " switched");
				}
				});
			}
		

		if(sec3 == 1)
		{
			tabBeg = 1;
			tabEnd = 9;
		}
		else if(sec3 = 2)
		{
			tabBeg = 10;
			tabEnd = 17;
		}
		else
		{
			tabBeg = 18;
			tabEnd = 25;
		}
		
		for(tabBeg; tabBeg < tabEnd; tabBeg++)
			{
				connection.query('UPDATE tableOrg SET server = ? WHERE tableNum = ?;', ['Louise', tabBeg], function(error, results, fields) {
				if(error) throw error;
				else {
					console.log("Table " + tableNum + " switched");
				}
				});
			}
		


						
	}
};

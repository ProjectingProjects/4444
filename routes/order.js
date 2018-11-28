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
                console.log("orderNum:"+order);

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
      console.log("orderNum:"+order);
      console.log("tableNum="+tableNum);
                	connection.query('INSERT INTO table' + tableNum + ' (menuItem, menuPrice, orderNum, stat) VALUES (?,?,?,0);', [item, price, order, 0], function(error, results, fields) {
                        if(error) throw error;
			console.log("order after insert:"+order);
      //else {
			//	console.log(item + " added to table's table");
			//}
			});
			total += parseFloat(price);
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

		connection.query('INSERT INTO orders(tableNum, date, cost, paid) VALUES (?,CURDATE(), ?, 0);',[tableNum, total], function(error, results, fields) {
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
		var sec1Server = groupServ[0]; // Victor 2
		var sec2Server = groupServ[1]; // Eddie 3 
		var sec3Server = groupServ[2]; // Louise 1
    
		groupServ.forEach(function(name, index){
      connection.query('UPDATE tableOrg SET server = ? WHERE tableNum>=? AND tableNum<=?;',
                         [name, (index*8)+1, (index+1)*8],
                         function(error, results, fields){
                           if(error) throw error;
                         }//end mySQL callback
      );//end update mySQL DB
    });//end foireach name
	},//end assignTables
  
  //this function gets the cost and date cols of orders table for last 7 days of orders sorted by date in descending order
  getOrderHistory: function(callback) {
		connection.query('SELECT cost, date FROM orders WHERE date > (CURDATE() - INTERVAL 7 DAY) AND cost != 0 ORDER BY date DESC;',  function(error, results, fields) {
		if(error) throw error;
		else {//if no error, send orderHist
		  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~results=");
      for(var orderRec = 0; orderRec < results.length; ++orderRec){
        console.log(results[orderRec]);
      }
      callback(results);
      
      /*
      var currOrd = {};
      var dateLstObj = {};
      var dateLst = [];
      //LOOP THRU ADDING UP SALES BY DAY
      for(var i = 0 ; i < results.length; ++i){
        currOrd = results[i];
        var currDate = currOrd.date;
        var currCost = currOrd.cost;
        
        //if first order of this date
        if(dateLstObj[currDate] == undefined){
          dateLstObj[currDate] = Decimal(currCost);
          dateLst.push({[currDate]:Decimal(currCost)});
        }
        else{//else we've already had an order for that date
          dateLstObj[currDate] = Decimal.add(dateLstObj[currDate], currCost);
          
          //LOOP THRU EACH of dateLst
          dateLst.forEach(function(x){
            if(currDate in x)
              x[currDate] = Decimal.add(x[currDate], currCost);
          });//END LOOP THRU EACH of dateLst
        }
      }//END LOOP THRU ADDING UP SALES BY DAY
      //stringify object to be able to print to console.log()
      
      //var dateLstObjJSON = JSON.stringify(dateLstObj);
      //console.log("dateLstObj="+dateLstObjJSON);
      
      var dateLstJSON = JSON.stringify(dateLst);
      console.log("dateLst="+dateLstJSON);
      
			callback(dateLst);
      */
		}//END send orderHist
		});//end mySQL query
	}//end getOrderHistory
};


















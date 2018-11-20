var mysql = require('mysql');

var connection = mysql.createConnection({
	host 	 : 'localhost',
	user 	 : 'root',
	password : 'Easier1',
	database : 'restInfo'
});

connection.connect(function(err){
	if (!err) {
	console.log("Waitstaff Database connected");
	}
	else {
	console.log("Error Connecting to database");
	}
});

module.exports=
{

	getTables: function(req, res) {
		var name;


		var userid = req.body.id;
		console.log("ID: " + userid);
		connection.query('SELECT name FROM loginInfo WHERE id = ?;', [userid], function(error, results, fields) {
		if (error) throw error;
		else
		{
			name = results[0].name;
			console.log("name: " + name);
			connection.query('SELECT tableNum FROM tableOrg WHERE server = ?;', [name], function(error, results, fields) {
				if (error) throw error;
				else
				{
					console.log("ANAMES: " + name);
					var tableJSON= {};
					for(var i = 0, j = 1; i < results.length; i++, j++)
					{
						tableJSON["table"+j] = results[i].tableNum;
					//	console.log("results["+i+"].tblNum="+results[i].tableNum);
					}

				console.log(tableJSON);
				res.send(tableJSON);
				}
			});
		}
		});
		
	}




};

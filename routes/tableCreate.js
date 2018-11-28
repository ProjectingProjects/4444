// Create tables automatically
var mysql = require('mysql');

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Easier1',
        database : 'restInfo'
});

connection.connect(function(err) {
	if (!err)
	{
		var count;
		for(count = 17; count < 25; count++)
		{
			var sqll = 'CREATE TABLE table'+count+'(menuItem VARCHAR(20) NOT NULL, menuPrice DECIMAL(5,2) NOT NULL, category VARCHAR(30), orderNum INT NOT NULL, stat TINYINT(1))';
			connection.query(sqll, function (err, result) {
				if (err) throw err;
				else
				{
					console.log("Table %d created", count);
	
					var quequ = 'INSERT INTO tableOrg(tableNum, paid ) VALUES ('1', '+ count')';
				}
			});
		}
	}
	else
	{
		console.log("Could not connect to database!");
	}
});

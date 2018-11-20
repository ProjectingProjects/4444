var mysql = require('mysql');;
var fs= require('fs');

//function intervalFunc() {

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Easier1',
        database : 'restInfo'
});

connection.connect(function(err){
        if (!err) {
	        console.log("Menu Databased connected");
        }
        else {
	        console.log("Error Connecting to database");
        }
});

module.exports = 
{
	menuUpdate: function(msg) {
		console.log(msg);
	
		connection.query('SELECT * FROM menu', function(err, results, fields) {
                        if (err) throw err;
                        else {
				var string = "{\"menu\":" +  JSON.stringify(results) + "}";
				fs.writeFile("routes/menu.json",string, (err) => {

					if(err) throw err;
						console.log("File saved");
				});
				console.log('Menu updated');
				//console.log("SOLUTION: ", results);
	                }
                });

	
}

}
	//console.log("Rechecking menu");

	//setTimeout(intervalFunc,5000);
//}


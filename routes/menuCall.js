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
  },//end menuUpdate
  
  updateSpecial: function(specialName, callback){
    console.log("updateSpecialNAME:"+specialName);
    
    connection.query('UPDATE menu SET isSpecial=0;', function(error, results, fields) {
		  if(error){
        callback(0);
        throw error;
      }
		});//end mySQL to make all isSpecial=0
    connection.query('UPDATE menu SET isSpecial=1 WHERE name=?;', [specialName], function(error, results, fields) {
      if(error){
        callback(0);
        throw error;
      }
      else
        callback(1);//respond that mySQL DB updated successfully
		});//end mySQL to set specialName item.isSpecial=1
  },//end updateSpecial
  
  getSpecial: function(callback){
    console.log("getting special item from DB");
    
    connection.query('SELECT name FROM menu WHERE isSpecial=1;', function(error, results, fields){
      if(error) throw error;
      else{
        console.log("results[0]="+results[0]);
        console.log("results[0].name="+results[0].name);
        callback(results[0].name);
      }
    });
  }//end getSpecial
  
}//end modules
	//console.log("Rechecking menu");

	//setTimeout(intervalFunc,5000);
//}


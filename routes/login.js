var mysql = require('mysql');
var redirection = require('./redirect');

var connection = mysql.createConnection({
	host 	 : 'localhost',
	user 	 : 'root',
	password : 'Easier1',
	database : 'restInfo'
});

connection.connect(function(err){
	if (!err) {
	console.log("Login Databased connected");
	}
	else {
	console.log("Error Connecting to database");
	}
});

module.exports= 
	{
	
	login: function(req, res) {

		console.log("login request");
		//res.status(200).end();
		var userID = req.body.userID;
		console.log(req.body.userID);
		connection.query('SELECT * FROM loginInfo WHERE id = ?', [userID], function(error, results, fields) {
		if (error) {
			console.log("Error:", error);
			res.send({
				"code":400,
				"failed":"error ocurred"
				})
		}
		else {
//			console.log("Solution: ", results);



		if(results.length > 0)	{
			//grab position data

	//		connection.query('SELECT position FROM loginInfo WHERE id = ?' + [userID], function(err, results, fields) 
	//		{
    	//			res.json(results);
//				console.log(results);
				var position = results[0].position;
				console.log(position);
			        //redirection.positionRedirect(position);	
			// If manager, redirects to managerdash
			if (position == "Manager")
	                {
	                        res.redirect('/ManagerDash.html');
	                }
			// Else if waiter, to waiterdash
        	        else if (position == "Waiter")
        	        {
                 		//redirect to correct dashboard
                 		res.redirect('/WaiterDash.html');
        	       	}
		}
		else {
			res.redirect('/login.html');
			
		
		}


		}	
	})
	}

};

var express = require("express");
var app = express();
module.exports = {

	positionRedirect: function(position, req, res) {

		console.log("Redirecting..");
		console.log(position);

		if (position == "Manager")
		{
			//res.redirect('/success.html');
			res.sendFile('/success.html');
		}

		else if (position == "Waiter")
		{
			//res.redirect('/success.html');
			res.sendFile('/success.html');
		}
	} 

}

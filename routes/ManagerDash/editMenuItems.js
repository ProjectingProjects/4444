var socket = io({transports: ['websocket']});

//populates food item tabs for editing
$(document).ready(function(){
  console.log("running editMenuItems.js script");


	//grab JSON file with menu data
	$.ajax({
		async: false,
		dataType: "json",
		url: "../routes/menu.json",
		success: function(data){

			var ind2 = 0;			

			$(data.menu).each(function(index, value){
			
      ///////////////////////////////////////////////////////
      //create tabs for each food item in foodType category//
      ///////////////////////////////////////////////////////
      //create string for tab hrefs(need to add non-word character codes
      var nme = makeIDrefString(value);
			var nav_item=
        "<li class=\"nav-item d-xl-flex itemTabItem\" style=\"background-color: #515151\">"+
        "<a id=\""+value.name+"-tab\" role=\"tab\" data-toggle=\"pill\" href=\"#"+nme+"Tab\" class=\"nav-link text-center d-xl-flex justify-content-xl-center align-items-xl-center\" style=\"height: 100%;padding: 0px;width: 100%;\">"+value.name+"</a>"+
        "</li>";
            
        //add tab to list of food items
        var addto = "#"+value.category+"Tab .foodItemTabs";
        $(addto).append(nav_item);
        var newel = addto+" #"+value.name+"-tab";
        //resize text
        //textFit($(newel), {alignHoriz: true, alignVert: true});
        
        //check if item is the current special
        var activeClass = "";
        socket.emit('isSpecial', value.name, function(isSpecial){
          if(isSpecial){
            console.log(value.name+"isSpecial=1");
            //if item is special set this to "active"
            //so "active" can be added to the class of this item's "specialButton"
            activeClass = " active";
          }//end if value.name isSpecial
          
          console.log("activeClass="+activeClass);
        
          //create pane for that item
          var tab_pane=
          "<div id=\""+value.name+"Tab\" class=\"tab-pane\" role=\"tabpanel\" style=\"height: 100%;\">"+
            "<div class=\"d-flex flex-column\" style=\"height: 100%;background-color: rgba(241,242,240,0.6);\">"+
              "<div class=\"row flex-fill\" style=\"margin: 0px;\">"+
                "<div class=\"col d-flex flex-column justify-content-center align-items-center\">"+
                  "<button class=\"btn btn-primary availButton active\" type=\"button\" id=\"available\" style=\"width: 50%;height: 50%; background-color: rgb(0, 123, 255); color: rgb(255, 255, 255);\">Available</button>"+
                "</div>"+
              "</div>"+
              "<div class=\"row flex-fill\" style=\"margin: 0px;\">"+
                "<div class=\"col d-flex justify-content-center align-items-center\">"+
                  "<button class=\"btn btn-primary availButton\" type=\"button\" id=\"NOTavailable\" style=\"width: 50%;height: 50%;background-color: rgb(81,81,81);color: rgb(137,137,137);\">Not Available</button>"+
                "</div>"+
              "</div>"+
              "<div class=\"row flex-fill\" style=\"margin: 0px;\">"+
                "<div class=\"col d-flex justify-content-center align-items-center\">"+
                  "<button class=\"btn btn-primary specialButton"+activeClass+"\" type=\"button\" id=\"special\" style=\"width: 70%;height: 40%;background-color: rgb(81,81,81);color: rgb(137,137,137);\">Make Special</button>"+
                "</div>"+
                "<div class=\"col d-flex justify-content-center align-items-center\">"+
                  "<button class=\"btn btn-primary confirmButton\" type=\"submit\" id=\"confirm\" style=\"width: 50%;height: 25%;background-color: rgb(28,60,95);color: #c2d0cd;\">Confirm</button>"+
                "</div>"+
              "</div>"
            "</div>"+
          "</div>";
          
          //console.log(tab_pane);
          
          //add pane to div of panes
          addto = "#"+value.category+"Tab .foodItemPanes";
          $(addto).append(tab_pane);
          newel = addto+" #"+value.name+"Tab";
          //resize text
          //textFit($(newel), {alignHoriz: true, alignVert: true});
        
          $(".availButton, .specialButton").on("click", toggle);
          $(".confirmButton").on("click", sendChngs);
          //$(".itemTabItem > a").on("click", setItemStatus);
        });//end emit('isSpecial')			
			});//end LOOP THRU EACH data	
		
    }//end success: function(data)
	});//END grab JSON file with menu data
});//END $(document).ready(function(){})

//colorPalette for availButtons... index indicates "bool active" value
//so availColors[0] means NOT active
//availColors[1] means acitve
var availColors = ["rgb(81, 81, 81)", "rgb(0, 123, 255)"];
var availFontColors = ["rgb(137, 137, 137)", "rgb(255, 255, 255)"];
function toggle(event){
  console.log("toggling...");
  
  var thisElem = $(event.target);
  var thisButton = $(event.target).closest("button");//get thisButton
  var thisID = thisButton.attr("id");
  var thisTabID = thisButton.closest(".tab-pane").attr("id");//get thisTabPane
  
  var value = {name: thisTabID};
  var thisTabIDrefString = makeIDrefString(value);//get thisTabPane's selector string
  console.log("thisID="+thisID);
  console.log("thisTabID="+thisTabID);
  console.log("thisTabIDrefString="+thisTabIDrefString);
    
  /*  
  //chng thisButton's color to on
  thisButton.css("background-color", availColors[1]);
  thisButton.css("color", availFontColors[1]);
  //change other button's color to off
  if($("#"+thisTabIDrefString+" #"+thisID).is($("#"+thisTabIDrefString+" #available"))){
    $("#"+thisTabIDrefString+" #NOTavailable").css("background-color", availColors[0]);
    $("#"+thisTabIDrefString+" #NOTavailable").css("color", availFontColors[0]);
  }
  else if($("#"+thisTabIDrefString+" #"+thisID).is($("#"+thisTabIDrefString+" #NOTavailable"))){
    $("#"+thisTabIDrefString+" #available").css("background-color", availColors[0]);
    $("#"+thisTabIDrefString+" #available").css("color", availFontColors[0]);
  }
  */
  if($("#"+thisTabIDrefString+" #"+thisID).hasClass("availButton")){
    $("#"+thisTabIDrefString+" #available").toggleClass("active");
    $("#"+thisTabIDrefString+" #NOTavailable").toggleClass("active");
  }
  else if($("#"+thisTabIDrefString+" #"+thisID).is($("#"+thisTabIDrefString+" #special"))){
    $("#"+thisTabIDrefString+" #special").toggleClass("active");
  }
  else
    console.log("Error finding button");
}//end toggle

function sendChngs(event){
  console.log("checking active states...");
  
  var thisElem = $(event.target);
  var thisButton = $(event.target).closest("button");//get thisButton
  var thisID = thisButton.attr("id");
  var thisTabID = thisButton.closest(".tab-pane").attr("id");//get thisTabPane
  
  var value = {name: thisTabID};
  var thisTabIDrefString = makeIDrefString(value);//get thisTabPane's selector string
  var itemName = thisTabID.substring(0,thisTabID.lastIndexOf("Tab"));
  console.log("itemName="+itemName);
  console.log("thisID="+thisID);
  console.log("thisTabID="+thisTabID);
  
  //if this item's avail button is active
  if($("#"+thisTabIDrefString+" #available").hasClass("active")){
    socket.emit('chngAvail', itemName, 1);
  }
  else{//else NOTAvail is active
    socket.emit('chngAvail', itemName, 0);
  }
  
  //if item marked as special
  if($("#"+thisTabIDrefString+" #special").hasClass("active")){
    console.log("Sending itemName to make special...");
    socket.emit('makeSpecial', itemName,
      function(response){
        if(response == "success"){
          console.log("successfully updated special item in DB");
        }
        else{
          console.log("ERROR updating special item in DB");
        }
      }//end getResponse
    );//end emit 'makeSpecial' 
  }//end if item marked as special
  
}//end sendChngs

function setItemStatus(event){
  //get thisTab
  var thisLink = $(event.target);
  var thisID = thisLink.attr("id");//get thisButton's ID
  var itemName = thisID.substring(0,thisID.lastIndexOf("-tab"));//get itemName
  var thisTabID = itemName+"Tab";
  
  var value = {name: thisTabID};
  var thisTabIDrefString = makeIDrefString(value);//get thisTabPane's selector string
  console.log("itemName="+itemName);
  console.log("thisID="+thisID);
  console.log("thisTabID="+thisTabID);
  
  /*
  socket.emit('isAvail', itemName,
    function(isAvail){
      if(isAvail){//if itemName isAvail
        $("#"+thisTabIDrefString+" #available").toggleClass("active", true);
        $("#"+thisTabIDrefString+" #NOTavailable").toggleClass("active", false);
      }
      else{//else NOT isAvail
        $("#"+thisTabIDrefString+" #available").toggleClass("active", false);
        $("#"+thisTabIDrefString+" #NOTavailable").toggleClass("active", true);
      }
    }//end getResponse
  );//end emit('isAvail')
  */
  socket.emit('isSpecial', itemName,
    function(isSpecial){
      if(isSpecial){//if itemName isSpecial
        $("#"+thisTabIDrefString+" #special").toggleClass("active", true);
      }
      else{//else not special
        $("#"+thisTabIDrefString+" #special").toggleClass("active", false);
      }
    }//end getResponse
  );//end emit('isSpecial')
}













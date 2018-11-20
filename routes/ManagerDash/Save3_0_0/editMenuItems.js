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
      var nme = "";
      //LOOP THRU non-word characters in itemName
      var i = 0;
      var count = 0;
      while((i < value.name.length)&&(i >= 0)){
        console.log("loop iteration: "+(count++));
        console.log("i= "+i);
        if(i==0)
          var nonWindex = ((value.name).substring(i)).search(/\W/);
        else if(i < (value.name.length - 1))
          var nonWindex = ((value.name).substring(i+1)).search(/\W/);
        else{//else last char(so can't have any more char codes to add... so just add last char)
          nme += value.name[i];
          break;
        }
        if(nonWindex < 0){//if didn't find non-word chars
          nme += (value.name).substring(i);
          console.log("nonWindex= \""+nonWindex+"\"");
          break;//!!!EXIT LOOP HERE!!!//
        }
        else{//else found non-word chars
          if(i==0){
            var decCode = (value.name).substring(i).charCodeAt(nonWindex);
            var hexCode = decCode.toString(16).toUpperCase();
            console.log("hexCode: \\"+hexCode);
            nme += (value.name).substring(i, i+nonWindex) + "\\" + hexCode;
            
            if(nonWindex == 0){
              nme += " ";
              ++i;
            }
            else{
              nme += " ";
              i += nonWindex+1;
            }
          }
          else{
            var decCode = (value.name).substring(i+1).charCodeAt(nonWindex);
            var hexCode = decCode.toString(16).toUpperCase();
            console.log("hexCode: \\"+hexCode);
            nme += (value.name).substring(i, i+1+nonWindex) + "\\" + hexCode + " ";
            
            i += (nonWindex+2);
          }
        }//end else found non-word chars
      }//END LOOP THRU non-word characters in itemName
      
      console.log("END make href string");
      
			var nav_item=
            "<li class=\"nav-item d-xl-flex\" style=\"background-color: #515151\">"+
            "<a id=\""+value.name+"-tab\" role=\"tab\" data-toggle=\"pill\" href=\"#"+nme+"Tab\" class=\"nav-link text-center d-xl-flex justify-content-xl-center align-items-xl-center\" style=\"height: 100%;padding: 0px;width: 100%;\">"+value.name+"</a>"+
			"</li>";
            
            //add tab to list of food items
            var addto = "#"+value.category+"Tab .foodItemTabs";
            $(addto).append(nav_item);
            var newel = addto+" #"+value.name+"-tab";
            //resize text
            //textFit($(newel), {alignHoriz: true, alignVert: true});
            
            //create pane for that item
            var tab_pane=
            "<div id=\""+value.name+"Tab\" class=\"tab-pane\" role=\"tabpanel\">"+
              "<div>"+
                "<p style=\"color:white\";>SUCCESS</p>"+
              "</div>"+
            "</div>";
            
            console.log(tab_pane);
            
            //add pane to div of panes
            addto = "#"+value.category+"Tab .foodItemPanes";
            $(addto).append(tab_pane);
            newel = addto+" #"+value.name+"Tab";
            //resize text
            //textFit($(newel), {alignHoriz: true, alignVert: true});
			
			});//end LOOP THRU EACH data	
		}//end success: function(data)
	});//END grab JSON file with menu data
});//END $(document).ready(function(){})
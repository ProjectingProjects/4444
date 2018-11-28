//takes an object with a "name" property and generates the correct string to use for selecting it's ID
function makeIDrefString(value){
  var nme = "";
  //LOOP THRU non-word characters in itemName
  var i = 0;
  var count = 0;
  while((i < value.name.length)&&(i >= 0)){
    //console.log("loop iteration: "+(count++));
    //console.log("i= "+i);
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
      //console.log("nonWindex= \""+nonWindex+"\"");
      break;//!!!EXIT LOOP HERE!!!//
    }
    else{//else found non-word chars
      if(i==0){
        var decCode = (value.name).substring(i).charCodeAt(nonWindex);
        var hexCode = decCode.toString(16).toUpperCase();
        //console.log("hexCode: \\"+hexCode);
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
        //console.log("hexCode: \\"+hexCode);
        nme += (value.name).substring(i, i+1+nonWindex) + "\\" + hexCode + " ";
        
        i += (nonWindex+2);
      }
    }//end else found non-word chars
  }//END LOOP THRU non-word characters in itemName

  //console.log("END make href string");
  return nme;
}//end makeIDrefString()
var socket = io({transports: ['websocket']});

$(document).ready(function(){$("#WeeklySales-tab").on("click", makeCharts)});
$(document).ready(getSalesByDay());

//for use by makeSalesChart, populated by getSalesByDay()
//  after getSalesByDay, completeHist will contain records
//  starting with today and going backward in time
var completeHist = [];
//////////////////////////////////////////////////////////////////////////////
//getSalesByDay populates the completeHist array
//after getSalesByDay() exectuion, the array wil
//contain sales for the last 7 days in newest --> oldest order
//
//this function is run as soon as page is ready... but charts are generated
//only when user switches to chart tab
//this ensures completeHist[] is populated before it is needed
function getSalesByDay(){
  console.log("getting Sales by day...");
  
  socket.emit('requestSalesHistory', function(hist){
    console.log("GOT SALES HISTORY");
    console.log(hist);
    
    //get today's date
    var date = new Date();
		date.setTime(date.getTime());
    
    //LOOP THRU making sure every day has an entry
    //(even days for which there are no sales)...
    //populates completeHist in reverse chrono order
    for(var daysBefore = 0; daysBefore < 7; ++daysBefore){
      if(hist.length == 0){//if no sales records
        var thisDate = new Date();
        //add 7 $0.00 records
        for(var numRec = 0; numRec < 7; ++numRec){
          thisDate.setDate(date.getDate() - numRec);
          completeHist.push({"cost":"0.00", "date":thisDate});
        }
        
        break;//!!!!END LOOP THRU make sure every day has entry!!!//
      }
      //else at least one sales record... guaranteed for hist[0] to be defined
      ////////////////////////////////////
      //generate date to look for record//
      ////////////////////////////////////
      //get date in format of hist date
      var thisDate = new Date(hist[0].date);
      //set actual date to todays date - daysBefore
      thisDate.setDate(date.getDate() - daysBefore);
      
      //get index of that record
      var indexOfThsDate = _.findIndex(hist, function isSame(histEl){
        return (histEl.date == thisDate.toISOString());
      });//end findIndex
      
      //if this date not in the salesHistory
      //then no reported sales for that day --> add record with 0 sales
      if(indexOfThsDate == -1)
        completeHist.push({"cost":"0.00", "date":thisDate});
      else//else there is a record, so add it to completeHist
        completeHist.push({"cost":hist[indexOfThsDate].cost, "date":new Date(hist[indexOfThsDate].date)});
    }//END LOOP THRU making sure every day has an entry
    
    //this block to print completeHist array
    console.log("completeHist=");
    for(var i = 0; i < completeHist.length; ++i)
      console.log("completeHist["+i+"].date="+completeHist[i].date+".cost="+completeHist[i].cost);
  });//end requestSalesHistory
}//end getSalesByDay()

//////////////////////////////////////////////////////////////////////////////
//populates gratChart with data and renders it
function makeGratuityChart(){
  var chart = new CanvasJS.Chart("gratChart");
  chart.options.title = {text: "Gratuity by Server Today"};
  chart.options.axisY = {title: "Gratuity", prefix: "$"};
  chart.options.interactivityEnable = false;
  chart.options.width = 960 * .99;
  chart.options.height = 851.578 * .99;
    
  var dataSeries = {
    type: "doughnut"
  }
  
  chart.options.data = [];
  chart.options.data.push(dataSeries);
  
// server names
  dataSeries.dataPoints = [
    {label: "banana", y: 23},
    {label: "orange", y: 33},
    {label: "apple", y: 48},
  ];
  
  chart.render();
}//END makeGratuityChart

//////////////////////////////////////////////////////////////////////////////
//populates salesChart with data and renders it
function makeSalesChart(){
  var chart = new CanvasJS.Chart("salesChart");
  chart.options.title = {text: "Sales by Day for Last Week"};
  chart.options.axisY = {title: "Sales", prefix: "$"};
  chart.options.axisX = {labelFontSize: 20};
  chart.options.interactivityEnable = false;
  chart.options.width = 960 * .99;
  chart.options.height = 851.578 * .99;
    
  var dataSeries = {
      type: "area"
  }
  
  chart.options.data = [];
  chart.options.data.push(dataSeries);
  
  //this block to print completeHist array
  console.log("BETA_completeHist=");
  for(var i = 0; i < completeHist.length; ++i){
    console.log("completeHist["+i+"].date="+completeHist[i].date+".cost"+completeHist[i].cost);
  }//end print completeHist array
  
  //get today's date
  var date = new Date();
  date = completeHist[0].date;
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  dataSeries.dataPoints = [
    {label: days[((date.getDay() - 6)+7)%7], y: parseFloat(completeHist[6].cost)},//...
    {label: days[((date.getDay() - 5)+7)%7], y: parseFloat(completeHist[5].cost)},//...
    {label: days[((date.getDay() - 4)+7)%7], y: parseFloat(completeHist[4].cost)},//...
    {label: days[((date.getDay() - 3)+7)%7], y: parseFloat(completeHist[3].cost)},//etc...
    {label: days[((date.getDay() - 2)+7)%7], y: parseFloat(completeHist[2].cost)},//2 days ago
    {label: days[((date.getDay() - 1)+7)%7], y: parseFloat(completeHist[1].cost)},//yesterday
    {label: days[date.getDay()],             y: parseFloat(completeHist[0].cost)}//today
  ];//end dataSeries.dataPoints
    
  chart.render();
}//END makeSalesChart

//////////////////////////////////////////////////////////////////////////////
function makeCharts(){
    makeGratuityChart();
    makeSalesChart();
}//end makeCharts()

//////////////////////////////////////////////////////////////
//REFERENCE//
//////////////////////////////////////////////////////////////
/*
window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer");

    chart.options.axisY = { prefix: "$", suffix: "K" };
    chart.options.title = { text: "Fruits sold in First & Second Quarter" };

    var series1 = { //dataSeries - first quarter
        type: "column",
        name: "First Quarter",
        showInLegend: true
    };

    var series2 = { //dataSeries - second quarter
        type: "column",
        name: "Second Quarter",
        showInLegend: true
    };

    chart.options.data = [];
    chart.options.data.push(series1);
    chart.options.data.push(series2);


    series1.dataPoints = [
            { label: "banana", y: 18 },
            { label: "orange", y: 29 },
            { label: "apple", y: 40 },
            { label: "mango", y: 34 },
            { label: "grape", y: 24 }
    ];

    series2.dataPoints = [
        { label: "banana", y: 23 },
        { label: "orange", y: 33 },
        { label: "apple", y: 48 },
        { label: "mango", y: 37 },
        { label: "grape", y: 20 }
    ];

    chart.render();
}
*/
//////////////////////////////////////////////////////////////
//END REFERENCE//
//////////////////////////////////////////////////////////////
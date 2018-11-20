$(document).ready(function(){$("#WeeklySales-tab").on("click", makeCharts())});

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

// 
//populates salesChart with data and renders it
function makeSalesChart(){
  var chart = new CanvasJS.Chart("salesChart");
  chart.options.title = {text: "Sales by Day for Last Week"};
  chart.options.axisY = {title: "Sales", prefix: "$"};
  chart.options.interactivityEnable = false;
  chart.options.width = 960 * .99;
  chart.options.height = 851.578 * .99;
    
  var dataSeries = {
      type: "area"
  }
  
  chart.options.data = [];
  chart.options.data.push(dataSeries);
  
//days, sales for day
  dataSeries.dataPoints = [
    {label: "banana", y: 18},
    {label: "orange", y: 29},
    {label: "apple", y: 40},
    {label: "mango", y: 34},
    {label: "grape", y: 24}
  ];
    
  chart.render();
}//END makeSalesChart

function makeCharts(){
    makeGratuityChart();
    makeSalesChart();
}

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
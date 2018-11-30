var chartData;

$(function(){
  $.ajax({

    url: 'http://localhost:3000/fuelPrices',
    type: 'GET',
    success : function(data) {
      chartData = data;
      var template = Handlebars.compile($("#tabular-template").html());
      $("#table-location").html(template(data));
      // console.log(data)
      console.log(chartData)
      var chartProperties = {
        "caption": "Variation of Petrol and Diesel price in Bangalore",
        "numberprefix": "Rs",
        "xAxisName": "time",
        "yAxisName": "Price",
        "exportEnabled": "1",
        "exportMode":"auto",
        "exportShowMenuItem":"1",
        "exportFileName":"getEasyGraph",
        "theme":"Fusion",
        "numbersufix":"s"
      };
      chartProperties.caption = chartData.subname;
      chartProperties.numberprefix = chartData.prefix;
      chartProperties.xAxisName = chartData.x;
      chartProperties.yAxisName = chartData.y;

      var categoriesArray = [{
          "category" : data["categories"]
      }];
      // type: chartData.type,
      var lineChart = new FusionCharts({
        type: chartData.type,
        renderAt: 'chart-location',
        width: '1150',
        height: '600',
        dataFormat: 'json',
        dataSource: {
          chart: chartProperties,
          categories : categoriesArray,
          dataset : data["dataset"]
        },
        
      });
    
      lineChart.render();
    }
  });
});

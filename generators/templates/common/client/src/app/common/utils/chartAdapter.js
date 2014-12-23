define(function(){
  var defaultConfig = {
    size: 150 
  };
  return function(config, chartData){
    if(config && chartData){
      var chartConfig,
        seriesData = [],
        xAxisData = [],
        processYData = [];

      if(config.type == 'pie'){
        var names = {};
        for(var key in chartData){
          for(var chartKey in chartData[key]){
            if(!names[chartKey]){
              names[chartKey] = [];
            }
            names[chartKey].push({
              name: key,
              y: chartData[key][chartKey]
            });
          }
        }
        _.each(config.display, function(ele, index){
          seriesData.push({
            name: ele.alias,
            data: names[ele.name],
            size: ele.size || defaultConfig.size,
            center: ele.center
          });
        });
      }else{
        for(var key in chartData){
          xAxisData.push(key);
          processYData.push(chartData[key]);
        }
        _.each(config.display, function(ele, index){
          seriesData.push({
            name: ele.alias,
            type: ele.type,
            data: _.pluck(processYData, ele.name),
            tooltip: {
              valueSuffix: ele.suffix || ''
            },
            yAxis: ele.yAxis || 0
          });
        });
      }

      //combine to real chart config
      chartConfig = {
        chart: {
        },
        title: {
          text: config.title
        },
        series: seriesData
      };
      if(config.type){
        chartConfig.chart.type = config.type;
      }
      if(config.yAxis && config.yAxis.length > 0){
        chartConfig.yAxis = config.yAxis;
      }
      if(xAxisData){
        chartConfig.xAxis = {
          categories: xAxisData
        }
      }
      return chartConfig;
    }
  };
});
function example () {

  var
    V = envision,
    container = document.getElementById('demo'),
  options, vis;
    
  function createData (dataList,prop) {
    var baseValue = .3; // hack to add a margin at the bottom of the roadmap
    var seriesY = dataList.length - 1; // add the series in reverse order so they are displayed in the right order
    var tickLabels = []
    var graphData = [];
    var lastDate = -1;
    for(i=0;i<dataList.length;i++) {
	 var dataRow = dataList[i];
	 var dataSet = [];
	 tickLabels.push([seriesY + baseValue,dataRow[0]["rowTitle"]]);
	 for(j=1;j<dataRow.length;j++) {
        var date =new Date(dataRow[j]["date"]).getTime();
        lastDate = date > lastDate ? date : lastDate; 
	   dataSet.push([date, seriesY + baseValue,dataRow[j]["title"]]);
	 }
		graphData.push({data: dataSet, xaxis: 2});
		graphData.push({data: dataSet, xaxis: 1});
	 seriesY--;
    }
    var ret = {
	 tickLabels : tickLabels,
	 data : graphData,
      lastDate : lastDate
    };
    return ret;
  }
  
  var data = createData(roadmapData,"close");
  var timelineData = data.data;

  options = {
    container : container,
    data : {
      timeline : timelineData,
      summary : timelineData
    },
    trackFormatter : function (o) {

      var
        index = o.index,
	   formattedDate,
        value;

      value = new Date(o.series.data[index][0]);
      formattedDate = value.getMonth()+1 + '/' + value.getDate();
      return formattedDate;
    },
    markerFormatter : function (obj) {
	 var d = new Date(obj.data[obj.index][0]);
	 return obj.data[obj.index][2] + '\n' + (1 + d.getMonth()) + '/' + d.getDate();
    },
    yaxis : {
	 showLabels : true,
	 ticks : data.tickLabels
    },
    defaults : {
      timeline : {
        skipPreprocess : true
      },
      summary : {
        skipPreprocess : true
	 }
    }
  };

  vis = new envision.templates.Roadmap(options);
}

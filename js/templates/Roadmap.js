(function () {

var
  V = envision;

// Custom data processor
function processData (options) {

  var
    resolution = options.resolution;

  options.preprocessor
    .bound(options.min, options.max)
    .subsampleMinMax(resolution + Math.round(resolution / 3));
}

function getDefaults () {
  var pointRadius = 8;
  return {
    timeline : {
      name : 'envision-roadmap-timeline',
      config : {
	   lines : {
		show: true,
		lineWidth : 3
	   },
	   mouse : {
          track: true,
          trackY: true,
          trackAll: false,
          sensibility: 10,
          trackDecimals: 4,
          position: 'ne'
	   },
	   points: {
		show: true,		// => setting to true will show points, false will hide
		radius: pointRadius
	   },        
	   markers: {
		show: true,
		verticalMargin: pointRadius + 3,
		fontSize : 11, // This is a Canvas font size so it should be a number 
		position: 'ct'
	   },
        x2axis : {
		mode: 'time',
          autoscale : true,
          autoscaleMargin : 0.5,
		showLabels : true,
		  fontSize : '16px' // This is a CSS font size so it should be a string
	   },
        xaxis : {
		mode: 'time',
          autoscale : true,
          autoscaleMargin : 0.5,
		showLabels : false,
		fontSize : '16px' // This is a CSS font size so it should be a string
	   },
	   yaxis : { 
          autoscale : true,
          autoscaleMargin : .5,
		fontSize : '16px',
		margin : true,
          showLabels : true
	   },
	   grid : {
		//color: Flotr.Color.processColor('#ccc', {opacity: 0.8}),
		backgroundColor : '#ebebeb',
		labelMargin : 10,
		verticalLines : true,
		outlineWidth : .1,
		outline: 'w'
		//		    backgroundColor : {
		//			   colors : [[0,'#fff'], [1,'#ccc']],
		//			   start : 'top',
		//			   end : 'bottom'
		//		    }
	   }
      ,HtmlText : true
	 },
      processData : processData
    }, 
    summary : {
      name : 'envision-roadmap-summary',
      config : {
        lines : {
          show : true,
          lineWidth : 1,
          fill : false,
          fillOpacity : 0.2,
          fillBorder : true
        },
	   points: {
		show: true,		// => setting to true will show points, false will hide
		radius: 3,
		fill: true,
		lineWidth: 1
	   },        
        x2axis : {
		mode: 'time',
          noTicks: 8,
          showLabels : false,
          autoscale : true,
          autoscaleMargin : 0.1
        },
        xaxis : {
		mode: 'time',
          noTicks: 8,
          showLabels : true,
          autoscale : true,
          autoscaleMargin : 0.1
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : 0.5,
 	     margin : true
        },
        handles : {
          show : true
        },
        selection : {
          mode : 'x',
		color: '#ccc'      // => selection box color
        },
        grid : {
          verticalLines : false
        }
      }
    },
    connection : {
      name : 'envision-roadmap-connection',
      config : {
		strokeStyle : Flotr.Color.processColor('#ccc', {opacity: 0.8}),
		fillStyle : Flotr.Color.processColor('#ccc', {opacity: 0.4})
      },
      adapterConstructor : V.components.QuadraticDrawing
    }
  };
}

function Roadmap (options) {

  var
    data = options.data,
    defaults = getDefaults(),
    vis = new V.Visualization({name : 'envision-roadmap'}),
    selection = new V.Interaction(),
    hit = new V.Interaction(),
    timeline, connection, summary;

  if (options.defaults) {
    defaults = Flotr.merge(defaults, options.defaults);
  }

  defaults.timeline.data = data.timeline;
  defaults.summary.data = data.summary;

  defaults.timeline.config.mouse.trackFormatter = options.trackFormatter || function (o) {

    var
      index = o.index,
      value = 'Timeline: $' + data.timeline[1][index];
      day;

    return value;
  };
    if (options.markerFormatter) {
	   defaults.timeline.config.markers.labelFormatter = options.markerFormatter;
    }
  if (options.xTickFormatter) {
    defaults.timeline.config.xaxis.tickFormatter = options.xTickFormatter;
    defaults.timeline.config.x2axis.tickFormatter = options.xTickFormatter;
    defaults.summary.config.xaxis.tickFormatter = options.xTickFormatter;
  }
  if(options.yaxis.showLabels !== undefined) defaults.timeline.config.yaxis.showLabels = options.yaxis.showLabels;
  if(options.yaxis.ticks) defaults.timeline.config.yaxis.ticks = options.yaxis.ticks;
  timeline = new V.Component(defaults.timeline);
  connection = new V.Component(defaults.connection);
  summary = new V.Component(defaults.summary);

  // Render visualization
  vis
    .add(timeline)
    .add(connection)
    .add(summary)
    .render(options.container);

  // Define the selection zooming interaction
  selection
    .follower(timeline)
    .follower(connection)
    .leader(summary)
    .add(V.actions.selection, options.selectionCallback ? { callback : options.selectionCallback } : null);

  // Define the mouseover hit interaction
  hit
    .group([timeline])
    .add(V.actions.hit);

  // Optional initial selection
  if (options.selection) {
    summary.trigger('select', options.selection);
  } else {
    selection = {
      data : {
        x : {
          min : new Date().getTime(), // today in milliseconds since Jan 1, 1970
          max : summary.api.flotr.axes.x.max
        }
      }
    };
    summary.trigger('select', selection);
  }

  // Members
  this.vis = vis;
  this.selection = selection;
  this.hit = hit;
  this.timeline = timeline;
  this.summary = summary;
}

V.templates.Roadmap = Roadmap;

})();

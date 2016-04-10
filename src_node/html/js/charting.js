var socket = io();

function dankItUp(id, channel, dataLength){

  	var dps = []; // dataPoints
    var dpstemp = [];

  	var chart = new CanvasJS.Chart(id,{
      axisY2:{
        valueFormatString:"0 °F",
        title: "Temperature"     
      },
      axisY:{
        valueFormatString:"0 bpm",
        title: "Heart Rate"               
      },
      legend:{
        verticalAlign: "bottom",
        horizontalAlign: "center",
        fontSize: 15,
        fontFamily: "Lucida Sans Unicode"

      },
      data: [{
  			type: "spline",
        markerType: "none",
        name: "Heart Rate",
        showInLegend: true,
  			dataPoints: dps
    		},
        {
          type: "spline",
          axisYType: "secondary",
          markerType: "none",
          name: "Temperature",
          showInLegend: true,
          dataPoints: dpstemp
        }
      ]
  	});

  	var xVal = 1300000000000;

    socket.on(channel, function(data){
      console.log(data)
      dps.push({
        x: new Date(xVal),
        y: data.val
      });
      dpstemp.push({
        x: new Date(xVal),
        y: data.temp
      });
      console.log(new Date(xVal))
      xVal+=1000000
      if (dps.length > dataLength)
  		{
  			dps.shift()
  		}
      chart.render()
    })

  	// generates first set of dataPoints
  	chart.render()
}

window.onload = function () {
  dankItUp("heartContainer", "waveform.lol", 500)
}

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
      data: [{
  			type: "spline",
        markerType: "none",
  			dataPoints: dps
    		},
        {
          type: "spline",
          axisYType: "secondary",
          markerType: "none",
          dataPoints: dpstemp
        }
      ]
  	});

  	var xVal = 1300000000000;

    socket.on(channel, function(data){
      var obj = JSON.parse(data);
      dps.push({
        x: new Date(xVal),
        y: obj.val
      });
      dpstemp.push({
        x: new Date(xVal),
        y: obj.temp
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

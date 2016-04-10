var socket = io();

function dankItUp(id, channel, dataLength){

  	var dps = []; // dataPoints

  	var chart = new CanvasJS.Chart(id,{
      axisY2:{
        valueFormatString:"0 °F",
        title: "Temperature"     
      },
      axisY:{
        valueFormatString:"0 bpm",
        title: "Beats per Minute"               
      },
      data: [{
  			type: "spline",
        markerType: "none",
  			dataPoints: dps
  		},
      {
        type: "spline",
        axisYType: "secondary"
        markerType: "none",
        dataPoints: [
          { x: 1300000000000, y: 30 },
          { x: 1300001000000, y: 35 },
          { x: 1300002000000, y: 45 }
        ]
      }]
  	});

  	var xVal = 1300000000000;

    socket.on(channel, function(data){
      dps.push({
        x: new Date(xVal),
        y: data
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

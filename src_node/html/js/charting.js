var socket = io();

function dankItUp(id, channel, dataLength){

  	var dps = []; // dataPoints

  	var chart = new CanvasJS.Chart(id,{
  		data: [{
  			type: "spline",
        markerType: "none",
  			dataPoints: dps
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

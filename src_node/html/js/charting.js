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
    socket.on("prescrip", function (message){
          displayPrescrip(message)
          console.log(message)
          createPrescrip()
        })
  	// generates first set of dataPoints
  	chart.render()
}

//takes JSON object containing prescription data from the
//Node and displays it on the website
function displayPrescrip() {

}

//takes the values from the website new prescription slots and
// creates a new JSON object from it, sending it over sockets to Node
//Gets called anytime the 'new medication' button is pressed.
function createPrescrip() {
  var medication = ""
  var amount = ""
  var time = ""
  var frequency = ""

  var medJSON = {"medication": medication,"amount": amount ,"time": time,"frequency": frequency}
  socket.emit("prescrip", JSON.stringify(medJSON))
}

window.onload = function () {
  dankItUp("heartContainer", "waveform.lol", 500)
}

var socket = io();

function bpmSlowChart(id, channel, dataLength){
  var dps = []
  var dpstemp = []

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

  socket.on(channel, function(data){
    dps.push({
      x: new Date(data.time),
      y: data.val
    });
    dpstemp.push({
      x: new Date(data.time),
      y: data.temp
    });
    if (dps.length > dataLength)
    {
      dps.shift()
      dpstemp.shift()
    }
    chart.render()
  })
  // generates first set of dataPoints
  chart.render()
}

function bpmChart(id, channel, dataLength){
  var dps = []

  var chart = new CanvasJS.Chart(id,{
    axisY:{
      valueFormatString:"0 bpm",
      title: "Heart Rate"
    },
    data: [{
      type: "spline",
      markerType: "none",
      name: "Heart Rate",
      dataPoints: dps
    },
    ]
  });

  socket.on(channel, function(data){
    dps.push({
      x: new Date(data.time),
      y: data.val
    });
    //chart.options.axisX.maximum = data.time
    if (dps.length > dataLength)
    {
      dps.shift()
    }
    //chart.options.axisX.minimum = dps[0].x.getTime()
    chart.render()
  })
  // generates first set of dataPoints
  chart.render()
}

function waveformChart(id, channel, dataLength){
  var dps = []

  var chart = new CanvasJS.Chart(id,{
    axisX:{valueFormatString:""},
    data: [{
      type: "spline",
      markerType: "none",
      name: "Heart Waveform",
      dataPoints: dps
    },
    ]
  });

  socket.on(channel, function(data){
    dps.push({
      x: new Date(data.time),
      y: data.val
    });
    if (dps.length > dataLength)
    {
      dps.shift()
    }
    chart.render()
  })
  // generates first set of dataPoints
  chart.render()
  /*setInterval(function(){
    console.log("test")
    	chart.options.axisX.maximum += 1000/60
      chart.options.axisX.minimum += 1000/60
      chart.render()
  },1000/60)*/
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
  bpmSlowChart("bpmSlowContainer", "bpm_slow.bill", 500)
  bpmChart("bpmContainer", "bpm.bill", 500)
  waveformChart("waveformContainer", "waveform.bill", 500)
}

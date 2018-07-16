var url = '/api';
var source = document.getElementById("entry-template").innerHTML;
var time = document.getElementById("entry-time").innerHTML
var template = Handlebars.compile(source);
var timeTemplate = Handlebars.compile(time);
var format = 'mm:ss';
var inputLine = [];
var outputLine = [];
var length = 8;
var chartColorsArray11 = ['rgb(255,0,0)', 'rgb(0,0,128)', 'rgb(0,128,128)', 'rgb(255,0,255)', 'rgb(128,128,128)','rgb(128,0,0)', 'rgb(128,0,128)', 'rgb(255, 159, 64)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];


function getData (i) {
  var client = new HttpClient();
  client.get(url, function(response) {
      if (!response)
        return false;
      else
        renderData(JSON.parse(response), i);
  });
}

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}

function startDashboard() {
 getData(0)
 setInterval(function(){
  getData(1);
 },5000)
}

function renderData (data, index) {
  var chartsInputs = data.pipelines.main.plugins.inputs.map(function(i, index) {
    return { title: i.id, id: i.id, note: i.name, event: i.events.out, index: index }
  })
  var chartsOutputs =  data.pipelines.main.plugins.outputs.map(function(i, index) {
    return { title: i.id, id: i.id, note: i.name, event: i.events.in, index: index }
  })

  var currentTime = timeTemplate({time : getCurrentTime()});
  $('#time').html(currentTime);

  if (!index) {
    var html = template({ chartsInputs: chartsInputs, chartsOutputs: chartsOutputs });
    $('#content').html(html);
    chartsInputs.forEach(function(i, c){
          var ctx = document.getElementById(i.id).getContext('2d');
          inputLine[c] = new Chart(ctx, config(i));
        })
    chartsOutputs.forEach(function(i, c){
        var ctx = document.getElementById(i.id).getContext('2d');
        outputLine[c] = new Chart(ctx, config(i));
    })
  }
  else {
    chartsInputs.forEach(function(i, c){
       inputLine[c].config.data.labels.push(moment().format(format));
       if (inputLine[c].config.data.labels.length >= length)
           inputLine[c].config.data.labels.splice(0,1);
       inputLine[c].config.data.datasets.forEach(function(dataset) {
          dataset.data.push(i.event);
          if (dataset.data >= length)
            dataset.data.splice(0,1)
     });

     inputLine[c].update();
    })

    chartsOutputs.forEach(function(i, c){
      outputLine[c].config.data.labels.push(moment().format(format));
      if (outputLine[c].config.data.labels.length >= length)
          outputLine[c].config.data.labels.splice(0,1);
      outputLine[c].config.data.datasets.forEach(function(dataset) {
          dataset.data.push(i.event);
          if (dataset.data >= length)
            dataset.data.splice(0,1)
      });
      outputLine[c].update();
    })

  }

}
function getCurrentTime() {
  return moment().format('MMMM Do YYYY, hh:mm:ss a');
}

$(document).ready(function() {
  startDashboard();
});



var url = '/api';
var source = document.getElementById("entry-template").innerHTML;
var timer = document.getElementById("entry-time").innerHTML
var template = Handlebars.compile(source);
var timerTemplate = Handlebars.compile(timer);
var format = 'mm:ss';
var inputLineGraphGraph = [];
var outputLineGraph = [];
var length = 8;
var polling = 5000;
var pollerId = null;
var chartColorsArray11 = ['rgb(255,0,0)', 'rgb(0,0,128)', 'rgb(0,128,128)', 'rgb(255,0,255)', 'rgb(128,128,128)','rgb(128,0,0)', 'rgb(128,0,128)', 'rgb(255, 159, 64)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];


function getData (flag) {
  var client = new HttpClient();
  client.get(url, function(response) {
      var res = JSON.parse(response);
      if (res.error) {
        console.log("Connection error");
        return false;
      }
      else {
        renderData(res, flag);
        poller();
      }
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

function poller() {
 if (pollerId)
  clearTimeout(pollerId);
 pollerId = setTimeout(function(){
  getData(true);
 }, polling);

}

function startDashboard() {
 getData(false)
}

function renderData (data, flag) {
  var chartsInputs = data.pipelines.main.plugins.inputs.map(function(i, index) {
    return { title: i.id, id: i.id, note: i.name, event: i.events.out, index: index }
  })
  var chartsOutputs =  data.pipelines.main.plugins.outputs.map(function(i, index) {
    return { title: i.id, id: i.id, note: i.name, event: i.events.in, index: index }
  })

  var currentTime = timerTemplate({time : getCurrentTime()});
  $('#timer').html(currentTime);

  if (!flag) {
    var html = template({ chartsInputs: chartsInputs, chartsOutputs: chartsOutputs });
    $('#content').html(html);
    chartsInputs.forEach(function(i, c){
          var ctx = document.getElementById(i.id).getContext('2d');
          inputLineGraph[c] = new Chart(ctx, config(i));
        })
    chartsOutputs.forEach(function(i, c){
        var ctx = document.getElementById(i.id).getContext('2d');
        outputLineGraph[c] = new Chart(ctx, config(i));
    })
  }
  else {
    chartsInputs.forEach(function(i, c){
       inputLineGraph[c].config.data.labels.push(moment().format(format));
       if (inputLineGraph[c].config.data.labels.length >= length)
           inputLineGraph[c].config.data.labels.splice(0,1);
       inputLineGraph[c].config.data.datasets.forEach(function(dataset) {
          dataset.data.push(i.event);
          if (dataset.data >= length)
            dataset.data.splice(0,1)
     });
     inputLineGraph[c].update();
    })

    chartsOutputs.forEach(function(i, c){
      outputLineGraph[c].config.data.labels.push(moment().format(format));
      if (outputLineGraph[c].config.data.labels.length >= length)
          outputLineGraph[c].config.data.labels.splice(0,1);
      outputLineGraph[c].config.data.datasets.forEach(function(dataset) {
          dataset.data.push(i.event);
          if (dataset.data >= length)
            dataset.data.splice(0,1)
      });
      outputLineGraph[c].update();
    })

  }

}
function getCurrentTime() {
  return moment().format('MMMM Do YYYY, hh:mm:ss a');
}

$(document).ready(function() {
  startDashboard();
});



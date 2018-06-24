import lineGraph from './lineGraph';
import donutChart from './donutChart';
import { select } from 'd3-selection';
import "./inputEvents";

const fakeData = [{
    label: "Vaccinated and immune",
    size: 250
  }, {
    label: "Vaccinated but vulnerable",
    size: 0
  }, {
    label: "Not vaccinated",
    size: 0
  }, {
    label: "Infected",
    size: 0
  }]

const donut = donutChart();
select('#chart').datum(fakeData).call(donut);

document.getElementById("test-update-button").addEventListener("click", function(){
    select('#chart').datum([{
        label: "Vaccinated and immune",
        size: Math.random() * 100
      }, {
        label: "Vaccinated but vulnerable",
        size: Math.random() * 100
      }, {
        label: "Not vaccinated",
        size: Math.random() * 100
      }, {
        label: "Infected",
        size: Math.random() * 100
      }]).call(donut);
})
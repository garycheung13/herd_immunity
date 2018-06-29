import lineGraph from './lineGraph';
import donutChart from './donutChart';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import "./inputEvents";
import * as utils from './utils';

const fakeData = [{
  label: "Vaccinated and immune",
  size: Math.random() * 100
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

const donut = donutChart()
  .label(function(d){ return d.size })
  .data(fakeData)

select('#chart').call(donut);

document.getElementById("test-update-button").addEventListener("click", function(){
  donut.data([{
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
  }]);
})

console.log(utils.distance({x: 1, y: 2}, {x: 5, y: 10}));
console.log(utils.herdImmunity(7, 0.88));
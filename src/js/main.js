import { select } from 'd3-selection';

import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd } from './utils';
import { generateDataSet } from './probability';
import { CYCLES, POPULATION_SIZE } from './constants';

// chart module inits
const line = lineGraph().x(function(d){
    return d.interval;
}).y(function(d){
    return d.percentInfected;
})
const donut = donutChart()
    .label(function(d){ return d.size })
    .width(250)
    .height(250)
    .data([{
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
      }])

const sim = herdSimulation()
    .rZero(10)
    .subscribe("splits", function(splits){
        donut.data([{
            label: "Vaccinated and immune",
            size: splits.vaccinated
          }, {
            label: "Vaccinated but vulnerable",
            size: splits.unprotected
          }, {
            label: "Not vaccinated",
            size: splits.unvaccinated
          }, {
            label: "Infected",
            size: splits.infected
          }])
    });

// initial chart displaies
select("#line-graph").datum(generateDataSet(10, POPULATION_SIZE, CYCLES)).call(line);
select("#donut-container").call(donut);

// event bindings
(function(){
    // individual slider change bindings
    const sliders = [...document.querySelectorAll("#sim-settings input[type='range']")];
    // prefinding the elements so event doesn't trigger a dom search
    const displayElements = sliders.reduce(function(map, node){
        map[node.id] = document.getElementById(`${node.id}__display`);
        return map;
    }, {});

    sliders.map(function(node){
        node.addEventListener("input", function(e){
            displayElements[e.target.id].innerText = e.target.value;
        });
    });

    // line graph change trigger
    const form = document.getElementById("sim-settings");
    form.addEventListener("input", function(){
        // grab the slider values and cast to ints
        // also convert vac percentage to a float
        const rNumber = +document.getElementById("r-number").value;
        const vaccEffect = +document.getElementById("vac-effect").value * 0.01;
        select("#line-graph").datum(generateDataSet(rNumber, POPULATION_SIZE, CYCLES, vaccEffect)).call(line);
    });

    // triggers simulation running
    document.getElementById("start-trigger").addEventListener("click", function(){
        const percentVaccinated = +document.getElementById("percent-vac").value * 0.01;
        const vaccEffect = +document.getElementById("vac-effect").value * 0.01;
        select("#herd-container").call(sim.data(initHerd(POPULATION_SIZE, percentVaccinated, vaccEffect)));
    });
})();
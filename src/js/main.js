import { select } from 'd3-selection';

import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd, herdImmunity } from './utils';
import { generateDataSet } from './probability';
import { CYCLES, POPULATION_SIZE } from './constants';

// chart module inits
const line = lineGraph()
    .showMarker(true)
    .x(function(d){ return d.interval; })
    .y(function(d){ return d.percentInfected; })
    .xLabel("Percent Vaccinated")
    .yLabel("Expected Percent of Population Infected");

const donut = donutChart()
    .label(function(d){ return d.size })
    .width(250)
    .height(250)
    .data([{
        label: "No group",
        size: 250
      },{
        label: "Immune",
        size: 0
      }, {
        label: "Unprotected",
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
        // console.log(splits);
        donut.data([{
            label: "No Group",
            size: 0
          },{
            label: "Immune",
            size: splits.vaccinated
          }, {
            label: "Unprotected",
            size: splits.unprotected
          }, {
            label: "Not vaccinated",
            size: splits.unvaccinated
          }, {
            label: "Infected",
            size: splits.infected
          }])
    });

// initially render graphs and charts with some default data
select("#line-graph").datum(generateDataSet(10, .5)).call(line);
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
    // selectors for changing setting display numbers
    const form = document.getElementById("sim-settings");
    const formulaQc = document.getElementById("formula__Qc");
    const formulaR0 = document.getElementById("formula__R0");
    const formulaVC = document.getElementById("formula__Vc");
    const formulaE = document.getElementById("formula__E");
    const formulaQCD = document.getElementById("formula__QcD");

    // line graph change trigger
    form.addEventListener("input", function(){
        // grab the slider values and cast to ints
        // also convert vac percentage to a float
        const rNumber = +document.getElementById("r-number").value;
        const vaccEffect = +document.getElementById("vac-effect").value * 0.01;

        // formula updates
        const herdThreshold = herdImmunity(rNumber).toFixed(2);

        formulaQc.innerText = herdThreshold;
        formulaR0.innerText = rNumber;
        formulaE.innerText = vaccEffect.toFixed(2);
        formulaQCD.innerText = herdThreshold;
        formulaVC.innerText = herdImmunity(rNumber, vaccEffect).toFixed(2);

        // set the marker for herd immunity threshold
        line.markerValue(herdImmunity(rNumber, vaccEffect).toFixed(2));
        select("#line-graph").datum(generateDataSet(rNumber, vaccEffect)).call(line);
    });

    // triggers simulation running
    document.getElementById("start-trigger").addEventListener("click", function(){
        //scroll the user into the sim area on click
        document.getElementById('sim-area').scrollIntoView({
            behavior: "smooth"
        });
        const percentVaccinated = +document.getElementById("percent-vac").value * 0.01;
        const vaccEffect = +document.getElementById("vac-effect").value * 0.01;
        select("#herd-container").call(sim.data(initHerd(POPULATION_SIZE, percentVaccinated, vaccEffect)));
    });

    document.getElementById("setting-jump").addEventListener("click", function(){
        document.getElementById("settings").scrollIntoView({
            behavior: "smooth"
        })
    })
})();
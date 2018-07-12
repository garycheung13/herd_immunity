import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd } from './utils';
import { select } from 'd3-selection';
import { generateDataSet } from './probability';
import { CYCLES, POPULATION_SIZE } from './constants';

const sim = herdSimulation()
    .rZero(10)
    .subscribe(function(splits){
        console.log(splits);
    })

const line = lineGraph().x(function(d){
    return d.interval;
}).y(function(d){
    return d.percentInfected;
})

// line chart init
select("#line-graph").datum(generateDataSet(10, POPULATION_SIZE, CYCLES)).call(line);

// event bindings
(function(){
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
    })

    // line graph change trigger
    const form = document.getElementById("sim-settings");
    form.addEventListener("input", function(){
        // grab the slider values and cast to ints
        // also convert vac percentage to a float
        const rNumber = +document.getElementById("r-number").value;
        const vaccEffect = +document.getElementById("vac-effect").value * 0.01;
        select("#line-graph").datum(generateDataSet(rNumber, POPULATION_SIZE, CYCLES, vaccEffect)).call(line);
    })
})();


document.getElementById("update").addEventListener("click", function(){
    select("#chart").call(sim.data(initHerd(250, .50, .95)));
})

console.log(generateDataSet(10, POPULATION_SIZE, CYCLES));
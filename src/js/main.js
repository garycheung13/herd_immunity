import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd } from './utils';

import { shuffle, range } from 'd3-array';
import { select } from 'd3-selection';
import "./inputEvents";
import { generateDataSet } from './probability';

const sim = herdSimulation()
    .rZero(10)
    .subscribe(function(splits){
        console.log(splits);
    })


document.getElementById("update").addEventListener("click", function(){
    select("#chart").call(sim.data(initHerd(250, .50, .95)));
})

console.log(generateDataSet(20, 250, 10));
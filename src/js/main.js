import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd } from './utils';
import { select } from 'd3-selection';
import "./inputEvents";
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

let defaultData = [{
    "percentInterval": 0,
    "probability": 1
}, {
    "percentInterval": 10,
    "probability": .9519999999999982
}, {
    "percentInterval": 20,
    "probability": 0.8999490754938368
}, {
    "percentInterval": 30,
    "probability": 0.8507346589600671
}, {
    "percentInterval": 40,
    "probability": 0.7931216448601929
}, {
    "percentInterval": 50,
    "probability": 0.7359907109503546
}, {
    "percentInterval": 60,
    "probability": 0.6643794408056614
}, {
    "percentInterval": 70,
    "probability": 0.6042326024262262
}, {
    "percentInterval": 80,
    "probability": 0.5233382743563393
}, {
    "percentInterval": 90,
    "probability": 0.46694997600028654
}, {
    "percentInterval": 100,
    "probability": 0.3729724400108452
}];


select("#line-graph").datum(generateDataSet(20, POPULATION_SIZE, CYCLES, 0.85)).call(line);

document.getElementById("update").addEventListener("click", function(){
    select("#chart").call(sim.data(initHerd(250, .50, .95)));
})

console.log(generateDataSet(20, POPULATION_SIZE, CYCLES, 0.85));
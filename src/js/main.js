import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { initHerd } from './utils';

import { shuffle, range } from 'd3-array';
import { select } from 'd3-selection';
import "./inputEvents";

const sim = herdSimulation().subscribe(function(data){
    console.log(data);
});

document.getElementById("update").addEventListener("click", function(){
    select("#chart").call(sim.data(initHerd(250, .50, .95)));
})
import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { shuffle, range } from 'd3-array';
import { select } from 'd3-selection';
import "./inputEvents";

const sim = herdSimulation().subscribe(function(data){
    console.log(data);
});

document.getElementById("update").addEventListener("click", function(){
    select("#chart").call(sim.data(shuffle(
        range(250).map(function(value, index){
            if (index <= 125) {
                return {
                    color: "green",
                    isInfectable: false,
                    status: "vaccinated"
                }
            } else if (index > 50 && index <= 149) {
                return {
                    color: "steelblue",
                    isInfectable: true,
                    status: "noEffect"
                }
            } else {
                return {
                    color: "black",
                    isInfectable: true,
                    status: "unvaccinated"
                }
            }
        })
      )));
})
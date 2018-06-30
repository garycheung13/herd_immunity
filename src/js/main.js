import lineGraph from './lineGraph';
import donutChart from './donutChart';
import herdSimulation from './herdSimulation';
import { shuffle, range } from 'd3-array';
import { select } from 'd3-selection';
import "./inputEvents";
import * as utils from './utils';

const nodes = shuffle(
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
);
const sim = herdSimulation().data(nodes);
select("#chart").call(sim);

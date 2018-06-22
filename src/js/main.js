import lineGraph from './linechart';
import { select } from 'd3-selection';
import "./inputEvents";
// select("#chart").append("svg");
const chart = lineGraph();

select('#chart').call(chart);
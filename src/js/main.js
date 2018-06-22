import lineGraph from './lineGraph';
import { select } from 'd3-selection';
import "./inputEvents";

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
const chart = lineGraph()
    .x(function(d){return +d.percentInterval})
    .y(function(d){return +d.probability});

select('#chart').datum(defaultData).call(chart);
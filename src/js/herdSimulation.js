import { randomUniform } from 'd3-random';
import { select } from 'd3-selection';
import { ascending } from 'd3-array';
import {forceSimulation, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { transition } from 'd3-transition';
import { distance, delay } from './utils';

function herdSimulation() {
    let width = 500;
    let height = 500;
    let _data = [];
    let radius = 7.5;
    let CYCLES = 10;
    let counter = 0;
    let state = {
        inProgress: false
    }
    let subscribers = [];


    function layout(selection) {
        selection.each(function(){
            // remove everything
            select(this).selectAll("*").remove();

            // append and start building up svg
            const svg = select(this).append("svg")
                .attr("viewBox", `0,0,${width},${height}`)
                .attr("perserveAspectRatio", "xMinYmid meet")
                .style("max-width", `${width}px`);

            // force layout settings
            const simulation = forceSimulation(_data)
                .alphaDecay(0.25)
                .force('charge', forceManyBody().strength(-5))
                .force('center', forceCenter(width / 2, height / 2))
                .force('collision', forceCollide().radius(radius))
                .on('tick', function(){
                    const chart = svg.selectAll('circle').data(_data)
                    chart.enter().append("circle")
                            .attr("r", radius)
                        .merge(chart)
                            .attr("cx", function(d){
                                return d.x;
                            })
                            .attr("cy", function(d){
                                return d.y;
                            })
                            .attr("fill", function(d){
                                return d.color;
                            })
                            .attr("class", "node")
                            .attr("id", function(d, i){
                                return `node_${i}`
                            });
                }).on("end", function(){
                    // simulate introduction of disease x # of cycles
                    // setTimeout spaces out the animations
                    state.inProgress = true;
                    let promises = [];

                    for (let i=0; i < CYCLES; i++) {
                        promises.push(delay(i * 1000, infect.bind(null, svg, 50)));
                        // setTimeout(infect.bind(null, svg, 50), i * 1000);
                    }

                    Promise.all(promises).then(function(){
                        state.inProgress = false;
                        console.log(state.inProgress);
                    })
                })
        })
    }

    // handles the infection simulation and animations
    function infect(selection, spreadSize) {
        const randomID = randomUniform(0, 250)();
        const randomNodeDatum = selection.select(`#node_${Math.round(randomID)}`).datum();
        const INITIAL_MOVEMENT_TIME = 500;
    
        // additional circle for animating diease attack
        const movingDot = selection.append("circle")
            .datum([{x: 5,y: 5}]) 
            .attr("id", "movingDot")
            .attr("fill", "red")
            .attr("r", 7.5)
            .attr("cx", randomUniform(width))
            .attr("cy", "50");

        // move to position of selected node
        movingDot.transition()
            .duration(INITIAL_MOVEMENT_TIME)
            .attr("cx", randomNodeDatum.x)
            .attr("cy", randomNodeDatum.y);

        if (randomNodeDatum.isInfectable) {
            const allNodes = selection.selectAll('.node').sort(function(a, b){  
                return ascending(distance(randomNodeDatum, a), distance(randomNodeDatum, b));
            }).filter(function(d, i){
                // filter out any nodes in range that are uninfectable or checked already
                return i < spreadSize && d.isInfectable && !select(this).classed("checked");
            });
            
            // mark the node as checked and animate and infection
            allNodes.classed("checked", true)
                .transition().delay(function(d, i){ return INITIAL_MOVEMENT_TIME + i * 10})
                .duration(500)
                .attr("r", radius * 1.2)
                .attr("fill", "red")
                .transition()
                .attr("r", radius);      
        } else {
            // bounce off if not infectable
            movingDot.transition().delay(1000).duration(1500)
            .attr("cx", 0)
            .attr("cy", 0)
            .transition()
            .attr("opacity", 0)    
        }
        subscribers.forEach(function(callback){
            callback(state.inProgress);
        });
        
    }
    layout.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return layout;
    }

    layout.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return layout;
    }

    layout.data = function(value) {
        if (!arguments.length) return _data;
        _data = value;
        return layout;
    }

    layout.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return layout;
    }

    layout.subscribe = function(value) {
        subscribers.push(value);
        return layout;
    }

    return layout;
}

export default herdSimulation;
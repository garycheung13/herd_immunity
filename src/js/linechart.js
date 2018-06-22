import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

function lineGraph(){
    // chart size defaults;
    let height = 550;
    let width = 900;
    let margin = {top: 20, right: 20, bottom: 40, left: 60};
    let xScale = scaleLinear();
    let yScale = scaleLinear();
    let xAxis = axisBottom(xScale);
    let yAxis = axisLeft(yScale);

    function chart(selection){
        selection.each(function(){
            console.log("test");
        })
        console.log("hello world module is working");
    }

    // setter/getters
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    }

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    }

    return chart;
}

export default lineGraph;
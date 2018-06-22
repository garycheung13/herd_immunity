import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { line } from 'd3-shape';

function lineGraph(){
    // chart size defaults;
    let height = 550;
    let width = 900;
    let margin = {top: 20, right: 20, bottom: 40, left: 60};
    let xScale = scaleLinear();
    let yScale = scaleLinear();
    let xValue = function(d) { return d[0]; };
    let yValue = function(d) { return d[1]; };
    let xAxis = axisBottom(xScale);
    let yAxis = axisLeft(yScale);

    function chart(selection){
        selection.each(function(data){
            // map object properties to array so array indicies
            // can be used instead of property names
            data = data.map(function(d, i){
                return [xValue.call(data, d, i), yValue.call(data, d, i)]
            });

            xScale
                .domain([0, max(data, function(d){return d[0]})])
                .range([0, width - margin.left - margin.right]);

            yScale
                .domain([0, max(data, function(d){return d[1]})])
                .range([height - margin.top - margin.bottom, 0]);


            // Select the svg element, if it exists.
            const svg = select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");

            // position and size the svg container
            // Using viewbox to make chart responsive
            // must assign at least one size attribute or else most browsers
            // will implicitly apply width: 100%, height: auto to the svg (too large)
            svg.merge(svgEnter)
                .attr("viewBox", `0,0,${width},${height}`)
                .attr("perserveAspectRatio", "xMinYmid meet")
                .style("max-width", `${width}px`);

            // positioning chart area
            const chartArea = svg.merge(svgEnter).append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // axises
            chartArea.append("g")
                .attr("class", "x-axis axis")
                .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
                .call(xAxis)

            chartArea.append("g")
                .attr("class", "y-axis axis")
                .call(yAxis);

            const valueLine = line()
                .x(function(d) {return xScale(d[0])})
                .y(function(d) {return yScale(d[1])});

            chartArea.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine)
                .attr("class", "path");
        })
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

    chart.x = function(value) {
        if (!arguments.length) return xValue;
        xValue = value;
        return chart;
    };

    chart.y = function(value) {
        if (!arguments.length) return yValue;
        yValue = value;
        return chart;
    };

    return chart;
}

export default lineGraph;
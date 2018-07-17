import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
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
    let xAxis = axisBottom(xScale).tickSize(0).tickPadding(8);
    let yAxis = axisLeft(yScale).tickSizeOuter(0).tickPadding(8);
    let xLabel = "X Value Label";
    let yLabel = "Y Value Label";
    let markerValue = function() { return 0; };
    let showMarker = false;

    function chart(selection){
        selection.each(function(data){
            // map object properties to array so array indicies
            // can be used instead of property names
            data = data.map(function(d, i){
                return [xValue.call(data, d, i), yValue.call(data, d, i)]
            });

            // calculate scales and line direction before render
            xScale
                .domain([0, max(data, function(d){return d[0]})])
                .range([0, width - margin.left - margin.right]);

            yScale
                // .domain([0, max(data, function(d){return d[1]})])
                .domain([0, 1])
                .range([height - margin.top - margin.bottom, 0]);

            yAxis.tickSizeInner(-width + margin.left + margin.right);

            const valueLine = line()
                .x(function(d) {return xScale(d[0])})
                .y(function(d) {return yScale(d[1])});

            // start render
            // Select the svg element, if it exists.
            const svg = select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            const gEnter = svgEnter.append("g"); // location of line

            // position and size the svg container
            // Using viewbox to make chart responsive
            // must assign at least one size attribute or else most browsers
            // will implicitly apply width: 100%, height: auto to the svg (too large)
            svg.merge(svgEnter)
                .attr("viewBox", `0,0,${width},${height}`)
                .attr("perserveAspectRatio", "xMinYmid meet")
                .style("max-width", `${width}px`);

            // positioning chart area
            const chartArea = svg.merge(svgEnter).select("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // create and draw axes
            gEnter.append("g")
                .attr("class", "x-axis axis")
                .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
                .call(xAxis)
              .append("text")
                .attr("class", "label")
                .attr("x", width/2)
                .attr("y", margin.bottom)
                .style("text-anchor", "end")
                .text(xLabel);

            gEnter.append("g")
                .attr("class", "y-axis axis")
                .call(yAxis)
              .append("text")
                .attr("class", "label")
                .attr("x", -height/2 + margin.top + margin.bottom)
                .attr("y", -margin.left/2)
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "end")
                .text(yLabel);

            // finally drawing the line on the graph
            gEnter.append("path").attr("class", "plot")

            chartArea.select(".plot")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .transition()
                .attr("d", valueLine);

            // handle drawing a vertical line marker on the graph if needed
            if (showMarker) {
                const value = (typeof markerValue === "function") ? markerValue.call(null, data) : markerValue;
                gEnter.append("line").attr("class", "threshold-marker")
                chartArea.select(".threshold-marker")
                    .attr("stroke-dasharray", "5, 5")
                    .style("stroke-width", 1)
                    .style("stroke", "grey")
                    .transition()
                    .attr("x1", xScale(value))
                    .attr("x2", xScale(value))
                    .attr("y1", 0)
                    .attr("y2", height - margin.top - margin.bottom);
            }
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

    chart.xLabel = function(value) {
        if (!arguments.length) return xLabel;
        xLabel = value;
        return chart;
    }

    chart.yLabel = function(value) {
        if (!arguments.length) return yLabel;
        yLabel = value;
        return chart;
    }

    chart.showMarker = function(value) {
        if (!arguments.length) return showMarker;
        showMarker = value;
        return chart;
    }

    chart.markerValue = function(value) {
        if (!arguments.length) return markerValue;
        markerValue = value;
        return chart;
    }

    return chart;
}

export default lineGraph;
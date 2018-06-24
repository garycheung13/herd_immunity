import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';
import { select } from 'd3-selection';
import { transition, attrTween } from 'd3-transition';
import { interpolate } from 'd3-interpolate';

function donutChart() {
    let height = 500;
    let width = 500;
    let margin = {top: 40, right: 40, bottom: 40, left: 40};
    let colors = ["grey", "green", "#F6E481", "black", "red"];
    let labelValue = function(d) { return d[0]; };
    let quantityValue = function(d) { return d[1]; };
    let donutScale = scaleOrdinal(colors);
    let donutArc = arc();
    let donutPie = pie();


    function chart(selection) {
        selection.each(function(data){
            const radius = Math.min(width, height) / 2;

            donutArc
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.5);

            donutPie.value(function(d){
                return d.size;
            }).sort(null);

            // start render
            // Select the svg element, if it exists.
            const svg = select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            svgEnter.append("g"); // location of line

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
                .attr("transform", `translate(${width/2},${height/2})`)

            const paths = chartArea.selectAll("path")
                .data(donutPie(data))

            paths.enter().append("path")
                .each(function (d) { this._current = d; })
                .attr('class', 'arc')
                // d arg is not used, but needed because index is second arg
                .attr('fill', function (d, i) {
                    return donutScale(i);
                })
                .attr('d', donutArc)

            paths.transition().duration(750).attrTween("d", arcTween)
                .attr('fill', function (d, i) {
                    return donutScale(i);
                })
        })
    }

    function arcTween(a) {
        var i = interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
          return donutArc(i(t));
        };
      }

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

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return colors;
    }

    chart.label = function(value) {
        if (!arguments.length) return labelValue;
        labelValue = value;
        return chart;
    };

    chart.quantity = function(value) {
        if (!arguments.length) return quantityValue;
        quantityValue = value;
        return chart;
    };

    return chart;
}

export default donutChart;
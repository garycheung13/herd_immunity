import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';
import { select } from 'd3-selection';
import { transition, attrTween } from 'd3-transition';
import { interpolate } from 'd3-interpolate';

function donutChart() {
    let height = 500;
    let width = 500;
    let colors = ["grey", "green", "steelblue", "black", "red"];
    let labelValue = function(d) { return d[0]; };
    let quantityValue = function(d) { return d[1]; };
    let donutScale = scaleOrdinal(colors);
    let donutArc = arc();
    let donutPie = pie();

    let _data = [];
    let updateData = function(){ return null; };


    function chart(selection) {
        selection.each(function(){
            const radius = Math.min(width, height) / 2;

            donutArc
                .outerRadius(radius)
                .innerRadius(radius * 0.7);

            donutPie.value(function(d){
                return labelValue(d);
            }).sort(null);

            const svg = select(this).append("svg")
                .attr("viewBox", `0,0,${width},${height}`)
                .attr("perserveAspectRatio", "xMinYmid meet")
                .style("max-width", `${width}px`);

            const chartArea = svg.append("g")
                .attr("transform", `translate(${width/2},${height/2})`);

            const paths = chartArea.selectAll("path")
                    .data(donutPie(_data))
                    .enter()
                .append("path")
                    .attr("class", "arc");

            paths.transition()
                .attr("fill", function(d,i){ return donutScale(i); })
                .attr("d", donutArc)
                .each(function(d){this._current = d});

            const tooltip = chartArea.append("g")
                .attr("display", "none");

            tooltip.append("circle")
                .attr("r", radius * 0.6)
                .attr("fill", "lightgrey");

            paths.on("mouseover", function(d, i){
                tooltip.attr("display", "block");
                // console.log(d);
                tooltip.append("text")
                    .attr("dx", 0)
                    .attr("dy", -10)
                    .attr("text-anchor", "middle")
                    .text(d.data.label);


                tooltip.append("text")
                    .attr("dx", 0)
                    .attr("dy", 20)
                    .attr("text-anchor", "middle")
                    .text(d.data.size);
            })

            paths.on("mouseout", function(d, i){
                tooltip.attr("display", "none");
                tooltip.selectAll("text").remove();
            })

            updateData = function() {
                const pathUpdate = chartArea.selectAll("path")
                        .data(donutPie(_data))

                pathUpdate.enter()
                    .append("path")
                        .attr("class", "arc")
                        .attr("fill", function(d,i){ return donutScale(i); })
                        .attr("d", donutArc)
                        .each(function(d){this._current = d});

                pathUpdate
                    .transition().duration(750)
                    .attrTween("d", arcTween);

                pathUpdate.exit().remove();
            }
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

    chart.data = function(value) {
        if (!arguments.length) return _data;
        _data = value;
        updateData();
        return chart;
    }
    return chart;
}

export default donutChart;
const lineChart = (function () {
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


    let margins = {
        top: 40,
        bottom: 60,
        left: 60,
        right: 20
    };
    let width = 700 - margins.left - margins.right;
    let height = 500 - margins.top - margins.bottom;

    let svg = d3.select("#probability-graph").append("svg")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    let xScale = d3.scaleLinear() //intervals
        .domain([0, d3.max(defaultData, function (d) {
            return d.percentInterval;
        })]).range([0, width]);

    let yScale = d3.scaleLinear() //probability
        .domain([0, 100]).range([height, 0]);

    let line = d3.line()
        .x(function (d) {
            return xScale(d.percentInterval);
        })
        .y(function (d) {
            return yScale(d.probability * 100);
        });

    svg.append("path")
        .datum(defaultData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("class", "path");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .style("font-size", "14");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .style("font-size", "14");;

    svg.append("text") //x axis label
        .text("% Percentage of Population Vaccinated")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margins.bottom - 10)
        .style("font-family", "Open Sans");

    svg.append("text") //y axis label
        .text("Average Percent of Population Infected")
        .attr("text-anchor", "middle")
        .attr("x", -width / 3)
        .attr("y", 0 - 45)
        .style("transform", "rotate(270deg)")
        .style("font-family", "Open Sans");

    svg.append("text")
        .text("Average Percentage Infected with Current Parameters")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", -margins.top / 2 + 10)
        .style("font-family", "Muli")
        .style("font-size", "18px");

    return {
        update: function (newData) {
            const plotLine = d3.select(".path");

            plotLine.datum(newData)
                .transition()
                .attr("d", line);
        },

        drawImmunityLine: function (percentage) {
            const percentageNeeded = percentage;
            const linexPosition = xScale(percentage);
            svg.selectAll(".immune-line").remove();

            if (percentageNeeded <= 100) {
                svg.append("line")
                    .attr("x1", linexPosition)
                    .attr("y1", 0)
                    .attr("x2", linexPosition)
                    .attr("y2", height)
                    .attr("class", "immune-line")
                    .attr("stroke-dasharray", "5, 5")
                    .style("stroke-width", 1)
                    .style("stroke", "grey");
            };
                svg.append("text")
                    .attr("x", linexPosition - 130)
                    .attr("y", 100)
                    .attr("class", "immune-line")
                    .style("font-family","Open Sans")
                    .text("Vaccination Rate");

                svg.append("text")
                    .attr("x", linexPosition - 75)
                    .attr("y", 120)
                    .attr("class", "immune-line")
                    .style("font-family","Open Sans")
                    .text("required");
        }
    }
})();
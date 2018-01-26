const donutChart = (function () {
  let data = [{
    label: "default",
    size: POPULATION_SIZE
  }, {
    label: "immune",
    size: 0
  }, {
    label: "vulnerable",
    size: 0
  }, {
    label: "not vaccinated",
    size: 0
  }, {
    label: "infected",
    size: 0
  }]

  //donut dimensions
  let width = 500;
  let height = 250;
  let radius = Math.min(width, height) / 2;

  const colors = d3.scaleOrdinal(["grey", "green", "#F6E481", "black", "red"]);
  const arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.5);

  const pie = d3.pie()
    .value(function (d) {
      return d.size;
    }).sort(null);

  let svg = d3.select("#donut")
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

  let path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path');

  path.transition()
    .attr('class', 'arc')
    .attr('fill', function (d, i) {
      return colors(i);
    })
    .attr('d', arc)
    .each(function (d) {
      this._current = d;
    });

  path.on("mouseover", function (d, i) {
    const defaultText = "No Simulation Ran";
    const currentSegment = d3.select(this).datum();

    if (currentSegment.data.label === "default") {
      svg.append("text")
        .text("Please run a")
        .attr("class", "desc")
        .attr("x", width / 4)
        .attr("y", -height / 4);
      svg.append("text")
        .text("simulation first")
        .attr("class", "desc")
        .attr("x", width / 4)
        .attr("y", -height / 4 + 40);
    } else {
      d3.selectAll(".arc")
        .attr("opacity", 0.5);
      d3.select(this)
        .attr("opacity", 1.0);

      svg.append("text")
        .text("Segment Name")
        .attr("class", "desc")
        .attr("x", width / 4)
        .attr("y", -height / 4);

      svg.append("text")
        .text("Segment Size")
        .attr("class", "desc")
        .attr("x", width / 4)
        .attr("y", -height / 4 + 100);

      svg.append("text")
        .attr("class", "arc-size")
        .attr("x", width / 4)
        .attr("y", -height / 4 + 40)
        .text(d.data.label);

      svg.append("text")
        .attr("class", "arc-size")
        .attr("x", width / 4)
        .attr("y", -height / 4 + 140)
        .text(d.data.size + " \(" + (d.data.size/POPULATION_SIZE * 100).toFixed(2) + "%\)");
    }
  });

  path.on("mouseout", function (d) {
    d3.selectAll(".arc-size").remove();
    d3.selectAll(".desc").remove();
    d3.selectAll(".arc").attr("opacity", 1.0);
  });

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
      return arc(i(t));
    };
  }

  return {
    update: function (data) {
      path.data(pie(data));
      path.transition().duration(750).attrTween("d", arcTween);
    }
  }
})();
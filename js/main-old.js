const POPULATION_SIZE = 250;

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

//stores and outputs data that the visualization generates
const dataStore = (function () {
    let totalSimulations = 0;
    let infectedTotal = 0;
    let defaultPopulationStats = {};
    let config = {}; //config refers to the user input fields
    let distanceData = [];
    let livePoplationStats = {};

    const resultsElement = document.getElementById("final-stats-body");

    function calculateInfectPercent() {
        return {
            percentOfPossible: ((infectedTotal / (defaultPopulationStats.unvaccinated + defaultPopulationStats.vulnerable)) * 100).toFixed(2) + "%",
            percentOfTotal: ((infectedTotal / POPULATION_SIZE) * 100).toFixed(2) + "%"
        };
    }

    return {
        getSimCalculations: calculateInfectPercent,

        setConfig: function (newConfig) {
            config = newConfig;
        },

        incrementTotalSims: function () {
            totalSimulations++;
        },

        setPopulationStats: function (nodesObj) {
            //define possible statuses and create an object to hold the segment counts
            const statusTypes = ["immune", "unvaccinated", "vulnerable"];
            const segments = {};

            for (let i = 0; i < statusTypes.length; i++) {
                const element = statusTypes[i];
                const filteredPopulation = nodesObj.filter(function (d) {
                    return d.status == element;
                });
                segments[element] = filteredPopulation.length;
            }

            defaultPopulationStats = segments; //unchanging initial stats
            livePoplationStats = JSON.parse(JSON.stringify(defaultPopulationStats));; //changes with sim progress
        },

        updateLiveStats: function (node) {
            //remove one from the corresponding node
            livePoplationStats[node.status] -= 1;
        },

        getLiveStats() {
            return livePoplationStats;
        },

        incrementDisplayElement: function () {
            infectedTotal++;
        },

        resetDisplayElement: function () {
            infectedTotal = 0;
        },

        insertResults: function () {
            //create the row
            const newRow = resultsElement.insertRow();
            //calculate percentages
            const results = calculateInfectPercent();

            const rowData = [totalSimulations, config.rZero, config.percentVaccinate, results.percentOfPossible, results.percentOfTotal];
            for (let i = 0; i < rowData.length; i++) {
                let data = newRow.insertCell(i);
                data.innerHTML = rowData[i];
            }
        },

        getDataForDonut: function () {
            //for updating data the donut charts
            const donutFormattedData = [{
                label: 'default',
                size: 0
            }, {
                label: 'immune',
                size: livePoplationStats.immune
            }, {
                label: "not vaccinated",
                size: livePoplationStats.vulnerable
            }, {
                label: 'unvaccinated',
                size: livePoplationStats.unvaccinated
            }, {
                label: 'infected',
                size: infectedTotal
            }]
            return donutFormattedData;
        },

        setDistance: function (nodeId, distance, totalInfections) {
            distanceData.push({
                startNode: nodeId,
                distance: distance,
                totalInfections: totalInfections
            })
        },

        getDistanceData: function () {
            return distanceData;
        },

        resetDistanceData: function () {
            distanceData = [];
        }
    }
})();


/**
 * @param {number} rZero - number representing the virus's reproductive rate
 * @param {number} vaccineRate - number between 0-1.00 representing the vaccine's effectiveness rate
 * @returns {number} - the percentage of the population that needs to be vaccinated for herd immunity
 */
function calculateImmunity(rZero, vaccineRate) {
    const effectiveness = vaccineRate || 0;

    const threshold = 1 - (1 / rZero);

    //only include vaccination rate if param is passed
    if (effectiveness) {
        return threshold / effectiveness;
    } else {
        return threshold;
    }
}


function handleSliderChange(sliderId, viewId, postfix) {
    const slider = document.getElementById(sliderId),
        sliderDisplay = document.getElementById(viewId);
    const postfixText = postfix || "";
    slider.onchange = function (event) {
        sliderDisplay.innerHTML = event.target.value + postfixText;
    }
}

handleSliderChange("r-number", "rZero-view");
handleSliderChange("effect", "effect-view", "%");
handleSliderChange("safe-percent", "safe-percent-view", "%");


function handleFormChange() {
    //retrieve and assign the form values
    let rZeroValue = document.getElementById("r-number").value;
    let vaccineEffectiveness = document.getElementById("effect").value;
    let vaccinationPercent = document.getElementById("safe-percent").value;
    let rZeroFormula = document.getElementById("rZero_formula");
    let thresholdNumberSpans = document.getElementsByClassName("thresholdNumber");

    rZeroFormula.innerHTML = rZeroValue;
    //iterate over the threshold number calculations
    //needs to be done with call beacause getElementsByClassName returns an HTMLCollection
    //not an array
    [].slice.call(thresholdNumberSpans).forEach(function (span) {
        span.innerHTML = calculateImmunity(rZeroValue).toFixed(2);
    });
    let probability = predictPrecentage.generateData(+rZeroValue, +vaccineEffectiveness * 0.01, POPULATION_SIZE);
    lineChart.update(probability);

    document.getElementById("effect-formula").innerHTML = vaccineEffectiveness * .01;

    let populationNeeded = calculateImmunity(rZeroValue, vaccineEffectiveness * .01);
    document.getElementById("populationNeeded").innerHTML = populationNeeded.toFixed(2);
    document.getElementById("threshold-number-percent").innerHTML = "(" + (populationNeeded * 100).toFixed(2) + "%)";
    lineChart.drawImmunityLine(populationNeeded * 100);
    //show message only if needed
    if (populationNeeded * 100 > 100) {
        document.getElementById("message").innerHTML = "Herd Immunity not possible with current settings (more than the total population needs to be vaccinated)";
    } else {
        document.getElementById("message").innerHTML = "";
    }
}



//d3 functions

function distance(a, b) {
    return Math.sqrt(((b.x - a.x) ** 2 + (b.y - a.y) ** 2));
}


function initPopulationArray(popSize, vaccPercentage, vaccEffect) {
    const RADIUS_SIZE = 7.5;
    const numberOfNoVac = Math.floor(popSize * (1 - vaccPercentage));
    const numberOfImmune = Math.floor((popSize - numberOfNoVac) * vaccEffect);
    const numberOfVulnerable = popSize - numberOfNoVac - numberOfImmune;
    //create array of non-vaccinated nodes
    const noVaccNodes = d3.range(numberOfNoVac).map(function (d) {
        return {
            status: "unvaccinated"
        };
    });
    //array of prefectly immune nodes
    const vaccImmuneNodes = d3.range(numberOfImmune).map(function (d) {
        return {
            status: "immune"
        }
    });
    //array of vaccinated but Vulnerable nodes
    const vaccVulnerableNodes = d3.range(numberOfVulnerable).map(function (d) {
        return {
            status: "vulnerable"
        }
    });
    //merge and shuffle the array
    const combinedPopArray = d3.shuffle(d3.merge([noVaccNodes, vaccImmuneNodes, vaccVulnerableNodes]));
    //add id numbers for the layout
    return combinedPopArray.map(function (d, i) {
        return {
            radius: RADIUS_SIZE,
            status: d.status,
            id: i
        };
    });
}


function calcuateSpread(nodes, rZero) {
    let spreadCounter = 0;
    for (let i = 0; i < rZero; i++) {
        const element = nodes[i];
        if (element.status !== "immune") {
            spreadCounter++
        }
    }
    const spreadTotal = +rZero + (rZero * spreadCounter);
    //if the infection spreads past the population size, return it instead
    //to avoid errors
    if (spreadTotal > POPULATION_SIZE) {
        return POPULATION_SIZE;
    } else {
        return spreadTotal;
    }
}

//recursive spread
function spread(spreadSize, nodes, population, rzero, cases) {
    let arrayFront = nodes.slice(0, cases);
    let arrayBack = nodes.slice(cases, nodes.length);
    let counter = 0; //tracks the number of infections for current call
    for (let i = 0; i < arrayFront.length; i++) {
        const element = arrayFront[i];
        if (element.status !== "immune") {
            counter++;
        }
    }
    //calculate the number of new cases for next call
    //each infection results in infection * reproductive rate
    let newCases = counter * rzero;
    //add to total
    spreadSize += newCases;

    //base case is reached if spread is more than the population, or there are no cases
    if (spreadSize >= population || counter <= 0) {
        return spreadSize;
    } else {
        return spread(spreadSize, arrayBack, population, rzero, newCases);
    }
}

function commentOnSimResults(percentage) {
    let message = "";

    if (percentage <= 5) {
        message = "The outbreak was avoided or contained because enough of the population was vaccinated.";
    } else if (percentage > 5 && percentage <= 30) {
        message = "Since there a  was majority vaccinated and immune against the disease, the disease was inhibited somewhat but still had some spread potential.";
    } else if (percentage > 30 && percentage <= 64) {
        message = "Although some of the population has been vaccinated against the virus, there enough vulnerable people to allow the vaccine to spread fairly wide. You should try increasing the vaccination rate or vaccine effectiveness.";
    } else if (percentage > 64) {
        message = "Not enough people in the population were vaccinated and the virus was about to spread very far. You should try increasing the vaccination rate or vaccine effectiveness.";
    } else {
        message = "Something went wrong";
    };

    return message;
}

//draws the graph and queues up the animations
function start(config) {
    //prevent users from pressing this sim button over and over again
    const startButton = document.getElementById("start-sim");
    startButton.innerHTML = "Sim in progress";
    startButton.disabled = true;

    //building the graph here
    var width = 500,
        height = 500;


    var svg = d3.select("#graph")
        .attr("width", width)
        .attr("height", height);
    //area resets
    //clear the svg area of text and image
    svg.selectAll("text").remove();
    svg.selectAll("image").remove();
    dataStore.resetDisplayElement(); //reset the infect counter

    svg.selectAll(".highlight").remove(); //delete the highlights
    dataStore.resetDistanceData();

    //reducing the percentages from the form into a decimals
    let nodes = initPopulationArray(POPULATION_SIZE, config.percentVaccinate * .01, config.vaccineEffect * .01);
    dataStore.setPopulationStats(nodes);
    donutChart.update(dataStore.getDataForDonut());

    var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function (d) {
            return d.radius * 1.5
        })) //temporary, until i have time to make is cleaner
        .on('tick', function () {
            var u = d3.select('#graph')
                .selectAll('circle')
                .data(nodes)

            u.enter()
                .append('circle')
                .attr('r', function (d) {
                    return d.radius;
                })
                .merge(u)
                .attr('cx', function (d) {
                    return d.x;
                })
                .attr('cy', function (d) {
                    return d.y;
                })
                .attr('fill', function (d, i) {
                    switch (d.status) {
                        case "immune":
                            return "green";
                            break;
                        case "unvaccinated":
                            return "black";
                            break;
                        case "vulnerable":
                            return "#F6E481";
                        default:
                            return "black";
                    }
                })
                .attr("id", function (d, i) {
                    return "group1_id_" + i;
                })
                .attr("class", "node")
            u.exit().remove()
        })
        .on('end', function () {
            var q = d3.queue();
            //enqueue 5 calls to the disease spread animation function
            for (let i = 0; i < 10; i++) {
                let handleLoadCompleteFactory = function (callback) {
                    setTimeout(function () {
                        handleLoadComplete(config);
                        callback(null);
                    }, i * 1000);
                }
                q.defer(handleLoadCompleteFactory);
            }
            //re-enable the sim button when the animation is done
            q.await(function (error) {
                startButton.innerHTML = "Simulate Again";
                startButton.disabled = false;

                //add a new sim to the total ran
                dataStore.incrementTotalSims();
                dataStore.insertResults();

                //insert a comment on the sim results
                const simComment = parseFloat(dataStore.getSimCalculations().percentOfPossible);
                const simCommentSelect = document.getElementById("sim-comment");
                simCommentSelect.innerHTML = commentOnSimResults(simComment);

                simCommentSelect.classList.remove("hidden");
                simCommentSelect.classList.add("visible");

                const distance = dataStore.getDistanceData();
                const overlay = svg.append("g").selectAll("circle").data(distance);

                overlay.enter().append("circle")
                    .attr("cx", function (d) {
                        return d.startNode.x;
                    })
                    .attr("cy", function (d) {
                        return d.startNode.y;
                    })
                    .attr("r", "7.5")
                    .attr("class", "highlight")
                    .attr("fill", "red")
                    .attr("stroke", "#8b0000")
                    .attr("opacity", "0.10")
                    .transition()
                    .attr("r", function (d) {
                        if (d.totalInfections === 0) {
                            return "7.5";
                        } else {
                            return d.distance;
                        }
                    });




                //handling hover over effects for the sim
                let divBox = d3.select("#sim-area").append("div")
                    .attr("class", "tooltip")
                    .style("display", "none");

                d3.selectAll(".highlight")
                    .on("mouseover", function (d, i) {
                        d3.select(this).attr("opacity", "0.50");
                        divBox.style("display", "inline")
                            .text("Number of People Infected \(\Excludes those already Infected\)\: " + d.totalInfections)
                            .style("left", (d3.event.pageX - 34) + "px")
                            .style("top", (d3.event.pageY - 12) + "px");

                    }).on("mouseout", function (d, i) {
                        divBox.style("display", "none");
                        d3.select(this).attr("opacity", "0.10");
                    });
            })
        });

}

//handle animation logic
function handleLoadComplete(config) {
    var svg = d3.select("#graph");
    const infectCounter = document.getElementById("infected-counter");

    //repeat the animation 10 times
    const movingDot = svg.append("circle")
        .datum([{
            x: "5",
            y: "5"
        }])
        .attr("id", "movingDot")
        .attr("fill", "red")
        .attr("r", 7.5)
        .attr("cx", d3.randomUniform(500))
        .attr("cy", "50");

    //interaction begins here
    //randomly pick a node, need to round to a integer
    const targetSelection = Math.floor(d3.randomUniform(POPULATION_SIZE)());
    const targettedNode = d3.select("#group1_id_" + targetSelection);
    //need to extract the datum in the selection
    const targettedNodeDatum = targettedNode.datum();
    //move the pointer towards the population

    movingDot.transition()
        .duration(250)
        .attr("cx", targettedNodeDatum.x)
        .attr("cy", targettedNodeDatum.y);

    if (targettedNodeDatum.status == "immune") {
        //if immune, just move the dot back and nothing else
        movingDot.transition()
            .delay(250)
            .duration(5000)
            .attr("cx", "0")
            .attr("cy", "0");
    } else if (!targettedNodeDatum.status != "immune") {
        //if the node isn't immune, calculate how to spread the infection
        var AllNodesSelection = svg.selectAll(".node");

        //sorting the nodes by their distance from the selected one (ascending)
        var sortedNodes = AllNodesSelection.sort(function (a, b) {
            return d3.ascending(distance(targettedNodeDatum, a), distance(targettedNodeDatum, b));
        }).data();

        const spreadDistance = calcuateSpread(sortedNodes, config.rZero);
        // const spreadDistance = spread(0, sortedNodes, POPULATION_SIZE, +config.rZero, 1);
        //if spread distance exceeds the size of the population, the interations  for the animation
        //such just run on the population size, rather than the spread
        // const interations = spreadDistance > POPULATION_SIZE ? POPULATION_SIZE: spreadDistance;
        // dataStore.setDistance(targettedNodeDatum, distance(targettedNodeDatum, sortedNodes[spreadDistance]));
        let infectionCounter = 0;
        let furthestNode = targettedNodeDatum; //initially set the deepest infection equal to the current section

        for (let i = 0; i < spreadDistance; i++) {
            const element = sortedNodes[i];
            const infectCheck = d3.select("#group1_id_" + element.id).classed("checked");
            const currentNode = d3.select("#group1_id_" + element.id);
            currentNode.transition()
                .delay(35 * i) //distance between transitions
                .attr("fill", function (d) {
                    //if the node is immune, don't change colors
                    if (d.status == "immune") {
                        return "green";
                    } else {
                        //add to the infect counter if it's a new infection
                        if (!infectCheck) {
                            //update infections
                            //record this infection to the data store
                            dataStore.incrementDisplayElement();
                            dataStore.updateLiveStats(currentNode.datum());
                            infectionCounter++;
                            furthestNode = currentNode.datum();
                        }
                        return "red";
                    }
                })
            //adds a checked class to the element to prevent double incrementing
            const selected = d3.select("#group1_id_" + element.id).classed("checked", true);
        }
        donutChart.update(dataStore.getDataForDonut());
        dataStore.setDistance(targettedNodeDatum, distance(targettedNodeDatum, furthestNode), infectionCounter);
    }
}


function main() {
    document.getElementById('sim-area').scrollIntoView({
        behavior: "smooth"
    }); //scroll the user into the sim area on click
    let formSelectCollection = document.querySelectorAll("#config input");
    //turn this into a reusable array of objects
    let config = {};
    for (let i = 0; i < formSelectCollection.length; i++) {
        const element = formSelectCollection[i];
        config[element.name] = element.value;
    }

    //insert sim configuration into the data store for later use
    dataStore.setConfig(config);
    //if all checks go well, start animations!
    start(config);
}
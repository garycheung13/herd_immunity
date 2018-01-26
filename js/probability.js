const predictPrecentage = (function () {
    //calculate number of possible targets
    function avgSample(sampleSize, possible, total) {
        var numOfObjects = sampleSize * (possible / total);
        return Math.ceil(numOfObjects);
    }

    function calculateSplits(population, vaccinatedPercent, effectiveness) {
        var immune = Math.floor(population * vaccinatedPercent * effectiveness);
        var possible = population - immune;

        return {
            immune: immune,
            possible: possible
        };
    }

    function calculateIntervals(population, effectiveness) {
        const INTERVALS = [0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1];
        const vulnerableIntervals = [];
        for (let i = 0; i < INTERVALS.length; i++) {
            vulnerableIntervals.push(calculateSplits(population, INTERVALS[i], effectiveness));
        }

        return vulnerableIntervals;
    }

    //calculates the average number of successful connections the sim will have
    function calcAverageContactSuccess(intervals) {
        let avgSuccessList = [];
        const CYCLES = 10; //sample size
        for (let i = 0; i < intervals.length; i++) {
            avgSuccessList.push(avgSample(CYCLES, intervals[i].possible, 250));
        }

        return avgSuccessList;
    }

    function calcTrialAverage(rZero, possible, population) {
        const rzeroSampleSize = rZero;
        let remainingPossible = possible; //need to iterate through this
        let remainingPopulation = population;
        //stores the total number of nodes removed by cycle
        let runningTotal = 0;
        //add one to total sample so loop includes it will running probability calcs
        let totalSamples = avgSample(rzeroSampleSize, remainingPossible, remainingPopulation) + 1;

        for (let j = 0; j < totalSamples; j++) {
            let outcome = avgSample(rzeroSampleSize, remainingPossible, remainingPopulation);
            remainingPopulation -= outcome;
            remainingPossible -= outcome;
            runningTotal += outcome;
        }

        return runningTotal;
    }
    // function calcTrialAverage(rZero, possible, population, total, newCases, k = 0) {
    //     let averageCases = avgSample(rZero, possible, population);
    //     let remainingPossible = possible - averageCases;
    //     let remainingPopulation = population - averageCases;
    //     let newInfections = averageCases * rZero;
    //     let runningTotal = total + newCases;
    //     if ((newInfections <= 0 || runningTotal >= POPULATION_SIZE) || k < 4) {
    //         return runningTotal;
    //     } else {
    //         k += 1;
    //         return calcTrialAverage(rZero, remainingPossible, remainingPopulation, runningTotal, newInfections, k);
    //     }
    // }

    //calculate the all infected over one run
    function calculateRunTotal(rzero, connections, possible, population) {
        const rzeroSampleSize = rzero;
        let remainingPopulation = population;
        let remainingPossible = possible;
        let runningTotal = 0;

        for (let i = 0; i < connections; i++) {
            // let trialTotal = calcTrialAverage(rzero, remainingPossible, remainingPopulation, 0, 1);
            let trialTotal = calcTrialAverage(rzero, remainingPossible, remainingPopulation);
            remainingPossible -= trialTotal;
            remainingPopulation -= trialTotal;
            runningTotal += trialTotal;
        }

        if (isNaN(runningTotal) || runningTotal > population) {
            return population / population;
        } else {
            return runningTotal / population;
        }
    }
    /**
     * generates a dataset predicting the average number of infections over the course of
     * 10 attempts based on average per run. Data is generated on 10% intervals, from 0 to 1.00
     *
     * @param {Number} rzero number between 1 and 20 standing for the basic reproductive rate of a virus
     * @param {Number} effectiveness percentage between 0.00 and 1.00
     * @param {Number} population number representing the total population
     * @returns {Arrray} returns a dataset predicting infection percentage at different vaccination rates
     */
    function calculateDataset(rzero, effectiveness, population) {
        let data = [];
        let intervals = calculateIntervals(population, effectiveness);
        //for each split
        for (let i = 0; i < intervals.length; i++) {
            let possible = intervals[i].possible;
            let avgConnections = avgSample(10, possible, population);
            data.push({percentInterval: i * 10, probability: calculateRunTotal(rzero, avgConnections, possible, population) });
        }
        return data;
    }

    return {
        generateData: calculateDataset
    }
})();
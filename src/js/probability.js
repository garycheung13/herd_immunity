import { INTERVAL_SET, POPULATION_SIZE, CYCLES } from './constants';

export function generateDataSet(sampleSize, vaccEffect=1) {
  return INTERVAL_SET.map(function(percentVacc){
    // const maxPossible = Math.round(POPULATION_SIZE - (POPULATION_SIZE * vaccEffect * percentVacc));
    const maxPossible = POPULATION_SIZE - (POPULATION_SIZE * vaccEffect * percentVacc);
    // add one for initial selection
    const ev = Math.round(sampleSize * (maxPossible/POPULATION_SIZE) + 1);

    // running counters
    let total = 0;
    let currentPossible = maxPossible;
    let currentPopulation = POPULATION_SIZE;
    let expectedInfections = Math.round(CYCLES * (maxPossible/POPULATION_SIZE));

    for (let i=0; i < ev * expectedInfections; i++) {
      // dont bother looping once population is all infected
      if (total >= maxPossible) break;

      const outcome = sampleSize * (currentPossible/currentPopulation);
      total += outcome;
      currentPossible -= outcome;
      currentPopulation -= outcome;
    }

    return {
      interval: percentVacc,
      percentInfected: (total >= maxPossible) ? maxPossible/POPULATION_SIZE : total/POPULATION_SIZE
    };
  });
}
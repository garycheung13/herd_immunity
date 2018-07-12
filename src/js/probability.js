import { INTERVAL_SET } from './constants';
import { sigma } from './utils';

export function generateDataSet(sampleSize, population, cycles, vaccEffect=1) {
	return INTERVAL_SET.map(function(percentVacc) {
        // save the max infection size since some vaccination rates will use it
        const maxPossible = Math.round(population - (population * vaccEffect * percentVacc));
        let total = 0;
        let runningPossible = maxPossible;
        let runningPopulation = population;

        // don't bother with looping if there are no targets
        if (maxPossible === 0) {
          return {
            interval: percentVacc,
            percentInfected: (total >= maxPossible) ? maxPossible/population : total/population
          };
        }

        // calcuate the expected value of the infection spread over multiple infection cycles
        for (let i=0; i < cycles; i++) {
          const expectedValue = Math.round(sampleSize * (runningPossible/population));
          // dont bother with further loopinng if max infection is achieved
          // this happens when previous loop results in negative remaining population (leading to negative ev)
          // or total is greater than population
          if (expectedValue <= 0 || total >= population) {
            break;
          }
          // sum of desired/total * samplesize is the ev of the total spread
          const summation = sigma(expectedValue + 1, function(d){
            return (runningPossible - d * expectedValue)/(runningPopulation - d * expectedValue);
          }) * sampleSize;

          // update running counts
          total += summation;
          runningPossible -= summation;
          runningPopulation -= summation;
        }
        return {
          interval: percentVacc,
          percentInfected: (total >= maxPossible) ? maxPossible/population : total/population
        };
        });
  }
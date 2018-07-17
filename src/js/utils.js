import { shuffle, range } from 'd3-array';
import * as constants from './constants';


/**
 * Calculates the euclidean distance between to points
 * @param {Object} a: object with x and y properties
 * @param {Object} b: object with x and y properties
 * @returns {number}: the distance between the two points
 */
export function distance(a, b) {
    return Math.sqrt(((b.x - a.x) ** 2 + (b.y - a.y) ** 2));
}


/**
 * Calcuate the threshold needed to reach herd immunity threshold.
 * Vaccine effectiveness is optional and defaults to 1.00 (100%)
 * @param {number} rZero: The basic reproductive number of the disease. Any number.
 * @param {number} [vaccEffect=1.00]: Effectiveness of the vaccination.
 * If not specified, it defaults to 1.00. Any number between 0.00 and 1.00
 * @returns {number} threshold percentage for herd immunity as as floating point
 */
export function herdImmunity(rZero, vaccEffect=1.00) {
    return (1 - (1 / rZero))/vaccEffect;
}

/**
 * Calculates average number of desired items in a sample of a population
 * @param {number} sampleSize: Number of of items taken in a sample
 * @param {number} targetSize: How many desired items in the sampe
 * @param {number} populationSize: Total size of the population
 * @returns {number}: Average number of desired items
 */
export function expectedValue(sampleSize, targetSize, populationSize) {
    return Math.ceil(sampleSize * (targetSize/populationSize));
}


/**
 * Promise wrapper around the setTimeout function
 * @param {number} duration: duration to wait in milliseconds
 * @param {function} callback: function to call after delay
 * @returns {Promise}: pending promise object. chainable.
*/
export function delay(duration, callback) {
    const args = Array.prototype.slice.call(arguments, 2);

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(callback.apply(null, args));
      }, duration);
    });
}


/**
 * Generates the splits needed to calculate herd objects
 * @param {number} populationSize: total population sizze
 * @param {number} percentVaccinated: percentage vaccinated as a floating point
 * @param {number} vaccEffect: effectiveness of the vaccine as a percentage in a float
 * @return {Object} Returns the population splits as on object with segments as object properties
 */
export function calculateSplits(populationSize, percentVaccinated, vaccEffect) {
  const unvaccinatedPop = Math.round(populationSize - (percentVaccinated * populationSize));
  const vaccinatedPop = Math.round((populationSize - unvaccinatedPop) * vaccEffect);
  const unprotectedPop = populationSize - unvaccinatedPop - vaccinatedPop;

  return {
    unvaccinated: unvaccinatedPop,
    vaccinated: vaccinatedPop,
    unprotected: unprotectedPop
  }
}


/**
 * Generates the population objects used for the simulation with necessary properties
 * @param {number} populationSize: total population sizze
 * @param {number} percentVaccinated: percentage vaccinated as a floating point
 * @param {number} vaccEffect: effectiveness of the vaccine as a percentage in a float
 * @return {Array} a randomized array of objects representing the population based on the parameters given
 */
export function initHerd(populationSize, percentVaccinated, vaccEffect) {
  // calculate the proportions of the population segements
  const unvaccinatedPop = Math.round(populationSize - (percentVaccinated * populationSize));
  const vaccinatedPop = Math.round((populationSize - unvaccinatedPop) * vaccEffect);
  const unprotectedPop = populationSize - unvaccinatedPop - vaccinatedPop;

  const populationObjects = range(populationSize).map(function(node, i){
    if (i < unvaccinatedPop) {
      return {
        isInfectable: true,
        status: "unvaccinated",
        color: constants.UNVACCINATED_COLOR

      }
    } else if (i >= unvaccinatedPop && i < (populationSize - unprotectedPop)) {
      return {
        isInfectable: false,
        status: "vaccinated",
        color: constants.VACCINATED_COLOR
      }
    } else {
      return {
        isInfectable: true,
        status: "unprotected",
        color: constants.UNPROTECTED_COLOR
      }
    }
  })

  return shuffle(populationObjects);
}
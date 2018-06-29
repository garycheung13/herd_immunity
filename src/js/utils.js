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
export function averageSample(sampleSize, targetSize, populationSize) {
    return Math.ceil(sampleSize * (targetSize/populationSize));
}
//// functions

// define type pair
type Pair = [number, number];

// function for checking two blocks are overlapping
export const isTooClose = (
    firstBlock: Pair,
    secondBlock: Pair,
    width: number,
    height: number
): boolean => {
    const dx = Math.abs(firstBlock[0] - secondBlock[0]);
    const dy = Math.abs(firstBlock[1] - secondBlock[1]);
    return dx < width && dy < height;
};

// func for generating random number in a given min max range
export const getRandomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

// func for attempting to generate n non-overlapping blocks
// at random positions on screen

export const generateFilteredRandomArray = (
    //number of blocks to attempt to generate
    n: number,
    // canvas properties
    canvasWidth: number,
    canvasHeight: number,
    // block properties
    height: number,
    width: number,
    // number of times we try to generate set of blocks (to avoid potentially infinite loop)
    maxAttempts = 1000000
): Pair[] => {
    const result: Pair[] = [];

    let attempts = 0;
    while (result.length < n && attempts < maxAttempts) {
        // generate potential block coord
        const candidate: Pair = [
            getRandomInRange(width, canvasWidth - width),
            getRandomInRange(0, 0.75 * canvasHeight),
        ];

        // check for overlap before pushing
        const isValid = result.every(
            (existing) => !isTooClose(candidate, existing, width, height)
        );

        if (isValid) {
            result.push(candidate);
        }

        attempts++;
    }
    // check to see if fewer than n blocks made
    if (result.length < n) {
        throw new Error(
            `Could not generate ${n} sufficiently distinct points after ${maxAttempts} attempts.`
        );
    }

    return result;
};

// function to determine ball speed depending on screen size
// increasing screen size, increase ball speed to make game more lively
export const ballSpeedUpdater = (canvasHeight: number): number => {
    if (canvasHeight < 700) {
        return 6;
    } else if (canvasHeight < 900) {
        return 7;
    } else if (canvasHeight < 1100) {
        return 9;
    } else {
        return 10;
    }
};

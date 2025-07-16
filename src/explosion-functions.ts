// func to determine distances between any two blocks
// to use in explosion case, to see whether blocks should be removed due to explosion
export const blockCentreDistance = (block1: Block, block2: Block): number => {
    return Math.sqrt((block1.x - block2.x) ** 2 + (block1.y - block2.y) ** 2);
};

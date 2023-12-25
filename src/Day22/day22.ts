import {readFileToLines, letterSequence} from "../utils";

let blocks:Map<string, number[][]> = new Map<string,number[][]>();
let occupied:Map<string, string> = new Map<string,string>();
let supporting:Map<string, Set<string>> = new Map<string, Set<string>>()
let supportedByCounter: Map<string, Set<string>> = new Map<string, Set<string>>

function applyGravityToBlock(fallingBlock: number[][], name: string): number[][] {
    // if it can fall we want to set the z position for each of the cubes to be 1 less
    let fallenBlock: number[][] = []
    fallingBlock.forEach(cube => {
        let [x, y, z] = cube
        // change the z position for each of the cubes in the occupied map
        occupied.delete(String(cube))
        occupied.set(String([x, y, z - 1]), name)
        fallenBlock.push([x, y, z - 1])
    })
    // remove this line from the original cubes line
    blocks.delete(name)
    return fallenBlock
}

function isBlockSupported(fallingBlock: number[][], name: string) {
    let isBlockSupported = false
    fallingBlock.forEach(cube => {
        let [x, y, z] = cube
        if (z == 0) {
            isBlockSupported = true
        }
        if (occupied.has(String([x, y, z - 1])) && (occupied.get(String([x, y, z - 1])) != name)) {
            isBlockSupported = true
        }
    })
    return isBlockSupported;
}

function main() {
    const lines = readFileToLines("src/Day22/input.txt")
    const sequence = letterSequence();
    lines.forEach(line => {
        let lineInBlocks = lineToBlocks(line)
        let lineName = sequence.next().value!
        lineInBlocks.forEach(block => {
            occupied.set(String(block), lineName)
        })
        blocks.set(lineName, lineInBlocks)
    })

    let currentLevel = 1;
    let fallingBlocks:Map<string, number[][]> = new Map<string,number[][]>();

    while(blocks.size > 0) {
        // check the current level and if there are any blocks then settle them
        blocks.forEach((cubes, name) => {
            let falling = false;
            cubes.forEach(cube => {
                let [x,y,z] = cube
                if (z == currentLevel) {
                    // this block is on the current level
                    falling = true
                }
            })
            if (falling) {
                fallingBlocks.set(name, cubes)
            }
        })
        currentLevel++

        // for each of the falling blocks, check if all the blocks below are empty until we reach the bottom
        fallingBlocks.forEach((fallingBlock, name) => {
            supporting.set(name, new Set())
            while(!isBlockSupported(fallingBlock, name)) {
                fallingBlock = applyGravityToBlock(fallingBlock, name);
            }
        })
        fallingBlocks.clear()

    }

    // find which bricks are supporting
    // check each occupied position, if the position above it has is occupied and isnt the same name then its supporting that block
    occupied.forEach((name, cube) => {
        let [x,y,z] = cube.split(",").map(Number)
        if (occupied.has(String([x,y,z+1])) && (occupied.get(String([x, y, z + 1])) != name)) {
            let supportedBlock = occupied.get(String([x, y, z + 1]))!
            let supportingBlocks = supporting.get(name) ?? new Set()
            if (!supportingBlocks.has(supportedBlock)) {
                supportingBlocks.add(supportedBlock)
                supporting.set(name, supportingBlocks)

                let supportedBy = supportedByCounter.get(supportedBlock) ?? new Set()
                supportedBy.add(name)
                supportedByCounter.set(supportedBlock, supportedBy)
            }
        }
    })

    // count if the block can be deleted
    let disintegratableCount = 0;
    supporting.forEach(sups => {
        if (sups.size == 0) {
            disintegratableCount++
        }
        else {
            let canBeDisintegrated = true
            sups.forEach(sb => {
                // if this is the not the only occurrence
                if (supportedByCounter.get(sb)!.size == 1) {
                    canBeDisintegrated = false
                    // need to count how many bricks would fall if this one falls
                    supporting.get(sb) // recursive call here
                }
            })
            if (canBeDisintegrated) {
                disintegratableCount++
            }

        }
    })

    let wouldFall = 0
    supporting.forEach((supporting, name) => {
        wouldFall += howManyBricksWillFall(name, [name]).length - 1
    })
    console.log(disintegratableCount)
    console.log(wouldFall)
}

function howManyBricksWillFall(brick: string, falling:string[]): string[] {
    let bricksSupporting = supporting.get(brick)!
    if (bricksSupporting.size == 0) {
        return falling;
    }
    bricksSupporting.forEach(sb => {
        // how to check that if both supporting bricks fall then the above falls too
        let s = supportedByCounter.get(sb)!
        if (Array.from(s).every(s => falling.includes(s))) {
            falling.push(sb)
            falling.concat(howManyBricksWillFall(sb, falling))
        }
    })
    return falling
}

function lineToBlocks(line:string): number[][] {
    let blocks: number[][] = []
    let [from, to] = line.split("~")
    let [fx, fy, fz] = from.split(",").map(Number)
    let [tx, ty, tz] = to.split(",").map(Number)
    let [lx,ly,lz,sx,sy,sz] = [0,0,0,0,0,0]
    if ((fx - tx >= 0) && (fy - ty >= 0) && (fz - tz >= 0)) {
        [lx,ly,lz,sx,sy,sz] = [fx,fy,fz,tx,ty,tz]
    } else {
        [lx,ly,lz,sx,sy,sz] = [tx,ty,tz,fx,fy,fz]
    }
    if ((lx == sx) && (ly == sy) && (lz == sz)) {
        blocks.push([lx, ly, lz])
    }
    if (lx != sx) {
        for (let x = 0; x <= lx - sx; x++) {
            blocks.push([sx + x, sy, sz])
        }
    }
    if (ly != sy) {
        for (let y = 0; y <= ly-sy; y++) {
            blocks.push([sx, sy + y, sz])
        }
    }
    if (lz != sz) {
        for (let z = 0; z <= lz-sz; z++) {
            blocks.push([sx, sy, sz + z])
        }
    }
    return blocks
}


main();
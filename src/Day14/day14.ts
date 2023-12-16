import {printMap, readFileToLines} from "../utils";

const repeats: Map<string, number> = new Map<string, number>
const cache: string[][][] = []

function main() {
    const lines = readFileToLines("src/Day14/input.txt")
    let map: string[][] = [];
    lines.forEach(line => map.push(line.split("")))

    // find where the cycle loops
    let sequenceStart = 0;
    let sequenceLength = 0;
    let rounds = 1000000000

    const cycledMap: string[][] = map.map(row => [...row]);
    cache.push(cycledMap)

    for (let i=0; i<rounds; i++) {
        map = cycle(map)
        console.log(i, calculateWeight(map))
        const cycledMap: string[][] = map.map(row => [...row]);
        cache.push(cycledMap)
        let stringify = JSON.stringify(cycledMap)

        if (repeats.has(stringify)) {
            if (sequenceStart == 0) {
                sequenceStart = repeats.get(stringify)!
                sequenceLength = i - sequenceStart
                console.log(sequenceStart, sequenceLength)
            break;
            }
        } else {
            repeats.set(JSON.stringify(cycledMap), i)
        }
    }

    let final = ((rounds-sequenceStart) % sequenceLength) + sequenceStart
    console.log("final: " + final)
    map = cache[final]

    //printMap(map)
    let weight = calculateWeight(map)
    console.log(weight)
}

function cycle(map: string[][]) {
    for (let i=0; i<map.length; i++) {
        map = shiftNorth(map)
    }
    for (let i=0; i<map.length; i++) {
        map = shiftWest(map)
    }
    for (let i=0; i<map.length; i++) {
        map = shiftSouth(map)
    }
    for (let i=0; i<map.length; i++) {
        map = shiftEast(map)
    }
    return map
}

function shiftNorth(map: string[][]) {
    for (let r= 1; r < map.length; r++) {
        for (let c=0; c<map[r].length; c++) {
            if (map[r][c] == "O") {
                if (map[r-1][c] == ".") {
                    map[r-1][c] = "O";
                    map[r][c] = ".";
                }
            }
        }
    }
    return map
}

function shiftSouth(map: string[][]) {
    for (let r=map.length-2 ; r >= 0; r--) {
        for (let c=0; c<map[r].length; c++) {
            if (map[r][c] == "O") {
                if (map[r+1][c] == ".") {
                    map[r+1][c] = "O";
                    map[r][c] = ".";
                }
            }
        }
    }
    return map
}

function shiftEast(map: string[][]) {
    for (let r=0; r<map[0].length; r++) {
        for (let c=map[0].length-2 ; c >= 0; c--) {
            if (map[r][c] == "O") {
                if (map[r][c+1] == ".") {
                    map[r][c+1] = "O";
                    map[r][c] = ".";
                }
            }
        }
    }
    return map
}

function shiftWest(map: string[][]) {
    for (let r=0; r<map[0].length; r++) {
        for (let c=0 ; c < map[0].length; c++) {
            if (map[r][c] == "O") {
                if (map[r][c-1] == ".") {
                    map[r][c-1] = "O";
                    map[r][c] = ".";
                }
            }
        }
    }
    return map
}

function calculateWeight(map: string[][]): number {
    let length = map.length
    let weight = 0;
    for (let r = 0; r<length; r++) {
        weight += map[r].filter(v => v == "O").length * (length -r)
    }
    return weight;
}

main();
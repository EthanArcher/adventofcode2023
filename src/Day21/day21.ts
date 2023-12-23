import {printMap, readFileToLines} from "../utils";

let start: number[] = []
let rocks: string[] = []
let potentialPositions: Set<string> = new Set()
let maxRow: number = 0
let maxCol: number = 0
let mapsToPositions: Map<string, Set<string>> = new Map<string, Set<string>>()

function main() {
    const lines = readFileToLines("src/Day21/input.txt")
    lines.forEach((line, row) => {
        line.split("").forEach((v, col) => {
            if (v == "S") {
                start = [row, col]
            } if (v == "#") {
                rocks.push(String([row, col]))
            }
        })
    })

    maxRow = lines.length - 1
    maxCol = lines[0].length - 1

    potentialPositions.add(String(start))
    mapsToPositions.set(String([0,0]), potentialPositions)

    // run this section to create a 5x5 grid
    // this will give us all the possible map combinations
    let required = 327
    for (let steps = 0; steps<required; steps++) {
        console.log(steps)
        const currentMapToPositions: Map<string, Set<string>> = new Map<string, Set<string>>()
        mapsToPositions.forEach((value, key) => {
            currentMapToPositions.set(key, new Set(value))
        })

        currentMapToPositions.forEach((map, name) => {
            let currentPotentialPositions = new Set(map)
            currentPotentialPositions.forEach(pp => {
                move(pp, name)
            })
        })
    }

    let total = 0
    mapsToPositions.forEach((map, name) => {
        total += map.size
        console.log("map " + name + ", size: " + map.size)
    })
    console.log(total)

    /*******************
        26501365 steps
        grid is 131 x 131
        65 steps to black edge
        then 26501300 remains
        => n = 202,300 complete squares in each direction
     *******************/

    let stepRemaining = 26501365
    let n = (stepRemaining - (maxRow / 2)) / (maxRow + 1)
    let possiblePositions =
        (mapsToPositions.get(String([0,0]))!.size * ((n-1) ** 2)) +
        (mapsToPositions.get(String([1,0]))!.size * ((n) ** 2)) +
        (mapsToPositions.get(String([0,2]))!.size) +
        (mapsToPositions.get(String([0,-2]))!.size) +
        (mapsToPositions.get(String([2,0]))!.size) +
        (mapsToPositions.get(String([-2,0]))!.size) +
        (mapsToPositions.get(String([1,2]))!.size * n) +
        (mapsToPositions.get(String([1,-2]))!.size * n) +
        (mapsToPositions.get(String([-1,2]))!.size * n) +
        (mapsToPositions.get(String([-1,-2]))!.size * n) +
        (mapsToPositions.get(String([1,1]))!.size * (n-1)) +
        (mapsToPositions.get(String([1,-1]))!.size * (n-1)) +
        (mapsToPositions.get(String([-1,1]))!.size * (n-1)) +
        (mapsToPositions.get(String([-1,-1]))!.size * (n-1))
    console.log(possiblePositions)

}

function addPotentialPosition(row: number, column: number, mapRow: number, mapColumn:number) {
    if (!rocks.includes(String([row, column]))) {
        let mtp: Set<string> = mapsToPositions.get(String([mapRow, mapColumn])) ?? new Set()
        mtp.add(String([row, column]))
        mapsToPositions.set(String([mapRow, mapColumn]), mtp)
    }
}

function move(position: string, mapLocation: string) {
    let [row, column] = position.split(",").map(Number)
    let [mapRow, mapCol] = mapLocation.split(",").map(Number)

    // north
    if (row - 1 >= 0) {
        addPotentialPosition(row - 1, column, mapRow, mapCol);
    } else {
        addPotentialPosition(maxRow, column, mapRow - 1, mapCol);
    }
    // south
    if (row + 1 <= maxRow) {
        addPotentialPosition(row + 1, column, mapRow, mapCol);
    } else {
        addPotentialPosition(0, column, mapRow + 1, mapCol);
    }
    // west
    if (column - 1 >= 0) {
        addPotentialPosition(row, column - 1, mapRow, mapCol);
    } else {
        addPotentialPosition(row, maxCol, mapRow, mapCol - 1);
    }
    // east
    if (column + 1 <= maxCol) {
        addPotentialPosition(row, column + 1, mapRow, mapCol);
    } else {
        addPotentialPosition(row, 0, mapRow, mapCol + 1);
    }

    let mtp: Set<string> = mapsToPositions.get(mapLocation)!
    mtp.delete(position)
    mapsToPositions.set(mapLocation, mtp)
}

main();
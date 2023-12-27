import {printMap, readFileToLines} from "../utils";

const directionMap = new Map<string, number[]>();
directionMap.set("U", [-1,0]);
directionMap.set("D", [1,0]);
directionMap.set("L", [0,-1]);
directionMap.set("R", [0,1]);

let maxRow = 0;
let maxCol = 0;
let finalPosition: number[] = []
let startingPosition: number[] = []
let maxPathLength:number = 0
let map:string[][] = []
let graph:Map<string, Map<string, number>> = new Map<string, Map<string, number>>()

function main() {
    const lines = readFileToLines("src/Day23/input.txt")
    lines.forEach(line => {
        map.push(line.split(""))
    })

    maxRow = lines.length - 1
    maxCol = lines[0].length - 1
    startingPosition = [0, lines[0].indexOf(".")]
    finalPosition = [maxRow, lines[maxRow].indexOf(".")]

    // want to build a weighted graph to reduce the searching
    graph.set(String(startingPosition), new Map<string, number>())

    // add all the nodes without connections
    for (let r=0; r<maxRow; r++) {
        for (let c = 0; c < maxCol; c++) {
            if (isNode([r,c])) {
                graph.set(String([r,c]), new Map<string, number>())
            }
        }
    }

    // add the final node
    graph.set(String(finalPosition), new Map<string, number>())

    let snowShoesOn = false
    // for each of the nodes in the graph find its connections
    graph.forEach((connections, pos) => {
        getConnectedNodesWithWeights(pos, snowShoesOn)
    })

    dfs(startingPosition, new Set(), 0)
    console.log("Part 1: " + maxPathLength)

    // Part 2
    snowShoesOn = true
    // for each of the nodes in the graph find its connections
    graph.forEach((connections, pos) => {
        getConnectedNodesWithWeights(pos, snowShoesOn)
    })

    dfs(startingPosition, new Set(), 0)
    console.log("Part 2: " + maxPathLength)

}

function dfs(position: number[], vis: Set<string>, currentWeight: number) {
    let visited = new Set(vis)
    visited.add(String(position))

    if (position[0] == finalPosition[0] && position[1] == finalPosition[1]) {
        maxPathLength = Math.max(maxPathLength, currentWeight)
    } else {
        let connections: Map<string, number> = graph.get(String(position))!
        connections.forEach((weight, con) => {
            if (!visited.has(con)) {
                dfs(con.split(",").map(Number), visited, currentWeight + weight)
            }
        })
    }
}

function getConnectedNodesWithWeights(position: string, hasSnowShoesOn: boolean) {
    let visited: string[] = []
    visited.push(String(position))
    transverse(position.split(",").map(Number), visited, position, hasSnowShoesOn)
}

function transverse(position:number[], vis:string[], startingPosition: string, hasSnowShoesOn: boolean) {

    let [cx, cy] = position
    directionMap.forEach((dir, name) => {
        let [x,y] = dir
        let nx = cx + x;
        let ny = cy + y;

        let visited = [...vis]

        if ((nx >= 0) && (nx <= maxRow) && (ny >= 0) && (ny <= maxCol) &&
            (!visited.includes(String([nx, ny]))) &&
            map[nx][ny] != "#" &&
            canGoDownSlope(name, map[nx][ny], hasSnowShoesOn)
        ) {
            if (graph.has(String([nx,ny]))) {
                let connections = graph.get(startingPosition)!
                connections.set(String([nx,ny]), visited.length)
                graph.set(String(startingPosition), connections)
            } else {
                visited.push(String([nx, ny]))
                transverse([nx,ny], [...visited], startingPosition, hasSnowShoesOn)
            }
        }
    })
}

function isNode(position: number[]) {
    let [r,c] = position
    let connection = 0;
    directionMap.forEach((dir, name) => {
        let [x, y] = dir
        let nx = r + x;
        let ny = c + y;

        if ((nx >= 0) && (nx <= maxRow) && (ny >= 0) && (ny <= maxCol) && map[nx][ny] != "#" && map[r][c] != "#") {
            connection++
        }
    })
    return connection > 2
}

function canGoDownSlope(direction: string, slope: string, hasSnowShoesOn: boolean): boolean {

    if (hasSnowShoesOn) return true;

    if (slope == ".") {
        return true
    }
    if (direction == "R") {
        return slope == ">"
    } else if (direction == "D") {
        return slope == "v"
    } else if (direction == "U") {
        return slope == "^"
    } else if (direction == "L") {
        return slope == "<"
    }
    return false;
}

main();
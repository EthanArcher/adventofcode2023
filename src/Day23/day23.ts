import {printMap, readFileToLines} from "../utils";
import {MaxPriorityQueue} from '@datastructures-js/priority-queue';

interface positionAndVisited {
    position: string,
    visited: string[]
}

const directionMap = new Map<string, number[]>();
directionMap.set("U", [-1,0]);
directionMap.set("D", [1,0]);
directionMap.set("L", [0,-1]);
directionMap.set("R", [0,1]);

let maxRow = 0;
let maxCol = 0;
let finalPosition: number[] = []
let startingPosition: number[] = []
let pathLengths: number[] = []
let map:string[][] = []

function main() {
    const lines = readFileToLines("src/Day23/input.txt")
    lines.forEach(line => {
        map.push(line.split(""))
    })

    maxRow = lines.length - 1
    maxCol = lines[0].length - 1
    startingPosition = [0, lines[0].indexOf(".")]
    finalPosition = [maxRow, lines[maxRow].indexOf(".")]

    printMap(map)
    console.log(startingPosition)
    
    let pathsToTransverse:positionAndVisited[] = []
    pathsToTransverse.push({position: String(startingPosition), visited:[]})

    while (pathsToTransverse.length > 0) {
        let newPaths: positionAndVisited[] = []
        pathsToTransverse.forEach(pav => {
            newPaths = newPaths.concat(move(pav.position.split(",").map(Number), pav.visited))
        })
        pathsToTransverse = [...newPaths]
        console.log(pathsToTransverse.length)
        // pathsToTransverse = filterPaths(pathsToTransverse)
    }

    console.log(pathLengths)
    console.log(Math.max(...pathLengths))

}

function filterPaths(paths: positionAndVisited[]) {
    let c_paths = [...paths]
    paths.forEach((pav) => {
        let currentPosition = pav.position
        c_paths = c_paths.filter(p => !p.visited.includes(currentPosition))
    })
    return c_paths
}

function move(position: number[], visited:string[]): positionAndVisited[] {

    let n_pavs:positionAndVisited[] = []

    if (position[0] == finalPosition[0] && position[1] == finalPosition[1]) {
        pathLengths.push(visited.length)
        return []
    }

    visited.push(String(position))
    let [cx, cy] = position
    directionMap.forEach((dir, name) => {
        let [x,y] = dir
        let nx = cx + x;
        let ny = cy + y;

        if ((nx >= 0) && (nx <= maxRow) && (ny >= 0) && (ny <= maxCol) &&
            (!visited.includes(String([nx, ny]))) &&
            map[nx][ny] != "#" &&
            (map[nx][ny] == "." || canGoDownSlope(name, map[nx][ny]))
        ) {
            n_pavs.push({position: String([nx, ny]), visited: [...visited]})
        }
    })
    
    return n_pavs

}

function canGoDownSlope(direction: string, slope: string): boolean {

    // return true

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
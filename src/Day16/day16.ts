import {printMap, readFileToLines} from "../utils";

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

interface positionAndDirection {
    position: number[],
    direction: Direction
}

let mirrorTracker:Map<string, Direction[]> =
    new Map([
        ["/", [Direction.Right, Direction.Left, Direction.Down, Direction.Up]],
        ['\\', [Direction.Left, Direction.Right, Direction.Up, Direction.Down]]
    ]);

let previousBeams: string[] = []

function countVisitedFromStartingPoint(map: string[][], beam:positionAndDirection): number {
    let beams: positionAndDirection[] = [{position:beam.position, direction:beam.direction}]
    let visitedMap: string[][] = []
    map.forEach(r => {
        let newRow: string[] = []
        r.forEach(c => newRow.push("."))
        visitedMap.push(newRow)
    })

    while (beams.length > 0) {
        let movedBeams: positionAndDirection[] = []
        beams.forEach(beam => {
            movedBeams = movedBeams.concat(move(map, visitedMap, beam))
        })
        beams = movedBeams
    }
    previousBeams = []
    return countVisited(visitedMap);
}

function main() {
    const lines = readFileToLines("src/Day16/input.txt")
    let map: string[][] = [];
    lines.forEach(line => map.push(line.split("")))

    let visitedTotal = countVisitedFromStartingPoint(map, {position:[0,-1], direction:Direction.Right})
    console.log(visitedTotal)

    // check each entry point
    let max = 0;
    for (let r=0; r<map.length; r++) {
        max = Math.max(max, countVisitedFromStartingPoint(map, {position:[r,-1], direction:Direction.Right}));
        max = Math.max(max, countVisitedFromStartingPoint(map, {position:[r,map[0].length], direction:Direction.Left}));
    }
    for (let c=0; c<map[0].length; c++) {
        max = Math.max(max, countVisitedFromStartingPoint(map, {position:[-1,c], direction:Direction.Down}));
        max = Math.max(max, countVisitedFromStartingPoint(map, {position:[map.length,c], direction:Direction.Up}));
    }
    console.log(max)
}

function move(map:string[][], visitedMap: string[][], beam: positionAndDirection): positionAndDirection[] {
    let newPosition: number[] = []
    let newDirection: Direction = beam.direction
    if (beam.direction == Direction.Right) {
        newPosition = [beam.position[0], beam.position[1] + 1]
    } else if (beam.direction == Direction.Left) {
        newPosition = [beam.position[0], beam.position[1] - 1]
    } else if (beam.direction == Direction.Up) {
        newPosition = [beam.position[0] - 1, beam.position[1]]
    } else if (beam.direction == Direction.Down) {
        newPosition = [beam.position[0] + 1, beam.position[1]]
    }

    if (newPosition[0] >= 0 && newPosition[0] < map.length && newPosition[1] >= 0 && newPosition[1] < map[0].length) {
        visitedMap[newPosition[0]][newPosition[1]] = "#"
        let next = map[newPosition[0]][newPosition[1]]
        if (next == "-" && (beam.direction == Direction.Up || beam.direction == Direction.Down)) {
            if (previousBeams.includes(JSON.stringify({position: newPosition, direction: Direction.Left})) &&
                previousBeams.includes(JSON.stringify({position: newPosition, direction: Direction.Right}))) {
                return []
            }
            previousBeams.push(JSON.stringify({position:newPosition, direction: Direction.Left}))
            previousBeams.push(JSON.stringify({position:newPosition, direction: Direction.Right}))

            return [
                {position:newPosition, direction: Direction.Left},
                {position:newPosition, direction: Direction.Right}
            ]
        }
        if (next == "|" && (beam.direction == Direction.Right || beam.direction == Direction.Left)) {
            if (previousBeams.includes(JSON.stringify({position: newPosition, direction: Direction.Up})) &&
                previousBeams.includes(JSON.stringify({position: newPosition, direction: Direction.Down}))) {
                return []
            }
            previousBeams.push(JSON.stringify({position:newPosition, direction: Direction.Up}))
            previousBeams.push(JSON.stringify({position:newPosition, direction: Direction.Down}))

            return [
                {position:newPosition, direction: Direction.Up},
                {position:newPosition, direction: Direction.Down}
            ]
        }

        if (next == "/" || next == "\\") {
            newDirection = mirrorTracker.get(next)![beam.direction]
        } else {
            newDirection = beam.direction
        }

        if (previousBeams.includes(JSON.stringify({position: newPosition, direction: newDirection}))) {
            return []
        }

        previousBeams.push(JSON.stringify({position:newPosition, direction:newDirection}))
        return [{position:newPosition, direction:newDirection}]
    }
    return []
}

function countVisited(visitedMap: string[][]): number {
    let total = 0;
    for (let r=0; r<visitedMap.length; r++) {
        for (let c=0; c<visitedMap[r].length; c++) {
            if (visitedMap[r][c] == "#") {
                total++
            }
        }
    }
    return total;
}

main();
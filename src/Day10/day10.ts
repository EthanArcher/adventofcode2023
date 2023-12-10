import { readFileSync } from "fs";

/*
    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
 */

interface pipe {
    style: string,
    moving: number[],
    next: number[]
}
export const LEFT: number[] = [0, -1];
export const RIGHT: number[] = [0, 1];
export const UP: number[] = [-1, 0];
export const DOWN: number[] = [1, 0];

let direction: pipe[] = [
    // style, current - from, current + to
    {style: "|", moving: DOWN, next: DOWN},
    {style: "|", moving: UP, next: UP},
    {style: "-", moving: RIGHT, next: RIGHT},
    {style: "-", moving: LEFT, next: LEFT},
    {style: "L", moving: DOWN, next: RIGHT},
    {style: "L", moving: LEFT, next: UP},
    {style: "J", moving: RIGHT, next: UP},
    {style: "J", moving: DOWN, next: LEFT},
    {style: "7", moving: RIGHT, next: DOWN},
    {style: "7", moving: UP, next: LEFT},
    {style: "F", moving: UP, next: RIGHT},
    {style: "F", moving: LEFT, next: DOWN}
]

const map: string[][] = [];
const mapWithOnlyConnectedTubes: string[][] = [];

function main() {
    const data = readFileSync("src/Day10/input.txt", "utf8");
    data.split("\n").forEach(l => {
        map.push(l.split(""))
        mapWithOnlyConnectedTubes.push(Array(l.length).fill("."));
    });

    let s:number[] = []
    for (let r=0; r<map.length; r++) {
        for (let c = 0; c<map[r].length; c++) {
            if (map[r][c] == "S") {
                s=[r,c]
            }
        }
    }

    let location: number[] = s;
    let currentMoving: number[] = []

    let validUp = isAValidDirection(s, UP)
    let validDown = isAValidDirection(s, DOWN)
    let validRight = isAValidDirection(s, RIGHT)
    let validLeft = isAValidDirection(s, LEFT)

    // find a direction to travel
    if (validDown) {
        if (validUp) map[s[0]][s[1]] = "|"
        if (validLeft) map[s[0]][s[1]] = "7"
        if (validRight) map[s[0]][s[1]] = "F"
        currentMoving = DOWN
    } else if (validUp) {
        if (validDown) map[s[0]][s[1]] = "|"
        if (validLeft) map[s[0]][s[1]] = "J"
        if (validRight) map[s[0]][s[1]] = "L"
        currentMoving = UP
    } else if (validRight) {
        if (validLeft) map[s[0]][s[1]] = "-"
        currentMoving = RIGHT
    } else if (validLeft) {
        if (validRight) map[s[0]][s[1]] = "-"
        currentMoving = LEFT
    }
    mapWithOnlyConnectedTubes[s[0]][s[1]] = map[s[0]][s[1]]

    location = [location[0] + currentMoving[0], location[1] + currentMoving[1]]

    let running = true
    let steps = 1;
    while (running) {
        mapWithOnlyConnectedTubes[location[0]][location[1]] = map[location[0]][location[1]];
        [location, currentMoving] = nextLocation(map[location[0]][location[1]], currentMoving, location);
        steps++
        if (location[0] == s[0] && location[1] == s[1]) {
            running = false;
        }
    }
    console.log(steps / 2)

    // for each row in the copy map
    // consider yourself as being outside
    // move across the row
    // if you hit a | switch your side
    // if you hit a L-J dont care
    // if you hit a F-7 dont care
    // if you hit a L-7 switch
    // if you hit a F-J switch

    // can print this to see the map with only the pipe
    mapWithOnlyConnectedTubes.forEach(l => console.log(l.join("")))

    let inside = false;
    let trapped = 0;
    for (let r = 0; r<mapWithOnlyConnectedTubes.length; r++) {
        inside = false;
        let lastAngle = "";
        for (let c = 0; c<mapWithOnlyConnectedTubes[r].length; c++) {
            let tube = mapWithOnlyConnectedTubes[r][c];
            if (inside && tube === ".") {
                trapped++;
            } else if (tube === "|") {
                inside = !inside;
            } else if (tube === "L" || tube === "F") {
                lastAngle = tube;
            } else if (tube === "J" && lastAngle === "F") {
                inside = !inside;
                lastAngle = "";
            } else if (tube === "7" && lastAngle === "L") {
                inside = !inside;
                lastAngle = "";
            }
        }
    }
    console.log(trapped)

}

const isAValidDirection = (s: number[], moving: number[]) : boolean => {
    if (s[0] + moving[0] < 0 || s[1] + moving[1] < 0) {
        return false;
    }
    let p = map[s[0] + moving[0]][s[1] + moving[1]]
    if (p == ".") {
        return false;
    }
    if (direction.find(d => (d.style == p) && d.moving == moving)) {
        return true
    }
    return false
}

function nextLocation(style: string, moving: number[], currentLocation: number[]): [number[], number[]] {
    const pipe = direction.find((p) => p.style === style && p.moving === moving);
    if (pipe) {
        return [[currentLocation[0] + pipe.next[0], currentLocation[1] + pipe.next[1]], pipe.next]
    }
    console.log(style, moving, currentLocation)
    throw "done"

}

main();

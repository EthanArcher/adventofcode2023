import {printMap, readFileToLines} from "../utils";

interface DiggerInstruction {
    direction: string,
    distance: number
}

enum Direction {
    R,
    D,
    L,
    U
}

const directionMap = new Map<string, number[]>();
directionMap.set("U", [-1,0]);
directionMap.set("D", [1,0]);
directionMap.set("L", [0,-1]);
directionMap.set("R", [0,1]);


function calculateArea(instructions: DiggerInstruction[]) {
    let boundaryPoints = 0
    let vertices: number[][] = []
    let currentPosition = [0,0]
    vertices.push(currentPosition)

    instructions.forEach(instruction => {
        currentPosition = [currentPosition[0] + directionMap.get(instruction.direction)![0] * instruction.distance, currentPosition[1] + directionMap.get(instruction.direction)![1] * instruction.distance]
        boundaryPoints += instruction.distance
        vertices.push(currentPosition)
    })

    // applying shoelace formula to determine total area
    let doubleArea = 0;
    for (let i = 0; i < vertices.length; i++) {
        const currentPoint = vertices[i];
        const previousPoint = vertices[(vertices.length + i - 1) % vertices.length];
        const nextPoint = vertices[(i + 1) % vertices.length];
        doubleArea += currentPoint[0] * (previousPoint[1] - nextPoint[1])
    }
    let area = Math.abs(doubleArea) / 2

    // apply picks theorem
    // A = i + b/2 - 1
    // i = A - b/2 + 1
    // i = (2a - b + 2) / 2

    let interiorArea = area - (boundaryPoints / 2) + 1

    console.log(interiorArea + boundaryPoints)
}

function main() {
    const lines = readFileToLines("src/Day18/input.txt")

    // Part 1
    let instructions: DiggerInstruction[] = []
    lines.forEach(line => {
        let [dir, dis, col] = line.split(" ")
        instructions.push({direction: dir, distance:Number(dis)}
        )
    })
    calculateArea(instructions);

    // Part 2
    instructions = []
    lines.forEach(line => {
        let [dir, dis, col] = line.split(" ")
        instructions.push({direction: Direction[Number(col.charAt(7))], distance: parseInt(col.slice(2, 7), 16)}
        )
    })
    calculateArea(instructions);

}

main();
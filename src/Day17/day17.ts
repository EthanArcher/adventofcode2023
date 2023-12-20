import {printMap, readFileToLines} from "../utils";
import {MinPriorityQueue} from '@datastructures-js/priority-queue';

const directionMap = new Map<string, number[]>();
directionMap.set("UP", [-1,0]);
directionMap.set("DOWN", [1,0]);
directionMap.set("LEFT", [0,-1]);
directionMap.set("RIGHT", [0,1]);

interface node {
    location: number[]
    heatLoss: number
    currentDirection: string
    currentSteps: number
}

interface visitedNode {
    totalHeatLoss: number
    currentDirection: string
    currentSteps: number
}

let nodes:number[][] = []
const nodesToVisit = new MinPriorityQueue<node>((node) => node.heatLoss)
let lowestHeatLossMap: Map<string, visitedNode> = new Map<string, visitedNode>
let visitedNodes: string[] = []

function main() {
    const lines = readFileToLines("src/Day17/input.txt")
    lines.forEach((line, row) => {
        nodes[row] = [];
        line.split("").forEach((node, column) => {
            nodes[row][column] = Number(node)
        })
    })

    nodesToVisit.push({location:[0,0], heatLoss:0, currentSteps:0, currentDirection:"RIGHT"})
    lowestHeatLossMap.set(String([0,0]), {totalHeatLoss:0, currentSteps:0, currentDirection:"RIGHT"})

    // for (let i=0; i<100; i++) {
    while(nodesToVisit.size() > 0) {
        let node = nodesToVisit.dequeue();
        console.log("visiting node: " + node.location[0] + "," + node.location[1] + " with heatloss of: " + node.heatLoss)
        if (node.location[0] == nodes.length-1 && node.location[1] == nodes[0].length-1) {
            console.log("*******")
            console.log(node.heatLoss)
            break;
        }

        // check if we have been here already as the last time would have been the best time
        if (visitedNodes.includes(String([node.location[0], node.location[1], node.currentDirection[0], node.currentDirection[1], node.currentSteps]))) {
            continue;
        }

        visitedNodes.push(String([node.location[0], node.location[1], node.currentDirection[0], node.currentDirection[1], node.currentSteps]))
        directionMap.forEach((direction, name) => {

            // move 4 to 7 spaces
            for (let ultra = 4; ultra <=10; ultra++) {

                let steps = ultra

                if (name == node.currentDirection) {
                    steps = node.currentSteps + ultra
                }

                if (node.location[0] + (direction[0] * ultra) >= 0 &&
                    node.location[0] + (direction[0] * ultra) < nodes.length &&
                    node.location[1] + (direction[1] * ultra) >= 0 &&
                    node.location[1] + (direction[1] * ultra) < nodes[0].length &&
                    !(directionMap.get(node.currentDirection)![0] + direction[0] == 0 && directionMap.get(node.currentDirection)![1] + direction[1] == 0) &&
                    steps <= 10) {

                    let row = node.location[0] + (direction[0] * ultra)
                    let column = node.location[1] + (direction[1] * ultra)
                    let newLocation = [row, column]

                    // heat loss along the way
                    let heatLoss = node.heatLoss
                    for (let hl = 1; hl <= ultra; hl++) {
                        heatLoss += nodes[node.location[0] + (direction[0] * hl)][node.location[1] + (direction[1] * hl)]
                    }

                    nodesToVisit.enqueue({
                        location: newLocation,
                        heatLoss: heatLoss,
                        currentDirection: name,
                        currentSteps: steps
                    })


                }
            }
        })
    }

    console.log(lowestHeatLossMap)
    console.log(lowestHeatLossMap.get(String([nodes.length-1, nodes[0].length-1])))

}

main();
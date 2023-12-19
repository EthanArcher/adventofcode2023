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
        console.log("visiting node: " + JSON.stringify(node))
        if (node.location[0] == nodes.length-1 && node.location[1] == nodes[0].length-1) {
            console.log("*******")
            console.log(node.heatLoss)
            break;
        }

        // check if we have been here already as the last time would have been the best time
        if (visitedNodes.includes(JSON.stringify({location: node.location, currentDirection:node.currentDirection, currentSteps:node.currentSteps}))) {
            continue;
        }

        visitedNodes.push(JSON.stringify({location: node.location, currentDirection:node.currentDirection, currentSteps:node.currentSteps}))
        directionMap.forEach((direction, name) => {

            let steps = 1
            if (name == node.currentDirection) {
                steps = node.currentSteps + 1
            }

            if (node.location[0] + direction[0] >= 0 &&
                node.location[0] + direction[0] < nodes.length &&
                node.location[1] + direction[1] >= 0 &&
                node.location[1] + direction[1] < nodes[0].length &&
                !(directionMap.get(node.currentDirection)![0] + direction[0] == 0 && directionMap.get(node.currentDirection)![1] + direction[1] == 0) &&
                steps <= 3) {

                let row = node.location[0] + direction[0]
                let column = node.location[1] + direction[1]
                let newLocation = [row, column]
                let heatLoss = node.heatLoss + nodes[row][column]

                // if the new node hasnt been visited, add it to the list
                if (!visitedNodes.includes(JSON.stringify({location: newLocation, currentDirection:direction, currentSteps:steps}))) {
                    // console.log("Queueing up: " + JSON.stringify({location: newLocation, heatLoss: heatLoss, currentDirection:name, currentSteps: steps}))
                    nodesToVisit.enqueue({location: newLocation, heatLoss: heatLoss, currentDirection:name, currentSteps: steps})
                }

                // check if the new heatloss is less than the current heat loss
                if (lowestHeatLossMap.has(String(newLocation))) {
                    heatLoss = Math.min(heatLoss, lowestHeatLossMap.get(String(newLocation))!.totalHeatLoss)
                }
                lowestHeatLossMap.set(String(newLocation), {
                    totalHeatLoss: heatLoss,
                    currentDirection: name,
                    currentSteps: steps
                })
            }
        })
    }

    console.log(lowestHeatLossMap)
    console.log(lowestHeatLossMap.get(String([nodes.length-1, nodes[0].length-1])))

}

main();
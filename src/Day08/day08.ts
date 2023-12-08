import { readFileSync } from "fs";

function main() {
    const data = readFileSync("src/Day08/input.txt", "utf8");
    const lines = data.trim().split("\n");
    const rightLeftArray: number[] = lines[0]
        .replace(new RegExp("L", "g"),"0")
        .replace(new RegExp("R", "g"), "1")
        .split("")
        .map(v => Number(v));

    const map = new Map<string, string[]>

    for (let i=2; i<lines.length; i++) {
        let split = lines[i].split("=")
        let key = split[0].trim()
        let directions = split[1].trim().slice(1, -1).split(",")
        map.set(key, [directions[0].trim(), directions[1].trim()]);
    }

    // part 1

    let finished = false;
    let mapIndex = 0;
    let currentPosition = "AAA";
    let steps = 0
    while (!finished) {
        steps++;
        currentPosition = getNextNode(rightLeftArray, map, currentPosition, mapIndex)
        if (currentPosition === "ZZZ") {
            finished = true
        }
        mapIndex = (mapIndex + 1) % rightLeftArray.length
    }
    console.log("Part one: " + steps)

    // part 2
    let nodes = getAllStatingNodes(map);
    let lcmArrayValues: number[] = []

    nodes.forEach(n=> {
        let beenHereBefore = new Set();
        let mapIndex = 0;
        let multiples: number[] = [];
        let counter = 0;
        let looped = false;
        let node = n;

        while (!looped) {
            node = getNextNode(rightLeftArray, map, node, mapIndex);
            counter++
            if (beenHereBefore.has(node + mapIndex)) {
                if ( node.charAt(node.length - 1) === "Z") {
                    multiples.push(counter);
                    looped = true;
                }
            } else {
                beenHereBefore.add(node + mapIndex)
                let lastChar = node.charAt(node.length - 1)
                if (lastChar === "Z") {
                    multiples.push(counter);
                }
            }
            mapIndex = (mapIndex + 1) % rightLeftArray.length
        }
        console.log("x = " + multiples[0] + " + y (mod " + (multiples[1] - multiples[0]) + ")")

        // as all loops are the same size as the time taken for the first z
        // therefore x must be the lcm of the loop size
        lcmArrayValues.push(multiples[0])

    })

    console.log(lcmArray(lcmArrayValues) == 12357789728873)
    console.log("Part two: " + lcmArray(lcmArrayValues))

}

const getNextNode = (rightLeftArray: number[], map : Map<string, string[]>, currentNode: string, mapIndex: number) : string => {
    let rightOrLeft = rightLeftArray[mapIndex];
    return map.get(currentNode)![rightOrLeft];
}

const getAllStatingNodes = (map : Map<string, string[]>) : string[] => {
    let startingNodes: string[] = []
    map.forEach( (value, key) => {
        if (key.charAt(key.length - 1) == "A") {
            startingNodes.push(key);
        }
    })
    return startingNodes;

}

function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

function lcmArray(numbers: number[]): number {
    let result = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }

    return result;
}

main();

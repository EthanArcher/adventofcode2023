import {printMap, readFileToLines} from "../utils";

interface part {
    x: number
    m: number
    a: number
    s: number
}

let destinationConditions: Map<string, string[]> = new Map<string, string[]>();

let acceptedParts: part[] = []
let workFlows: Map<string, string[]> = new Map<string, string[]>();
let waysToA: string[][] = []

function extracted(fromOperation: string, conditionsSoFar: string[]) {
    let start = workFlows.get(fromOperation)!
    let conditions: string[] = []
    start.forEach(cond => {
        if (cond.includes(":")) {
            let [eq, dest] = cond.split(":")
            if (dest == "A") {
                waysToA.push([eq].concat(conditionsSoFar).concat(conditions))
            } else if (dest == "R") {
                // ignore the drops
            } else {
                destinationConditions.set(dest, [eq].concat(conditionsSoFar).concat(conditions))
            }
            conditions.push(reverseEquality(eq))
        } else {
            if (cond == "A") {
                waysToA.push(conditions.concat(conditionsSoFar))
            } else if (cond == "R") {
                // ignore the drops
            } else {
                destinationConditions.set(cond, conditions.concat(conditionsSoFar))
            }

        }
    })
}

function main() {
    const lines = readFileToLines("src/Day19/input.txt")
    let parts: part[] = []
    let lineIndex = 0
    for (let l = lineIndex; l<lines.length; l++) {
        let line = lines[l]
        if (line == "") {
            lineIndex = l + 1
            break;
        }
        else {
            let [functionName, ops] = line.split(/[{}]/)
            let operations = ops.split(",")
            workFlows.set(functionName, operations)
        }
    }
    for (let l = lineIndex; l<lines.length; l++) {
        let line = lines[l]
        let [x,m,a,s] = line.replace(/[xmas{}=]/g, "").split(",").map(Number);
        parts.push({x:x, m:m, a:a, s:s})
    }

    // All parts begin in the workflow named in
    parts.forEach(part => {
        applyCheck(workFlows.get("in")!, part)
    })

    let sumTotal = 0
    acceptedParts.forEach(ap => {
        sumTotal += ap.x + ap.m + ap.a + ap.s
    })

    console.log(sumTotal)
    extracted("in", []);

    destinationConditions.forEach(( cond, dest) => {
        extracted(dest, cond)
    })

    let sum = 0
    waysToA.forEach(wta => {
        sum += countOptions(wta)
    })

    console.log(sum)

}

function countOptions(wta: string[]) {
    let [x_min, m_min, a_min, s_min] = [0,0,0,0]
    let [x_max, m_max, a_max, s_max] = [4001,4001,4001,4001]

    wta.forEach(l => {
        const property = l.charAt(0);
        const operator = l.includes(">") ? ">" : "<";
        const value = Number(l.split(operator)[1]);

        switch (property) {
            case "x":
                x_min = operator === ">" ? Math.max(x_min, value) : x_min;
                x_max = operator === "<" ? Math.min(x_max, value) : x_max;
                break;
            case "m":
                m_min = operator === ">" ? Math.max(m_min, value) : m_min;
                m_max = operator === "<" ? Math.min(m_max, value) : m_max;
                break;
            case "a":
                a_min = operator === ">" ? Math.max(a_min, value) : a_min;
                a_max = operator === "<" ? Math.min(a_max, value) : a_max;
                break;
            case "s":
                s_min = operator === ">" ? Math.max(s_min, value) : s_min;
                s_max = operator === "<" ? Math.min(s_max, value) : s_max;
                break;
        }
    });

    return (x_max - x_min - 1) * (m_max - m_min - 1) * (a_max - a_min - 1) * (s_max - s_min - 1)
}

function reverseEquality(eq:string): string {
    if (eq.includes(">")) {
        let [p, n] = eq.split(">")
        return p + "<" + String(Number(n) + 1);
    }
    let [p, n] = eq.split("<")
    return p + ">" + String(Number(n) - 1);
}

// each rule specifies a condition and where to send the part if the condition is true
function applyCheck(workflow: string[], part: part) {
    let currentWorkflow = workflow[0]
    if (currentWorkflow == "A") {
        acceptedParts.push(part)
    } else if (currentWorkflow == "R") {
        // reject
    } else if (currentWorkflow.includes(":")) {
        let [category, value, result] = currentWorkflow.split(/[<>:]/)
        let partValue = getValue(part, category)
        let response = evaluate(partValue, currentWorkflow.charAt(1), Number(value))

        if (response) {
            if (result == "A") {
                acceptedParts.push(part)
            } else if (result == "R") {
                // reject
            } else {
                applyCheck(workFlows.get(result)!, part)
            }
        } else {
            applyCheck(workflow.slice(1, workflow.length), part)
        }
    } else {
        applyCheck(workFlows.get(currentWorkflow)!, part)
    }
}

function evaluate(partValue: number, operation: string, value: number): boolean {
    if (operation == ">") {
        return partValue > value
    } else {
        return partValue < value
    }
}

function getValue(somePart:part, propertyName: string): number {
    switch (propertyName) {
        case "x":
            return somePart.x
        case "m":
            return somePart.m
        case "a":
            return somePart.a
        case "s":
            return somePart.s
        default:
            throw Error
    }
}

main();
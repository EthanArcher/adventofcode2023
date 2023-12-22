import {printMap, readFileToLines} from "../utils";

interface pulse {
    from: string,
    to: string,
    value: number
}

export const states:Map<string, number> = new Map<string, number>();
let currentPulses: pulse[] = [];
export const  nextPulses: pulse[] = [];
export const map:Map<string, string[]> = new Map<string, string[]>();
let operations:Map<string, string> = new Map<string, string>();
let conjunctions:Map<string, string[]> = new Map<string, string[]>();

function main() {
    const lines = readFileToLines("src/Day20/input.txt")

    lines.forEach(lines => {
        const [from, to] = lines.split("->")
        let [value, operation] = getNameAndOperation(from)
        operations.set(value, operation)
        map.set(value, to.split(",").map(v => v.trim()))
    })

    // we want to have a array of all the inputs to this conjunction
    // need to go through all the conjunctions and create a store of which we need to check
    operations.forEach((operation, module) => {
        let con: string[] = []
        if (operation == "&") {
            map.forEach((to, from) => {
                if (to.includes(module)) {
                    con.push(from)
                }
            })
            conjunctions.set(module, con)
        }
    })

    let lowPulses = 0
    let highPulses = 0

    let lcmArray: Map<string, number> = new Map<string, number>

    for (let presses=0; presses<10000; presses++) {
        // find the broadcaster start point
        map.get("broadcaster")!.forEach(out => {
            nextPulses.push({from: "broadcaster", to: out, value:0})
        });
        lowPulses += 1

        currentPulses = nextPulses.map(obj => ({...obj}));
        // copy and empty
        nextPulses.length = 0

        // while there are still pulses to process
        while (currentPulses.length > 0) {
            currentPulses.forEach(pulse => {
                if (pulse.value == 0) lowPulses += 1
                if (pulse.value == 1) highPulses += 1

                applyPulse(pulse)
            })
            currentPulses = nextPulses.map(obj => ({...obj}));
            nextPulses.length = 0;
            if (states.get("bt") == 1) {
                if (!lcmArray.has("bt")) lcmArray.set("bt", presses+1)
            }
            if (states.get("fv") == 1) {
                if (!lcmArray.has("fv")) lcmArray.set("fv", presses+1)
            }
            if (states.get("rd") == 1) {
                if (!lcmArray.has("rd")) lcmArray.set("rd", presses+1)
            }
            if (states.get("pr") == 1) {
                if (!lcmArray.has("pr")) lcmArray.set("pr", presses+1)
            }
        }
    }

    console.log(lowPulses * highPulses)
    // is 788848550

    // Part B
    // for rx to be low, all the inputs into vd need to be high
    // bt, fv, rd, pr
    // can we find the cycle for each of these?

    // Part 2
    // multiplying the cycle lengths together
    console.log(lcmArray)
    let total = 1
    lcmArray.forEach(v => total = total * v)
    console.log(total)


}

function applyPulse(pulse: pulse) {
    //console.log(JSON.stringify(pulse))
    // get the module and apply its operation
    if (!map.has(pulse.to)) {
        // dead end
        return;
    }
    if (operations.get(pulse.to)! == "%") {
        flipFlop(pulse.from, pulse.to, pulse.value)
    } else {
        conjunction(pulse.from, pulse.to, pulse.value)
    }
}

function getNameAndOperation(from: string): string[] {
    if (from.includes("%")) {
        return [from.split("%")[1].trim(), "%"]
    }
    if (from.includes("&")) {
        let module = from.split("&")[1].trim()
        return [module, "&"]
    }
    return [from.trim(), from.trim()]
}

export function flipFlop(from:string, to: string, pulse: number) {
    if (pulse == 0) {
        const currentState = states.get(to) ?? 0;
        let outputPulse = 1 - currentState
        states.set(to, outputPulse)
        map.get(to)!.forEach(out => {
            nextPulses.push({from:to, to:out, value:outputPulse})
        })
    }
}

export function conjunction(from: string, to: string, pulse: number) {
    let currentStates:number[] = []
    conjunctions.get(to)!.forEach(f => {
        currentStates.push(states.get(f)!)
    })

    let outputPulse = Array.from(currentStates.values()).every(value => value === 1) ? 0 : 1;
    if (map.has(to)) {
        map.get(to)!.forEach(module => {
            nextPulses.push({from:from, to:module, value:outputPulse})
        })
    }
    states.set(to, outputPulse)
}

main();
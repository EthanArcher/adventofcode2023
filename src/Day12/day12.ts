import { readFileSync } from "fs";
import {separatedStringToNumberArrayBySplitter} from "../utils";

interface springInput {
    springs: string
    damagedGroupSize: number[]
}

interface springAndCombinationWithTracker {
    spring: string
    grouping: number[]
    streak: number
}

let transverseCache = new Map<string, number>

function main() {
    const data = readFileSync("src/Day12/input.txt", "utf8");
    const input: springInput[] = [];
    const unfoldedInputs: springInput[] = [];
    data.split("\n").forEach(l => {
        let [springs, groups] = l.split(" ");
        let brokenSprings: number[] = separatedStringToNumberArrayBySplitter(groups, ",")
        input.push({springs: springs, damagedGroupSize: brokenSprings})

        let unfoldedInput: string = springs + "?" + springs + "?" + springs + "?" + springs + "?" + springs;
        let unfoldedBrokenSprings: number[] = [...brokenSprings, ...brokenSprings, ...brokenSprings, ...brokenSprings, ...brokenSprings]
        unfoldedInputs.push({springs: unfoldedInput, damagedGroupSize: unfoldedBrokenSprings})
    });

    // console.log(input)
    // console.log(unfoldedInputs)

    let total = 0;
    input.forEach((springInput, index) => {
        console.log("Completed: " + Math.ceil(index/input.length * 100) + "%")
        total += findPossibleGroupings(springInput)
    })

    console.log(total)

    let total2 = 0;
    unfoldedInputs.forEach((springInput, index) => {
        console.log("Completed: " + Math.ceil(index/input.length * 100) + "%")
        total2 += findPossibleGroupings(springInput)
    })

    console.log(total2)

}


export function findPossibleGroupings(springInput: springInput) {
    return transverse({spring: springInput.springs, grouping: springInput.damagedGroupSize, streak:0})
}


function transverse(springAndCombinationWithTracker: springAndCombinationWithTracker): number {


    if (transverseCache.has(JSON.stringify(springAndCombinationWithTracker))) {
        return transverseCache.get(JSON.stringify(springAndCombinationWithTracker))!
    }
    let count: number = 0
    const { spring, grouping, streak } = springAndCombinationWithTracker;

    // if there isn't enough possible values left then we can drop this option
    if (spring.length < (sum(grouping) + grouping.length - streak - 1)) {
        transverseCache.set(JSON.stringify(springAndCombinationWithTracker), 0)
        return 0
    }

    if (spring[0] == ".") {
        if (streak == 0 && spring.length > 1) {
            // hasnt started a streak so just move forward 1
            count += transverse(
                {
                    spring: spring.slice(1),
                    grouping: grouping,
                    streak: 0
                })
        } else if (streak == 0 &&
                    spring.length == 1 &&
                    grouping.length == 0) {
            count++
        } else if (streak == grouping[0] &&
                    spring.length == 1 &&
                    grouping.length == 1 &&
                    spring.split("").every(sc => sc == ".")) {
            // its the last position and everything is good
            count++
        } else if (streak == grouping[0]) {
            // completed a successful group move forward both index
            count += transverse(
                {
                    spring: spring.slice(1),
                    grouping: grouping.slice(1),
                    streak:0
                })
        } else {
            return 0
        }
    } else if (spring[0] == "#") {
        if (grouping.length == 0) {
            // it should be over kill this
            return 0
        }

        if (streak + 1 > grouping[0]) {
            // its too big a streak, can also drop it
        } else if (spring.length == 1 &&
            grouping.length == 1 &&
            streak + 1 == grouping[0]) {
            // this is the final piece in a complete transverse
            count++
        } else {
            // move onto the next index
            // can do a load of skips here
            for (let i=0; i<grouping[0]; i++) {
                // if it breaks too early kill it
                if (spring[i] == ".") {
                    return 0
                }
            }
            if (spring[grouping[0]] == "#"){
                // too big a run kill this too
                return 0
            }

            if (spring.length == grouping[0]) {
                count++
            } else {
                count+= transverse(
                    {
                        spring: spring.slice(springAndCombinationWithTracker.grouping[0]),
                        grouping: grouping,
                        streak: grouping[0]
                    })
            }
        }
    } else if (spring[0] == "?") {
        count += transverse(
            {
                spring: "." + spring.substring(1),
                grouping: grouping,
                streak: streak
            })
        count += transverse(
            {
                spring: "#" + spring.substring(1),
                grouping: grouping,
                streak: streak
            })
    }

    transverseCache.set(JSON.stringify(springAndCombinationWithTracker), count)
    return count

}

export function sum(...nums: number[] | (readonly number[])[]): number {
    let tot = 0;
    for (const x of nums) {
        if (typeof x === "number") {
            tot += x;
        } else {
            for (const y of x) {
                tot += y;
            }
        }
    }
    return tot;
}

main();
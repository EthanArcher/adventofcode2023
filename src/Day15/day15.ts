import {printMap, readFileToLines} from "../utils";

let hashmap: Map<number, string[]> = new Map<number, string[]>

function main() {
    const lines = readFileToLines("src/Day15/input.txt")
    let steps = lines[0].split(",")

    let total = 0;
    steps.forEach(step => {
        total += hash(step)
    })
    console.log(total)

    steps.forEach(step => {
        applyToHashMap(step)
    })

    let total2 = 0;
    hashmap.forEach((contents, index) => {
        let t = (1 + index)
        contents.forEach((value, innerIndex) => {
            total2 += t * (innerIndex + 1) * Number(value.split(" ")[1])
        })
    })
    console.log(total2)

}

function applyToHashMap(step: string) {

    let boxNumber: number = hash(step.split(/[-=]/)[0])
    let v = step.replace(/[-=]/, " ")

    if (step.includes("-")) {
        let contents = hashmap.get(boxNumber) || []
        contents = contents.filter(c => !c.includes(v))
        hashmap.set(boxNumber, contents)
    } else {
        let contents = hashmap.get(boxNumber) || []
        let replaced = false
        contents = contents.map(c => {
            if (c.includes(v.split(" ")[0])) {
                c = v
                replaced = true
            }
            return c
        })
        if (!replaced) contents.push(v)
        hashmap.set(boxNumber, contents)
    }
}

export function hash(value: string ): number {
    let currentValue = 0
    value.split("").forEach((char, index) => {
        currentValue += value.charCodeAt(index);
        currentValue *= 17
        currentValue = currentValue % 256
    })
    return currentValue
}

main();
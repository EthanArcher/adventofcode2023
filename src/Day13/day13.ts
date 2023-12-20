import { readFileSync } from "fs";
import {readFileToLines} from "../utils";

interface lavaField {
    map:string[][]
}

function main() {
    const data = readFileSync("src/Day13/input.txt", "utf8");
    let map: string[][] = [];
    let fields: lavaField[] = []
    let lavaFieldIndex = 0;
    data.split("\n").forEach(l => {
        if (l == "") {
            fields.push({map})
            map = []
            lavaFieldIndex++
        } else {
            map.push(l.split(""))
        }
    });

    let total1 = 0
    fields.forEach(field => {
        total1 += findTheReflectionIndex(field, 0)

    })
    console.log(total1)

    let total2 = 0
    fields.forEach(field => {
        total2 += findTheReflectionIndex(field, 2)

    })
    console.log(total2)

}

function findTheReflectionIndex(field: lavaField, requiredDiff: number) {

    let vertical = findVerticalReflection(field, requiredDiff)
    if (vertical > 0) {
        return vertical
    }
    return findHorizontalReflection(field, requiredDiff) * 100;

}

export function findVerticalReflection(field: lavaField, requiredDiff: number): number {

    let shouldBePerfect = requiredDiff == 0;

    // row then column
    let lineLength = field.map[0].length;
    for (let i=0; i<lineLength-1; i++) {
        // try moving to the right
        let perfect = true;
        let totalDiff = 0;
        field.map.forEach((line, index) => {
            let [isReflection, diff] = isAVerticalReflection(line.slice(i, lineLength))
            perfect = perfect && isReflection
            totalDiff += diff
        })
        if (!shouldBePerfect && totalDiff == requiredDiff) {
            return ((lineLength - i) / 2) + i;
        }
        if (perfect && shouldBePerfect) {
            return ((lineLength - i) / 2) + i;
        }

        perfect = true;
        totalDiff = 0;
        field.map.forEach((line, index) => {
            let [isReflection, diff] = isAVerticalReflection(line.slice(0, lineLength - i))
            perfect = perfect && isReflection
            totalDiff += diff
        })
        if (!shouldBePerfect && totalDiff == requiredDiff) {
            return ((lineLength - i) / 2);
        }
        if (perfect && shouldBePerfect) {
            return ((lineLength - i) / 2);
        }
    }
    return 0;
}


export function findHorizontalReflection(field: lavaField, requiredDiff: number): number {

    let shouldBePerfect = requiredDiff == 0;

    // row then column
    let lineLength = field.map.length;
    for (let r=0; r<field.map.length-1; r++) {
        // try moving down
        let [isReflection, diff] = isAHorizontalReflection(field.map.slice(r, lineLength))
        if (!shouldBePerfect && diff == requiredDiff) {
            return ((lineLength - r) / 2) + r;
        }
        if (isReflection && shouldBePerfect) {
            return ((lineLength - r) / 2) + r;
        }
        // try moving up
        [isReflection, diff] = isAHorizontalReflection(field.map.slice(0, lineLength - r))
        if (!shouldBePerfect && diff == requiredDiff) {
            return ((lineLength - r) / 2);
        }
        if (isReflection && shouldBePerfect) {
            return ((lineLength - r) / 2);
        }
    }
    return 0;
}

export function isAHorizontalReflection(rows: string[][]): [boolean, number] {
    if (rows.length % 2 == 1) {
        return [false, 0]
    }

    let isReflection = true;
    let diff = 0;
    for (let r=0; r<rows.length; r++) {
        let rowPerfectMatch = true
        rows[r].forEach((value, index) => {
            if (value != rows[rows.length - 1 - r][index]) {
                rowPerfectMatch = false;
                diff++
            }
        })
        isReflection = isReflection && rowPerfectMatch
    }
    return [isReflection, diff]
}


export function isAVerticalReflection(values: string[]): [boolean, number] {
    if (values.length % 2 == 1) {
        return [false, 0]
    }

    let diff = 0;
    let isReflection = true
    let perfectMatch = true
    for (let i= 0; i < values.length; i++) {
        if (values[i] != values[values.length - 1 - i]) {
            perfectMatch = false
            diff++
        }

        isReflection = isReflection && perfectMatch
    }
    return [isReflection, diff]
}

main();
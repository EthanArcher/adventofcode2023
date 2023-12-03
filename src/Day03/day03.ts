import { readFileSync } from "fs";

const gears = new Map<string, number[]>();

function main() {
    const data = readFileSync("src/Day03/input.txt", "utf8");
    const map: string[][] = [];
    data.split("\n").forEach(l => map.push(l.split("")))
    getValuesAndStartingCoordinate(map)

}

interface ValueAndLocation {
    numberValue: number;
    position: [number, number];
    width: number;
    valid: boolean;
}

export function getValuesAndStartingCoordinate(map: string[][]) {

    let rows: number = map.length
    let columns: number = map[0].length
    const values: ValueAndLocation[] = []
    let tempNumberHolder = ""
    let row_start = 0;
    let col_start = 0;
    let width = 0;
    let building = false;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (/[0-9]/.test(map[row][col])) {
                width++;
                tempNumberHolder += map[row][col]
                if (building == false) {
                    row_start = row;
                    col_start = col;
                }
                building = true;
            } else if (building) {
                values.push({numberValue: Number(tempNumberHolder), position: [row_start, col_start], width: width, valid: false})
                building = false;
                tempNumberHolder = "";
                width = 0;
            } else {
                building = false;
                width = 0;
                tempNumberHolder = "";
            }
        }
        if (building) {
            values.push({numberValue: Number(tempNumberHolder), position: [row_start, col_start], width: width, valid: false})
        }
        building = false;
        width = 0;
        tempNumberHolder = "";
    }

    // check if the numberValue is now valid
    values.forEach(v => {
        for (let r = v.position[0] - 1; r < v.position[0] + 2; r++ ) {
            for (let c = v.position[1] - 1; c < v.position[1] + v.width + 1; c++ ) {
                if (r >= 0 && r < rows && c >= 0 && c < columns) {
                    if (map[r][c] != "." && !/[0-9]/.test(map[r][c])) {
                        v.valid = true;
                        if (map[r][c] == "*") {
                            addToMap(r.toString()+ "," + c.toString(), v.numberValue)
                        }
                    }
                }
            }
        }
    })

    // find sum of valid parts
    let total = 0;
    values.forEach(v => {
        if (v.valid) {
            total += v.numberValue;
        }
    });

    // find the gear ratios
    let gearTotal:number = 0
    gears.forEach((value, key) => {
        if (value.length === 2) {
            gearTotal += value[0] * value[1]
        }
    })

    console.log(total)
    console.log(gearTotal)
}

function addToMap(key: string, value: any) {
    if (gears.has(key)) {
        gears.get(key)?.push(value);
    } else {
        gears.set(key, [value]);
    }
}

main();
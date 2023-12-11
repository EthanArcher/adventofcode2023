import { readFileSync } from "fs";
import {printMap} from "../utils";

function main() {
    const data = readFileSync("src/Day11/input.txt", "utf8");
    const map: string[][] = [];
    data.split("\n").forEach(l => map.push(l.split("")));

    let emptyRows: number[] = [];
    let emptyColumns: number[] = [];
    let locations: number[][] = [];

    // useful for smaller maps
    //printMap(map)

    for (let r = 0; r < map.length; r++) {
        let allEmptyRows = map[r].every(v => v == ".");
        if (allEmptyRows) {
            emptyRows.push(r);
        }
    }

    for (let c = 0; c < map.length; c++) {
        let allEmptyColumns = true;
        for (let r = 0; r < map.length; r++) {
            allEmptyColumns = allEmptyColumns && map[r][c] == "."
            if (map[r][c] == "#") {
                locations.push([r,c])
            }
        }
        if (allEmptyColumns) {
            emptyColumns.push(c)
        }
    }

    findAllTheDistances(locations, emptyRows, emptyColumns, 2)
    findAllTheDistances(locations, emptyRows, emptyColumns, 1000000)

}

function findAllTheDistances(locations: number[][], emptyRows: number[], emptyColumns: number[], time: number) {
    let distances: number[] = [];
    let extraRows = time - 1;

    for (let i=0; i<locations.length; i++) {
        for (let j=i+1; j<locations.length; j++) {
            let rowsOverTime = Math.abs(locations[j][0] - locations[i][0]) + extraRows * (betweenArray(locations[j][0],locations[i][0]).filter(v => emptyRows.includes(v)).length)
            let columnsOverTime = Math.abs(locations[j][1] - locations[i][1]) + extraRows * (betweenArray(locations[j][1],locations[i][1]).filter(v => emptyColumns.includes(v)).length)

            let distance = rowsOverTime + columnsOverTime
            distances.push(distance);
        }
    }

    let td = distances.reduce((acc, val) => acc + val, 0);
    console.log(td)
}

const betweenArray = (start: number, end: number): number[] => {
    if (start === end) {
        return [];
    }
    const increment = Math.sign(end - start);
    const length = Math.abs(end - start) - 1;
    return Array.from({ length }, (_, index) => start + (index + 1) * increment);
};

main();

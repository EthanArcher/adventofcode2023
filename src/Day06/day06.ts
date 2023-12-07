import { readFileSync } from "fs";
import {separatedStringToNumberArray} from "../utils";

function main() {
    const data = readFileSync("src/Day06/input.txt", "utf8");
    const lines = data.split("\n");
    const input: number[][] = [];
    let bigT = Number(lines[0].split(/:/)[1].replace(/\s/g, ''));
    let bigD = Number(lines[1].split(/:/)[1].replace(/\s/g, ''));
    lines.forEach(l => {
        let n: number[] = separatedStringToNumberArray(l.split(/:/)[1])
        input.push(n);
    })

    let margin = 1
    for (let i=0; i<input[0].length; i++) {
        let t = input[0][i];
        let d = input[1][i];
        margin = margin * findWaysToWin(t, d);
    }

    console.log(margin)
    console.log(findWaysToWin(bigT, bigD))

}

export const findWaysToWin = (time:number, record:number): number => {
    let count = 0;
    for (let i=0; i<time; i++) {
        let d = i * (time - i);
        if (d > record) {
            count++
        }
    }
    return count;
}

main()
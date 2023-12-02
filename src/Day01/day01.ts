import { readFileSync } from "fs";

function main() {
    const data = readFileSync("src/Day01/input.txt", "utf8");
    console.log(day01(data));
}

export function day01(data: string) {

    // Split lines
    const lines = data.split("\n");
    const numbers: number[] = [];

    lines.forEach(function (line) {

        // replace any words with their corresponding number
        line = line.replace(/zero/g, "ze0ro");
        line = line.replace(/one/g, "on1e");
        line = line.replace(/two/g, "tw2o");
        line = line.replace(/three/g, "thr3ee");
        line = line.replace(/four/g, "fo4ur");
        line = line.replace(/five/g, "fi5ve");
        line = line.replace(/six/g, "si6x");
        line = line.replace(/seven/g, "sev7en");
        line = line.replace(/eight/g, "eig8ht");
        line = line.replace(/nine/g, "ni9ne");

        const strippedLine = line.replace(/\D/g, "");
        const first = strippedLine.charAt(0);
        const last = strippedLine.charAt(strippedLine.length - 1);
        numbers.push(Number(first + last));
    })

    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum;
}

main();

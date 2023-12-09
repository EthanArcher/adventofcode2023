import { readFileSync } from "fs";
import {separatedStringToNumberArray} from "../utils";

function main() {
    const data = readFileSync("src/Day09/input.txt", "utf8");
    const lines = data.trim().split("\n");
    let sequences = lines.map(l => separatedStringToNumberArray(l))

    let total = 0
    sequences.forEach(seq => {
        let newSeq = findNextNumberInSequence(seq)
        total += newSeq[newSeq.length - 1]
    })

    console.log("Part one: " + total)

    total = 0;
    sequences.forEach(seq => {
        let newSeq = findNextNumberInSequence(seq.reverse())
        total += newSeq[newSeq.length - 1]
    })

    console.log("Part two: " + total)

}

export const findNextNumberInSequence = (sequence: number[]) : number[] => {

    let seq = findDifferences(sequence);
    if (seq.every((v) => v == 0)) {
        //console.log("all diffs are 0")
    } else {
        seq = findNextNumberInSequence(seq);
    }
    let nextVal = sequence[sequence.length - 1] + seq[seq.length - 1];
    return [...sequence, nextVal];

}

export const findDifferences = (sequence: number[]) : number[] => {
    let differences: number[] = []
    for (let i= 0; i<sequence.length - 1; i++) {
        differences.push(sequence[i+1] - sequence[i])
    }
    return differences
}

main();

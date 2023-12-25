import {readFileSync} from "fs";

export const separatedStringToNumberArray = (input: string): number[] => input.trim().split(/\s+/).map(Number);
export const separatedStringToNumberArrayBySplitter = (input: string, splitter: string): number[] => input.trim().split(splitter).map(Number);

export function printMap(input: string[][]) {
    input.forEach(l => console.log(l.join("")))
}

export function readFileToLines(filename: string): string[] {
    const data = readFileSync(filename, "utf8");
    return data.trim().split("\n");
}

export function sumNumberArray(...nums: number[] | (readonly number[])[]): number {
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


export function* letterSequence() {
    let letter = 'A';
    while (true) {
        yield letter;
        letter = getNextLetter(letter);
    }
}

function getNextLetter(letter: string): string {
    const lastChar = letter.charAt(letter.length - 1);

    // if its all Zs then return all As
    if (letter === 'Z'.repeat(letter.length)) {
        return 'A'.repeat(letter.length + 1);
    }

    // if the last character is Z
    if (lastChar === 'Z') {
        // get the letters up to this point
        let prefix = letter.slice(0, -1);
        let suffix = 'A';
        while (prefix.endsWith('Z')) {
            prefix = prefix.slice(0, -1);
            suffix += 'A';
        }
        prefix = prefix.slice(0, -1) + String.fromCharCode(letter.charCodeAt(prefix.length - 1) + 1);
        return prefix + suffix;
    } else {
        return letter.slice(0, -1) + String.fromCharCode(letter.charCodeAt(letter.length - 1) + 1);
    }
}
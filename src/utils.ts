export const separatedStringToNumberArray = (input: string): number[] => input.trim().split(/\s+/).map(Number);
export const separatedStringToNumberArrayBySplitter = (input: string, splitter: string): number[] => input.trim().split(splitter).map(Number);

export function printMap(input: string[][]) {
    input.forEach(l => console.log(l.join("")))
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
export const separatedStringToNumberArray= (input: string): number[] => input.trim().split(/\s+/).map(Number);

export function printMap(input: string[][]) {
    input.forEach(l => console.log(l.join("")))

}
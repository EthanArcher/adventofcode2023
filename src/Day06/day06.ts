import { readFileSync } from "fs";

type Color = "red" | "green" | "blue"

function main() {
    const data = readFileSync("src/Day02/input.txt", "utf8");
    const games = data.trim().split("\n");
    const validGames = games.map(isValidGame);

    let totalValidGames = 0;
    for (let i= 0; i < games.length; i++) {
        if (validGames[i]) {
            totalValidGames = totalValidGames + (i + 1);
        }
    }

    const totalPowerOfGames = games.reduce((acc, game) => acc + powerOfGame(game), 0);
    console.log(totalValidGames);
    console.log(totalPowerOfGames);
}

export function powerOfGame(game: string) {
    const colorMap = new Map<Color, number>([
        ["blue", 1],
        ["red", 1],
        ["green", 1]
    ]);
    const hands = game.split(/[;:,]/).slice(1);
    hands.map(getColourAndValue).forEach(([color, value]) => {
        const currentMax = colorMap.get(color) ?? 1;
        if (value > currentMax) {
            colorMap.set(color, value);
        }
    });
    return Array.from(colorMap.values()).reduce((acc, val) => acc * val, 1);
}

function getColourAndValue(hand: string): [Color, number] {
    const regex = /\d+/;
    const color = ["red", "green", "blue"].find((c) => hand.includes(c)) as Color;
    const number = Number(hand.match(regex)?.[0] ?? 0);
    return [color, number];
}

export function isValidGame(game: string) {
    const rounds = game.split(/[;:]/).slice(1);
    const validRounds = rounds.map(isValidRound);
    return validRounds.every((isValid) => isValid);
}

export function isValidRound(round: string) {
    const maxValues: Record<Color, number> = {
        red: 12,
        green: 13,
        blue: 14
    };
    const validHands = round.split(",").map((value) => {
        const [color, number] = getColourAndValue(value);
        return number <= maxValues[color];
    });
    return validHands.every((isValid) => isValid);
}

main();
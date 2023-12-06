import { readFileSync } from "fs";
import {separatedStringToNumberArray} from "../utils";

function main() {
    const data = readFileSync("src/Day04/input.txt", "utf8");
    const totalPoints:number[] = [];
    const cardCounter= new Map<number, number>();
    const cards = data.split("\n")

    for (let i = 1; i<=cards.length; i++){
        addToMapOrIncrement(cardCounter, i, 1);
    }

    cards.forEach(line => {
        let l = line.split(/[:|]/)
        let cardNumber = Number(l[0].split(/\s+/)[1]);
        let winners = separatedStringToNumberArray(l[1]);
        let youHave = separatedStringToNumberArray(l[2]);
        let matches = 0;
        let points = 0;
        let numberOfCards = cardCounter.get(cardNumber) || 0;

        winners.forEach(w => {
            if (youHave.includes(w)) {
                matches++
            }
        })

        if (matches > 0) {
           points = Math.pow(2, matches - 1);
           for (let x=1; x<=matches; x++) {
               addToMapOrIncrement(cardCounter, cardNumber + x, numberOfCards);
           }
        }

        totalPoints.push(points)

    })

    let tp = totalPoints.reduce((acc, val) => acc + val, 0);

    let numberOfCards = 0;
    cardCounter.forEach((count, card) => {
        numberOfCards += count;
    })

    console.log(tp)
    console.log(numberOfCards)

}

function addToMapOrIncrement(map: Map<number, number>, key: number, numberOfCards: number) {
    const count = map.get(key) || 0;
    map.set(key, count + numberOfCards);
}

main();
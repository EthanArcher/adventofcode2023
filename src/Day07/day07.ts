import { readFileSync } from "fs";

type Card = "A" | "K" | "Q" | "J" |
    "T" | "9" | "8" | "7" | "6" |
    "5" | "4" | "3" | "2" | "1"

const sortedCards: Card[] = [
    "1", "2" , "3" , "4" , "5",
    "6", "7", "8", "9", "T",
    "J", "Q", "K", "A"
]

export type HandResult = "Five of a kind" | "Four of a kind" | "Full house" |
    "Three of a kind" | "Two pair" | "One pair" | "High card"

const possibleHands: HandResult[]  = [
    "High card",
    "One pair",
    "Two pair",
    "Three of a kind",
    "Full house",
    "Four of a kind",
    "Five of a kind",
];

const handRanks = new Map<string, number>();
let index = 0;
possibleHands.forEach((hand, index) => {
    handRanks.set(hand, index + 1);
});

const cardRanks = new Map<string, number>();
let cardIndex = 0;
sortedCards.forEach((hand, cardIndex) => {
    cardRanks.set(hand, cardIndex + 1);
});

interface handWithRankAndBid {
    hand: string;
    holding: string;
    bid: number;
}

function main() {
    const data = readFileSync("src/Day07/input.txt", "utf8");
    const hands = data.trim().split("\n");
    const handsArray: handWithRankAndBid[] = []
    hands.forEach(h => {
        const [hand, b] = h.split(" ") as [string, string];
        const bid = Number(b.trim());
        const result = calculateHand(hand);
        const hrb: handWithRankAndBid = {hand: hand, holding:result, bid:bid}
        handsArray.push(hrb)
    })

    const sortedHandsArray: handWithRankAndBid[] = sortHands(handsArray)

    let total = 0;
    for (let i=1; i<= sortedHandsArray.length; i++) {
        total += sortedHandsArray[i-1].bid * i;
    }

    console.log(total)

}

export const sortHands = (handsArray: handWithRankAndBid[]): handWithRankAndBid[] => {
    return handsArray.sort((a, b) => {
        if (a.holding === b.holding) {
            // compare the cards in order
            for (let i=0; i<a.hand.length; i++) {
                if (a.hand[i] != b.hand[i]) {
                    return cardRanks.get(a.hand[i])! - cardRanks.get(b.hand[i])!
                }
            }
            return 0;
        } else {
            return handRanks.get(a.holding)! - handRanks.get(b.holding)!
        }
    });
}

export const calculateHand = (hand: string): HandResult =>   {
    const uniqueCards = Array.from(new Set(hand.split("")));

    if (uniqueCards.length === 1) {
        return "Five of a kind"
    }
    if (uniqueCards.length === 2) {
        if (numberOfOccurrences(hand, uniqueCards[0]) === 4 || numberOfOccurrences(hand, uniqueCards[0]) === 1) {
            return "Four of a kind"
        }
        return "Full house"
    }
    if (uniqueCards.length === 3) {
        if (numberOfOccurrences(hand, uniqueCards[0]) === 3 ||
            numberOfOccurrences(hand, uniqueCards[1]) === 3  ||
            numberOfOccurrences(hand, uniqueCards[2]) === 3) {
            return "Three of a kind"
        }
        return "Two pair"
    }
    if (uniqueCards.length === 4) {
        return "One pair"
    }

    return "High card"
}

const numberOfOccurrences = (hand:string, char:string): number => {
    return hand.split(char).length - 1;
}

main();
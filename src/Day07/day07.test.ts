import {calculateHand} from "./day07";

describe("calculateHand", () => {
    it("should return correct value for each hand", () => {
        expect("Five of a kind").toEqual(calculateHand("KKKKK"))
        expect("Four of a kind").toEqual(calculateHand("KKKKQ"))
        expect("Four of a kind").toEqual(calculateHand("KQKKK"))
        expect("Full house",).toEqual(calculateHand("KKKQQ"))
        expect("Full house",).toEqual(calculateHand("KQKQK"))
        expect("Three of a kind",).toEqual(calculateHand("KKKQJ"))
        expect("Two pair").toEqual(calculateHand("KKQQJ"))
        expect("One pair").toEqual(calculateHand("KKQJT"))
        expect("High card").toEqual(calculateHand("KQJT9"))
    });
});
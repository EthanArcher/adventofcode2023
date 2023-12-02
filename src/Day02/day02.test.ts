import {powerOfGame, isValidRound} from "./day02";

describe("isValidRound", () => {
    it("should return true for a valid round", () => {
        const inputString = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
        expect(true).toEqual(isValidRound(inputString));
    });
    it("should return false for a invalid round", () => {
        const inputString = "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red"
        expect(false).toEqual(isValidRound(inputString));
    });
});

describe("powerOfGame", () => {
    it("should find the power of the min numbers from a game", () => {
        const inputString = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
        expect(48).toEqual(powerOfGame(inputString));
    });
});

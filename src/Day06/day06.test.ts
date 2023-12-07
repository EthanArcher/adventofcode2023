import {findWaysToWin} from "./day06";

describe("findWaysToWin", () => {
    it("should return correct value for number of ways to win", () => {
        expect(4).toEqual(findWaysToWin(7, 9));
        expect(8).toEqual(findWaysToWin(15, 40));
        expect(9).toEqual(findWaysToWin(30, 200));
    });
});
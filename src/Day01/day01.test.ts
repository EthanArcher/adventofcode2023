import {day01} from "./day01";

describe("sumNumbersInString", () => {
    it("should replace words with their corresponding numbers and sum the first and last digits of each line", () => {
        const inputString =
            `1abc2
            pqr3stu8vwx
            a1b2c3d4e5f
            treb7uchet`
        expect(142).toEqual(day01(inputString));
    });
    it("should sum when words in input need conversion", () => {
        const inputString =
            `two1nine
            eightwothree
            abcone2threexyz
            xtwone3four
            4nineeightseven2
            zoneight234
            7pqrstsixteen`
        expect(281).toEqual(day01(inputString));
    });
});
import {findHorizontalReflection, findVerticalReflection, isAVerticalReflection} from "./day13";

describe("testing functions in day 13", () => {
    it("sample is a reflection", () => {
        expect(isAVerticalReflection("...####...".split(""))).toEqual([true, 0])
    });
    it("odd sample not a reflection", () => {
        expect(isAVerticalReflection("...###...".split(""))).toEqual([false, 0])
    });
    it("finds the vertical reflection starting from 0", () => {
        expect(findVerticalReflection({map:["...####...".split("")]}, 0)).toEqual(5)
    });
    it("finds the vertical reflection starting from 2", () => {
        expect(findVerticalReflection({map:[".....####...".split("")]}, 0)).toEqual(7)
    });
    it("finds the vertical reflection starting from 8", () => {
        expect(findVerticalReflection({map:["...####.....".split("")]}, 0)).toEqual(5)
    });
    it("finds the vertical reflection in sample 1", () => {
        expect(findVerticalReflection({ map: [
                "#.##..##.".split(""),
                "..#.##.#.".split(""),
                "##......#".split(""),
                "##......#".split(""),
                "..#.##.#.".split(""),
                "..##..##.".split(""),
                "#.#.##.#.".split("")]
        }, 0)).toEqual(5)
    });
    it("finds the horizontal reflection in sample 1", () => {
        expect(findHorizontalReflection({ map: [
                "#...##..#".split(""),
                "#....#..#".split(""),
                "..##..###".split(""),
                "#####.##.".split(""),
                "#####.##.".split(""),
                "..##..###".split(""),
                "#....#..#".split("")],
        }, 0)).toEqual(4)
    });
    it("finds the horizontal reflection in sample 3", () => {
        expect(findHorizontalReflection({ map: [
                "##..##.".split(""),
                "#.#.##.".split(""),
                "#.#.##.".split(""),
                "##..##.".split(""),
                "###.#.#".split(""),
                ".#.#..#".split(""),
                "..#...#".split(""),
                "..##...".split(""),
                ".##...#".split(""),
                ".##.#.#".split(""),
                ".##.#.#".split(""),
                ".##.#.#".split(""),
                "..##...".split("")]
        }, 0)).toEqual(2)
    });
})
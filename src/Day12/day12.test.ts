import {findPossibleGroupings} from "./day12";

describe("testing functions in day 12", () => {
    it("sample 1 count", () => {
        expect(findPossibleGroupings({springs: "???.###", damagedGroupSize:[1,1,3]})).toEqual(1)
    });
    it("sample 2 count", () => {
        expect(findPossibleGroupings({springs: ".??..??...?##.", damagedGroupSize:[1,1,3]})).toEqual(4)
    });
    it("sample 3 count", () => {
        expect(findPossibleGroupings({springs: "?#?#?#?#?#?#?#?", damagedGroupSize:[1,3,1,6]})).toEqual(1)
    });
    it("sample 4 count", () => {
        expect(findPossibleGroupings({springs: "????.#...#...", damagedGroupSize:[4,1,1]})).toEqual(1)
    });
    it("sample 5 count", () => {
        expect(findPossibleGroupings({springs: "????.######..#####.", damagedGroupSize:[1,6,5]})).toEqual(4)
    });
    it("sample 6count", () => {
        expect(findPossibleGroupings({springs: "?###????????", damagedGroupSize:[3,2,1]})).toEqual(10)
    });
})
import {findNextNumberInSequence, findDifferences} from "./day09";

describe("testing functions in day 9", () => {
    it("findDifferences should return differences for equal differences top level", () => {
        expect(findDifferences([1,2,3,4,5,6])).toEqual([1,1,1,1,1])
    });
    it("findDifferences should return all 0 for equal", () => {
        expect(findDifferences([1,1,1,1,1,1])).toEqual([0,0,0,0,0])
    });
    it("findNextNumberInSequence should return differences for equal differences top level", () => {
        expect(findNextNumberInSequence([1,1,1])).toEqual([1,1,1,1])
    });
    it("findNextNumberInSequence should return differences for equal differences one level deep", () => {
        expect(findNextNumberInSequence([1,2,3])).toEqual([1,2,3,4])
    });
    it("findNextNumberInSequence should return differences for equal differences two levels deep", () => {
        expect(findNextNumberInSequence([0,3,6,9,12,15])).toEqual([0,3,6,9,12,15,18])
    });
    it("findNextNumberInSequence should return differences for equal differences three levels deep", () => {
        expect(findNextNumberInSequence([1,3,6,10,15,21])).toEqual([1,3,6,10,15,21,28])
    });
    it("findNextNumberInSequence should return differences for equal differences four levels deep", () => {
        expect(findNextNumberInSequence([10,13,16,21,30,45])).toEqual([10,13,16,21,30,45,68])
    });
    it("findNextNumberInSequence should return differences for sequence with negative", () => {
        expect(findNextNumberInSequence([-3,-2,-1,0,1])).toEqual([-3,-2,-1,0,1,2])
    });
    it("findNextNumberInSequence should return differences for sequence with negative decreasing", () => {
        expect(findNextNumberInSequence([-3,-5,-7,-9])).toEqual([-3,-5,-7,-9,-11])
    });
});
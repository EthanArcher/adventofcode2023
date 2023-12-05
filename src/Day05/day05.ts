import { readFileSync } from "fs";

function main() {
    const data = readFileSync("src/Day05/input.txt", "utf8");
    const lines = data.split("\n");
    let seeds = lines[0].split(/:/)[1].match(/\d+/g)?.map(Number) || [];
    let lowest: number = 999999999999;

    let mapName = "";
    const maps = new Map<String, number[][]>

    for (let l = 2; l < lines.length; l++) {
        let line = lines[l];
        if (line.includes("map")) {
            mapName = line.split(" ")[0];
        } else if (line.trim().length === 0) {
            // empty line just skip
        } else {
            let c = maps.get(mapName) || []
            // destination range start, source range start, range length
            let values: number[] = line.match(/\d+/g)?.map(Number) || []
            c.push(values);
            maps.set(mapName, c);
        }
    }

    // Part 1
    seeds.forEach(s => {
        lowest = Math.min(lowest, magicMap(s, maps));
    })
    console.log("part 1: " + lowest)

    // Part 2
    lowest = 999999999999;
    for (let i=0; i<seeds.length; i=i+2) {
        console.log("Set " + (i+1) + " of " + (seeds.length / 2))
        for (let j=0; j<seeds[i+1]; j++) {
            lowest = Math.min(lowest, magicMap(seeds[i]+j, maps));
        }
    }
    console.log("part 2: " + lowest)
}

function magicMap(seed:number, map: Map<String, number[][]>) {
    // ensure order
    seed = convertFromMap(seed, map.get("seed-to-soil")!);
    seed = convertFromMap(seed, map.get("soil-to-fertilizer")!);
    seed = convertFromMap(seed, map.get("fertilizer-to-water")!);
    seed = convertFromMap(seed, map.get("water-to-light")!);
    seed = convertFromMap(seed, map.get("light-to-temperature")!);
    seed = convertFromMap(seed, map.get("temperature-to-humidity")!);
    seed = convertFromMap(seed, map.get("humidity-to-location")!);
    return seed;
}

function convertFromMap(input:number, map:number[][]): number {
    let mappedValue = input
    map.forEach(values => {
        // grab the source
        let sourceRangeStart = values[1];
        let destinationRangeStart = values[0];
        let range = values[2];

        // check if seed is in this map
        if (input >= sourceRangeStart && input < (sourceRangeStart + range)) {
            // return the new seed value
            let diff = input - sourceRangeStart;
            mappedValue = destinationRangeStart + diff;
        }
    })
    return mappedValue
}

main();
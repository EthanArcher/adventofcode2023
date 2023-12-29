import {printMap, readFileToLines} from "../utils";

interface toVisit {
    currentNode: string,
    visited: string[]
}

let connections:Map<string, Set<string>> = new Map<string, Set<string>>()

function main() {
    const lines = readFileToLines("src/Day25/input.txt")
    lines.forEach(line => {
        let [name, cons] = line.split(":")
        connections.set(name.trim(), new Set(cons.trim().split(" ").map(c => c.trim())))
    })

    // ensure mirrors
    connections.forEach((cons, name) => {
        cons.forEach(c => {
            let s = connections.get(c) ?? new Set()
            s.add(name)
            connections.set(c, s)
        })

    })

    let connectedMap:Map<string, Map<string, string[]>> = new Map<string, Map<string, string[]>>
    let counter: Map<string, number> = new Map<string, number>

    // for every node,
    // find the shortest route to another node,
    // store this journey as a set of nodes visited
    connections.forEach( (cs, name)  => {

        let seen: Map<string, string[]> = new Map<string, string[]>

        let pathsToVisit:toVisit[] = []
        pathsToVisit.push({currentNode:name, visited:[]})

        while(pathsToVisit.length > 0) {
            let ps: toVisit[] = []
            pathsToVisit.forEach(ptv => {
                ps = ps.concat(search(ptv, seen))
            })
            pathsToVisit = ps
        }
        connectedMap.set(name, seen)
        counter.set(name, 0)
    })

    connectedMap.forEach((connections, name) => {
        connections.forEach(cs => {
            cs.forEach(x => {
                let c = counter.get(x)!
                counter.set(x, c+1)
            })
        })
    })

    let mostCommonNodes = largestSet(counter, 6)
    console.log(mostCommonNodes)

    // remove the connections
    let nodes = [...mostCommonNodes]
    mostCommonNodes.forEach(node => {
        let cons = connections.get(node)!
        nodes.forEach(n => {
            if (cons.has(n)) {
                cons.delete(n)
            }
        })
        connections.set(node, cons)
    })

    // for each of the deleted nodes, find out their new connected graph size
    let groups: Set<number> = new Set()
    mostCommonNodes.forEach(node => {
        let seen: Map<string, string[]> = new Map<string, string[]>
        seen.set(node, [])
        let pathsToVisit:toVisit[] = []
        pathsToVisit.push({currentNode:node, visited:[]})

        while(pathsToVisit.length > 0) {
            let ps: toVisit[] = []
            pathsToVisit.forEach(ptv => {
                ps = ps.concat(search(ptv, seen))
            })
            pathsToVisit = ps
        }
        groups.add(seen.size)

    })

    console.log(groups)
    let t = 1;
    groups.forEach(v => {
        t = t * v
    })
    console.log(t)



}

function largestSet(map:Map<string, number>, n:number) : string[] {
    let largestSet: string[] = []
    let everything = new Map(map)

    for (let i=0; i<n; i++) {
        let large = largest(everything)
        largestSet.push(large)
        everything.delete(large)
    }

    return largestSet
}

function largest(map:Map<string, number>): string {
    let n = ""
    let l = 0
    map.forEach((v,k) => {
        if (v > l) {
            l = v
            n = k
        }
    })
    return n
}

function search(node: toVisit, seen: Map<string, string[]>): toVisit[] {

    let ps: toVisit[] = []
    let currentNode = node.currentNode;
    let visited = [...node.visited];

    visited.push(currentNode)

    connections.get(currentNode)!.forEach(con => {
        // if we havent visited this node yet
        if (!visited.includes(con) && !seen.has(con)) {
            seen.set(con, visited)
            ps.push({currentNode: con, visited: visited})
        }
    })

    return ps
}


main();
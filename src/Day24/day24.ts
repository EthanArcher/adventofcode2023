import {printMap, readFileToLines} from "../utils";
import { Matrix } from 'ts-matrix';

interface hailstone {
    px: number,
    py: number,
    pz: number,
    vx: number,
    vy: number,
    vz: number,
    m: number,
    c: number
}

let hailstones: hailstone[] = []
let parallel:hailstone[][]= []

function main() {
    const lines = readFileToLines("src/Day24/input.txt")
    lines.forEach(line => {
        let [pos, vol] = line.split("@")
        let [px, py, pz] = pos.split(",").map(p => p.trim()).map(Number)
        let [vx, vy, vz] = vol.split(",").map(p => p.trim()).map(Number)
        let [m, c] = equationOfLine(px, py, vx, vy)
        hailstones.push({px:px, py:py, pz:pz, vx:vx, vy:vy, vz:vz, m:m, c:c})
    })

    let min = 200000000000000
    let max = 400000000000000
    // let min = 2
    // let max = 27

    let intersections = 0
    for (let i=0; i<hailstones.length; i++) {
        for (let j = i + 1; j < hailstones.length; j++) {
            if (isAParallel(hailstones[i], hailstones[j])) {
                //console.log(hailstones[i], hailstones[j])
            }
            let [x,y] = intersection(hailstones[i], hailstones[j])
            let dxi = hailstones[i].vx > 0 ? 1 : -1
            let dyi = hailstones[i].vy > 0 ? 1 : -1
            let dxj = hailstones[j].vx > 0 ? 1 : -1
            let dyj = hailstones[j].vy > 0 ? 1 : -1
            let time: string = ""
            if (x != undefined && y != undefined &&
                ((x - hailstones[i].px > 0 && dxi == 1) || (x - hailstones[i].px < 0 && dxi == -1)) &&
                ((y - hailstones[i].py > 0 && dyi == 1) || (y - hailstones[i].py < 0 && dyi == -1)) &&
                ((x - hailstones[j].px > 0 && dxj == 1) || (x - hailstones[j].px < 0 && dxj == -1)) &&
                ((y - hailstones[j].py > 0 && dyj == 1) || (y - hailstones[j].py < 0 && dyj == -1))
            ) {
                time = "future"
            }

            if (x != undefined && y != undefined &&
                x >= min && y >= min &&
                x <= max && y <= max &&
                time == "future") {
                intersections++
            }
        }
    }

    console.log(intersections)

    /*
    x + vx * t == hailstone_x + v_hailstone_x * t
    y + vy * t == hailstone_y + v_hailstone_y * t
    z + vz * t == hailstone_z + v_hailstone_z * t

    rx + rv_x * t = hx + vhx * t

    t(rv_x - hv_x) = hx - rx
    t = (hx - rx) / (rv_x - hv_x) = (hy - ry) / (rv_y - hv_y)

    (hx - rx) (rv_y - hv_y)             = (hy - ry) (rv_x - hv_x)
    hxrv_y - rxrv_y - hxhv_y + rxhv_y = hyrv_x - ryrv_x + ryhv_x - hyhv_x

    // for any hailstone (ryrv_x - rxrv_y) is a constant
    ryrv_x - rxrv_y = hyrv_x + ryhv_x - hyhv_x -hxrv_y + hxhv_y - rxhv_y

    hyrv_x + ryhv_x - hyhv_x -hxrv_y + hxhv_y - rxhv_y
    - rxhv_y + hxhv_y - hxrv_y + ryhv_x -  hyhv_x + hyrv_x

    ... therefore for any sets of hailstones we can compare that:
    - rxhv_y[0] + hx[0]hv_y[0] - hx[0]rv_y + ryhv_x[0] -  hy[0]hv_x[0] + hy[0]rv_x = - rxhv_y[1] + hx[1]hv_y[1] - hx[1]rv_y + ryhv_x[1] -  hy[1]hv_x[1] + hy[1]rv_x
    - rxhv_y[0] + rxhv_y[1] - hx[0]rv_y + hx[1]rv_y + ryhv_x[0] - ryhv_x[1] -  hy[1]rv_x  + hy[0]rv_x = hx[1]hv_y[1] -  hy[1]hv_x[1] - hx[0]hv_y[0] + hy[0]hv_x[0]
    rx(hv_y[1] - hv_y[0]) + ry(hv_x[0] - hv_x[1]) + rv_x(hy[0] - hy[1]) + rv_y(hx[1] - hx[0])     = hy[0]hv_x[0] - hx[0]hv_y[0] + hx[1]hv_y[1] -  hy[1]hv_x[1]
    ... this gives us an equation with 4 unknows, considering 4 hailstones we can then apply some matrix multiplication to find the result


    therefore for z we can apply the same logic:
    rx(hv_z[1] - hv_z[0]) + rz(hv_x[0] - hv_x[1]) + rv_x(hz[0] - hz[1]) + rv_z(hx[1] - hx[0])     = hz[0]hz_x[0] - hx[0]hv_z[0] + hx[1]hv_z[1] -  hz[1]hv_x[1]

     */
    let m:Matrix
    let r:Matrix
    let u:Matrix
    let matrix: number[][]
    let resultsMatrix: number[][]

    matrix = []
    resultsMatrix = []
    // use the 10 -> 14th lines as these round correctly
    for (let i=10; i<=14; i++) {
        matrix.push([hailstones[i].vy - hailstones[0].vy, hailstones[0].vx - hailstones[i].vx, hailstones[0].py - hailstones[i].py, hailstones[i].px - hailstones[0].px])
        resultsMatrix.push([(hailstones[0].py * hailstones[0].vx) - (hailstones[0].px * hailstones[0].vy) + (hailstones[i].px * hailstones[i].vy) - (hailstones[i].py * hailstones[i].vx)])
    }

    m = new Matrix(4,4,matrix)
    r = new Matrix(4,1, resultsMatrix)

    u = m.inverse()
    let values = u.multiply(r)
    let x = values.at(0,0)
    let y = values.at(1,0)
    console.log("x = " + values.at(0,0))
    console.log("y = " + values.at(1,0))

    // again for z
    matrix = []
    resultsMatrix = []
    for (let i=10; i<=14; i++) {
        matrix.push([hailstones[i].vz - hailstones[0].vz, hailstones[0].vx - hailstones[i].vx, hailstones[0].pz - hailstones[i].pz, hailstones[i].px - hailstones[0].px])
        resultsMatrix.push([(hailstones[0].pz * hailstones[0].vx) - (hailstones[0].px * hailstones[0].vz) + (hailstones[i].px * hailstones[i].vz) - (hailstones[i].pz * hailstones[i].vx)])
    }

    m = new Matrix(4,4,matrix)
    r = new Matrix(4,1, resultsMatrix)

    u = m.inverse()
    values = u.multiply(r)
    let z = values.at(1,0)
    console.log("z = " + values.at(1,0))


    let total = x + y + z
    console.log(total)

}

function equationOfLine (px: number, py: number, vx:number, vy:number) {
    // find the gradient
    let m = vy / vx

    // find intercept
    let c = py - (m * px)

    return [m ,c]
}

function intersection(hailstoneA:hailstone, hailstoneB:hailstone) {
    if (hailstoneA.m == hailstoneB.m) {
        // if the gradient is the same they either
        // are on the exact same path
        if (hailstoneA.c == hailstoneB.c) {
            //console.log("same path")
        } else {
            parallel.push([hailstoneA, hailstoneB])
            //console.log("parallel")
        }
        return []
    } else {
        // x = (c2 - c1) / (m1 - m2)
        let x = (hailstoneB.c - hailstoneA.c) / (hailstoneA.m - hailstoneB.m)
        let y = (hailstoneA.m * x) + hailstoneA.c
        return [x,y]
    }
}

function isAParallel(hailstoneA:hailstone, hailstoneB:hailstone) {
    let d =  hailstoneA.vx / hailstoneB.vx
    return hailstoneA.vy / hailstoneB.vy == d &&  hailstoneA.vz / hailstoneB.vz == d
}

main();
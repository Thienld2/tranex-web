/**
 * 3D model spec per project, matched to its photo in lib/projects.ts
 * (storeys, massing, cladding, window patterns, roof, terraces…).
 * Projects without a dedicated spec show the default single-storey house.
 * Units: metres; the front of the house faces +Z (toward the default camera).
 * See lib/house-model.ts for the vocabulary.
 */
import type { HouseSpec } from "@/lib/house-model"

const specs: Record<string, HouseSpec> = {
  // Two-storey garden house: dark timber wing, glass living room under a
  // black box with vertical slit windows, white tower, under a big old tree.
  "nha-vuon-op-go-thao-dien": {
    blocks: [
      {
        x: [0, 4.8],
        z: [0, 7.2],
        floors: 1,
        clad: "darkWood",
        facade: { front: "ribbon", left: "punched", back: "punched" },
      },
      {
        x: [4.8, 13.2],
        z: [0, 7.2],
        floors: 1,
        clad: "white",
        facade: { front: "glass", right: "glass", back: "punched" },
        roof: { type: "flat", overhang: { front: 1.2, right: 0.6 }, mat: "dark", soffit: "wood" },
      },
      {
        x: [4.8, 10.8],
        z: [0, 7.2],
        from: 1,
        floors: 1,
        clad: "dark",
        facade: { front: "slits", right: "slits", back: "punched", left: "punched" },
        roof: { type: "flat", overhang: 0.3, mat: "dark" },
      },
      {
        x: [2.4, 4.8],
        z: [0, 4.8],
        from: 1,
        floors: 1,
        clad: "white",
        facade: { front: "tall", left: "blank", back: "small" },
      },
    ],
    doors: [{ block: 0, side: "front", pos: 0.9, width: 0.95, kind: "wood" }],
    decks: [{ x: [4.8, 13.2], z: [7.2, 9.6], mat: "wood" }],
    trees: [{ x: -2.6, z: -2.2, h: 12, r: 4.6 }],
    stair: { x: 5.6, z: 5.6, axis: "x" },
    core: { block: 0, x: 3.6 },
    kitchen: { x: [9.6, 12.6] },
  },
}

/** Default: single-storey RC-frame house ("nhà cấp 4"). */
const fallback: HouseSpec = {
  storey: 3.6,
  blocks: [
    {
      x: [0, 10.8],
      z: [0, 7.2],
      floors: 1,
      clad: "white",
      facade: "punched",
    },
  ],
  doors: [{ block: 0, side: "front", pos: 5.4, width: 1.6, kind: "glass" }],
  core: { block: 0, x: 4.5 },
  kitchen: { x: [0.3, 3.3] },
}

export function getHouseSpec(projectId: string): HouseSpec {
  return specs[projectId] ?? fallback
}

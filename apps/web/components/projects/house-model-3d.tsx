"use client"

import {
  Box,
  ChevronDown,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type * as THREE_NS from "three"

import { cn } from "@workspace/ui/lib/utils"

import {
  buildHouse,
  componentKey,
  countByLayer,
  type El,
  GROUND_LEVEL,
  type HouseModel,
  type HouseSpec,
  type Info,
  type Layer,
  type MatKey,
  modelText,
  type V3,
} from "@/lib/house-model"
import type { Locale } from "@/lib/i18n/types"

type Three = typeof THREE_NS
type Selected = { info: Info; layer: Layer } | null
type Api = {
  setLayer: (layer: Layer, visible: boolean) => void
  setXray: (on: boolean) => void
  reset: () => void
  clear: () => void
}

const LAYERS: Layer[] = ["arch", "struct", "mep"]
const LAYER_COLOR: Record<Layer, string> = {
  arch: "#d99a2b",
  struct: "#7c8a96",
  mep: "#2b78e4",
}

/**
 * Interactive three.js model of a project's house, generated from its spec:
 * RC frame (footings, columns, beams, slabs), architecture and exposed MEP
 * water piping. Top-right panel toggles layers; clicking a component shows
 * its size and material.
 */
export function HouseModel3D({
  locale,
  spec,
  name,
}: {
  locale: Locale
  spec: HouseSpec
  /** Project name, for the accessible label. */
  name: string
}) {
  const txt = modelText(locale, name)
  const model = useMemo(() => buildHouse(locale, spec), [locale, spec])
  const hostRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<Api | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [visible, setVisible] = useState<Record<Layer, boolean>>({
    arch: true,
    struct: true,
    mep: true,
  })
  const [xray, setXray] = useState(false)
  const [selected, setSelected] = useState<Selected>(null)
  /** Control panel (layers + info) visibility, toggled by the tab bar. */
  const [panelOpen, setPanelOpen] = useState(true)
  // Phones: start collapsed so the model is not covered.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setPanelOpen(false)
  }, [])
  const counts = useMemo(() => countByLayer(model.els), [model])

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    setStatus("loading")
    setSelected(null)
    ;(async () => {
      try {
        const THREE = await import("three")
        const { OrbitControls } =
          await import("three/examples/jsm/controls/OrbitControls.js")
        if (disposed || !hostRef.current) return
        const { dispose, api } = mountScene(
          THREE,
          OrbitControls,
          hostRef.current,
          model,
          (sel) => {
            setSelected(sel)
            // picking a component re-opens the panel so its info is visible
            if (sel) setPanelOpen(true)
          }
        )
        cleanup = dispose
        apiRef.current = api
        setVisible({ arch: true, struct: true, mep: true })
        setXray(false)
        setStatus("ready")
      } catch {
        if (!disposed) setStatus("error")
      }
    })()
    return () => {
      disposed = true
      cleanup()
      apiRef.current = null
    }
  }, [model])

  const toggleLayer = (layer: Layer) => {
    const next = !visible[layer]
    setVisible((v) => ({ ...v, [layer]: next }))
    apiRef.current?.setLayer(layer, next)
    if (!next && selected?.layer === layer) {
      apiRef.current?.clear()
    }
  }

  return (
    <div className="relative h-[520px] overflow-hidden rounded-[8px] border border-neutral-200 bg-[linear-gradient(180deg,#cfe3f3_0%,#eef4f8_55%,#f4f6f3_100%)] md:h-[clamp(480px,calc(100svh-150px),720px)]">
      <div
        ref={hostRef}
        role="img"
        aria-label={txt.canvasLabel}
        className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
      />

      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-[15px] font-bold text-neutral-600">
          {status === "loading" ? (
            <span className="flex items-center gap-3">
              <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              {txt.loading}
            </span>
          ) : (
            txt.error
          )}
        </div>
      )}

      {/* Control column (top-right): a tab bar that shows/hides the layer
          panel and the component info card */}
      <div className="pointer-events-none absolute top-3 right-3 bottom-3 flex w-[230px] flex-col items-end gap-2.5 sm:top-4 sm:right-4 sm:bottom-4 sm:w-[270px] lg:w-[290px] [&>*]:pointer-events-auto">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          aria-controls="bim-panel"
          aria-label={panelOpen ? txt.hidePanel : txt.showPanel}
          className={cn(
            "flex shrink-0 items-center gap-2.5 rounded-[6px] px-4 py-2.5 text-[14px] font-bold shadow-lg ring-1 ring-black/5 transition-colors",
            panelOpen
              ? "w-full bg-brand-dark text-white hover:bg-brand"
              : "bg-white/95 text-neutral-800 backdrop-blur hover:text-brand"
          )}
        >
          <SlidersHorizontal
            className={cn(
              "size-4",
              panelOpen ? "text-brand-lime" : "text-brand"
            )}
            aria-hidden="true"
          />
          <span className="flex-1 text-left">{txt.panelToggle}</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              panelOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        <div
          id="bim-panel"
          hidden={!panelOpen}
          className="flex min-h-0 w-full flex-col gap-2.5 [&:not([hidden])]:animate-in [&:not([hidden])]:fade-in-0 [&:not([hidden])]:slide-in-from-top-1"
        >
          <div className="shrink-0 rounded-[6px] bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <p className="flex items-center gap-2 text-[14px] font-bold text-neutral-800">
              <Layers className="size-4 text-brand" aria-hidden="true" />
              {txt.panelTitle}
            </p>
            <ul className="mt-2.5 space-y-0.5">
              {LAYERS.map((layer) => (
                <li key={layer}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-1 hover:bg-neutral-100">
                    <input
                      type="checkbox"
                      checked={visible[layer]}
                      onChange={() => toggleLayer(layer)}
                      disabled={status !== "ready"}
                      className="size-4 accent-[#138a4c]"
                    />
                    <span
                      className="size-3 shrink-0 rounded-[2px]"
                      style={{ background: LAYER_COLOR[layer] }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-[14px] font-bold text-neutral-800">
                      {txt.layers[layer]}
                    </span>
                    <span className="font-en text-[12px] text-neutral-500">
                      {counts[layer]}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 space-y-2 border-t border-neutral-200 pt-2.5">
              <label className="flex cursor-pointer items-center gap-3 px-2 text-[13px] font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={xray}
                  disabled={status !== "ready"}
                  onChange={(e) => {
                    setXray(e.target.checked)
                    apiRef.current?.setXray(e.target.checked)
                  }}
                  className="size-4 accent-[#138a4c]"
                />
                {txt.xray}
              </label>
              <button
                type="button"
                onClick={() => apiRef.current?.reset()}
                disabled={status !== "ready"}
                className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-neutral-300 py-2 text-[13px] font-bold text-neutral-700 transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                {txt.reset}
              </button>
            </div>
          </div>

          {/* Component info */}
          <div
            className={cn(
              "min-h-0 w-full shrink overflow-y-auto overscroll-contain rounded-[6px] bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur"
            )}
            aria-live="polite"
          >
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="rounded-[3px] px-2 py-0.5 text-[11px] font-bold text-white"
                    style={{ background: LAYER_COLOR[selected.layer] }}
                  >
                    {txt.layers[selected.layer]}
                  </span>
                  <button
                    type="button"
                    onClick={() => apiRef.current?.clear()}
                    aria-label={txt.close}
                    className="-m-1 grid size-6 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[16px] leading-snug font-bold text-neutral-900">
                  {selected.info.name}
                </p>
                <dl className="mt-2 space-y-1 text-[13px] leading-snug">
                  <Row label={txt.fields.size} value={selected.info.size} />
                  <Row
                    label={txt.fields.material}
                    value={selected.info.material}
                  />
                  {selected.info.spec && (
                    <Row label={txt.fields.spec} value={selected.info.spec} />
                  )}
                  {selected.info.location && (
                    <Row
                      label={txt.fields.location}
                      value={selected.info.location}
                    />
                  )}
                </dl>
              </>
            ) : (
              <p className="flex items-center gap-2 text-[13px] text-neutral-500">
                <Box className="size-4 shrink-0" aria-hidden="true" />
                {txt.empty}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="pointer-events-none absolute bottom-3 left-3 hidden max-w-[calc(100%-310px)] rounded-full bg-black/55 px-4 py-1.5 text-[12px] font-bold text-white backdrop-blur md:block">
        {txt.hint}
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-2">
      <dt className="pt-px text-[11px] font-bold tracking-wide text-neutral-500 uppercase">
        {label}
      </dt>
      <dd className="text-neutral-800">{value}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* three.js scene                                                      */
/* ------------------------------------------------------------------ */

function mountScene(
  THREE: Three,
  OrbitControls: typeof import("three/examples/jsm/controls/OrbitControls.js").OrbitControls,
  host: HTMLElement,
  model: HouseModel,
  onSelect: (s: Selected) => void
): { dispose: () => void; api: Api } {
  const { els, grid, house, site } = model
  // Model extents drive the camera, ground, shadows and grid.
  const cx = (site.min[0] + site.max[0]) / 2
  const cz = (site.min[2] + site.max[2]) / 2
  const siteW = site.max[0] - site.min[0]
  const siteD = site.max[2] - site.min[2]
  const height = house.max[1]
  const radius = Math.max(Math.hypot(siteW, siteD) / 2, height * 0.9, 6.5)
  const scale = radius / 6.5
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400)
  const CENTER = new THREE.Vector3(cx, 0.5 + Math.max(0, height - 5) * 0.2, cz)
  const HOME_TARGET = CENTER.clone().add(new THREE.Vector3(1.8 * scale, 0, -0.2 * scale))
  const HOME_POS = HOME_TARGET.clone().add(
    new THREE.Vector3(11.8, 9.5, 15.1).multiplyScalar(scale)
  )
  camera.position.copy(HOME_POS)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.copy(HOME_TARGET)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 3
  controls.maxDistance = 60 * scale
  controls.maxPolarAngle = Math.PI * 0.62
  controls.update()

  // Lighting
  scene.add(new THREE.HemisphereLight("#eaf3ff", "#6f7d5c", 1.1))
  const sun = new THREE.DirectionalLight("#fff6e8", 2.2)
  sun.position.set(cx + 9.6 * scale, 22 * scale, cz + 12.4 * scale)
  sun.target.position.set(cx, 0, cz)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  const sh = 14 * scale
  Object.assign(sun.shadow.camera, {
    left: -sh,
    right: sh,
    top: sh,
    bottom: -sh,
    near: 1,
    far: 70 * scale,
  })
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.02
  scene.add(sun, sun.target)

  // Materials
  const std = (
    color: string,
    extra: Partial<THREE_NS.MeshStandardMaterialParameters> = {}
  ) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.85,
      metalness: 0,
      ...extra,
    })
  const double = { side: THREE.DoubleSide }
  const MATS: Record<MatKey, THREE_NS.MeshStandardMaterial> = {
    concrete: std("#b9bbb7", { roughness: 0.92 }),
    roofSlab: std("#b9bbb7", { roughness: 0.92 }),
    roofWhite: std("#f3f2ee", { roughness: 0.9 }),
    roofDark: std("#2c2e30", { roughness: 0.7 }),
    footing: std("#a6a9a3", { roughness: 0.95 }),
    lean: std("#8d8f89", { roughness: 1 }),
    white: std("#f4f2ec", { roughness: 0.95 }),
    beige: std("#e2d3b9", { roughness: 0.9 }),
    stone: std("#b9a890", { roughness: 0.9 }),
    wood: std("#9a5a36", { roughness: 0.7 }),
    darkWood: std("#4a3426", { roughness: 0.75 }),
    timber: std("#c49a6c", { roughness: 0.75 }),
    dark: std("#25272a", { roughness: 0.6 }),
    panel: std("#878c90", { roughness: 0.7 }),
    sage: std("#9ba68e", { roughness: 0.9 }),
    siding: std("#f1f0ea", { roughness: 0.85 }),
    frame: std("#2f3438", { roughness: 0.5, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#a9d4ee",
      roughness: 0.05,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    }),
    doorWood: std("#7a4a2c", { roughness: 0.7 }),
    steelDoor: std("#6e4b36", { roughness: 0.6, metalness: 0.2 }),
    garage: std("#3a3d40", { roughness: 0.55, metalness: 0.3 }),
    floorTile: std("#e6dfd2", { roughness: 0.6 }),
    counter: std("#cfc8bb", { roughness: 0.6 }),
    paving: std("#d8d3c9", { roughness: 0.85 }),
    deck: std("#a57650", { roughness: 0.8 }),
    water: std("#3fb3d6", {
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
    }),
    roofTile: std("#3b3f44", { roughness: 0.8, ...double }),
    terracotta: std("#b4603d", { roughness: 0.85, ...double }),
    metalRoof: std("#5b6166", { roughness: 0.5, metalness: 0.4, ...double }),
    soffitWood: std("#b07a4c", { roughness: 0.7 }),
    soffitWhite: std("#f5f5f2", { roughness: 0.9 }),
    screen: std("#f2f2ef", { roughness: 0.8 }),
    railMetal: std("#c9ced2", { roughness: 0.35, metalness: 0.6 }),
    pipeCold: std("#2b78e4", { roughness: 0.4 }),
    pipeHot: std("#e04a3f", { roughness: 0.4 }),
    pipeDrain: std("#8c96a0", { roughness: 0.5 }),
    pipeRain: std("#d1d6db", { roughness: 0.5 }),
    pipePool: std("#18a39a", { roughness: 0.4 }),
    steel: std("#7d858c", { roughness: 0.45, metalness: 0.5 }),
    inox: std("#dfe3e7", { roughness: 0.3, metalness: 0.45 }),
    ceramic: std("#fbfbfa", { roughness: 0.25 }),
    pit: std("#7b6f63", { roughness: 1 }),
    solar: std("#1d2c4a", { roughness: 0.25, metalness: 0.5 }),
    trunk: std("#6b5444", { roughness: 1 }),
    leaves: std("#5c8a4b", { roughness: 0.9, flatShading: true }),
  }
  // Materials made see-through by the x-ray toggle: architecture + roofs.
  const XRAY_MATS: MatKey[] = [
    "white",
    "beige",
    "stone",
    "wood",
    "darkWood",
    "timber",
    "dark",
    "panel",
    "sage",
    "siding",
    "frame",
    "glass",
    "doorWood",
    "steelDoor",
    "garage",
    "floorTile",
    "counter",
    "roofSlab",
    "roofWhite",
    "roofDark",
    "roofTile",
    "terracotta",
    "metalRoof",
    "soffitWood",
    "soffitWhite",
    "screen",
    "railMetal",
    "leaves",
  ]
  const xrayMats = new Set<THREE_NS.Material>(XRAY_MATS.map((k) => MATS[k]))
  const baseOpacity = new Map<THREE_NS.Material, number>()
  for (const k of XRAY_MATS) baseOpacity.set(MATS[k], MATS[k].opacity)

  // Layers
  const groups = Object.fromEntries(
    LAYERS.map((l) => {
      const g = new THREE.Group()
      g.name = l
      scene.add(g)
      return [l, g]
    })
  ) as Record<Layer, THREE_NS.Group>

  const pickables: THREE_NS.Mesh[] = []
  const meshesByKey = new Map<string, THREE_NS.Mesh[]>()
  const elByKey = new Map<string, El>()

  const addMesh = (
    el: El,
    geom: THREE_NS.BufferGeometry,
    mat: THREE_NS.Material,
    parent: THREE_NS.Object3D
  ) => {
    const mesh = new THREE.Mesh(geom, mat)
    const key = componentKey(el)
    mesh.userData.key = key
    mesh.userData.seeThrough = xrayMats.has(mat)
    mesh.castShadow = mat !== MATS.glass
    mesh.receiveShadow = true
    parent.add(mesh)
    pickables.push(mesh)
    if (!meshesByKey.has(key)) meshesByKey.set(key, [])
    meshesByKey.get(key)!.push(mesh)
    elByKey.set(key, el)
    return mesh
  }

  const box = (
    el: El,
    size: V3,
    center: V3,
    mat: THREE_NS.Material,
    parent: THREE_NS.Object3D
  ) => {
    const m = addMesh(el, new THREE.BoxGeometry(...size), mat, parent)
    m.position.set(...center)
    return m
  }

  for (const el of els) {
    const parent = groups[el.layer]
    switch (el.kind) {
      case "box": {
        const m = box(el, el.size, el.center, MATS[el.mat], parent)
        if (el.rotation) m.rotation.set(...el.rotation)
        break
      }
      case "roof": {
        const geom = roofGeometry(THREE, el)
        addMesh(el, geom, MATS[el.mat], parent)
        break
      }
      case "tree": {
        const g = new THREE.Group()
        g.position.set(...el.center)
        parent.add(g)
        const trunkH = el.form === "pine" ? el.height * 0.35 : el.height * 0.55
        const trunk = addMesh(
          el,
          new THREE.CylinderGeometry(0.16 * (el.height / 10), 0.3 * (el.height / 10), trunkH, 10),
          MATS.trunk,
          g
        )
        trunk.position.y = trunkH / 2
        if (el.form === "pine") {
          // stacked cones
          for (let i = 0; i < 3; i++) {
            const h = el.height * (0.42 - i * 0.06)
            const cone = addMesh(
              el,
              new THREE.ConeGeometry(el.radius * (1 - i * 0.25), h, 9),
              MATS.leaves,
              g
            )
            cone.position.y = trunkH * 0.7 + i * el.height * 0.2 + h / 2
          }
        } else {
          // a few low-poly blobs forming a wide crown
          const r = el.radius
          const blobs: [number, number, number, number][] = [
            [0, 0, 0, 0.62],
            [0.48, -0.1, 0.2, 0.5],
            [-0.45, -0.05, -0.15, 0.52],
            [0.1, 0.05, -0.5, 0.46],
            [-0.15, -0.12, 0.5, 0.45],
            [0.05, 0.3, 0.05, 0.45],
          ]
          for (const [dx, dy, dz, s] of blobs) {
            const b = addMesh(el, new THREE.IcosahedronGeometry(r * s, 1), MATS.leaves, g)
            b.position.set(dx * r, el.height - r * 0.55 + dy * r, dz * r)
            b.scale.y = 0.72
          }
          // main limbs
          for (const [ax, az] of [
            [0.6, 0.3],
            [-0.5, -0.2],
            [0.1, -0.6],
          ] as const) {
            const limbLen = r * 0.7
            const limb = addMesh(
              el,
              new THREE.CylinderGeometry(0.08 * (el.height / 10), 0.16 * (el.height / 10), limbLen, 8),
              MATS.trunk,
              g
            )
            const dir = new THREE.Vector3(ax, 1, az).normalize()
            limb.position
              .set(0, trunkH, 0)
              .add(dir.clone().multiplyScalar(limbLen / 2))
            limb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
          }
        }
        break
      }
      case "cyl": {
        const m = addMesh(
          el,
          new THREE.CylinderGeometry(el.radius, el.radius, el.height, 40),
          MATS[el.mat],
          parent
        )
        m.position.set(...el.center)
        break
      }
      case "wall": {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(el.length, 0)
        if (el.top?.length) {
          // gabled / sloped top, traced right → left
          for (const [t, extra] of [...el.top].sort((a, b) => b[0] - a[0]))
            shape.lineTo(t, el.height + extra)
        } else {
          shape.lineTo(el.length, el.height)
          shape.lineTo(0, el.height)
        }
        shape.closePath()
        for (const o of el.openings) {
          const hole = new THREE.Path()
          hole.moveTo(o.a, o.bottom)
          hole.lineTo(o.a, o.top)
          hole.lineTo(o.b, o.top)
          hole.lineTo(o.b, o.bottom)
          hole.closePath()
          shape.holes.push(hole)
        }
        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: el.thickness,
          bevelEnabled: false,
        })
        geom.translate(0, 0, -el.thickness / 2)
        const m = addMesh(el, geom, MATS[el.mat], parent)
        m.position.set(...el.origin)
        if (el.axis === "z") m.rotation.y = -Math.PI / 2 // local +x → world +z
        break
      }
      case "pipe": {
        const r = el.radius
        for (let i = 1; i < el.points.length; i++) {
          const a = new THREE.Vector3(...el.points[i - 1]!)
          const b = new THREE.Vector3(...el.points[i]!)
          const dir = b.clone().sub(a)
          const len = dir.length()
          const m = addMesh(
            el,
            new THREE.CylinderGeometry(r, r, len, 18),
            MATS[el.mat],
            parent
          )
          m.position.copy(a.clone().add(b).multiplyScalar(0.5))
          m.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.normalize()
          )
        }
        el.points.slice(1, -1).forEach((p) => {
          const j = addMesh(
            el,
            new THREE.SphereGeometry(r * 1.18, 18, 12),
            MATS[el.mat],
            parent
          )
          j.position.set(...p)
        })
        break
      }
      case "window": {
        const g = new THREE.Group()
        g.position.set(...el.center)
        if (el.axis === "z") g.rotation.y = -Math.PI / 2
        parent.add(g)
        const f = 0.05
        const d = 0.08
        const { width: w, height: h } = el
        box(el, [w, f, d], [0, h / 2 - f / 2, 0], MATS.frame, g)
        box(el, [w, f, d], [0, -h / 2 + f / 2, 0], MATS.frame, g)
        box(el, [f, h, d], [-w / 2 + f / 2, 0, 0], MATS.frame, g)
        box(el, [f, h, d], [w / 2 - f / 2, 0, 0], MATS.frame, g)
        // mullions about every 1.4 m
        const mullions = Math.max(0, Math.ceil(w / 1.4) - 1)
        for (let i = 1; i <= mullions; i++)
          box(
            el,
            [0.04, h - 2 * f, d * 0.8],
            [-w / 2 + (w * i) / (mullions + 1), 0, 0],
            MATS.frame,
            g
          )
        box(el, [w - 2 * f, h - 2 * f, 0.012], [0, 0, 0], MATS.glass, g)
        break
      }
      case "door": {
        const g = new THREE.Group()
        g.position.set(...el.center)
        if (el.axis === "z") g.rotation.y = -Math.PI / 2
        parent.add(g)
        const f = 0.05
        const d = 0.1
        const { width: w, height: h } = el
        box(el, [w, f, d], [0, h / 2 - f / 2, 0], MATS.frame, g)
        box(el, [f, h, d], [-w / 2 + f / 2, 0, 0], MATS.frame, g)
        box(el, [f, h, d], [w / 2 - f / 2, 0, 0], MATS.frame, g)
        const leafW = (w - 2 * f) / el.leaves
        for (let k = 0; k < el.leaves; k++) {
          const x = -w / 2 + f + leafW * (k + 0.5)
          if (el.style === "glass") {
            // aluminium leaf: four rails around a glass pane
            const r = 0.06
            const lh = h - f
            const cy = -f / 2
            box(
              el,
              [leafW - 0.01, r, 0.05],
              [x, cy + lh / 2 - r / 2, 0],
              MATS.frame,
              g
            )
            box(
              el,
              [leafW - 0.01, r, 0.05],
              [x, cy - lh / 2 + r / 2, 0],
              MATS.frame,
              g
            )
            box(
              el,
              [r, lh - 2 * r, 0.05],
              [x - leafW / 2 + r / 2 + 0.005, cy, 0],
              MATS.frame,
              g
            )
            box(
              el,
              [r, lh - 2 * r, 0.05],
              [x + leafW / 2 - r / 2 - 0.005, cy, 0],
              MATS.frame,
              g
            )
            box(
              el,
              [leafW - 2 * r - 0.01, lh - 2 * r, 0.012],
              [x, cy, 0],
              MATS.glass,
              g
            )
          } else if (el.style === "garage") {
            // sectional door: horizontal panels
            const n = 5
            const ph = (h - f) / n
            for (let p = 0; p < n; p++)
              box(
                el,
                [leafW - 0.01, ph - 0.02, 0.05],
                [x, -h / 2 + ph * (p + 0.5), 0],
                MATS.garage,
                g
              )
          } else {
            box(
              el,
              [leafW - 0.01, h - f - 0.01, 0.04],
              [x, -f / 2, 0],
              el.style === "wood" ? MATS.doorWood : MATS.steelDoor,
              g
            )
          }
        }
        break
      }
    }
  }

  // Ground (semi-transparent so the foundations stay visible)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(siteW + 30, siteD + 26),
    new THREE.MeshStandardMaterial({
      color: "#86a873",
      roughness: 1,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.set(cx, GROUND_LEVEL - 0.002, cz)
  ground.receiveShadow = true
  scene.add(ground)

  // Structural grid lines + bubbles (part of the structure layer, not pickable)
  const gridGroup = new THREE.Group()
  groups.struct.add(gridGroup)
  const lineMat = new THREE.LineDashedMaterial({
    color: "#c0392b",
    dashSize: 0.3,
    gapSize: 0.18,
  })
  const y = GROUND_LEVEL + 0.01
  const bubble = (label: string, pos: V3) => {
    const c = document.createElement("canvas")
    c.width = c.height = 128
    const ctx = c.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#c0392b"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(64, 64, 54, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = "#c0392b"
    ctx.font = "bold 64px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(label, 64, 68)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, depthTest: false })
    )
    s.scale.set(0.6, 0.6, 1)
    s.position.set(...pos)
    s.renderOrder = 10
    gridGroup.add(s)
  }
  const line = (a: V3, b: V3) => {
    const l = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...a),
        new THREE.Vector3(...b),
      ]),
      lineMat
    )
    l.computeLineDistances()
    gridGroup.add(l)
  }
  const [hx0, , hz0] = house.min
  const [hx1, , hz1] = house.max
  grid.xs.forEach((x, i) => {
    line([x, y, hz0 - 1.9], [x, y, hz1 + 1.9])
    bubble(grid.xNames[i]!, [x, y + 0.3, hz1 + 2.3])
  })
  grid.zs.forEach((z, j) => {
    line([hx0 - 1.9, y, z], [hx1 + 1.9, y, z])
    bubble(grid.zNames[j]!, [hx0 - 2.3, y + 0.3, z])
  })

  /* ---------- selection ---------- */
  const hlCache = new Map<THREE_NS.Material, THREE_NS.Material>()
  const highlight = (mat: THREE_NS.Material) => {
    let h = hlCache.get(mat)
    if (!h) {
      const c = (mat as THREE_NS.MeshStandardMaterial).clone()
      c.emissive = new THREE.Color("#ffb020")
      c.emissiveIntensity = 0.55
      if (c.transparent) c.opacity = Math.max(c.opacity, 0.55)
      hlCache.set(mat, c)
      h = c
    }
    return h
  }
  let selectedKey: string | null = null
  const original = new Map<THREE_NS.Mesh, THREE_NS.Material>()
  const select = (key: string | null) => {
    for (const [mesh, mat] of original) mesh.material = mat
    original.clear()
    selectedKey = key
    if (!key) {
      onSelect(null)
      return
    }
    for (const mesh of meshesByKey.get(key) ?? []) {
      original.set(mesh, mesh.material as THREE_NS.Material)
      mesh.material = highlight(mesh.material as THREE_NS.Material)
    }
    const el = elByKey.get(key)!
    onSelect({ info: el.info, layer: el.layer })
  }

  /* ---------- picking ---------- */
  let xrayOn = false
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const shown = (o: THREE_NS.Object3D | null) => {
    for (let p = o; p; p = p.parent) if (!p.visible) return false
    return true
  }
  const pick = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1
    )
    ray.setFromCamera(ndc, camera)
    const hits = ray
      .intersectObjects(pickables, false)
      .filter((h) => shown(h.object))
    // In x-ray mode, see-through walls/roof should not block what is behind them.
    const hit =
      (xrayOn && hits.find((h) => !h.object.userData.seeThrough)) || hits[0]
    return hit?.object as THREE_NS.Mesh | undefined
  }

  let down: { x: number; y: number } | null = null
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY })
  const onUp = (e: PointerEvent) => {
    if (
      down &&
      Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5 &&
      e.button === 0
    ) {
      const hit = pick(e)
      const key = (hit?.userData.key as string | undefined) ?? null
      select(key === selectedKey ? null : key)
    }
    down = null
  }
  let hoverQueued = false
  const onMove = (e: PointerEvent) => {
    if (e.buttons || hoverQueued) return
    hoverQueued = true
    requestAnimationFrame(() => {
      hoverQueued = false
      renderer.domElement.style.cursor = pick(e) ? "pointer" : "grab"
    })
  }
  const el = renderer.domElement
  el.addEventListener("pointerdown", onDown)
  el.addEventListener("pointerup", onUp)
  el.addEventListener("pointermove", onMove)

  /* ---------- size + loop ---------- */
  const resize = () => {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()

  // Default view: pull the camera back on narrow (portrait) viewers so the
  // whole house fits; on wide ones keep it shifted left of the control panel.
  const homeView = () => {
    const a = camera.aspect || 1.6
    const f = Math.min(2.3, Math.max(1, 1.75 / a))
    const target = a < 1.2 ? CENTER.clone() : HOME_TARGET.clone()
    camera.position
      .copy(target)
      .add(HOME_POS.clone().sub(HOME_TARGET).multiplyScalar(f))
    controls.target.copy(target)
    controls.update()
  }
  homeView()
  const ro = new ResizeObserver(resize)
  ro.observe(host)

  let raf = 0
  let running = false
  const tick = () => {
    raf = requestAnimationFrame(tick)
    controls.update()
    renderer.render(scene, camera)
  }
  const start = () => {
    if (!running) {
      running = true
      tick()
    }
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }
  // Only render while the viewer is on screen.
  const io = new IntersectionObserver(([entry]) =>
    entry?.isIntersecting ? start() : stop()
  )
  io.observe(host)
  renderer.render(scene, camera)

  const api: Api = {
    setLayer(layer, on) {
      groups[layer].visible = on
      if (!on && selectedKey && elByKey.get(selectedKey)?.layer === layer)
        select(null)
    },
    setXray(on) {
      xrayOn = on
      for (const k of XRAY_MATS) {
        const m = MATS[k]
        m.transparent = on || k === "glass"
        m.opacity = on ? (k === "glass" ? 0.12 : 0.16) : baseOpacity.get(m)!
        m.depthWrite = !on && k !== "glass"
        m.needsUpdate = true
      }
      for (const mesh of pickables) {
        if (mesh.userData.seeThrough)
          mesh.castShadow = !on && mesh.material !== MATS.glass
      }
      // Rebuild highlight materials so they follow the new transparency.
      const key = selectedKey
      select(null)
      for (const m of hlCache.values()) m.dispose()
      hlCache.clear()
      if (key) select(key)
    },
    reset() {
      homeView()
    },
    clear() {
      select(null)
    },
  }

  const dispose = () => {
    stop()
    io.disconnect()
    ro.disconnect()
    el.removeEventListener("pointerdown", onDown)
    el.removeEventListener("pointerup", onUp)
    el.removeEventListener("pointermove", onMove)
    controls.dispose()
    scene.traverse((o) => {
      const mesh = o as THREE_NS.Mesh
      mesh.geometry?.dispose()
      const mats = ([] as THREE_NS.Material[]).concat(
        (mesh.material as THREE_NS.Material) ?? []
      )
      for (const m of mats) {
        ;(m as THREE_NS.SpriteMaterial).map?.dispose()
        m.dispose()
      }
    })
    for (const m of hlCache.values()) m.dispose()
    lineMat.dispose()
    renderer.dispose()
    el.remove()
  }

  return { dispose, api }
}

/** Pitched roof surface (gable / hip / shed) as a flat-shaded geometry. */
function roofGeometry(
  THREE: Three,
  el: Extract<El, { kind: "roof" }>
): THREE_NS.BufferGeometry {
  const { y, rise, overhang: o, ridge } = el
  // local frame: u along the ridge, v across it
  const [U0, U1] = ridge === "x" ? el.x : el.z
  const [V0, V1] = ridge === "x" ? el.z : el.x
  const P = (u: number, h: number, v: number): V3 =>
    ridge === "x" ? [u, h, v] : [v, h, u]
  const tris: V3[] = []
  const quad = (a: V3, b: V3, c: V3, d: V3) => tris.push(a, b, c, a, c, d)

  if (el.shape === "shed") {
    const high = el.up === "front" || el.up === "right" ? V1 : V0
    const low = high === V1 ? V0 : V1
    const h = (v: number) => y + (rise * (v - low)) / (high - low)
    quad(
      P(U0 - o, h(V0 - o), V0 - o),
      P(U1 + o, h(V0 - o), V0 - o),
      P(U1 + o, h(V1 + o), V1 + o),
      P(U0 - o, h(V1 + o), V1 + o)
    )
  } else {
    const d = (V1 - V0) / 2
    const vc = (V0 + V1) / 2
    const ye = y - (o * rise) / d
    const yr = y + rise
    let r0 = U0 - o
    let r1 = U1 + o
    if (el.shape === "hip") {
      r0 = U0 + d
      r1 = U1 - d
      if (r0 > r1) r0 = r1 = (U0 + U1) / 2
      tris.push(P(U0 - o, ye, V0 - o), P(U0 - o, ye, V1 + o), P(r0, yr, vc))
      tris.push(P(U1 + o, ye, V1 + o), P(U1 + o, ye, V0 - o), P(r1, yr, vc))
    }
    quad(P(U0 - o, ye, V1 + o), P(U1 + o, ye, V1 + o), P(r1, yr, vc), P(r0, yr, vc))
    quad(P(U1 + o, ye, V0 - o), P(U0 - o, ye, V0 - o), P(r0, yr, vc), P(r1, yr, vc))
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute("position", new THREE.Float32BufferAttribute(tris.flat(), 3))
  geom.computeVertexNormals()
  return geom
}

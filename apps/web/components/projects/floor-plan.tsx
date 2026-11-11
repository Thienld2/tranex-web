import { type Plan, PLAN_H, PLAN_W, type Rect, type RoomRole } from "@/lib/floor-plan"
import type { Content } from "@/lib/i18n/types"

type PlanLabels = Content["projectDetail"]["plan"]

const ROOM_FILL: Record<RoomRole, string> = {
  living: "#86b4e0",
  kitchen: "#6f9cc6",
  bed: "#66788b",
  bath: "#52667a",
  garage: "#4a5664",
  stair: "#3d4957",
  terrace: "#8b98a6",
}

/** Rectangle as a path, so stroke-dash "drawing" works everywhere. */
const rp = (r: Rect) => `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}Z`

/**
 * Round trig results: Math.sin/cos can differ in the last bits between the
 * server (Node) and the browser, which would cause hydration mismatches.
 */
const f = (n: number) => Math.round(n * 10) / 10

/**
 * Night-blue architectural site plan (walls in white, rooms tinted, lawn,
 * pool, trees). `draw` (0→1) traces the line work, `fill` (0→1) floods the
 * colours in — both driven by scroll from the project film.
 */
export function FloorPlan({
  plan,
  labels,
  projectName,
  draw,
  fill,
}: {
  plan: Plan
  labels: PlanLabels
  projectName: string
  draw: number
  fill: number
}) {
  const line = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw }
  const edgeText = {
    street: labels.street,
    sidewalk: labels.sidewalk,
    sea: labels.sea,
    garden: labels.garden,
  }

  return (
    <svg
      viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={`${labels.title} – ${projectName}`}
    >
      <defs>
        <pattern id="fp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(130,180,230,0.08)" strokeWidth="1" />
        </pattern>
        <pattern id="fp-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V10" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        </pattern>
        <linearGradient id="fp-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e3f73" />
          <stop offset="1" stopColor="#1f74bd" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <rect width={PLAN_W} height={PLAN_H} fill="#0b1626" />
      <rect width={PLAN_W} height={PLAN_H} fill="url(#fp-grid)" />

      {/* Sea */}
      {plan.sea && (
        <g opacity={fill}>
          <rect {...plan.sea} fill="url(#fp-sea)" />
          {[40, 78, 116].map((y) => (
            <path
              key={y}
              d={`M0 ${y} ${"q 20 -8 40 0 t 40 0 ".repeat(20)}`}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {/* Street + sidewalk */}
      <rect {...plan.street} fill="#121c29" />
      <path
        d={`M0 ${plan.street.y + plan.street.h / 2}H${PLAN_W}`}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="2"
        strokeDasharray="26 20"
      />
      <path d={rp(plan.sidewalk)} fill="#1b2737" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" {...line} />

      {/* Neighbouring lots */}
      {plan.neighbours.map((n, i) => (
        <path
          key={`n${i}`}
          d={rp(n)}
          fill="url(#fp-hatch)"
          fillOpacity={fill}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          {...line}
        />
      ))}

      {/* Site, lawn, paving */}
      <path d={rp(plan.site)} fill="#10233a" fillOpacity={fill} stroke="rgba(255,255,255,0.75)" strokeWidth="2" {...line} />
      {plan.lawn.map((r, i) => (
        <path key={`l${i}`} d={rp(r)} fill="#2a5a3c" fillOpacity={fill * 0.95} />
      ))}
      {plan.paving.map((r, i) => (
        <path key={`p${i}`} d={rp(r)} fill="#4b5664" fillOpacity={fill} stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" {...line} />
      ))}

      {/* Pools */}
      {plan.pools.map((r, i) => (
        <g key={`w${i}`}>
          <path d={rp(r)} fill="#2f97e6" fillOpacity={fill} stroke="#a6dcff" strokeWidth="2.5" {...line} />
          <path
            d={rp({ x: r.x + 9, y: r.y + 9, w: r.w - 18, h: r.h - 18 })}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            opacity={fill}
          />
        </g>
      ))}

      {/* Rooms */}
      {plan.rooms.map((r, i) => (
        <path
          key={`r${i}`}
          d={rp(r)}
          fill={ROOM_FILL[r.role]}
          fillOpacity={fill * 0.92}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
          {...line}
        />
      ))}

      {/* Stair treads */}
      {plan.rooms
        .filter((r) => r.role === "stair")
        .map((r, i) => {
          const alongX = r.w >= r.h
          const n = Math.floor((alongX ? r.w : r.h) / 14)
          return (
            <g key={`s${i}`} opacity={fill} stroke="rgba(255,255,255,0.55)" strokeWidth="1">
              {Array.from({ length: n }, (_, k) =>
                alongX ? (
                  <path key={k} d={`M${r.x + 7 + k * 14} ${r.y + 6}V${r.y + r.h - 6}`} />
                ) : (
                  <path key={k} d={`M${r.x + 6} ${r.y + 7 + k * 14}H${r.x + r.w - 6}`} />
                )
              )}
            </g>
          )
        })}

      {/* Door swings */}
      {plan.rooms
        .filter((r) => r.role !== "stair" && r.w > 74 && r.h > 74)
        .map((r, i) => {
          const d = Math.min(26, r.w / 3, r.h / 3)
          const cx = r.x + 8
          const cy = r.y + r.h - 8
          return (
            <path
              key={`d${i}`}
              d={`M${cx + d} ${cy}A${d} ${d} 0 0 0 ${cx} ${cy - d}L${cx} ${cy}`}
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.1"
              {...line}
            />
          )
        })}

      {/* Outer walls */}
      {plan.wings.map((w, i) => (
        <path key={`o${i}`} d={rp(w)} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="miter" {...line} />
      ))}

      {/* Trees / palms */}
      <g opacity={fill}>
        {plan.trees.map((t, i) =>
          t.palm ? (
            <g key={`t${i}`} transform={`translate(${t.x} ${t.y})`}>
              <circle r={t.r * 0.55} fill="#2f7d4b" />
              {Array.from({ length: 9 }, (_, k) => {
                const a = (k / 9) * Math.PI * 2
                return (
                  <path
                    key={k}
                    d={`M0 0Q${f(Math.cos(a + 0.4) * t.r * 0.6)} ${f(Math.sin(a + 0.4) * t.r * 0.6)} ${f(Math.cos(a) * t.r)} ${f(Math.sin(a) * t.r)}`}
                    stroke="#7ad39a"
                    strokeWidth="2"
                    fill="none"
                  />
                )
              })}
            </g>
          ) : (
            <g key={`t${i}`} transform={`translate(${t.x} ${t.y})`}>
              <circle r={t.r} fill="#2b6a40" stroke="#6cc58c" strokeWidth="1.5" />
              <circle r={t.r * 0.45} fill="none" stroke="rgba(160,230,180,0.5)" strokeWidth="1" />
            </g>
          )
        )}
      </g>

      {/* Room labels */}
      <g opacity={fill * 0.9} fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="1">
        {plan.rooms
          .filter((r) => r.w >= 70 && r.h >= 48)
          .map((r, i) => (
            <text key={`rl${i}`} x={r.x + r.w / 2} y={r.y + r.h / 2 + 4}>
              {labels.rooms[r.role].toUpperCase()}
            </text>
          ))}
      </g>

      {/* Edge labels (street, sidewalk, sea, garden) */}
      <g opacity={fill * 0.75} fill="#ffffff" fontSize="15" fontWeight="700" textAnchor="middle" letterSpacing="5">
        {plan.labels.map((l, i) => (
          <text key={`el${i}`} x={l.x} y={l.y} transform={l.rotate ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}>
            {edgeText[l.key].toUpperCase()}
          </text>
        ))}
      </g>

      {/* Title block */}
      <g opacity={fill} transform="translate(40 36)">
        <rect width="340" height="86" fill="rgba(11,22,38,0.7)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
        <path d="M0 30H340" stroke="rgba(255,255,255,0.35)" />
        <text x="16" y="21" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="700" letterSpacing="3">
          {labels.title.toUpperCase()} · {labels.scale}
        </text>
        <text x="16" y="62" fill="#ffffff" fontSize="20" fontWeight="700">
          {projectName.length > 30 ? `${projectName.slice(0, 29)}…` : projectName}
        </text>
      </g>

      {/* North arrow + scale bar */}
      <g opacity={fill} transform="translate(1520 82)" stroke="rgba(255,255,255,0.7)" fill="none" strokeWidth="1.5">
        <circle r="30" />
        <path d="M0 -24L9 12L0 5L-9 12Z" fill="#ffffff" stroke="none" />
        <text y="-36" textAnchor="middle" fill="#ffffff" stroke="none" fontSize="14" fontWeight="700">
          N
        </text>
      </g>
      <g opacity={fill} transform="translate(1340 735)" fill="#ffffff" fontSize="11">
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={k * 40} y="0" width="40" height="7" fill={k % 2 ? "rgba(255,255,255,0.15)" : "#ffffff"} stroke="#ffffff" strokeWidth="1" />
        ))}
        <text x="0" y="22">0</text>
        <text x="80" y="22" textAnchor="middle">5</text>
        <text x="160" y="22" textAnchor="end">10 m</text>
      </g>
    </svg>
  )
}

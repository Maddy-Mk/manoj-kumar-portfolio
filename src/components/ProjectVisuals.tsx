import {
  Activity,
  BedDouble,
  Database,
  FileText,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import type { ProjectVisual } from "../data/projects";

const TASKFLOW_IMAGE_URL = `${import.meta.env.BASE_URL}images/taskflow-main.png`;

const skeletonPoints = [
  [200, 252],
  [160, 220],
  [130, 185],
  [105, 145],
  [88, 105],
  [165, 192],
  [157, 142],
  [160, 95],
  [166, 54],
  [202, 186],
  [202, 132],
  [204, 78],
  [208, 34],
  [238, 192],
  [246, 142],
  [253, 95],
  [260, 58],
  [270, 210],
  [290, 168],
  [305, 130],
  [316, 98],
] as const;

const skeletonBones = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
] as const;

function GestureVisual() {
  return (
    <div className="gesture-demo">
      <div className="demo-toolbar">
        <span className="live-indicator"><i /> Sample landmark frame</span>
        <span>CAM 01 · LOCAL PREVIEW</span>
      </div>
      <svg
        viewBox="0 0 420 300"
        role="img"
        aria-label="Hand landmark tracking interface with 21 detected points"
      >
        {skeletonBones.map(([start, end]) => (
          <line
            key={`${start}-${end}`}
            x1={skeletonPoints[start][0]}
            y1={skeletonPoints[start][1]}
            x2={skeletonPoints[end][0]}
            y2={skeletonPoints[end][1]}
          />
        ))}
        {skeletonPoints.map(([x, y], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r={index === 0 ? 6 : 4} />
            <text x={x + 8} y={y - 7}>{String(index).padStart(2, "0")}</text>
          </g>
        ))}
      </svg>
      <div className="demo-output">
        <span>Gesture</span>
        <strong>PINCH / EDGE</strong>
        <span>Action</span>
        <strong>LEFT CLICK</strong>
      </div>
    </div>
  );
}

function VedaVisual() {
  const rows = [
    ["Auth & staff", "JWT + RBAC", "44 routes", "Guarded"],
    ["Patient flow", "Records + beds", "18 tables", "Linked"],
    ["Pharmacy + labs", "Stock + orders", "22 keys", "Linked"],
  ];

  return (
    <div className="veda-demo" aria-label="VEDA healthcare system architecture preview">
      <aside>
        <div className="veda-mark">V</div>
        <Activity aria-hidden="true" />
        <Users aria-hidden="true" />
        <BedDouble aria-hidden="true" />
        <FlaskConical aria-hidden="true" />
      </aside>
      <div className="veda-main">
        <div className="veda-topbar">
          <div>
            <span>SYSTEM MAP / VERIFIED STRUCTURE</span>
            <strong>Healthcare operations</strong>
          </div>
          <span className="role-chip"><ShieldCheck size={13} /> Role model</span>
        </div>
        <div className="veda-metrics">
          <div><Users /><span>Staff roles</span><strong>6</strong></div>
          <div><Stethoscope /><span>API endpoints</span><strong>45</strong></div>
          <div><BedDouble /><span>Relational tables</span><strong>18</strong></div>
        </div>
        <div className="veda-table">
          <div className="veda-table-title">
            <span>Connected domains</span>
            <span><Database size={14} /> 22 foreign keys</span>
          </div>
          {rows.map((row) => (
            <div className="veda-row" key={row[0]}>
              {row.map((cell) => <span key={cell}>{cell}</span>)}
            </div>
          ))}
        </div>
        <div className="veda-footer">
          <span><FileText size={14} /> Audit trail active</span>
          <span>JWT · RBAC · MYSQL</span>
        </div>
      </div>
    </div>
  );
}

function TaskFlowVisual() {
  return (
    <figure className="taskflow-demo">
      <img
        src={TASKFLOW_IMAGE_URL}
        alt="TaskFlow dashboard showing task statistics and task management controls"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        Actual project interface · main task view
      </figcaption>
    </figure>
  );
}

export function ProjectVisual({ type }: { type: ProjectVisual }) {
  if (type === "gesture") return <GestureVisual />;
  if (type === "veda") return <VedaVisual />;
  return <TaskFlowVisual />;
}

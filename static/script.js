const HISTORY_LEN = 20;
const history = { cpu: [], ram: [], temp: [] };

let prevServiceCount = -1;
let prevDockerCount = -1;

async function loadStats() {
  try {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const d = await res.json();

    document.getElementById("hostname").textContent = d.hostname;
    document.getElementById("local-ip").textContent = d.local_ip;
    document.getElementById("uptime").textContent = formatUptime(d.uptime);
    document.getElementById("system").textContent = d.system;
    document.getElementById("kernel").textContent = d.kernel;
    document.getElementById("cpu-count").textContent = d.cpu_count ?? "--";
    document.getElementById("updated-at").textContent = d.updated_at;

    if (d.network) {
      document.getElementById("net-label").innerHTML =
        `Network &uarr; ${fmtBytes(d.network.bytes_sent)} &nbsp; &darr; ${fmtBytes(d.network.bytes_recv)}`;
    }

    updateMetric("cpu", d.cpu, 70, 90);
    updateMetric("ram", d.ram, 70, 90);
    updateMetric("disk", d.disk, 75, 90);
    updateMetric("temp", d.temperature ?? 0, 65, 80);

    const ramUsed = d.ram_used_mb ? (d.ram_used_mb / 1024).toFixed(1) : null;
    const ramTotal = d.ram_total_mb ? (d.ram_total_mb / 1024).toFixed(1) : null;
    if (ramUsed && ramTotal)
      document.getElementById("ram-sub").textContent = `${ramUsed} / ${ramTotal} GB`;

    if (d.disk_used_gb != null && d.disk_total_gb != null)
      document.getElementById("disk-sub").textContent =
        `${d.disk_used_gb} / ${d.disk_total_gb} GB`;

    if (d.cpu_count)
      document.getElementById("cpu-sub").textContent = `${d.cpu_count} cores`;

    if (d.temperature != null)
      document.getElementById("temp-sub").textContent =
        d.temperature >= 80 ? "⚠ Throttling risk" :
        d.temperature >= 65 ? "Warm" : "OK";

    pushHistory("cpu", d.cpu);
    pushHistory("ram", d.ram);
    pushHistory("temp", d.temperature ?? 0);
    drawSparkline("cpu-spark", history.cpu, d.cpu, 70, 90);
    drawSparkline("ram-spark", history.ram, d.ram, 70, 90);
    drawSparkline("temp-spark", history.temp, d.temperature ?? 0, 65, 80);

    if (d.services.length !== prevServiceCount) {
      renderServices(d.services);
      prevServiceCount = d.services.length;
    }
    if (d.docker.length !== prevDockerCount) {
      renderDocker(d.docker);
      prevDockerCount = d.docker.length;
    }

    setOnline(true);
  } catch (e) {
    setOnline(false);
    console.error("Stats fetch failed:", e);
  }
}

function setOnline(ok) {
  const dot = document.querySelector(".status-dot");
  const pill = document.querySelector(".status-pill");
  if (dot) dot.style.background = ok ? "var(--good)" : "var(--danger)";
  if (pill) pill.querySelector("span:last-child") || null;
}

function updateMetric(id, value, warnLimit, dangerLimit) {
  const num = Number(value).toFixed(1);
  document.getElementById(id).textContent = num;

  const bar = document.getElementById(`${id}-bar`);
  const pct = Math.min(value, 100);
  bar.style.width = pct + "%";

  const status = document.getElementById(`${id}-status`);
  if (value >= dangerLimit) {
    status.textContent = "High";
    status.className = "badge danger";
    bar.className = "progress-fill danger";
  } else if (value >= warnLimit) {
    status.textContent = "Medium";
    status.className = "badge warning";
    bar.className = "progress-fill warning";
  } else {
    status.textContent = "Normal";
    status.className = "badge";
    bar.className = "progress-fill";
  }
}

function pushHistory(key, val) {
  history[key].push(val);
  if (history[key].length > HISTORY_LEN) history[key].shift();
}

function drawSparkline(canvasId, data, current, warnLimit, dangerLimit) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || data.length < 2) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const max = 100;
  const pts = data.map((v, i) => ({
    x: (i / (HISTORY_LEN - 1)) * w,
    y: h - (v / max) * h,
  }));

  const color = current >= dangerLimit ? "#ef4444"
              : current >= warnLimit  ? "#f59e0b"
              : "#7c3aed";

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1].x + pts[i].x) / 2;
    ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = color + "22";
  ctx.fill();
}

function renderServices(services) {
  const box = document.getElementById("services-list");
  if (!services.length) {
    box.innerHTML = `<p class="muted">No running services found.</p>`;
    return;
  }
  box.innerHTML = services.map(s => `
    <div class="list-row">
      <span>${escHtml(s.name)}</span>
      <strong class="online">Running</strong>
    </div>
  `).join("");
}

function renderDocker(containers) {
  const box = document.getElementById("docker-list");
  if (!containers.length) {
    box.innerHTML = `<p class="muted">No Docker containers found.</p>`;
    return;
  }
  box.innerHTML = containers.map(c => `
    <div class="list-row">
      <span>${escHtml(c.name)}</span>
      <strong class="${c.running ? "online" : "danger"}">${c.running ? "Running" : "Stopped"}</strong>
    </div>
    <small>${escHtml(c.image)}${c.ports ? " · " + escHtml(c.ports) : ""}</small>
  `).join("");
}

function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  return `${h}h ${m}m`;
}

function fmtBytes(b) {
  if (b >= 1e9) return (b / 1e9).toFixed(1) + " GB";
  if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
  if (b >= 1e3) return (b / 1e3).toFixed(1) + " KB";
  return b + " B";
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadStats();
setInterval(loadStats, 3000);
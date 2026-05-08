from flask import Flask, render_template, jsonify
import psutil
import socket
import time
import platform
import subprocess

app = Flask(__name__)


def run_cmd(command):
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True, timeout=3
        )
        return result.stdout.strip()
    except Exception:
        return ""


def get_ip():
    output = run_cmd("hostname -I")
    return output.split()[0] if output else "N/A"


def get_services():
    output = run_cmd(
        "systemctl list-units --type=service --state=running --no-pager --no-legend"
    )
    services = []
    for line in output.splitlines()[:12]:
        parts = line.split()
        if parts:
            services.append({"name": parts[0].replace(".service", ""), "status": "running"})
    return services


def get_docker_containers():
    output = run_cmd(
        "docker ps -a --format '{{.Names}}|{{.Status}}|{{.Image}}|{{.Ports}}'"
    )
    containers = []
    for line in output.splitlines():
        parts = line.split("|")
        if len(parts) >= 3:
            raw_status = parts[1]
            running = raw_status.lower().startswith("up")
            containers.append({
                "name": parts[0],
                "status": raw_status,
                "running": running,
                "image": parts[2],
                "ports": parts[3] if len(parts) > 3 else "",
            })
    return containers


def get_temperature():
    try:
        temps = psutil.sensors_temperatures()
        for key in ("cpu_thermal", "coretemp", "acpitz", "cpu-thermal"):
            if key in temps and temps[key]:
                return round(temps[key][0].current, 1)
    except Exception:
        pass

    output = run_cmd("vcgencmd measure_temp")
    if "temp=" in output:
        try:
            return round(float(output.replace("temp=", "").replace("'C", "")), 1)
        except ValueError:
            pass

    return None


def get_network():
    try:
        net = psutil.net_io_counters()
        return {
            "bytes_sent": net.bytes_sent,
            "bytes_recv": net.bytes_recv,
        }
    except Exception:
        return {"bytes_sent": 0, "bytes_recv": 0}


def get_stats():
    vm = psutil.virtual_memory()
    du = psutil.disk_usage("/")

    return {
        "hostname": socket.gethostname(),
        "local_ip": get_ip(),
        "system": platform.system(),
        "kernel": platform.release(),
        "cpu": psutil.cpu_percent(interval=1),
        "cpu_count": psutil.cpu_count(logical=True),
        "ram": vm.percent,
        "ram_used_mb": round(vm.used / 1024 / 1024, 1),
        "ram_total_mb": round(vm.total / 1024 / 1024, 1),
        "disk": du.percent,
        "disk_used_gb": round(du.used / 1024 / 1024 / 1024, 1),
        "disk_total_gb": round(du.total / 1024 / 1024 / 1024, 1),
        "temperature": get_temperature(),
        "uptime": int(time.time() - psutil.boot_time()),
        "services": get_services(),
        "docker": get_docker_containers(),
        "network": get_network(),
        "updated_at": time.strftime("%H:%M:%S"),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/stats")
def stats():
    return jsonify(get_stats())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
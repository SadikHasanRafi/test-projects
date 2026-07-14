import os from "os";
import { UAParser } from "ua-parser-js";
// import si from "systeminformation";
// import { UAParser } from "ua-parser-js";

const formatBytes = (bytes = 0) => {
  bytes = Number(bytes);

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const getStatusIcon = (status) => {
  if (status >= 500) return "✖";
  if (status >= 400) return "⚠";
  return "✔";
};

const getTime = () => {
  return new Date().toLocaleTimeString("en-GB");
};

export const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", async () => {
    const latency =
      Number(process.hrtime.bigint() - start) / 1_000_000;

    const upload = formatBytes(req.headers["content-length"] || 0);

    const download = formatBytes(
      res.getHeader("content-length") || 0
    );

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown";

    const parser = new UAParser(req.headers["user-agent"]);

    const browser = parser.getBrowser().name || "Unknown";

    const version = parser.getBrowser().version || "";

    const osName = parser.getOS().name || "";

    const memory = process.memoryUsage();

    const ram = formatBytes(memory.heapUsed);

    const cpu = await si.currentLoad();

    const cpuUsage = cpu.currentLoad.toFixed(1);

    const user = req.user?.id || "Guest";

    console.log("");

    console.log(
      `[${getTime()}] ${getStatusIcon(res.statusCode)} ${req.method} ${res.statusCode} ${latency.toFixed(
        2
      )}ms`
    );

    console.log(`├─ 🌍 URL      : ${req.originalUrl}`);
    console.log(`├─ 🌐 IP       : ${ip}`);
    console.log(`├─ 👤 User     : ${user}`);
    console.log(
      `├─ 💻 Browser  : ${browser} ${version} (${osName})`
    );
    console.log(`├─ 📤 Upload   : ${upload}`);
    console.log(`├─ 📥 Download : ${download}`);
    console.log(`├─ 💾 RAM      : ${ram}`);
    console.log(`├─ 🧠 CPU      : ${cpuUsage}%`);
    console.log(
      "└──────────────────────────────────────────────────────────────"
    );
  });

  next();
};
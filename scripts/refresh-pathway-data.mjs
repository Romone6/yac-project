import { spawnSync } from "node:child_process";

const target = process.argv[2] ?? "all";

const commands = {
  scholarships: ["node", ["scripts/import-scholarships.mjs"]],
  timelines: ["node", ["scripts/import-timelines.mjs"]],
  subjects: ["node", ["scripts/import-subject-alignment.mjs"]],
};

const order =
  target === "all" ? ["scholarships", "timelines", "subjects"] : [target];

for (const item of order) {
  if (!commands[item]) {
    console.error(`Unknown refresh target: ${item}`);
    process.exit(1);
  }

  const [cmd, args] = commands[item];
  console.log(`\n== Refreshing ${item} ==`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

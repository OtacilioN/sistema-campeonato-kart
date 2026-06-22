import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

const localDatabaseUrl =
  "postgresql://velocidade:velocidade@localhost:54329/velocidade_dev?schema=public";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function hasDockerCompose() {
  const result = spawnSync("docker", ["compose", "version"], {
    stdio: "ignore",
  });
  return result.status === 0;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPostgres() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const result = spawnSync(
      "docker",
      ["compose", "exec", "-T", "postgres", "pg_isready", "-U", "velocidade", "-d", "velocidade_dev"],
      { stdio: "ignore" },
    );

    if (result.status === 0) {
      return;
    }

    await wait(1000);
  }

  console.error("Postgres local nao ficou pronto dentro do tempo esperado.");
  process.exit(1);
}

if (!hasDockerCompose()) {
  console.error("Docker Compose nao esta disponivel. Instale/abra o Docker para rodar npm run dev.");
  process.exit(1);
}

console.log("Subindo Postgres local em Docker...");
run("docker", ["compose", "up", "-d", "postgres"]);
await waitForPostgres();

console.log("Postgres local pronto em localhost:54329.");
console.log("Iniciando Next.js com DATABASE_URL local.");

const next = spawn("next", ["dev"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: localDatabaseUrl,
  },
  shell: process.platform === "win32",
});

next.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});

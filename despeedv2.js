import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import Table from "cli-table3";
import chalk from "chalk";

dotenv.config();

const ACCOUNTS_FILE = "accounts1.txt";
const TOKEN_FILE = "token1.txt";
const CAPTCHA_API = "https://v1.captchaly.com/hcaptcha";
const LOGIN_URL = "https://app.despeed.net/v1/api/auth/login";
const SITE_KEY = "88768106-0292-4886-b0a2-fc92c48ea536";
const LOGIN_PAGE = "https://app.despeed.net/";

async function readAccounts() {
  const data = fs.readFileSync(ACCOUNTS_FILE, "utf-8");
  return data.trim().split("\n").map((line) => {
    const [email, password] = line.split(":");
    return { email, password };
  });
}

async function solveCaptcha() {
  console.log(chalk.yellow("🔄 Solving captcha..."));
  try {
    const response = await axios.get(`${CAPTCHA_API}?sitekey=${SITE_KEY}&url=${LOGIN_PAGE}`, {
      headers: { Authorization: `Bearer ${process.env.CAPTCHA_API_KEY}` },
    });
    if (response.data?.token) {
      console.log(chalk.green("✅ Captcha solved!"));
      return response.data.token;
    }
    throw new Error("Captcha solving failed");
  } catch (error) {
    console.error(chalk.red("❌ Captcha error:"), error.message);
    return null;
  }
}

async function loginAccount(email, password) {
  console.log(chalk.blue(`[${email}] 🔄 Trying to login...`));

  const captchaToken = await solveCaptcha();
  if (!captchaToken) {
    console.log(chalk.red(`[${email}] ❌ Skipping due to captcha failure.`));
    return { email, status: "Captcha Failed", token: null };
  }

  try {
    const response = await axios.post(LOGIN_URL, {
      emailOrUsername: email,
      password: password,
      captchaResponse: captchaToken,
    }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (response.data?.success) {
      console.log(chalk.green(`[${email}] ✅ Login successful!`));
      return { email, status: "Success", token: response.data.data.accessToken };
    }
    throw new Error("Login failed");
  } catch (error) {
    console.error(chalk.red(`[${email}] ❌ Login error:`), error.message);
    return { email, status: "Failed", token: null };
  }
}

async function main() {
  console.log(chalk.cyan.bold("\n🚀 Despeed Auto Login Bot"));
  console.log(chalk.yellow("GitHub: https://github.com/despeedbot | Telegram: https://t.me/despeed"));
  console.log(chalk.cyan("\n🔄 Starting multi-account login...\n"));

  const accounts = await readAccounts();
  let successfulTokens = [];

  // Tabel header
  const table = new Table({
    head: [
      chalk.magenta.bold("Email"),
      chalk.magenta.bold("Status"),
      chalk.magenta.bold("Token"),
    ],
    colWidths: [30, 20, 50],
  });

  let successCount = 0;
  let failedCount = 0;

  for (const { email, password } of accounts) {
    const result = await loginAccount(email, password);

    if (result.status === "Success") {
      successfulTokens.push(result.token);
      fs.appendFileSync(TOKEN_FILE, result.token + "\n");
      console.log(chalk.green("✅ Token saved!"));

      table.push([
        chalk.blue(result.email),
        chalk.green.bold(result.status),
        result.token.substring(0, 10) + "...",
      ]);
      successCount++;
    } else {
      table.push([
        chalk.blue(result.email),
        chalk.red.bold(result.status),
        "-",
      ]);
      failedCount++;
    }

    // Menampilkan progress bar
    const totalAccounts = accounts.length;
    const progress = ((successCount + failedCount) / totalAccounts) * 100;
    console.log(chalk.magenta("\n🔁 Session Progress"));
    console.log(
      chalk.bgGreen(" ".repeat(progress / 5) + chalk.white.bold(` ${progress.toFixed(0)}% `)) +
        " ".repeat(20 - progress / 5)
    );

    // Jeda 3 detik setelah setiap login
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log("\n📊 Login Results:");
  console.log(table.toString());

  // Statistik login
  const stats = new Table();
  stats.push(
    { "Total Accounts": chalk.blue(accounts.length) },
    { "Successful Logins": chalk.green(successCount) },
    { "Failed Logins": chalk.red(failedCount) },
    {
      "Success Rate": chalk.green(
        ((successCount / accounts.length) * 100).toFixed(2) + "%"
      ),
    }
  );

  console.log(chalk.yellow.bold("\n📈 Login Statistics"));
  console.log(stats.toString());

  console.log(chalk.cyan("\n✅ All login attempts finished."));
}

main();

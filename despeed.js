import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCOUNTS_FILE = "accounts.txt";
const TOKEN_FILE = "token.txt";
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
  console.log("🔄 Solving captcha...");
  try {
    const response = await axios.get(`${CAPTCHA_API}?sitekey=${SITE_KEY}&url=${LOGIN_PAGE}`, {
      headers: { Authorization: `Bearer ${process.env.CAPTCHA_API_KEY}` },
    });
    if (response.data?.token) {
      console.log("✅ Captcha solved!");
      return response.data.token;
    }
    throw new Error("Captcha solving failed");
  } catch (error) {
    console.error("❌ Captcha error:", error.message);
    return null;
  }
}

async function loginAccount(email, password) {
  console.log(`[${email}] 🔄 Trying to login...`);

  const captchaToken = await solveCaptcha();
  if (!captchaToken) {
    console.log(`[${email}] ❌ Skipping due to captcha failure.`);
    return null;
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
      console.log(`[${email}] ✅ Login successful!`);
      return response.data.data.accessToken;
    }
    throw new Error("Login failed");
  } catch (error) {
    console.error(`[${email}] ❌ Login error:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting multi-account login...");
  const accounts = await readAccounts();

  let successfulTokens = [];

  for (const { email, password } of accounts) {
    const token = await loginAccount(email, password);
    if (token) {
      successfulTokens.push(token);
      fs.appendFileSync(TOKEN_FILE, token + "\n"); // Simpan token ke file
      console.log("✅ Token saved!");
      
      // Jeda 3 detik setelah login sukses
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log("✅ All login attempts finished.");
}

main();

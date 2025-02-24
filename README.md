# 🚀 Despeed Auto Login Bot

## 📌 Description
This bot is designed to automate the login process on the **Despeed** platform using multiple accounts simultaneously. It automatically solves captchas and saves successfully obtained tokens. The login results are displayed in a neat table with final statistics.

## 🎯 Key Features
- ✅ **Multi-Account Login** → Processes multiple accounts in a single execution.
- 🔄 **Automatic Captcha Solving** → Uses an API to solve captchas automatically.
- 📊 **Login Result Table** → Displays login results in a structured CLI table.
- 📈 **Final Statistics** → Shows the number of successful and failed logins along with the success rate.
- ⏳ **Automatic Delay** → Waits 3 seconds after a successful login to avoid spam detection.

## 📂 Setup
### 1️⃣ **Install Dependencies**
Ensure you have **Node.js** installed. If not, download and install it from the [Node.js Official Website](https://nodejs.org/).

Then, run the following command to install the required dependencies:
```bash
npm install axios dotenv cli-table3 chalk
```

### 2️⃣ **Create Configuration File**
Create a `.env` file to store the captcha API key:
```
CAPTCHA_API_KEY=your_captcha_api_key_here
```

### 3️⃣ **Prepare Account & Token Files**
Create an `accounts1.txt` file to store account credentials in the following format:
```
email1@example.com:password123
email2@example.com:password456
```
Tokens from successful logins will be automatically saved in `token1.txt`.

## 🚀 How to Use
Run the bot using the following command:
```bash
node despeed.js
```

## 📊 Sample Output
```bash
🚀 Despeed Auto Login Bot
🔄 Starting multi-account login...

🔄 Solving captcha...
✅ Captcha solved!
[email1@example.com] 🔄 Trying to login...
[email1@example.com] ✅ Login successful!
✅ Token saved!

📊 Login Results:
┌────────────────────────────┬──────────┬─────────────────────────┐
│ Email                      │ Status   │ Token                   │
├────────────────────────────┼──────────┼─────────────────────────┤
│ email1@example.com         │ ✅ Success │ 9a8b7c6d5e...           │
│ email2@example.com         │ ❌ Failed  │ -                       │
└────────────────────────────┴──────────┴─────────────────────────┘

📈 Login Statistics
┌──────────────────┬───────────┐
│ Total Accounts   │ 2         │
├──────────────────┼───────────┤
│ Successful Logins│ 1         │
├──────────────────┼───────────┤
│ Failed Logins    │ 1         │
├──────────────────┼───────────┤
│ Success Rate     │ 50%       │
└──────────────────┴───────────┘

✅ All login attempts finished.
```

## 🛠️ Troubleshooting
If you encounter the error "Cannot find module 'chalk'", try reinstalling the dependencies:
```bash
npm install chalk
```

If the bot fails to log in, ensure that the accounts in `accounts1.txt` are correct and that the captcha API is active.

## 🤝 Contribution
If you want to contribute to improving this bot, feel free to fork the repository and submit a pull request!

## 📜 License
This bot is created for educational purposes. Use it responsibly.

---
Made with ❤️ by [AnakDajjalYalo]
Special Thanks to @ahlulmukh

import fs from "fs";

const INPUT_FILE = "r.txt"; // Ubah sesuai nama file asli
const OUTPUT_FILE = "accounts1.txt";

function convertAccounts() {
  const data = fs.readFileSync(INPUT_FILE, "utf-8");
  
  // Memisahkan berdasarkan baris dan membersihkan data
  const lines = data.split("\n").map(line => line.trim()).filter(line => line && !line.includes("----"));
  
  let accounts = [];
  let email = "";
  
  for (const line of lines) {
    if (line.startsWith("Email: ")) {
      email = line.replace("Email: ", "").trim();
    } else if (line.startsWith("Password: ")) {
      const password = line.replace("Password: ", "").trim();
      if (email) {
        accounts.push(`${email}:${password}`);
        email = ""; // Reset email untuk akun berikutnya
      }
    }
  }

  // Menyimpan hasil dalam format email:password
  fs.writeFileSync(OUTPUT_FILE, accounts.join("\n"));
  console.log(`✅ Conversion complete! Saved to ${OUTPUT_FILE}`);
}

convertAccounts();

const fs = require("fs");
const readline = require("readline");
const simpleGit = require("simple-git");
const git = simpleGit();

const FILE_NAME = "spamFile.txt";

function getRandomMessage() {
    const messages = [
        "feat: add more spam 🚀",
        "fix: minor commit fix 🛠️",
        "refactor: nothing useful 🔧",
        "chore: add some nonsense 🤖",
        "docs: update for no reason 📚",
        "test: testing spam 💥"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function banner() {
    console.log(`
     
 .d8888b.  d8b 888     .d8888b.
d88P  Y88b Y8P 888    d88P  Y88b
888    888     888    Y88b.
888        888 888888  "Y888b.   88888b.   8888b.  88888b.d88b.  88888b.d88b.   .d88b.  888d888
888  88888 888 888        "Y88b. 888 "88b     "88b 888 "888 "88b 888 "888 "88b d8P  Y8b 888P"
888    888 888 888          "888 888  888 .d888888 888  888  888 888  888  888 88888888 888
Y88b  d88P 888 Y88b.  Y88b  d88P 888 d88P 888  888 888  888  888 888  888  888 Y8b.     888
 "Y8888P88 888  "Y888  "Y8888P"  88888P"  "Y888888 888  888  888 888  888  888  "Y8888  888
                                 888
                                 888
                                 888
`);
}

async function spamCommits(count, delay = 0, infinite = false) {
    let i = 0;
    while (infinite || i < count) {
        fs.appendFileSync(FILE_NAME, `Spam line ${Date.now()}\n`);
        await git.add(FILE_NAME);
        await git.commit(getRandomMessage());
        console.log(`[gitSpammer] ✅ Commit ${i + 1} effectué.`);
        i++;
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    if (!infinite) {
        await git.push();
        console.log("[gitSpammer] 🚀 Tous les commits ont été poussés !");
    }
}

function menu() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    banner();
    console.log("1️⃣  1 commit");
    console.log("2️⃣  Choisir le nombre de commits");
    console.log("3️⃣  Choisir le nombre de commits + délai entre commits (ms)");
    console.log("4️⃣  Spam infini (CTRL+C pour stopper)");
    console.log("──────────────────────────────────────────────");

    rl.question("👉 Choisis une option : ", (option) => {
        switch (option.trim()) {
            case "1":
                spamCommits(1).then(() => rl.close());
                break;
            case "2":
                rl.question("🔢 Combien de commits ? ", (n) => {
                    const count = parseInt(n);
                    if (isNaN(count) || count <= 0) {
                        console.log("[gitSpammer] ❌ Nombre invalide.");
                        rl.close();
                    } else {
                        spamCommits(count).then(() => rl.close());
                    }
                });
                break;
            case "3":
                rl.question("🔢 Combien de commits ? ", (n) => {
                    const count = parseInt(n);
                    if (isNaN(count) || count <= 0) {
                        console.log("[gitSpammer] ❌ Nombre invalide.");
                        rl.close();
                        return;
                    }
                    rl.question("⏱️  Délai entre commits (en ms) ? ", (d) => {
                        const delay = parseInt(d);
                        if (isNaN(delay) || delay < 0) {
                            console.log("[gitSpammer] ❌ Délai invalide.");
                            rl.close();
                        } else {
                            spamCommits(count, delay).then(() => rl.close());
                        }
                    });
                });
                break;
            case "4":
                console.log("[gitSpammer] ⚠️ Spam infini activé... CTRL+C pour arrêter.");
                spamCommits(0, 1000, true);
                break;
            default:
                console.log("[gitSpammer] ❌ Option invalide.");
                rl.close();
        }
    });
}

menu();

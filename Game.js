import { GameState } from "./state.js";
import { UI } from "./ui.js";

// =====================
// 🔧 UTILITIES
// =====================
const Utils = {
    clamp(value, min = 0, max = 100) {
        return Math.max(min, Math.min(max, value));
    }
};

// =====================
// MENU
// =====================
window.openMenu = function() {
    UI.menu.classList.toggle("hidden");
};

window.resetGame = function() {
    location.reload();
};
// =====================
// 🎮 PLAYER ACTIONS
// =====================
window.choosePolicy = function(policy) {
    if (GameState.gameOver) return;

    const actions = {
        tax() {
            GameState.eco += 20;
            GameState.pop -= 10;
            GameState.regions.forEach(r => {
                r.pop -= 5;
                r.loyalty -= 5;
            });
            return "💰 Taxes augmentées";
        },

        education() {
            GameState.eco -= 15;
            GameState.educationBoost = true;
            GameState.regions.forEach(r => {
                r.pop += 3;
                r.loyalty += 2;
            });
            return "🎓 Éducation améliorée";
        },

        military() {
            GameState.mil += 20;
            GameState.eco -= 15;
            return "🪖 Armée renforcée";
        },

        nothing() {
            return "⏸️ Aucun changement";
        }
    };

    const result = actions[policy]?.();
if (result !== undefined) UI.log(result);

    UI.menu.classList.add("hidden");
    UI.update();
};

// =====================
// 🌍 EVENTS
// =====================
function randomEvent() {
    const r = Math.random();

    if (GameState.eco < 50 && r < 0.5) {
        GameState.eco -= 15;
        return "📉 Crise économique";
    }

    if (GameState.pop < 40 && r < 0.5) {
        GameState.pop -= 15;
        return "🔥 Manifestations";
    }

    if (GameState.mil > 80 && GameState.pop < 50 && r < 0.4) {
        GameState.gameOver = true;
        return "⚠️ Coup d'État !";
    }

    return "🌍 Situation stable";
}

// =====================
// 📊 POLLS
// =====================
function calculatePolls() {
    let total = 0;

    GameState.polls.regions = GameState.regions.map(region => {
        let support =
            40 +
            region.loyalty * 0.5 +
            GameState.campaignPower * 0.4 +
            GameState.eco * 0.2;

        support += (Math.random() - 0.5) * 6;
        support = Utils.clamp(support);

        total += support;

        return {
            name: region.name,
            percent: Math.floor(support)
        };
    });

    GameState.polls.national = Math.floor(total / GameState.regions.length);
}

// =====================
// ⏱️ GAME LOOP
// =====================
window.nextTurn = function() {
    if (GameState.gameOver) return;

    GameState.turn++;
    UI.log("➡️ Tour " + GameState.turn);

    UI.log(randomEvent());

    GameState.eco -= 2;

    if (GameState.educationBoost) {
        GameState.pop += 2;
        GameState.eco += 2;
    }

   if (GameState.turn % GameState.termDuration === 0) {
    runElection();
}

    calculatePolls();
    UI.showPolls();

    GameState.eco = Utils.clamp(GameState.eco);
    GameState.pop = Utils.clamp(GameState.pop);
    GameState.mil = Utils.clamp(GameState.mil);

    UI.update();
    checkGameOver();
};

// =====================
// restart
// =====================
function askRestart() {
    setTimeout(() => {
        if (confirm("🔁 Recommencer ?")) location.reload();
    }, 200);
}
// =====================
// GAME OVER
// =====================
function checkGameOver() {
    if (GameState.pop <= 0 || GameState.eco <= 0) {
        if (!GameState.gameOver) {
            GameState.gameOver = true;
            UI.log("💀 Game Over !");
            askRestart();
        }
    }
}
// =====================
// NATIONAL ASSEMBLY
// =====================
function nationalAssemblyVote() {
    let proposed = parseInt(prompt("🏛️ Durée du mandat ?", "5"));

    if (isNaN(proposed) || proposed < 3 || proposed > 10) {
        GameState.termDuration = 4;
        UI.log("⚠️ Mandat: 4 ans");
        return;
    }

    if (Math.random() < 0.28) {
        GameState.termDuration = proposed;
        UI.log("✅ Accepté: " + proposed + " ans");
    } else {
        GameState.termDuration = 4;
        UI.log("❌ Refus → 4 ans");
    }
}
// =====================
// ELECTION
// =====================
function runElection() {
    let total = 0;

    GameState.regions.forEach(region => {
        let support =
            40 +
            region.loyalty * 0.5 +
            GameState.campaignPower * 0.4 +
            GameState.eco * 0.2;

        support = Utils.clamp(support + (Math.random() - 0.5) * 4);

        total += support;
    });

    let result = Math.floor(total / GameState.regions.length);

    UI.log("🗳️ Résultat élection: " + result + "%");

    let opponent = 45 + Math.random() * 10;

if (result < opponent) {
    GameState.gameOver = true;
    UI.log("💀 Défaite !");
    askRestart();
    } else {
        UI.log("🏆 Victoire !");
        GameState.campaignPower = 0;
    }
}

// =====================
// INIT
// =====================
function init() {
    nationalAssemblyVote();
    UI.update();
    UI.log("🎮 Jeu démarré");
}

init();
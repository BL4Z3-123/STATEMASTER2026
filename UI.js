import { GameState } from "./state.js";

export const UI = {
    ecoBar: document.getElementById("ecoBar"),
    popBar: document.getElementById("popBar"),
    milBar: document.getElementById("milBar"),
    logDiv: document.getElementById("log"),
    regionsDiv: document.getElementById("regions"),
    menu: document.getElementById("menu"),

    update() {
        this.updateBars();
        this.renderRegions();
    },

    updateBars() {
        this.setBar(this.ecoBar, GameState.eco, "#3b82f6");
        this.setBar(this.popBar, GameState.pop, "#22c55e");
        this.setBar(this.milBar, GameState.mil, "#f59e0b");
    },

    setBar(bar, value, color) {
        bar.style.width = value + "%";
        bar.style.background = value < 30 ? "red" : color;
    },

    renderRegions() {
        this.regionsDiv.innerHTML = GameState.regions.map(r => `
            <div class="region">
                <b>${r.name}</b><br>
                😊 ${r.pop} | 💰 ${r.eco} | 🗳️ ${r.loyalty}
            </div>
        `).join("");
    },

    showPolls() {
        this.log("📊 National: " + GameState.polls.national + "%");

        GameState.polls.regions.forEach(r => {
            this.log(`📍 ${r.name}: ${r.percent}%`);
        });
    },

    log(text) {
        this.logDiv.innerHTML += `> ${text}<br>`;

        if (this.logDiv.children.length > 50) {
            this.logDiv.removeChild(this.logDiv.firstChild);
        }

        this.logDiv.scrollTop = this.logDiv.scrollHeight;
    }
};
// =====================
// 🎮 GAME STATE
// =====================
export const GameState = {
    eco: 100,
    pop: 60,
    mil: 40,
    turn: 1,
    gameOver: false,

    termDuration: 4,
    campaignPower: 0,
    educationBoost: false,

    regions: [
        { name: "Nord", pop: 60, eco: 50, loyalty: 50 },
        { name: "Sud", pop: 70, eco: 60, loyalty: 60 },
        { name: "Est", pop: 50, eco: 40, loyalty: 40 },
        { name: "Ouest", pop: 65, eco: 55, loyalty: 55 }
    ],

    polls: {
        national: 50,
        regions: []
    }
};
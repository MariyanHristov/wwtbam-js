import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";

import { useUser } from "./auth/use-user.mjs";
import { createBus } from "../bus/index.mjs";

const playerWS = new Map();
const playerGames = new Map();

const wss = new WebSocketServer({ clientTracking: false, noServer: true });

wss.on("connection", async (ws, req) => {
    const bus = createBus();
    await bus.connect();

    const playerID = req.loggedInUserID;

    playerWS.set(playerID, ws);

    ws.on("error", console.error);

    ws.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        const gameID = playerGames.get(playerID);

        // Can only joinGame at the beginning
        if (!gameID) {
            if (message.type === "joinGame") {
                await bus.send({ ...message, playerID });
                playerGames.set(playerID, message.gameID);
            }

            return;
        }

        // Relay messages from player to server
        const allowedFromPlayerToServer = ["startGame", "answerQuestion", "useLifeline", "continue", "gameState"];

        if (allowedFromPlayerToServer.includes(message.type)) {
            await bus.send({ ...message, gameID, playerID });
        }
    });

    bus.on("message", (message) => {
        // Relay messages from server to player

        if (message.type === "gameState") {
            for (const [playerID, gameID] of playerGames) {
                if (gameID === message.gameID) {
                    playerWS.get(playerID)?.send(JSON.stringify(message));
                }
            }
        }

        if (message.type === "removeAnswers") {
            if (playerWS.has(message.playerID) && playerGames.get(message.playerID) === message.gameID) {
                playerWS.get(message.playerID).send(JSON.stringify(message));
            }
        }
    });

    ws.on("close", async () => {
        playerWS.delete(playerID);
        playerGames.delete(playerID);

        await bus.disconnect();
    });
});

export function onUpgrade(req, socket, head) {
    // Hack, we need cookies to parse the auth token.

    const parseCookies = cookieParser();

    parseCookies(req, {}, () => {
        useUser(req, {}, () => {
            if (!req.loggedInUserID) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }

            wss.handleUpgrade(req, socket, head, function (ws) {
                wss.emit("connection", ws, req);
            });
        });
    });
}

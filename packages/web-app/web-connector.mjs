import { Server } from "socket.io";

import { createBus } from "../bus/index.mjs";
import { parseAuthToken } from "./auth/parse-auth-token.mjs";

const playerSockets = new Map();
const playerGames = new Map();

async function handleConnection(socket, auth) {
    const bus = createBus();
    await bus.connect();

    const playerID = auth.id;

    playerSockets.set(playerID, socket);

    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        const gameID = playerGames.get(playerID);

        // Can only joinGame at the beginning
        if (!gameID) {
            if (message.type === "joinGame") {
                await bus.send({ ...message, playerID, data: auth });
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
                    playerSockets.get(playerID)?.send(JSON.stringify(message));
                }
            }
        }

        if (message.type === "removeAnswers") {
            if (playerSockets.has(message.playerID) && playerGames.get(message.playerID) === message.gameID) {
                playerSockets.get(message.playerID).send(JSON.stringify(message));
            }
        }
    });

    socket.on("disconnect", async () => {
        playerSockets.delete(playerID);
        playerGames.delete(playerID);

        await bus.disconnect();
    });
}

export function attach(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        const authToken = socket.handshake.auth.token;

        parseAuthToken(authToken)
            .then((decoded) => {
                handleConnection(socket, decoded);
            })
            .catch(() => {
                socket.disconnect(true);
            });
    });
}

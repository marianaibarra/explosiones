const http = require("http");
const crypto = require("crypto");
// const { createClient } = require("redis");
const websocket = require("websocket").server;
const httpServer = http.createServer();

// partyId => { [
//   {client}
//   {client}
// ] }
let parties = {};
// clientID => { connection }
let clients = {};

httpServer.listen(9090, () => {
  console.log("listening on http://localhost:9090");
});

wsServer = new websocket({
  httpServer: httpServer,
});

wsServer.on("request", (request) => {
  // create connection
  const connection = request.accept(null, request.origin);

  connection.on("message", (message) => {
    let result;
    // Verify json was received
    try {
      result = JSON.parse(message.utf8Data);
    } catch (error) {
      const payload = {
        message: "Invalid json",
      };
      connection.send(JSON.stringify(payload));
      return;
    }
    // Parse message and verify its method

    if (result.method === "create") {
      const payload = {
        method: "create",
        partyId: genString(),
        message: "OK",
      };
      parties[payload.partyId] = {
        clients: [],
      };

      connection.send(JSON.stringify(payload));
    }
    if (result.method === "join") {
      const partyId = result.partyId;
      const party = parties[partyId];

      // No existing party

      if (!Object.hasOwn(parties, partyId)) {
        const payload = {
          method: "join",
          message: "no_existing_party",
        };
        connection.send(JSON.stringify(payload));
        return;
      }

      // If there's already two people on the party

      if (party.clients.length >= 2) {
        const payload = {
          method: "join",
          message: "full_party",
        };
        connection.send(JSON.stringify(payload));
        return;
      }

      if (party.clients.length === 1) {
        // Notify players that new client has entered
        let payload = {
          method: "join",
          message: "player_joined",
        };

        party.clients.forEach((client) => {
          clients[client.clientId].connection.send(JSON.stringify(payload));
        });

        payload = {
          method: "join",
          message: "OK",
        };

        party.clients.push({
          clientId: result.clientId,
        });

        connection.send(JSON.stringify(payload));

        // Broadcast to all players, the game can start

        party.clients.forEach((client, index) => {
          const payload = {
            method: "start",
            partyId: partyId,
            color: index === 0 ? "255,255,255" : "158,141,140",
            turn: index,
          };

          clients[client.clientId].connection.send(JSON.stringify(payload));
        });
        return;
      }
      const payload = {
        method: "join",
        message: "OK",
      };

      party.clients.push({
        clientId: result.clientId,
      });
      connection.send(JSON.stringify(payload));
    }

    // - Broadcast lose method to all players

    if (result.method === "lose") {
      let turn;
      result.turn === 0 ? (turn = 1) : (turn = 0);
      const payload = {
        method: "lose",
        turn,
      };
      parties[result.partyId].clients.forEach((client) => {
        clients[client.clientId].connection.send(JSON.stringify(payload));
      });
    }
  });

  // TCP connection btw client and server
  let clientId = genString();
  if (Object.hasOwn(clients, clientId)) clientId = genString();
  const payload = {
    method: "connect",
    clientId: clientId,
    message: "ClientID_Set_Succesfully",
  };
  clients[clientId] = {
    connection: connection,
  };

  connection.send(JSON.stringify(payload));
});

// Generates a random string that serves as a separate "room"
const genString = () => crypto.randomBytes(4).toString("hex");

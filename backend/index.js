const http = require("http");
const crypto = require("crypto");
// const { createClient } = require("redis");
const websocket = require("websocket").server;
const httpServer = http.createServer();

// partyID => { [
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
        partyID: genString(),
        message: "OK",
      };
      parties[payload.partyID] = {
        clients: [],
      };

      connection.send(JSON.stringify(payload));
    }
    if (result.method === "join") {
      const partyId = result.partyId;

      if (!Object.hasOwn(parties, partyId)) {
        const payload = {
          method: "join",
          message: "no_existing_party",
        };
        connection.send(JSON.stringify(payload));
        return;
      }

      // If there's already two people on the party
      const partyClients = parties[partyId].clients;

      if (partyClients.length >= 2) {
        const payload = {
          method: "join",
          message: "full_party",
        };
        connection.send(JSON.stringify(payload));
        return;
      }

      if (partyClients.length == 1) {
        const payload = {
          method: "join",
          message: "player_joined",
        };
        // notify the creator of the party that a client has joined
        clients[partyClients[0].clientId].connection.send(
          JSON.stringify(payload)
        );
      }

      const color = { 0: "255,255,255", 1: "158,141,140" }[partyClients.length];

      const payload = {
        method: "join",
        message: "OK",
        color,
      };

      partyClients.push({
        clientId: result.clientId,
      });

      connection.send(JSON.stringify(payload));
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

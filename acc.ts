const express = require("express");
const snap7 = require("node-snap7");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: 8081 });

const machines = [
  {
    machineId: "B-04",
    ip: "192.168.0.34",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "P-01",
    ip: "192.168.0.23",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "B-05",
    ip: "192.168.0.21",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: false,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-05",
    ip: "192.168.0.41",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-04",
    ip: "192.168.0.42",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-06",
    ip: "192.168.0.22",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-07",
    ip: "192.168.0.36",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "B-01",
    ip: "192.168.0.31",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "B-02",
    ip: "192.168.0.24",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "P-02",
    ip: "192.168.0.29",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-02",
    ip: "192.168.0.39",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "P-04",
    ip: "192.168.0.38",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-01",
    ip: "192.168.0.33",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "P-03",
    ip: "192.168.0.145",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "E-03",
    ip: "192.168.0.27",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "K-01",
    ip: "192.168.0.26",
    dbNumber: 5,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
  {
    machineId: "K-02",
    ip: "192.168.0.26",
    dbNumber: 1,
    s7client: new snap7.S7Client(),
    isActive: true,
    isConnected: false,
    fields: [
      { name: "itemName", type: "string", start: 276, size: 52 },
      { name: "targetSpeed", type: "float", start: 52, size: 4 },
      { name: "actualSpeed", type: "float", start: 18, size: 4 },
      { name: "averageSpeed", type: "float", start: 36, size: 4 },
      { name: "message", type: "string", start: 74, size: 52 },
      { name: "idle", type: "string", start: 328, size: 52 },
      { name: "orderValue", type: "float", start: 128, size: 4 },
      { name: "actualValue", type: "float", start: 12, size: 4 },
    ],
  },
];

const connections = {};
let subscriptions = {}; // Abone listesi

// PLC'den veri okuma fonksiyonu
const readDataFromPLC = (client, dbNumber, params) => {
  return new Promise((resolve, reject) => {
    client.DBRead(dbNumber, params.start, params.size, function (err, result) {
      if (err) {
        console.log("Read error:", err);
        reject("Read error: " + err);
        client.Disconnect();
      } else {
        if (params.type === "string") {
          const maxLength = result.readUInt8(0);
          const actualLength = result.readUInt8(1);
          const stringData = result
            .slice(2, 2 + actualLength)
            .toString("utf-8");
          resolve(stringData.replace(/�/g, "²"));
        } else if (params.type === "float") {
          resolve(result.readFloatBE(0).toString());
        } else {
          reject("Unknown data type: " + params.type);
        }
      }
    });
  });
};

// Makine verisini IP bazında okuma fonksiyonu
const readMachineDataByIp = async (ip, machine) => {
  let machineData = { machineId: machine.machineId, data: {} };

  try {
    for (const field of machine.fields) {
      const value = await readDataFromPLC(
        connections[ip].client,
        machine.dbNumber,
        field
      );
      machineData.data[field.name] = value;
    }
  } catch (error) {
    console.log(`Error reading machine data for IP ${ip}: ${error}`);
  }

  return machineData;
};

// Belirtilen makinelere abone olan istemciler için veri yayınlama fonksiyonu
const sendMachineDataToSubscribers = async () => {
  const activeMachines = machines.filter((m) => m.isActive);

  for (const machine of activeMachines) {
    const ip = machine.ip;

    if (!connections[ip]) {
      connections[ip] = { client: new snap7.S7Client(), isConnected: false };
    }

    if (!connections[ip].isConnected) {
      try {
        connections[ip].client.ConnectTo(ip, 0, 1, (err) => {
          if (err) {
            console.log(`Connection failed for ${ip}:`, err);
          } else {
            console.log(`Connected to ${ip}.`);
            connections[ip].isConnected = true;
          }
        });
      } catch (error) {
        console.log(`Connection failed for ${ip}:`, error);
      }
    }

    if (connections[ip].isConnected) {
      const machineData = await readMachineDataByIp(ip, machine);

      // Abone olan istemcilere veri gönderimi
      const subscribers = subscriptions[machine.machineId] || [];
      subscribers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(machineData));
        }
      });
    }
  }
};

// WebSocket bağlantı işlemleri
wss.on("connection", (ws, req) => {
  const token = req.url.split("token=")[1];
  if (token !== "alves123") {
    ws.close(1008, "Unauthorized");
    return;
  }

  ws.on("message", (message) => {
    const { machine1Id, machine2Id } = JSON.parse(message);
    console.log(`Subscribed to machines: ${machine1Id}, ${machine2Id}`);

    // Makine 1'e abone ol
    if (machine1Id) {
      if (!subscriptions[machine1Id]) {
        subscriptions[machine1Id] = [];
      }
      subscriptions[machine1Id].push(ws);
    }

    // Makine 2'ye abone ol
    if (machine2Id) {
      if (!subscriptions[machine2Id]) {
        subscriptions[machine2Id] = [];
      }
      subscriptions[machine2Id].push(ws);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");

    // Bağlantı kapandığında istemciyi tüm aboneliklerden kaldır
    for (const machineId in subscriptions) {
      subscriptions[machineId] = subscriptions[machineId].filter(
        (client) => client !== ws
      );
    }
  });
});

// Her saniye veri okuyup abone olan istemcilere yayın yap
setInterval(sendMachineDataToSubscribers, 1000);

// API başlatma
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

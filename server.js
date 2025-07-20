// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9999 });

let clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const { type, id, target, payload } = data;

    if (type === 'register') {
      clients.set(id, ws);
    } else if (type === 'signal' && clients.has(target)) {
      clients.get(target).send(JSON.stringify({ type: 'signal', from: id, payload }));
    }
  });

  ws.on('close', () => {
    for (const [id, sock] of clients) {
      if (sock === ws) clients.delete(id);
    }
  });
});

console.log('✅ RBP Signaling server started on ws://localhost:8080');

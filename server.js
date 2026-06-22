const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// HTTP server — serves static files from public/
const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Room management: Map<hashedRoomId, Set<WebSocket>>
const rooms = new Map();

// WebSocket server — the dumb relay
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const params = new URL(req.url, 'http://localhost').searchParams;
  const roomId = params.get('room');

  if (!roomId || roomId.length < 16) {
    ws.close(4001, 'Invalid room');
    return;
  }

  // Add to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  const room = rooms.get(roomId);
  room.add(ws);
  ws._roomId = roomId;
  ws._rateWindow = [];

  // Broadcast participant count to all in room
  broadcastParticipantCount(roomId);

  ws.on('message', (data) => {
    // Rate limiting: max 30 messages per second
    const now = Date.now();
    ws._rateWindow.push(now);
    // Keep only timestamps within the last 1 second
    ws._rateWindow = ws._rateWindow.filter(t => now - t < 1000);

    if (ws._rateWindow.length > 30) {
      try {
        ws.send(JSON.stringify({ type: 'error', message: 'Rate limited' }));
      } catch (_) { /* ignore */ }
      return;
    }

    // Broadcast to all OTHER clients in the same room
    const currentRoom = rooms.get(ws._roomId);
    if (!currentRoom) return;

    for (const client of currentRoom) {
      if (client !== ws && client.readyState === 1) {
        try {
          client.send(data);
        } catch (_) { /* ignore */ }
      }
    }
  });

  ws.on('close', () => {
    const currentRoom = rooms.get(ws._roomId);
    if (currentRoom) {
      currentRoom.delete(ws);
      if (currentRoom.size === 0) {
        rooms.delete(ws._roomId);
      } else {
        broadcastParticipantCount(ws._roomId);
      }
    }
  });

  // No error logging — privacy
  ws.on('error', () => {});
});

function broadcastParticipantCount(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const msg = JSON.stringify({
    type: 'system',
    event: 'participant_count',
    count: room.size
  });
  for (const client of room) {
    if (client.readyState === 1) {
      try {
        client.send(msg);
      } catch (_) { /* ignore */ }
    }
  }
}

server.listen(PORT, () => {
  console.log(`Private Chatroom relay running on port ${PORT}`);
});

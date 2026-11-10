const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const accounts=require('./auth-server');

const root = path.join(__dirname, 'public');
const rooms = new Map();
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
const server = http.createServer((req, res) => {
  if(req.method==='POST' && req.url.startsWith('/api/')){let raw='';req.on('data',b=>raw+=b);return req.on('end',async()=>{try{let data=JSON.parse(raw||'{}');
    if(req.url==='/api/account'){let u=data.action==='register'?accounts.createAccount(data.name,data.password):accounts.login(data.name,data.password);return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(u));}
    if(req.url==='/api/save'){accounts.save(data.id,Math.min(250,Math.max(1,+data.progress||1)),+data.coins||0,data.inventory||[]);return res.end('{"ok":true}');}
    throw Error('Niet gevonden');}catch(e){res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:e.message}))}})}
  const safe = path.normalize(req.url.split('?')[0]).replace(/^([.][.][\\/])+/, '');
  const file = path.join(root, safe === '/' ? 'index.html' : safe);
  if (!file.startsWith(root)) return res.writeHead(403).end('Forbidden');
  fs.readFile(file, (e, data) => e ? res.writeHead(404).end('Niet gevonden') : res.writeHead(200, {'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data));
});
const wss = new WebSocketServer({ server });
function broadcast(room, data, except) { for (const c of room.clients) if (c !== except && c.readyState === 1) c.send(JSON.stringify(data)); }
wss.on('connection', ws => {
  ws.id = Math.random().toString(36).slice(2,8); ws.room = null;
  ws.on('message', raw => { let m; try { m=JSON.parse(raw); } catch { return; }
    if(m.type==='join') {
      const code=(m.code||'HEYN').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8)||'HEYN';
      let room=rooms.get(code); if(!room) rooms.set(code, room={clients:new Set(), state:{power:false,key:false,code:false,escaped:false}});
      if(room.clients.size>=4) return ws.send(JSON.stringify({type:'full'}));
      ws.room=room; ws.code=code; room.clients.add(ws);
      ws.send(JSON.stringify({type:'welcome',id:ws.id,room:code,state:room.state,players:[...room.clients].filter(x=>x!==ws).map(x=>({id:x.id,...(x.player||{})}))}));
      broadcast(room,{type:'joined',player:{id:ws.id,name:m.name||'Onderzoeker',x:3.5,y:3.5,a:0}},ws);
    }
    if(!ws.room) return;
    if(m.type==='move') { ws.player={name:m.name||'Onderzoeker',x:m.x,y:m.y,a:m.a}; broadcast(ws.room,{type:'move',id:ws.id,...ws.player},ws); }
    if(m.type==='zombies' && Array.isArray(m.zombies)) { broadcast(ws.room,{type:'zombies',zombies:m.zombies.slice(0,12)},ws); }
    if(m.type==='state' && ['power','key','code','escaped'].includes(m.key)) { ws.room.state[m.key]=true; broadcast(ws.room,{type:'state',key:m.key,value:true}); }
  });
  ws.on('close',()=>{ if(!ws.room)return; ws.room.clients.delete(ws); broadcast(ws.room,{type:'left',id:ws.id}); if(!ws.room.clients.size) rooms.delete(ws.code); });
});
const port=process.env.PORT||3000; server.listen(port,()=>console.log(`MFC Heynsdaele draait op http://localhost:${port}`));

const fs=require('fs'), path=require('path'), crypto=require('crypto');
const dataDir=process.env.DATA_DIR||__dirname;
const file=path.join(dataDir,'heynsdaele-users.json');
function read(){try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch{return {users:[]}}}function write(data){fs.writeFileSync(file+'.tmp',JSON.stringify(data));fs.renameSync(file+'.tmp',file)}
function hash(p,s){return crypto.scryptSync(p,s,64).toString('hex')}
function createAccount(name,password){name=String(name||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name)||password.length<8)throw Error('Gebruik een geldig e-mailadres en een wachtwoord van minstens 8 tekens.');let data=read();if(data.users.some(u=>u.name===name))throw Error('Dit e-mailadres is al in gebruik.');let u={id:crypto.randomUUID(),name,salt:crypto.randomBytes(16).toString('hex'),progress:1,coins:80,inventory:[]};u.hash=hash(password,u.salt);data.users.push(u);write(data);return publicUser(u)}
function publicUser(u){return {id:u.id,name:u.name,progress:u.progress,coins:u.coins,inventory:u.inventory}}
function login(name,password){name=String(name||'').trim().toLowerCase();let u=read().users.find(u=>u.name===name);if(!u||!crypto.timingSafeEqual(Buffer.from(u.hash,'hex'),Buffer.from(hash(password,u.salt),'hex')))throw Error('Onjuist e-mailadres of wachtwoord.');return publicUser(u)}
function save(id,progress,coins,inventory){let data=read(),u=data.users.find(x=>x.id===id);if(!u)return;u.progress=Math.max(u.progress,progress);u.coins=coins;u.inventory=inventory;write(data)}
module.exports={createAccount,login,save};


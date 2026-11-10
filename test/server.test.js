const test=require('node:test'); const assert=require('node:assert/strict');
test('project heeft een speelbare server entry',()=>{assert.ok(require('fs').existsSync(require('path').join(__dirname,'..','server.js')));});


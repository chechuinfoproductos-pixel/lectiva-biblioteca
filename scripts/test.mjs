import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('el catálogo publicado es un array',()=>{assert.ok(Array.isArray(JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'))))});
test('el logotipo oficial está presente',()=>{assert.ok(fs.statSync('dist/assets/logo-lectiva-oficial.png').size>0)});

#!/usr/bin/env node
/** Backup Namecheap DNS via XML API */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOMAINS = ['seanpcallahan.net', '3ninjallc.com', 'janicacallahan.com'];
const API_URL = 'https://api.namecheap.com/xml.response';

function loadConfig() {
  const env = {
    apiUser: process.env.NAMECHEAP_API_USER,
    apiKey: process.env.NAMECHEAP_API_KEY,
    username: process.env.NAMECHEAP_USERNAME || process.env.NAMECHEAP_API_USER
  };
  const configPath = join(homedir(), '.config', 'namecheap-cli', 'config.json');
  if (existsSync(configPath)) {
    const file = JSON.parse(readFileSync(configPath, 'utf8'));
    env.apiUser ??= file.apiUser ?? file.api_user;
    env.apiKey ??= file.apiKey ?? file.api_key;
    env.username ??= file.username ?? file.apiUser;
  }
  if (!env.apiUser || !env.apiKey) {
    console.error('Set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME');
    process.exit(1);
  }
  return env;
}

async function clientIp() {
  if (process.env.NAMECHEAP_CLIENT_IP) return process.env.NAMECHEAP_CLIENT_IP;
  return fetch('https://api.ipify.org?format=text').then((r) => r.text());
}

async function getHosts(config, ip, domain) {
  const [sld, ...tldParts] = domain.split('.');
  const tld = tldParts.join('.');
  const body = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.username,
    ClientIp: ip,
    Command: 'namecheap.domains.dns.getHosts',
    SLD: sld,
    TLD: tld
  });
  const res = await fetch(API_URL, { method: 'POST', body });
  return res.text();
}

async function main() {
  const config = loadConfig();
  const ip = await clientIp();
  const outDir = join(__dirname);
  mkdirSync(outDir, { recursive: true });

  for (const domain of DOMAINS) {
    const xml = await getHosts(config, ip, domain);
    const out = join(outDir, `${domain}.before.json`);
    writeFileSync(out, JSON.stringify({ domain, clientIp: ip, fetchedAt: new Date().toISOString(), xml }, null, 2));
    console.log(`Saved ${out}`);
    console.log(`${domain} MX (dig):`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

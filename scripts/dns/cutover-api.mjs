#!/usr/bin/env node
/**
 * Namecheap DNS cutover via XML API — preserves MX/TXT/SPF/DKIM.
 * Env: NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME
 * Optional: NAMECHEAP_CLIENT_IP (auto-detected if omitted)
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GITHUB_A = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
const GITHUB_WWW = 'callsea1.github.io';
const DOMAINS = ['seanpcallahan.net', '3ninjallc.com'];
const API_URL = 'https://api.namecheap.com/xml.response';

function loadConfig() {
  const env = {
    apiUser: process.env.NAMECHEAP_API_USER,
    apiKey: process.env.NAMECHEAP_API_KEY,
    username: process.env.NAMECHEAP_USERNAME || process.env.NAMECHEAP_API_USER
  };
  const configPath = join(homedir(), '.config', 'namecheap-cli', 'config.json');
  if (existsSync(configPath)) {
    try {
      const file = JSON.parse(readFileSync(configPath, 'utf8'));
      env.apiUser ??= file.apiUser ?? file.api_user;
      env.apiKey ??= file.apiKey ?? file.api_key;
      env.username ??= file.username ?? file.apiUser;
    } catch {
      /* ignore */
    }
  }
  if (!env.apiUser || !env.apiKey) {
    console.error('Missing Namecheap API credentials.');
    console.error('Set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME');
    console.error('Or run: namecheap auth login (when CLI is fixed)');
    process.exit(1);
  }
  return env;
}

async function clientIp() {
  if (process.env.NAMECHEAP_CLIENT_IP) return process.env.NAMECHEAP_CLIENT_IP;
  const res = await fetch('https://api.ipify.org?format=text');
  return res.text();
}

async function apiRequest(config, clientIpAddr, params) {
  const body = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.username,
    ClientIp: clientIpAddr,
    ...params
  });
  const res = await fetch(API_URL, { method: 'POST', body });
  const text = await res.text();
  if (text.includes('Status="ERROR"')) {
    const err = text.match(/<Error[^>]*>([^<]+)/)?.[1] ?? text.slice(0, 300);
    throw new Error(err);
  }
  return text;
}

function parseHosts(xml) {
  const hosts = [];
  const re = /<host\b[^>]*\/>/gi;
  let match;
  while ((match = re.exec(xml))) {
    const tag = match[0];
    const get = (key) => tag.match(new RegExp(`${key}="([^"]*)"`, 'i'))?.[1] ?? '';
    hosts.push({
      name: get('Name'),
      type: get('Type').toUpperCase(),
      address: get('Address'),
      mxPref: get('MXPref') || '10',
      ttl: get('TTL') || '1800'
    });
  }
  return hosts;
}

function splitDomain(domain) {
  const parts = domain.split('.');
  return { sld: parts[0], tld: parts.slice(1).join('.') };
}

function cutoverHosts(hosts) {
  const kept = hosts.filter((h) => {
    const t = h.type.toUpperCase();
    if (['URL', 'URL301', 'FRAME'].includes(t)) return false;
    if (t === 'A' && h.name === '@') return false;
    if (t === 'CNAME' && h.name === 'www') return false;
    return true;
  });

  for (const ip of GITHUB_A) {
    kept.push({ name: '@', type: 'A', address: ip, mxPref: '10', ttl: '1800' });
  }
  kept.push({ name: 'www', type: 'CNAME', address: GITHUB_WWW, mxPref: '10', ttl: '1800' });
  return kept;
}

async function setHosts(config, clientIpAddr, domain, hosts) {
  const { sld, tld } = splitDomain(domain);
  const params = {
    Command: 'namecheap.domains.dns.setHosts',
    SLD: sld,
    TLD: tld,
    EmailType: 'MX'
  };
  hosts.forEach((h, i) => {
    const n = i + 1;
    params[`HostName${n}`] = h.name;
    params[`RecordType${n}`] = h.type;
    params[`Address${n}`] = h.address;
    params[`MXPref${n}`] = h.mxPref;
    params[`TTL${n}`] = h.ttl;
  });
  return apiRequest(config, clientIpAddr, params);
}

async function getHosts(config, clientIpAddr, domain) {
  const { sld, tld } = splitDomain(domain);
  const xml = await apiRequest(config, clientIpAddr, {
    Command: 'namecheap.domains.dns.getHosts',
    SLD: sld,
    TLD: tld
  });
  return parseHosts(xml);
}

async function main() {
  const config = loadConfig();
  const ip = await clientIp();
  console.log(`Client IP: ${ip}`);

  for (const domain of DOMAINS) {
    console.log(`\n=== ${domain} ===`);
    const before = await getHosts(config, ip, domain);
    const mxBefore = before.filter((h) => h.type === 'MX');
    console.log(`MX before (${mxBefore.length}):`, mxBefore.map((h) => h.address).join(', ') || 'none');

    const after = cutoverHosts(before);
    await setHosts(config, ip, domain, after);

    const verify = await getHosts(config, ip, domain);
    const mxAfter = verify.filter((h) => h.type === 'MX');
    console.log(`MX after (${mxAfter.length}):`, mxAfter.map((h) => h.address).join(', ') || 'none');
    console.log(`A @ records:`, verify.filter((h) => h.type === 'A' && h.name === '@').map((h) => h.address).join(', '));
    console.log(`www:`, verify.find((h) => h.name === 'www')?.address ?? 'missing');
  }

  console.log('\nCutover complete. Run: ./scripts/dns/verify-cutover.sh');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

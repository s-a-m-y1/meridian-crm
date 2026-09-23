#!/usr/bin/env node
/**
 * Seed demo data into a running Meridian CRM backend via its REST API.
 *
 * Usage:
 *   node scripts/seed-demo.mjs [baseUrl]
 *
 * Defaults to http://localhost:4000/api/v1. Creates (or logs into) a demo
 * account and populates customers, leads, properties, deals, tasks,
 * activities and notes with realistic real-estate data.
 *
 * Idempotent: existing customers/leads are looked up instead of re-created
 * (safe to re-run). Note: valid lead statuses are NEW / CONTACTED /
 * QUALIFIED / UNQUALIFIED / CONVERTED — HOT/WARM are AI classifications.
 */

const BASE = process.argv[2] || 'http://localhost:4000/api/v1';
const DEMO_EMAIL = 'demo@meridian.crm';
const DEMO_PASSWORD = 'Demo1234!x';

let token = null;

async function api(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

async function list(path) {
  const res = await api(`${path}?limit=100`);
  return res.data ?? res ?? [];
}

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n) => new Date(Date.now() + n * 86400000).toISOString();

async function getOrCreateCustomer(def) {
  const existing = await list('/customers');
  const found = existing.find((c) => c.name === def.name);
  if (found) return found.id;
  const created = await api('/customers', 'POST', def);
  console.log(`✓ customer: ${def.name}`);
  return created.id;
}

async function getOrCreateLead(def, customerId, customers) {
  const existing = await list('/leads');
  const found = existing.find(
    (l) => l.customerId === customerId && l.status === def.status,
  );
  if (found) return found.id;
  const created = await api('/leads', 'POST', {
    customerId,
    status: def.status,
    source: def.source,
    budgetMin: def.budgetMin,
    budgetMax: def.budgetMax,
    requestedLocation: def.loc,
    requestedPropertyType: def.type,
  });
  console.log(`✓ lead: ${customers[customerId]} (${def.status})`);
  return created.id;
}

async function main() {
  console.log(`Seeding ${BASE} ...`);

  // Auth: register demo user, fall back to login if already exists
  try {
    const reg = await api('/auth/register', 'POST', {
      email: DEMO_EMAIL,
      name: 'Demo Agent',
      password: DEMO_PASSWORD,
    });
    token = reg.accessToken;
    console.log('✓ registered demo user');
  } catch {
    const login = await api('/auth/login', 'POST', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    token = login.accessToken;
    console.log('✓ logged into existing demo user');
  }

  // -- Customers -----------------------------------------------------------
  const customerDefs = [
    { name: 'Ahmed Hassan', email: 'ahmed.hassan@example.com', phone: '+201001112223' },
    { name: 'Sarah Mohamed', email: 'sarah.mohamed@example.com', phone: '+201002223334' },
    { name: 'Omar Ali', email: 'omar.ali@example.com', phone: '+201003334445' },
    { name: 'Fatima Ahmed', email: 'fatima.ahmed@example.com', phone: '+201004445556' },
    { name: 'Khalid Ibrahim', email: 'khalid.ibrahim@example.com', phone: '+201005556667' },
    { name: 'Nour El-Sayed', email: 'nour.elsayed@example.com', phone: '+201006667778' },
  ];
  const customerIdByName = {};
  for (const c of customerDefs) {
    customerIdByName[c.name] = await getOrCreateCustomer(c);
  }

  // -- Leads ----------------------------------------------------------------
  const leadDefs = [
    { name: 'Ahmed Hassan', status: 'CONTACTED', source: 'WEBSITE', budgetMin: 2500000, budgetMax: 4000000, loc: 'Zamalek, Cairo', type: 'VILLA' },
    { name: 'Sarah Mohamed', status: 'QUALIFIED', source: 'REFERRAL', budgetMin: 5000000, budgetMax: 8000000, loc: 'Maadi, Cairo', type: 'VILLA' },
    { name: 'Omar Ali', status: 'NEW', source: 'PHONE', budgetMin: 900000, budgetMax: 1500000, loc: 'Nasr City, Cairo', type: 'APARTMENT' },
    { name: 'Fatima Ahmed', status: 'CONTACTED', source: 'SOCIAL', budgetMin: 3000000, budgetMax: 3500000, loc: 'Sheikh Zayed, Giza', type: 'TOWNHOUSE' },
    { name: 'Khalid Ibrahim', status: 'QUALIFIED', source: 'WEBSITE', budgetMin: 7000000, budgetMax: 12000000, loc: 'New Cairo', type: 'VILLA' },
    { name: 'Nour El-Sayed', status: 'NEW', source: 'EMAIL', budgetMin: 1200000, budgetMax: 1800000, loc: 'Smouha, Alexandria', type: 'APARTMENT' },
    { name: 'Ahmed Hassan', status: 'QUALIFIED', source: 'WALK_IN', budgetMin: 4000000, budgetMax: 6000000, loc: '6th of October, Giza', type: 'VILLA' },
    { name: 'Fatima Ahmed', status: 'QUALIFIED', source: 'REFERRAL', budgetMin: 2000000, budgetMax: 2600000, loc: 'Heliopolis, Cairo', type: 'APARTMENT' },
  ];
  const customerNameById = Object.fromEntries(
    Object.entries(customerIdByName).map(([name, id]) => [id, name]),
  );
  const leadIdByKey = {};
  for (const l of leadDefs) {
    leadIdByKey[`${l.name}:${l.status}`] = await getOrCreateLead(
      l,
      customerIdByName[l.name],
      customerNameById,
    );
  }

  // -- Properties -----------------------------------------------------------
  const existingProps = await list('/properties');
  const propertyDefs = [
    { name: 'Nile View Villa', description: '5BR villa with private garden and Nile view', category: 'VILLA', price: 6500000, bedrooms: 5, location: 'Zamalek, Cairo', status: 'AVAILABLE' },
    { name: 'Maadi Corniche Villa', description: 'Modern villa on the corniche with pool', category: 'VILLA', price: 7500000, bedrooms: 4, location: 'Maadi, Cairo', status: 'AVAILABLE' },
    { name: 'Nasr City Apartment', description: '3BR apartment, newly renovated, elevator', category: 'APARTMENT', price: 1200000, bedrooms: 3, location: 'Nasr City, Cairo', status: 'AVAILABLE' },
    { name: 'Zayed Townhouse', description: '4BR townhouse in gated compound with clubhouse', category: 'TOWNHOUSE', price: 3300000, bedrooms: 4, location: 'Sheikh Zayed, Giza', status: 'AVAILABLE' },
    { name: 'New Cairo Luxury Villa', description: '6BR smart villa, full automation, pool house', category: 'VILLA', price: 11500000, bedrooms: 6, location: 'New Cairo', status: 'AVAILABLE' },
    { name: 'Smouha Sea Apartment', description: '2BR apartment, 5 min from the beach', category: 'APARTMENT', price: 1500000, bedrooms: 2, location: 'Smouha, Alexandria', status: 'AVAILABLE' },
  ];
  for (const p of propertyDefs) {
    if (existingProps.some((x) => x.name === p.name)) continue;
    await api('/properties', 'POST', p);
    console.log(`✓ property: ${p.name}`);
  }

  // -- Deals ----------------------------------------------------------------
  const existingDeals = await list('/deals');
  const dealDefs = [
    { leadKey: 'Sarah Mohamed:QUALIFIED', stage: 'PROPOSAL', value: 7500000 },
    { leadKey: 'Ahmed Hassan:QUALIFIED', stage: 'NEGOTIATION', value: 5500000 },
    { leadKey: 'Khalid Ibrahim:QUALIFIED', stage: 'QUALIFICATION', value: 11000000 },
    { leadKey: 'Fatima Ahmed:QUALIFIED', stage: 'PROSPECTING', value: 2400000 },
    { leadKey: 'Ahmed Hassan:CONTACTED', stage: 'CLOSED_WON', value: 3800000 },
    { leadKey: 'Omar Ali:NEW', stage: 'CLOSED_LOST', value: 1400000 },
  ];
  for (const d of dealDefs) {
    if (existingDeals.some((x) => x.leadId === leadIdByKey[d.leadKey] && x.stage === d.stage)) continue;
    await api('/deals', 'POST', {
      leadId: leadIdByKey[d.leadKey],
      value: d.value,
      stage: d.stage,
      
    });
    console.log(`✓ deal: ${d.stage} ($${d.value.toLocaleString()})`);
  }

  // -- Tasks ----------------------------------------------------------------
  const existingTasks = await list('/tasks');
  const taskDefs = [
    { leadKey: 'Ahmed Hassan:CONTACTED', title: 'Call Ahmed about Zamalek villa', dueAt: daysAgo(2), status: 'PENDING' },
    { leadKey: 'Sarah Mohamed:QUALIFIED', title: 'Send Maadi villa proposal', dueAt: daysAhead(1), status: 'PENDING' },
    { leadKey: 'Ahmed Hassan:QUALIFIED', title: 'Prepare October villa viewing', dueAt: daysAhead(2), status: 'PENDING' },
    { leadKey: 'Khalid Ibrahim:QUALIFIED', title: 'Schedule New Cairo compound tour', dueAt: daysAhead(4), status: 'PENDING' },
    { leadKey: 'Fatima Ahmed:QUALIFIED', title: 'Follow up on Heliopolis apartment', dueAt: daysAgo(1), status: 'PENDING' },
    { leadKey: 'Omar Ali:NEW', title: 'Qualify budget for Nasr City apartment', dueAt: daysAgo(6), status: 'COMPLETED' },
  ];
  for (const t of taskDefs) {
    if (existingTasks.some((x) => x.title === t.title)) continue;
    await api('/tasks', 'POST', {
      leadId: leadIdByKey[t.leadKey],
      title: t.title,
      dueAt: t.dueAt,
      status: t.status,
    });
    console.log(`✓ task: ${t.title}`);
  }

  // -- Activities -----------------------------------------------------------
  const existingActivities = await list('/activities');
  const activityDefs = [
    { leadKey: 'Ahmed Hassan:CONTACTED', type: 'CALL', content: 'Intro call — interested in Zamalek, wants garden' },
    { leadKey: 'Sarah Mohamed:QUALIFIED', type: 'VIEWING', content: 'Viewed Maadi corniche villa — very positive' },
    { leadKey: 'Sarah Mohamed:QUALIFIED', type: 'EMAIL', content: 'Sent Maadi villa floor plans' },
    { leadKey: 'Omar Ali:NEW', type: 'WHATSAPP', content: 'Answered pricing questions for Nasr City apartment' },
    { leadKey: 'Fatima Ahmed:QUALIFIED', type: 'NOTE', content: 'Office meeting — budget confirmed for Heliopolis apartment' },
    { leadKey: 'Khalid Ibrahim:QUALIFIED', type: 'VIEWING', content: 'Toured 3 New Cairo villas, shortlisted one' },
  ];
  for (const a of activityDefs) {
    if (existingActivities.some((x) => x.content === a.content)) continue;
    await api('/activities', 'POST', {
      leadId: leadIdByKey[a.leadKey],
      type: a.type,
      content: a.content,
    });
    console.log(`✓ activity: ${a.type}`);
  }

  // -- Notes ----------------------------------------------------------------
  const existingNotes = await list('/notes');
  const noteDefs = [
    { leadKey: 'Ahmed Hassan:CONTACTED', content: 'Prefers direct phone contact over email. Cash buyer, no financing needed.' },
    { leadKey: 'Sarah Mohamed:QUALIFIED', content: 'Relocating from Dubai in Q4 — timeline is flexible but decisive.' },
    { leadKey: 'Khalid Ibrahim:QUALIFIED', content: 'Wants smart-home features; compare New Cairo compound options with automation packages.' },
  ];
  for (const n of noteDefs) {
    if (existingNotes.some((x) => x.content === n.content)) continue;
    await api('/notes', 'POST', { leadId: leadIdByKey[n.leadKey], content: n.content });
    console.log('✓ note added');
  }

  console.log('\n✅ Seed complete.');
  console.log(`Demo login → ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});

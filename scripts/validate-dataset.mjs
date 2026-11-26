import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../src/data/interactions.json');

const VALID_CATEGORIES = new Set([
  'ddi-pk',
  'pgx',
  'prodrug',
  'phenoconversion',
  'ddi-pd',
  'safe-swap',
]);

const VALID_PROMPT_TYPES = new Set([
  'effect',
  'action',
  'phenotype',
  'swap',
  'hazard',
]);

const raw = fs.readFileSync(dataPath, 'utf-8');
const cards = JSON.parse(raw);

if (!Array.isArray(cards) || cards.length === 0) {
  throw new Error('Dataset must be a non-empty JSON array.');
}

const seenIds = new Set();
const categoryCounts = {};
let errors = 0;

for (const [idx, card] of cards.entries()) {
  const prefix = `Card #${idx + 1} (${card.id ?? 'missing-id'})`;

  if (!card.id || typeof card.id !== 'string') {
    console.error(`${prefix}: missing valid string id`);
    errors++;
  } else if (seenIds.has(card.id)) {
    console.error(`${prefix}: duplicate id`);
    errors++;
  } else {
    seenIds.add(card.id);
  }

  if (!VALID_CATEGORIES.has(card.category)) {
    console.error(`${prefix}: invalid category "${card.category}"`);
    errors++;
  } else {
    categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
  }

  if (!VALID_PROMPT_TYPES.has(card.promptType)) {
    console.error(`${prefix}: invalid promptType "${card.promptType}"`);
    errors++;
  }

  for (const field of ['prompt', 'question', 'mechanism', 'pearl']) {
    if (!card[field] || typeof card[field] !== 'string' || !card[field].trim()) {
      console.error(`${prefix}: missing or empty "${field}"`);
      errors++;
    }
  }

  if (!Array.isArray(card.options) || card.options.length < 2 || card.options.length > 4) {
    console.error(`${prefix}: options must contain 2 to 4 items`);
    errors++;
  } else if (
    typeof card.correctIndex !== 'number' ||
    card.correctIndex < 0 ||
    card.correctIndex >= card.options.length
  ) {
    console.error(`${prefix}: invalid correctIndex ${card.correctIndex}`);
    errors++;
  }

  if (!card.source || typeof card.source.label !== 'string' || !card.source.label.trim()) {
    console.error(`${prefix}: missing source.label`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`OK: ${cards.length} cards validated successfully.`);
console.log('Breakdown by category:', categoryCounts);

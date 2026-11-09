const assert = require('assert');

// Test extractProjectStem
function extractProjectStem(filename) {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  const cleaned = nameWithoutExt.replace(/[_\-]+/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);

  const stopWords = new Set([
    'final', 'draft', 'copy', 'v1', 'v2', 'v3', 'new', 'old', 'temp', 'latest',
    'document', 'file', 'image', 'photo', 'video', 'untitled', 'download', 'screen',
    'screenshot', 'test', 'backup'
  ]);

  const candidateWords = words.filter(w => !stopWords.has(w.toLowerCase()) && !/^\d+$/.test(w));
  
  if (candidateWords.length >= 2) {
    return candidateWords.slice(0, 2)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  } else if (candidateWords.length === 1 && candidateWords[0].length >= 4) {
    const w = candidateWords[0];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }

  return null;
}

console.log('Testing extractProjectStem...');
assert.strictEqual(extractProjectStem('Thesis_Draft_Final.docx'), 'Thesis');
assert.strictEqual(extractProjectStem('Client_Acme_Contract_v2.pdf'), 'Client Acme');
assert.strictEqual(extractProjectStem('Project_Apollo_specs.md'), 'Project Apollo');
console.log('✔ extractProjectStem passed!');

console.log('All tests passed successfully!');

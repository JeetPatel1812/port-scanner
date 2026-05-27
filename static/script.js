// ─── Global State ─────────────────────────────────────────
let allResults = [];

// ─── Start Scan ───────────────────────────────────────────
async function startScan() {
  const target = document.getElementById('targetInput').value.trim();
  const portRange = document.getElementById('portRange').value;
  const speed = document.getElementById('scanSpeed').value;

  if (!target) {
    showError('Please enter a target IP or domain!');
    return;
  }

  hideAll();
  showStatus(`Scanning ${target}...`);
  disableBtn(true);

  try {
    const res = await fetch('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: target,
        port_range: portRange,
        speed: speed
      })
    });

    const data = await res.json();

    if (data.error) {
      hideStatus();
      showError(data.error);
      disableBtn(false);
      return;
    }

    allResults = data.results;
    hideStatus();
    displaySummary(data);
    displayResults(allResults);
    disableBtn(false);

  } catch (err) {
    hideStatus();
    showError('Something went wrong. Make sure Flask is running.');
    disableBtn(false);
  }
}

// ─── Display Summary Cards ────────────────────────────────
function displaySummary(data) {
  document.getElementById('summaryCards').style.display = 'grid';
  document.getElementById('cardTarget').textContent   = data.target;
  document.getElementById('cardIP').textContent       = data.ip;
  document.getElementById('cardOpen').textContent     = data.open;
  document.getElementById('cardTotal').textContent    = data.total;
  document.getElementById('cardDuration').textContent = data.duration + 's';
}

// ─── Display Results Table ────────────────────────────────
function displayResults(results) {
  const tbody = document.getElementById('resultsBody');
  tbody.innerHTML = '';

  if (results.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3"
          style="text-align:center;color:#555;padding:24px;
                 font-family:'Segoe UI',sans-serif;font-size:13px;">
          No results found
        </td>
      </tr>`;
    document.getElementById('resultsBox').style.display  = 'block';
    document.getElementById('filterRow').style.display   = 'flex';
    return;
  }

  results.forEach(r => {
    const row = document.createElement('tr');
    const badge = r.status === 'open'
      ? `<span class="badge badge-open"><span class="dot"></span>open</span>`
      : `<span class="badge badge-closed">closed</span>`;

    row.innerHTML = `
      <td>${r.port}</td>
      <td>${r.service}</td>
      <td>${badge}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('resultsBox').style.display  = 'block';
  document.getElementById('filterRow').style.display   = 'flex';
}

// ─── Filter Results ───────────────────────────────────────
function filterResults(type, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  let filtered = allResults;
  if (type === 'open')   filtered = allResults.filter(r => r.status === 'open');
  if (type === 'closed') filtered = allResults.filter(r => r.status === 'closed');

  displayResults(filtered);
}

// ─── Export Results ───────────────────────────────────────
function exportResults() {
  const target = document.getElementById('cardTarget').textContent;
  const ip     = document.getElementById('cardIP').textContent;
  const date   = new Date().toLocaleString();

  let text = `PortScan Report\n`;
  text += `================\n`;
  text += `Target   : ${target}\n`;
  text += `IP       : ${ip}\n`;
  text += `Date     : ${date}\n`;
  text += `Open     : ${allResults.filter(r => r.status === 'open').length}\n`;
  text += `Scanned  : ${allResults.length}\n`;
  text += `================\n\n`;
  text += `PORT     SERVICE          STATUS\n`;
  text += `─────────────────────────────────\n`;

  allResults.forEach(r => {
    text += `${String(r.port).padEnd(8)} ${r.service.padEnd(16)} ${r.status}\n`;
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `portscan-${target}-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Helper Functions ─────────────────────────────────────
function showStatus(msg) {
  document.getElementById('statusBar').style.display = 'flex';
  document.getElementById('statusText').textContent  = msg;
}

function hideStatus() {
  document.getElementById('statusBar').style.display = 'none';
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.style.display = 'block';
  box.textContent   = '⚠️ ' + msg;
}

function hideAll() {
  document.getElementById('summaryCards').style.display = 'none';
  document.getElementById('resultsBox').style.display   = 'none';
  document.getElementById('filterRow').style.display    = 'none';
  document.getElementById('errorBox').style.display     = 'none';
}

function disableBtn(state) {
  const btn       = document.getElementById('scanBtn');
  btn.disabled    = state;
  btn.textContent = state ? '⏳ Scanning...' : '🔍 Scan';
}

// ─── Enter Key Support ────────────────────────────────────
document.getElementById('targetInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') startScan();
});
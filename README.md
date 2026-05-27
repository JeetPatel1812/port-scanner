# 🔍 PortScan — Simple Port Scanner

A fast, clean web-based port scanner built with Python Flask.
Scan any IP or domain for open ports directly from your browser.

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Flask](https://img.shields.io/badge/Flask-2.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

## Screenshot

![PortScan App](assets/screenshot.png)

---


## Features

- Scan any IP address or domain for open/closed ports
- 20 common ports scanned by default (SSH, HTTP, HTTPS, FTP, etc.)
- Custom port ranges (1–100, 1–500, full 1–1024)
- Fast scan mode using multi-threading
- Real-time summary — IP, open ports, scan duration
- Filter results by open or closed ports
- Export scan report as a `.txt` file
- Clean modern dark UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3, Flask |
| Port Scanning | Python `socket` + `concurrent.futures` |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Version Control | Git + GitHub |

---

## Project Structure
---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/JeetPatel1812/port-scanner.git
cd port-scanner
```

### 2. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the app
```bash
python app.py
```

### 5. Open in browser
---

## Usage

1. Enter a target IP or domain (e.g. `scanme.nmap.org`)
2. Select port range and scan speed
3. Click **Scan**
4. View open/closed ports in the results table
5. Filter by status or export as a report

> Use `scanme.nmap.org` for safe legal testing — it's provided by the Nmap project.

---

## Legal Disclaimer

This tool is built for **educational purposes only**.
Only scan systems you own or have explicit permission to scan.
Unauthorized port scanning may be illegal in your country.

---

## Author

**Jeet Patel**
[GitHub](https://github.com/JeetPatel1812)

---

## Part of Cybersecurity Projects Series

- ✅ PassGuard — Password Strength Checker
- ✅ PortScan — Simple Port Scanner
- 🔲 More coming soon...
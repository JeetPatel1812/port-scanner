from flask import Flask, request, jsonify, render_template
from scanner import scan_ports, resolve_host

app = Flask(__name__)

# ─── Home Page ───────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')

# ─── Scan Route ──────────────────────────────────────────────
@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()

    target = data.get('target', '').strip()
    port_range = data.get('port_range', 'common')
    speed = data.get('speed', 'normal')

    if not target:
        return jsonify({'error': 'No target provided'}), 400

    # Block scanning private/local addresses for safety
    blocked = ['localhost', '127.0.0.1', '0.0.0.0']
    if target in blocked:
        return jsonify({'error': 'Scanning localhost is not allowed'}), 403

    result = scan_ports(target, port_range, speed)
    return jsonify(result)

# ─── Resolve Route ───────────────────────────────────────────
@app.route('/resolve', methods=['POST'])
def resolve():
    data = request.get_json()
    target = data.get('target', '').strip()

    if not target:
        return jsonify({'error': 'No target provided'}), 400

    ip, error = resolve_host(target)
    if error:
        return jsonify({'error': error}), 400

    return jsonify({'ip': ip})

if __name__ == '__main__':
    app.run(debug=True)
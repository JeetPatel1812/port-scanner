import socket
import concurrent.futures
from datetime import datetime

# ─── Common Ports & Service Names ────────────────────────
COMMON_PORTS = {
    21:   'FTP',
    22:   'SSH',
    23:   'Telnet',
    25:   'SMTP',
    53:   'DNS',
    80:   'HTTP',
    110:  'POP3',
    135:  'RPC',
    139:  'NetBIOS',
    143:  'IMAP',
    443:  'HTTPS',
    445:  'SMB',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5900: 'VNC',
    6379: 'Redis',
    8080: 'HTTP-Alt',
    8443: 'HTTPS-Alt',
    27017:'MongoDB',
}

# ─── Resolve Hostname ─────────────────────────────────────
def resolve_host(target):
    try:
        ip = socket.gethostbyname(target)
        return ip, None
    except socket.gaierror:
        return None, f'Could not resolve hostname: {target}'

# ─── Scan Single Port ─────────────────────────────────────
def scan_port(ip, port, timeout=1):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((ip, port))
        sock.close()
        if result == 0:
            service = COMMON_PORTS.get(port, 'Unknown')
            return {
                'port':    port,
                'status':  'open',
                'service': service
            }
        return {
            'port':    port,
            'status':  'closed',
            'service': COMMON_PORTS.get(port, 'Unknown')
        }
    except Exception as e:
        return {
            'port':    port,
            'status':  'error',
            'service': 'Unknown'
        }

# ─── Scan Multiple Ports ──────────────────────────────────
def scan_ports(target, port_range='common', speed='normal'):
    start_time = datetime.now()

    # Resolve host
    ip, error = resolve_host(target)
    if error:
        return {'error': error}

    # Set timeout based on speed
    timeout = 0.5 if speed == 'fast' else 1.0

    # Determine ports to scan
    if port_range == 'common':
        ports = list(COMMON_PORTS.keys())
    elif port_range == 'all':
        ports = list(range(1, 1025))
    else:
        try:
            start, end = map(int, port_range.split('-'))
            ports = list(range(start, end + 1))
        except:
            ports = list(COMMON_PORTS.keys())

    # Scan ports using threads
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = {
            executor.submit(scan_port, ip, port, timeout): port
            for port in ports
        }
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    # Sort by port number
    results.sort(key=lambda x: x['port'])

    end_time = datetime.now()
    duration = round((end_time - start_time).total_seconds(), 2)

    open_ports = [r for r in results if r['status'] == 'open']

    return {
        'target':     target,
        'ip':         ip,
        'total':      len(ports),
        'open':       len(open_ports),
        'duration':   duration,
        'scan_time':  start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'results':    results
    }
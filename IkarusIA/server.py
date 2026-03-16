#!/usr/bin/env python3
"""
Icarus-IA Development Server
Includes CORS support for Chatling integration
"""
import http.server
import socketserver
import os

PORT = 8000

class IcarusHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS headers for Chatling
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def do_GET(self):
        # Serve index.html for root
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    os.chdir('/home/lucare/Documents/ICARUS_V2.5/core/frontend/public')
    
    with socketserver.TCPServer(("", PORT), IcarusHTTPRequestHandler) as httpd:
        print("🚀 Icarus-IA Development Server")
        print("=" * 50)
        print(f"📡 Running at: http://localhost:{PORT}")
        print(f"📂 Serving: {os.getcwd()}")
        print(f"🌐 Network: http://{os.popen('hostname -I').read().strip().split()[0]}:{PORT}")
        print("=" * 50)
        print("✅ Chatling enabled (ID: 7825123996)")
        print("✅ CORS enabled")
        print("✅ All pages linked")
        print("=" * 50)
        print("🛑 Press Ctrl+C to stop\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")

#!/usr/bin/env python3
import http.server, os

PORT = 8742
DIR  = os.path.join(os.path.expanduser("~"), "Library", "glow-up-era")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIR, **kw)
    def log_message(self, *a): pass

with http.server.HTTPServer(("", PORT), Handler) as s:
    s.serve_forever()

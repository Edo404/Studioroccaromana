# Server di sviluppo locale senza cache: ogni modifica è visibile subito.
import functools, http.server, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

root = sys.argv[1] if len(sys.argv) > 1 else "."
handler = functools.partial(NoCache, directory=root)
http.server.ThreadingHTTPServer(("127.0.0.1", 5500), handler).serve_forever()

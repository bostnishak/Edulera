import os
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, HTTPServer
import tkinter as tk

def get_base_path():
    # If the app is bundled by PyInstaller, sys._MEIPASS holds the temp folder path
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.abspath(".")

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass
    def log_error(self, format, *args):
        pass

def start_server(path):
    os.chdir(path)
    handler = QuietHandler
    httpd = HTTPServer(("127.0.0.1", 0), handler) # Bind to localhost on an open port
    port = httpd.server_address[1]
    
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    return port, httpd

def open_url(target_url):
    try:
        if hasattr(os, 'startfile'):
            os.startfile(target_url)  # Daha güvenilir Windows yöntemi
        else:
            webbrowser.open(target_url)
    except Exception:
        try:
            webbrowser.open_new(target_url)
        except:
            pass

def main():
    base_path = get_base_path()
    port, server = start_server(base_path)
    url = f"http://localhost:{port}/index.html"
    
    # Open the default web browser
    open_url(url)
    
    # Create simple GUI to keep the server alive and offer nice controls
    root = tk.Tk()
    root.title("Edulera")
    root.geometry("350x180")
    
    # Simple icon and formatting
    tk.Label(root, text="Edulera Program is Running!", font=("Helvetica", 12, "bold"), pady=15).pack()
    tk.Label(root, text="Sistemi kullanmaya devam etmek icin bu\npencereyi acik birakin.", justify=tk.CENTER).pack()
    
    def open_browser():
        open_url(url)
        
    tk.Button(root, text="Tarayicida Ac", command=open_browser, width=20, bg="#4CAF50", fg="white").pack(pady=10)
    
    def on_closing():
        root.destroy()
        sys.exit(0)
        
    root.protocol("WM_DELETE_WINDOW", on_closing)
    
    # Bring window to front initially
    root.attributes('-topmost', True)
    root.update()
    root.attributes('-topmost', False)
    
    root.mainloop()

if __name__ == "__main__":
    main()

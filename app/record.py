import subprocess, sys, time, shutil

from pathlib import Path

def make_even(x, y, w, h):
    # shrink by 1 pixel if odd; keep inside bounds
    if w % 2: 
        w -= 1
    if h % 2:
        h -= 1
    w = max(2, w)
    h = max(2, h)
    return x, y, w, h

# ---------------- DPI awareness (avoids -8,-8 offsets) ----------------
def make_dpi_aware():
    try:
        import ctypes
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

# ---------------- Find FFmpeg (bundled via imageio-ffmpeg or PATH) ----------------
def find_ffmpeg():
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        if exe and Path(exe).exists():
            return exe
    except Exception:
        pass
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    for c in [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe",
    ]:
        if Path(c).exists():
            return c
    return None

# ---------------- Desktop (virtual screen) bounds ----------------
def get_virtual_desktop_bounds():
    import ctypes
    SM_XVIRTUALSCREEN = 76
    SM_YVIRTUALSCREEN = 77
    SM_CXVIRTUALSCREEN = 78
    SM_CYVIRTUALSCREEN = 79
    x = ctypes.windll.user32.GetSystemMetrics(SM_XVIRTUALSCREEN)
    y = ctypes.windll.user32.GetSystemMetrics(SM_YVIRTUALSCREEN)
    w = ctypes.windll.user32.GetSystemMetrics(SM_CXVIRTUALSCREEN)
    h = ctypes.windll.user32.GetSystemMetrics(SM_CYVIRTUALSCREEN)
    return x, y, w, h

def clamp_rect(x, y, w, h, vx, vy, vw, vh):
    # Clamp capture rect within virtual desktop
    x2, y2 = x + w, y + h
    x = max(x, vx)
    y = max(y, vy)
    x2 = min(x2, vx + vw)
    y2 = min(y2, vy + vh)
    w = max(1, x2 - x)
    h = max(1, y2 - y)
    x,y,w,h = make_even(x,y,w,h)
    return x, y, w, h

# ---------------- Window selection ----------------
def list_windows():
    import pygetwindow as gw
    titles = [t for t in gw.getAllTitles() if t and t.strip()]
    seen, out = set(), []
    for t in titles:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out

def pick_window(titles):
    print("\nAvailable windows:")
    for i, t in enumerate(titles):
        print(f"  [{i}] {t}")
    while True:
        try:
            idx = int(input("\nSelect a window index to record: ").strip())
            if 0 <= idx < len(titles):
                return titles[idx]
        except ValueError:
            pass
        print("Invalid choice. Try again.")

def get_window_bounds(title):
    import pygetwindow as gw, time as _t
    wins = gw.getWindowsWithTitle(title)
    if not wins:
        raise RuntimeError(f"No window found with title: {title!r}")
    win = wins[0]
    try:
        win.activate()
        _t.sleep(0.3)
    except Exception:
        pass
    left, top, width, height = win.left, win.top, win.width, win.height
    if width <= 0 or height <= 0:
        raise RuntimeError("Window has zero-sized bounds (is it minimized?)")
    return left, top, width, height

# ---------------- FFmpeg command ----------------
def build_ffmpeg_cmd(ffmpeg_exe, x, y, w, h, out_path, fps=30, show_mouse=True, preset="veryfast", duration=None):
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "gdigrab",
        "-framerate", str(fps),
        "-offset_x", str(x),
        "-offset_y", str(y),
        "-video_size", f"{w}x{h}",
    ]
    if show_mouse:
        cmd += ["-draw_mouse", "1"]
    cmd += ["-i", "desktop", "-c:v", "libx264", "-preset", preset, "-pix_fmt", "yuv420p", "-r", str(fps)]
    if duration:
        cmd += ["-t", str(duration)]
    cmd += [str(out_path)]
    return cmd

def main():
    make_dpi_aware()

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("FFmpeg not found.\n"
              "Install with: pip install imageio-ffmpeg  (recommended)\n"
              "or install system-wide and ensure 'ffmpeg' is in PATH.")
        sys.exit(1)

    titles = list_windows()
    if not titles:
        print("No top-level windows found.")
        sys.exit(1)

    chosen = pick_window(titles)
    print(f"\nSelected: {chosen}")

    try:
        left, top, width, height = get_window_bounds(chosen)
    except RuntimeError as e:
        print(f"Error: {e}")
        sys.exit(1)

    vx, vy, vw, vh = get_virtual_desktop_bounds()
    x, y, w, h = clamp_rect(left, top, width, height, vx, vy, vw, vh)

    # Use MKV for resilience (safe if you must terminate). Switch to .mp4 later if you want.
    out_path = Path("window_capture.mkv").resolve()

    cmd = build_ffmpeg_cmd(ffmpeg, x, y, w, h, out_path, fps=30, show_mouse=True, preset="veryfast", duration=None)

    print("\nStarting recording...")
    print(f"FFmpeg:      {ffmpeg}")
    print(f"Capture rect: x={x}, y={y}, size={w}x{h} (virtual desktop origin {vx},{vy}, size {vw}x{vh})")
    print(f"Output file: {out_path}")
    print("?? Press Ctrl+C to stop and finalize the file.\n")

    # Launch FFmpeg and stop cleanly on Ctrl+C
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        try:
            # Best: ask FFmpeg to quit gracefully
            if proc.stdin:
                proc.stdin.write(b"q")
                proc.stdin.flush()
            proc.wait(timeout=10)
        except Exception:
            # Fallback: terminate (MKV usually survives; MP4 might not)
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except Exception:
                proc.kill()
        print("\nStopped. File saved:", out_path)

if __name__ == "__main__":
    main()


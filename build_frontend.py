"""Helper script to build the Vite React frontend before Django collectstatic.

Usage (Render Build Command example):
  pip install -r requirements.txt && npm --prefix frontend ci && python build_frontend.py && python manage.py collectstatic --noinput && python manage.py migrate

This keeps the built assets out of git while allowing Django/WhiteNoise to serve them.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).parent
FRONTEND = ROOT / "frontend"
DIST = FRONTEND / "dist"

def run(cmd: list[str]):
    print(f"[build_frontend] $ {' '.join(cmd)}")
    subprocess.check_call(cmd)

def main():
    if not FRONTEND.exists():
        print("Frontend directory missing, skipping build.")
        return
    # Install dependencies if node_modules absent (safety)
    if not (FRONTEND / 'node_modules').exists():
        run(["npm", "--prefix", "frontend", "ci"])
    run(["npm", "--prefix", "frontend", "run", "build"])
    if not DIST.exists():
        print("ERROR: build output not found at frontend/dist", file=sys.stderr)
        sys.exit(1)
    print("Build complete. Dist contains:")
    for p in DIST.glob("**/*"):
        if p.is_file():
            print(" -", p.relative_to(FRONTEND))

if __name__ == "__main__":
    main()

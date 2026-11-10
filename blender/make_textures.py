"""Generates the tee's textures at real-world scale (2048 px per metre of sewing pattern).
Pattern UVs: u = x + 0.5 (x in metres, -0.5..0.5), v = z / 0.75 (z = metres above the hem)."""
import numpy as np, math, sys
from PIL import Image, ImageFilter, ImageDraw
SRC = sys.argv[1]; OUT = sys.argv[2]
W, H = 2048, 1536; PPM = 2048.0
FABRIC = np.array([22, 22, 24], float)      # washed black cotton (sRGB)
INK = np.array([236, 234, 228], float)      # white plastisol
def to_px(x, z): return (x + 0.5) * PPM, (1 - z / 0.75) * H
def ink_mask(name, width_m):
    a = np.asarray(Image.open(f"{SRC}/{name}.webp").convert("RGBA")).astype(float)
    al = a[..., 3] > 200
    er = np.asarray(Image.fromarray((al * 255).astype("uint8")).filter(ImageFilter.MinFilter(15))) > 0
    lum = a[..., :3].mean(-1)
    m = np.clip((lum - 80) / 90, 0, 1) * er
    ys, xs = np.nonzero(m > 0.5); m = m[ys.min()-2:ys.max()+3, xs.min()-2:xs.max()+3]
    tw = int(width_m * PPM); th = int(m.shape[0] * tw / m.shape[1])
    big = Image.fromarray((m * 255).astype("uint8")).resize((tw, th), Image.LANCZOS)
    big = big.filter(ImageFilter.GaussianBlur(1.2))
    b = np.asarray(big).astype(float) / 255
    return np.clip((b - 0.5) * 4 + 0.5, 0, 1)          # crisp anti-aliased ink edge
def stitch(draw, p0, p1, off, col=(46, 46, 49)):
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0); nx, ny = -(y1 - y0) / L, (x1 - x0) / L
    for o in off:
        n = int(L / 9)
        for i in range(n):
            if i % 2: continue
            t0, t1 = i / n, (i + 0.8) / n
            draw.line([(x0 + (x1 - x0) * t0 + nx * o, y0 + (y1 - y0) * t0 + ny * o),
                       (x0 + (x1 - x0) * t1 + nx * o, y0 + (y1 - y0) * t1 + ny * o)], fill=col, width=2)
def panel(name, print_w, top_below_hps, flip):
    rng = np.random.default_rng(7)
    img = np.ones((H, W, 3)) * FABRIC
    # garment-dyed heather: low-frequency mottling + fibre noise
    lo = np.asarray(Image.fromarray((rng.random((48, 64)) * 255).astype("uint8")).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))).astype(float) / 255
    img += (lo[..., None] - 0.5) * 10 + (rng.random((H, W, 1)) - 0.5) * 5
    rough = np.full((H, W), 0.93)
    m = ink_mask(name, print_w)
    if flip: m = m[:, ::-1]
    hps_z = 0.705; top_z = hps_z - top_below_hps
    px, py = to_px(-print_w / 2, top_z); px, py = int(px), int(py)
    if flip: px = int(to_px(-print_w / 2, 0)[0])
    h, w = m.shape
    crack = 1 - 0.06 * (rng.random((h, w)) > 0.985)       # faint worn-print speckle
    region = img[py:py + h, px:px + w]
    mm = (m * crack)[..., None]
    img[py:py + h, px:px + w] = region * (1 - mm) + INK * mm
    rough[py:py + h, px:px + w] = rough[py:py + h, px:px + w] * (1 - m) + 0.62 * m
    out = Image.fromarray(np.clip(img, 0, 255).astype("uint8"))
    d = ImageDraw.Draw(out)
    # double-needle hem + sleeve cuff stitching (pattern coords, metres)
    a = math.radians(50); dx, dz = math.cos(a), -math.sin(a); nx, nz = dz, -dx
    SP = (0.315, 0.672); T = (SP[0] + dx * 0.245, SP[1] + dz * 0.245); B = (T[0] + nx * 0.195, T[1] + nz * 0.195)
    for s in (1, -1):
        stitch(d, to_px(-0.31, 0.0), to_px(0.31, 0.0), (-36, -48))
        t2, b2 = (s * T[0], T[1]), (s * B[0], B[1])
        stitch(d, to_px(*t2), to_px(*b2), (36 * s, 48 * s) if True else ())
    out.save(f"{OUT}/tee_{name}_color.webp", quality=88, method=6)
    r = Image.fromarray((np.dstack([np.zeros_like(rough), rough, np.zeros_like(rough)]) * 255).astype("uint8")).resize((1024, 768), Image.LANCZOS)
    r.save(f"{OUT}/tee_{name}_rough.webp", quality=85, method=6)
def normal_tile(h, strength, fn):
    gy, gx = np.gradient(h)
    n = np.dstack([-gx * strength, gy * strength, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    Image.fromarray(((n * 0.5 + 0.5) * 255).astype("uint8")).save(f"{OUT}/{fn}", quality=90, method=6)
S = 256; y, x = np.mgrid[0:S, 0:S] / S
# single jersey: columns of interlocking V loops (8 wales x 12 courses per tile)
wx = (x * 8) % 1; cy = (y * 12 + 0.5 * (np.floor(x * 8) % 2)) % 1
loop = np.exp(-((wx - 0.5 - 0.25 * np.sign(wx - 0.5) * (1 - cy)) ** 2) / 0.02) * (0.6 + 0.4 * np.sin(cy * math.pi))
normal_tile(loop, 6.0, "jersey_normal.webp")
rib = 0.5 + 0.5 * np.cos(x * 2 * math.pi * 6)        # 1x1 rib, 6 ribs per tile
normal_tile(rib ** 0.6, 9.0, "rib_normal.webp")
panel("front", 0.222, 0.151, False)
panel("back", 0.282, 0.091, True)
print("ok")

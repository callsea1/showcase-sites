# 3 Ninja LLC — Static 3D Assets (Phase 5 optional)

Place authored assets here to enable `useAuthoredAssets` in the WebGL stage config.

| File | Purpose | Target |
|------|---------|--------|
| `robot-presenter.glb` | Robotic bust + arm presenting baseball | < 40k tris, Draco |
| `baseball.glb` | Hero baseball prop | < 2k tris |
| `../hdri/stadium-night.hdr` | Stadium night environment | 2K max |
| `../textures/stickers/` | Effort decal PNGs | 512×512 each |

## Blender export settings

- Scale: 1m, Y-up, apply transforms
- Export GLB with Draco compression
- Validate at https://gltf.report

Procedural robot + baseball render without these files.

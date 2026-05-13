# CLAUDE.md

Guide for AI assistants working in this repository.

## What this repo is

**Pressure Gradient Theory (PGT)** — a physics research repo by *BlackJakey*, audited / revised in collaboration with Claude. It contains paper drafts (LaTeX + Markdown + compiled PDFs) and one standalone React/Three.js visualization.

This is a **paper repo**, not a software project: there is no build system, no test suite, no package.json, no CI. Edits are almost always to prose, equations, tables, or the single JSX file.

The theory proposes the vacuum is a high-pressure FCC lattice of regular tetrahedra and derives multiple fundamental constants (α⁻¹, μ = m_p/m_e, G, ε_K, ...) from one geometric parameter ξ₀ = 1 + δ_S/60 where δ_S = 1+√2 (silver ratio, Pell equation root). See `README.md` for the headline results.

## File inventory

```
README.md                                       Project overview (key results table)
PGT_v6.2.{tex,pdf}                              Paper v6.2 — tetrahedral vacuum / G decomposition
PGT_v6.2_English.md                             Paper v6.2, Markdown form (English)
PGT_v7_Contest_EN_right_version_v5.md           ★ v7 Contest paper — current canonical English MD
PGT_v7_Contest_EN_v5.{tex,pdf}                  v7 Contest paper (English LaTeX + PDF)
PGT_v7_Contest_v5_EN.tex                        Alternate v7 Contest LaTeX source (see "two v7 EN .tex" below)
PGT_v7_Contest_v5_rightversion_EN.pdf           PDF compiled from the "right_version" MD
PGT_v7_Contest_v5_ZH.pdf                        v7 Contest paper, Chinese
pgt_solar_3d_v2.jsx                             Three.js solar-system orbit visualization
```

### The two paper "branches"

- **v6.2** — tetrahedral vacuum geometry; derives α⁻¹ = 360°/δ_S − 5δ_S, G = 12ℏ²H₀/(c m_π³), Hubble = 71.3 km/s/Mpc, etc.
- **v7 Contest** — Journal Ambitions Contest entry; reframes around non-backtracking paths on the FCC lattice, O_h decomposition into 5 irreps (A_1g, T_1u, T_2g, E_g, T_2u), derives Maxwell's equations + periodic-table IE ratios with zero free parameters. **`PGT_v7_Contest_EN_right_version_v5.md` is the canonical EN text** (the filename literally says "right_version"). The "right_version" PDF was compiled from it.

There are two v7 EN `.tex` files (`PGT_v7_Contest_EN_v5.tex` and `PGT_v7_Contest_v5_EN.tex`). They are slightly different drafts. Don't assume they are interchangeable — check which one corresponds to the PDF you care about before editing, and ask the user if it's unclear which is canonical.

## Conventions when editing

### Physics content is load-bearing — do not paraphrase numerically

- Never alter a numerical value, equation, symbol, or unit without explicit instruction. Even reformatting (e.g. `10^-11` ↔ `10⁻¹¹`) can introduce a sign or exponent error.
- Constants and tagged values appear in multiple files. If the user asks to change one (e.g., update H₀ from 71.3 to a new value), grep across `*.md` and `*.tex` and update all occurrences — but list them back to the user before committing.
- Preserve the **claim-level tags** used in v7: `[P]` proven, `[V]` verified, `[O]` observed, `[C]` candidate, `[x]` negated. These are part of the theory's epistemic discipline; do not silently change a `[C]` to `[P]` or drop the bracket.
- Key invariants worth recognizing (so you can spot accidental damage):
  - δ_S = 1 + √2 ≈ 2.41421 (silver ratio, Pell equation root)
  - ξ₀ = 1 + δ_S/60 ≈ 1.04024
  - α⁻¹ formula: `360°/δ_S − 5δ_S = 137.046`
  - G formula: `G = 12 ℏ² H₀ / (c m_π³)`, 12 = FCC coordination number
  - O_h irrep dimensions: A_1g(1) ⊕ T_1u(3) ⊕ T_2g(3) ⊕ E_g(2) ⊕ T_2u(3), total = 12 (bond rep)
  - Identity check `P1 = Σ dim_Γ · |λ_Γ|² = 132` for all ξ (this is a theorem; if you "fix" it to something else you've broken the theory)

### LaTeX / Markdown parity

- The `.md` and `.tex` files for the same version are meant to express the same content but **diverge in formatting**: the MD uses pandoc-style YAML headers + `\begin{theorem}` blocks inline, the TeX files are standalone. When the user asks to "update the paper," ask which surface (MD, TeX, or both) and which version.
- Do not regenerate a PDF unless the user asks. There is no Makefile; building requires `pandoc` + a TeX distribution and the user typically does it themselves.

### The JSX file (`pgt_solar_3d_v2.jsx`)

- A single-file React component (`Solar3Dv2`) using `three` directly (no react-three-fiber). It compares actual planetary semi-major axes to PGT's bare prediction `a = n/5` (with optional helium-screening correction `σ_He = 0.3131`).
- It is **not** wired into a build — it is meant to be dropped into a React host. Don't add a `package.json`, bundler config, or `index.html` unless explicitly asked.
- The constants table (`PLANETS` array, lines ~12–20) encodes physical predictions. Don't tweak `n`, `d_n`, `oh`, or `type` casually — those map to PGT's irrep assignments.

### Filenames

Filenames follow an ad-hoc convention (`_v5`, `_right_version`, `_EN`, `_ZH`, etc.). Do not rename existing files. New artifacts should follow the same suffix pattern (e.g., `PGT_v7_Contest_EN_v6.tex` for a next iteration).

## Git workflow

- Remote: `origin → BlackJakey-lgtm/PGT` (only this repo is in scope).
- Working branch: **`claude/add-claude-documentation-2lhBi`** (per session instructions). Push there with `git push -u origin <branch>`; do **not** push to other branches.
- History is small (5 commits, mostly "Add files via upload"). Commit messages can be short but should describe the substantive change (not "update files").
- Only create commits / PRs when the user explicitly asks.

## Doing tasks here — general principles

These come from `Claude 寫程式準則` (provided by the user as a working guideline):

1. **Think before acting.** Surface assumptions. If the request is ambiguous (e.g. "fix the formula on page 3" — which paper? which formula?), ask. Don't silently choose one interpretation.
2. **Smallest change that solves it.** Don't refactor neighbouring prose, don't "improve" tables you weren't asked to touch, don't introduce abstractions in the JSX.
3. **Surgical edits.** Match existing style — including the in-file mix of English/Chinese in some sections of the v7 MD, the inline `\begin{theorem}` blocks, and the compact one-letter variable names in the JSX. Don't normalize them.
4. **Verify against a target.** "Add a row to the constants table" → know what value to add, where it comes from, and confirm dimensions before editing.
5. **No speculative features.** No documentation files (other than this one), no scripts, no helpers, no `.gitignore`, no CI configs, unless the user asks.

## Things to watch out for

- The user is a physics author who collaborates with LLMs but is wary of hallucinations (Chapter 0 of the v7 paper says so explicitly). If you're not sure about a physics claim, say so — do **not** invent a citation, a numerical value, or a derivation step.
- Multiple files contain near-duplicate prose with small intentional differences (v6.2 vs v7, EN vs ZH, two v7 EN .tex). When editing one, check whether the change should propagate, and ask if unsure.
- PDFs are checked in alongside sources. Don't delete them; the user uses them for reference.

## Out of scope for this repo

If you receive uploads or attachments that reference a different project (e.g. the "魔素紀元 / Mana Era" GDD pack, with files like `spec_index.yaml`, system specs, or `generate_diagrams.py`), they are **not** part of this repo. Flag the mismatch to the user before incorporating any of that content here.

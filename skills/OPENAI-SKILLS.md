# Codex and ChatGPT skill copies

Copied 40 locally available skill packages on 2026-10-23, including 20 artifact
templates. The 386 imported files include scripts, references, assets, agent
metadata, and bundled licenses. This is a snapshot, without automatic updates.

[OPENAI-SKILLS-IMPORT.json](OPENAI-SKILLS-IMPORT.json) lists every skill, its source
path and description, and SHA-256 checksums for the source and copied files.

## Copy adjustments

- Existing MausBot files were preserved. The incoming `pdf` and `skill-creator`
  packages are named `codex-pdf` and `codex-skill-creator` to avoid conflicts.
- Those two frontmatter names match their new folders. The frontmatter names of
  `presentations` and `spreadsheets` were lowercased for MausBot's skill parser.
- `create-pet` and `update-pet` each include their two shared contract files under
  `references/`; the four links to those files were updated accordingly.
- All other source files are unchanged. Original source checksums and each
  adjustment are recorded in the import inventory.

## Using these files

These are source copies. No MausBot `manifest.json` files, runtime registrations,
bot assignments, or deployment changes were added. MausBot's bundled loader
requires a manifest beside each `SKILL.md`. An already packaged application does
not automatically read newly added source files.

The copies contain instructions and supporting files, not the tools they call.
Artifact Session, Pages/Spaces, Pets, live Excel control, plugin management,
image generation, and Codex inline visualization need corresponding tools or
MausBot adaptations. Original application APIs and runtime paths remain in the
instructions. Local artifact helpers also require their documented libraries,
runtimes, and renderers. The creator and installer retain Codex destination
guidance; explicitly select MausBot's skills folder when using them here.

All 40 copied `SKILL.md` files passed MausBot's frontmatter parser. All imported
files were checked against their sources or the documented adjustments, and the
412 previously existing skill files were verified unchanged. This validates the
copy, not execution of each workflow in MausBot.

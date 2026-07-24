#!/usr/bin/env python3
"""
orcestor/dispatch.py — Task lifecycle manager for file-based orchestration.

Usage examples:
  python3 orcestor/dispatch.py new T-003
      Creates a new draft task template in orcestor/tasks/T-003.md based on orcestor/prompt.md.

  python3 orcestor/dispatch.py send T-003
      Moves task T-003.md from orcestor/tasks/ to orcestor/task_pending/.

  python3 orcestor/dispatch.py complete T-003
      Moves task T-003.md (and T-003-response.md if present) from orcestor/task_pending/
      to orcestor/task_compliete/ and appends a timestamped log entry to orcestor/status/T-003.log.

  python3 orcestor/dispatch.py status
      Displays current status of all tasks across tasks, task_pending, and task_compliete directories.

  python3 orcestor/dispatch.py check T-005 [--build]
      ADVISORY ONLY — prints signals to help review T-005 (scope-matched changes,
      out-of-scope changes, response.md format). Never writes status/ or moves files.
      See cmd_check() docstring for exactly what it does and does not guarantee.
"""

import argparse
import datetime
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

# Paths relative to the orcestor directory
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
PROMPT_TEMPLATE_PATH = BASE_DIR / "prompt.md"
TASKS_DIR = BASE_DIR / "tasks"
PENDING_DIR = BASE_DIR / "task_pending"
COMPLETE_DIR = BASE_DIR / "task_compliete"
STATUS_DIR = BASE_DIR / "status"


def ensure_directories():
    """Ensure all required orchestrator directories exist."""
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    PENDING_DIR.mkdir(parents=True, exist_ok=True)
    COMPLETE_DIR.mkdir(parents=True, exist_ok=True)
    STATUS_DIR.mkdir(parents=True, exist_ok=True)


def normalize_task_id(task_id: str) -> str:
    """Normalize task ID by removing .md extension if passed."""
    if task_id.endswith(".md"):
        return task_id[:-3]
    return task_id


def extract_template(task_id: str) -> str:
    """Extract template block from prompt.md and replace {{TASK_ID}} placeholder."""
    if not PROMPT_TEMPLATE_PATH.exists():
        # Fallback template if prompt.md is missing
        return f"""## Task ID: {task_id}
### Sarlavha: [Task Title]

**Maqsad (Goal):**
[Goal description]

**Kontekst (Context):**
[Context]

**Cheklovlar (Constraints):**
[Constraints]

**Ish doirasidagi fayllar (Files in scope):**
[Files]

**Bajarilgan deb hisoblanish mezoni (Definition of Done):**
[DoD]

**Tavsiya etilgan Antigravity rejimi (Mode):**
Agent-driven

**Natijani qayerga yozish kerak (Report back):**
- Ishlash davomida `orcestor/task_pending/{task_id}-response.md` fayliga yozib boring.
- Topshiriq to'liq bajarilgach, ikkala faylni `orcestor/task_compliete/` papkasiga ko'chiring.
"""

    content = PROMPT_TEMPLATE_PATH.read_text(encoding="utf-8")
    
    # Try to extract section 1 markdown codeblock
    match = re.search(r"## 1\. Shablon.*?```markdown\n(.*?)\n```", content, re.DOTALL)
    if match:
        template = match.group(1)
    else:
        # Fallback to general block match
        match_block = re.search(r"```markdown\n(.*?)\n```", content, re.DOTALL)
        if match_block:
            template = match_block.group(1)
        else:
            template = content

    return template.replace("{{TASK_ID}}", task_id)


def cmd_new(args):
    """Create a new task draft in orcestor/tasks/<TASK_ID>.md."""
    ensure_directories()
    task_id = normalize_task_id(args.task_id)
    filename = f"{task_id}.md"
    target_path = TASKS_DIR / filename

    if target_path.exists():
        print(f"[ERROR] Task file already exists: {target_path}")
        sys.exit(1)

    # Check if task already exists in pending or complete
    if (PENDING_DIR / filename).exists():
        print(f"[ERROR] Task '{task_id}' is already in pending queue ({PENDING_DIR / filename}).")
        sys.exit(1)
    if (COMPLETE_DIR / filename).exists():
        print(f"[ERROR] Task '{task_id}' is already completed ({COMPLETE_DIR / filename}).")
        sys.exit(1)

    template_content = extract_template(task_id)
    target_path.write_text(template_content, encoding="utf-8")
    print(f"[SUCCESS] Created new task draft: orcestor/tasks/{filename}")


def cmd_send(args):
    """Move task file from orcestor/tasks/ to orcestor/task_pending/."""
    ensure_directories()
    task_id = normalize_task_id(args.task_id)
    filename = f"{task_id}.md"
    src_path = TASKS_DIR / filename
    dest_path = PENDING_DIR / filename

    if not src_path.exists():
        if dest_path.exists():
            print(f"[WARNING] Task '{task_id}' is already in task_pending.")
            return
        if (COMPLETE_DIR / filename).exists():
            print(f"[ERROR] Task '{task_id}' is already completed and in task_compliete.")
            sys.exit(1)
        print(f"[ERROR] Task file not found: {src_path}")
        sys.exit(1)

    shutil.move(str(src_path), str(dest_path))
    print(f"[SUCCESS] Moved {filename} from orcestor/tasks/ to orcestor/task_pending/")


def cmd_complete(args):
    """Move task file from orcestor/task_pending/ to orcestor/task_compliete/ and write status log."""
    ensure_directories()
    task_id = normalize_task_id(args.task_id)
    filename = f"{task_id}.md"
    resp_filename = f"{task_id}-response.md"

    src_task = PENDING_DIR / filename
    dest_task = COMPLETE_DIR / filename

    src_resp = PENDING_DIR / resp_filename
    dest_resp = COMPLETE_DIR / resp_filename

    if not src_task.exists():
        if dest_task.exists():
            print(f"[WARNING] Task '{task_id}' is already in task_compliete.")
        else:
            print(f"[ERROR] Task file not found in pending: {src_task}")
            sys.exit(1)
    else:
        shutil.move(str(src_task), str(dest_task))
        print(f"[SUCCESS] Moved {filename} to orcestor/task_compliete/")

    if src_resp.exists():
        shutil.move(str(src_resp), str(dest_resp))
        print(f"[SUCCESS] Moved {resp_filename} to orcestor/task_compliete/")

    # Append to status log
    log_file = STATUS_DIR / f"{task_id}.log"
    now_iso = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    log_entry = f"{now_iso} — {task_id} completed\n"

    with open(log_file, "a", encoding="utf-8") as f:
        f.write(log_entry)

    print(f"[SUCCESS] Status log updated: orcestor/status/{task_id}.log")


def cmd_status(args):
    """List current status of all tasks across directories."""
    ensure_directories()

    def list_md_files(directory: Path):
        if not directory.exists():
            return []
        return sorted([f.name for f in directory.glob("*.md")])

    drafts = list_md_files(TASKS_DIR)
    pending = list_md_files(PENDING_DIR)
    completed = list_md_files(COMPLETE_DIR)

    print("==========================================")
    print("      Orchestrator Task Status Summary    ")
    print("==========================================")

    print("\n[tasks] Draft Tasks:")
    if drafts:
        for f in drafts:
            print(f"  - {f}")
    else:
        print("  (none)")

    print("\n[task_pending] Pending / In-Progress Tasks:")
    if pending:
        for f in pending:
            print(f"  - {f}")
    else:
        print("  (none)")

    print("\n[task_compliete] Completed Tasks:")
    if completed:
        for f in completed:
            print(f"  - {f}")
    else:
        print("  (none)")
    print("==========================================")


def find_task_file(task_id: str):
    """Locate <task_id>.md across tasks/, task_pending/, task_compliete/. Returns (Path, dirname) or (None, None)."""
    filename = f"{task_id}.md"
    for directory, label in ((TASKS_DIR, "tasks"), (PENDING_DIR, "task_pending"), (COMPLETE_DIR, "task_compliete")):
        candidate = directory / filename
        if candidate.exists():
            return candidate, label
    return None, None


def extract_scope_paths(task_content: str):
    """Pull backtick-quoted paths out of the 'Ish doirasidagi fayllar' section.

    Best-effort only: task files are free-form markdown, not a strict grammar,
    so this is a heuristic, not a parser. False negatives/positives are expected
    on unusually worded scope sections — that's why `check` reports this as a
    signal to look at, not a verdict.
    """
    section_match = re.search(
        r"\*\*Ish doirasidagi fayllar.*?:\*\*\n(.*?)(?:\n\*\*|\Z)",
        task_content,
        re.DOTALL,
    )
    if not section_match:
        return []
    section = section_match.group(1)
    return re.findall(r"`([^`]+)`", section)


def path_in_scope(rel_path: str, scope_entries: list) -> bool:
    """Check whether a repo-relative changed file path falls under any scope entry.

    Entries ending in /** or /* are treated as directory prefixes; anything else
    (including entries with no trailing wildcard, or mid-string globs like
    `foo/*.ts`) falls back to a prefix match on the part before the first `*`.
    This is intentionally permissive (favors false negatives over false
    positives) since the goal is a heads-up, not an enforcement gate.
    """
    for entry in scope_entries:
        cleaned = entry.split(" ")[0].strip("`").rstrip("/")
        star_idx = cleaned.find("*")
        prefix = cleaned[:star_idx] if star_idx != -1 else cleaned
        prefix = prefix.rstrip("/")
        if not prefix:
            continue
        if rel_path == prefix or rel_path.startswith(prefix + "/") or rel_path.startswith(prefix):
            return True
    return False


def git_changed_files():
    """Return repo-relative paths of all changed (staged+unstaged+untracked) files.

    Reflects the WHOLE working tree, not just this task — with no per-task
    commits/branches in this workflow, there is no way to isolate one task's
    diff from another's. Callers must not treat "changed" as "changed by this
    task" without cross-referencing scope.
    """
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"[WARNING] Could not run git status: {e}")
        return None
    files = []
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        # porcelain format: XY <path> (rename entries use "old -> new"; take the new path)
        path_part = line[3:]
        if " -> " in path_part:
            path_part = path_part.split(" -> ", 1)[1]
        files.append(path_part.strip())
    return files


def cmd_check(args):
    """ADVISORY ONLY. Prints signals for a human/Claude Code review — never a gate.

    Does NOT:
      - write to status/, move any files, or decide ACCEPTED/REJECTED/NEEDS_REVISION.
      - guarantee correctness of scope matching (best-effort markdown parsing).
      - isolate this task's changes from other tasks/sessions touching the same
        shared, uncommitted working tree — out-of-scope changes are reported as
        a note, not an error, since they may belong to unrelated concurrent work.

    Prints three signals:
      1. Scope-matched changed files (empty = possible fake "done" report — the
         known AGY failure mode from T-004, see starter.md).
      2. Other changed files in the tree (informational only, not a violation).
      3. Whether {TASK_ID}-response.md contains the expected sections.
      4. (only with --build) filtered npm run build / tsc --noEmit output.
    """
    ensure_directories()
    task_id = normalize_task_id(args.task_id)
    task_path, location = find_task_file(task_id)

    print("==========================================")
    print(f"   ADVISORY check for {task_id} (not a gate)   ")
    print("==========================================")

    if not task_path:
        print(f"[ERROR] Task file not found in tasks/, task_pending/, or task_compliete/: {task_id}.md")
        sys.exit(1)

    print(f"[INFO] Task file found in: {location}/")
    task_content = task_path.read_text(encoding="utf-8")
    scope_entries = extract_scope_paths(task_content)

    if not scope_entries:
        print("[WARNING] Could not extract a 'Files in scope' list from the task file — "
              "skipping scope signal. Check the task file manually.")
    else:
        print(f"\n[INFO] Declared scope ({len(scope_entries)} entries):")
        for entry in scope_entries:
            print(f"  - {entry}")

    changed = git_changed_files()
    if changed is None:
        print("\n[WARNING] git status unavailable — skipping change signals.")
    elif not changed:
        print("\n[SIGNAL] No changes at all in the working tree. If this task is "
              "supposed to be done, that's a red flag (empty-write pattern from T-004).")
    else:
        in_scope = [f for f in changed if scope_entries and path_in_scope(f, scope_entries)]
        out_of_scope = [f for f in changed if f not in in_scope]

        print(f"\n[SIGNAL] Files changed within declared scope ({len(in_scope)}):")
        if in_scope:
            for f in in_scope:
                print(f"  - {f}")
        else:
            print("  (none) — if AGY reported this task done, this is worth double-checking "
                  "with `git diff` yourself before trusting the response.md summary.")

        print(f"\n[NOTE] Other changed files in the tree ({len(out_of_scope)}, "
              f"may belong to other tasks/sessions — not necessarily a violation):")
        if out_of_scope:
            for f in out_of_scope:
                print(f"  - {f}")
        else:
            print("  (none)")

    resp_filename = f"{task_id}-response.md"
    resp_path = None
    for directory in (PENDING_DIR, COMPLETE_DIR):
        candidate = directory / resp_filename
        if candidate.exists():
            resp_path = candidate
            break

    print(f"\n[SIGNAL] Response file:")
    if not resp_path:
        print(f"  (none) — {resp_filename} not found in task_pending/ or task_compliete/.")
    else:
        resp_content = resp_path.read_text(encoding="utf-8")
        has_changed_table = "O'zgargan fayllar" in resp_content or "Ozgargan fayllar" in resp_content
        has_dod_mention = bool(re.search(r"Definition of Done|Bajarilgan deb hisoblanish", resp_content, re.IGNORECASE))
        print(f"  Found: {resp_path.relative_to(REPO_ROOT)}")
        print(f"  Contains 'O'zgargan fayllar' table: {'yes' if has_changed_table else 'NO — missing, worth asking AGY to add it'}")
        print(f"  Mentions Definition of Done in summary: {'yes' if has_dod_mention else 'no'}")

    if getattr(args, "build", False):
        print("\n[BUILD] Running npm run build (this may take a while, and is heavy on "
              "this machine — avoid running while AGY is also building)...")
        _run_filtered(["npm", "run", "build"])
        print("\n[BUILD] Running npx tsc --noEmit...")
        _run_filtered(["npx", "tsc", "--noEmit"])

    print("\n==========================================")
    print("This is advisory output only. It does not decide ACCEPTED/REJECTED —")
    print("that judgment, and the status/ log entry, are still yours to make.")
    print("==========================================")


def _run_filtered(cmd: list):
    """Run a command from repo root; print only a pass/fail line unless it fails, then show error-ish lines."""
    try:
        result = subprocess.run(cmd, cwd=str(REPO_ROOT), capture_output=True, text=True)
    except FileNotFoundError as e:
        print(f"  [WARNING] Could not run {' '.join(cmd)}: {e}")
        return
    if result.returncode == 0:
        print(f"  [OK] {' '.join(cmd)} passed.")
        return
    print(f"  [FAIL] {' '.join(cmd)} exited with code {result.returncode}. Relevant output:")
    combined = (result.stdout or "") + (result.stderr or "")
    lines = [l for l in combined.splitlines() if re.search(r"error", l, re.IGNORECASE)]
    for line in (lines or combined.splitlines())[:40]:
        print(f"    {line}")


def main():
    parser = argparse.ArgumentParser(
        description="orcestor/dispatch.py — Task lifecycle manager for file-based orchestration."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Subcommand: new
    parser_new = subparsers.add_parser(
        "new", help="Create a new draft task template in orcestor/tasks/<TASK_ID>.md"
    )
    parser_new.add_argument("task_id", help="Task ID (e.g. T-003)")
    parser_new.set_defaults(func=cmd_new)

    # Subcommand: send
    parser_send = subparsers.add_parser(
        "send", help="Move task file from orcestor/tasks/ to orcestor/task_pending/"
    )
    parser_send.add_argument("task_id", help="Task ID (e.g. T-003)")
    parser_send.set_defaults(func=cmd_send)

    # Subcommand: complete
    parser_complete = subparsers.add_parser(
        "complete",
        help="Move task file from orcestor/task_pending/ to orcestor/task_compliete/ and write status log",
    )
    parser_complete.add_argument("task_id", help="Task ID (e.g. T-003)")
    parser_complete.set_defaults(func=cmd_complete)

    # Subcommand: status
    parser_status = subparsers.add_parser(
        "status", help="List current status of all tasks across orchestrator directories"
    )
    parser_status.set_defaults(func=cmd_status)

    # Subcommand: check
    parser_check = subparsers.add_parser(
        "check",
        help="ADVISORY ONLY: print scope/change/response-format signals for a task. Never gates or writes status.",
    )
    parser_check.add_argument("task_id", help="Task ID (e.g. T-005)")
    parser_check.add_argument(
        "--build", action="store_true",
        help="Also run npm run build + npx tsc --noEmit and show filtered (errors-only) output.",
    )
    parser_check.set_defaults(func=cmd_check)

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        args.func(args)
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

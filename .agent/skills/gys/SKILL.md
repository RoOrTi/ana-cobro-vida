---
name: gys
description: Saves all changes and synchronizes commits with the remote repository.
---

# Git Yield Sync (gys)

This skill automates the process of saving all current progress and syncing it with the Git repository. It ensures that all modifications are staged, committed, and shared with the remote server efficiently.

## Core Capabilities
1. **Auto-staging**: Automatically stages all new, modified, and deleted files.
2. **Smart Committing**: Creates a commit with a descriptive message.
3. **Full Sync**: Perfors a `git pull --rebase` to stay up-to-date and a `git push` to share changes.

## How to use this skill
When you need to "save everything" or "sync the project", use the provided sync script.

### Executing the Sync
You can run the sync script from the terminal:
```powershell
powershell -File .agent/skills/gys/scripts/sync.ps1 "Your commit message"
```

If you don't provide a message, the script should attempt to generate a brief summary or use a generic "sync: update project state" message.

## Files
- `SKILL.md`: This instruction file.
- `scripts/sync.ps1`: The PowerShell script that performs the Git operations.

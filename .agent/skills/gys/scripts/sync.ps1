param (
    [string]$CommitMessage = "sync: save changes"
)

Write-Host "Starting Git synchronization..." -ForegroundColor Cyan

# Check if inside a git repo
git rev-parse --is-inside-work-tree 2> $null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not a git repository."
    exit 1
}

# Stage all changes
Write-Host "Staging changes..."
git add .

# Check if there are changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit. Proceeding to pull/push..." -ForegroundColor Yellow
}
else {
    Write-Host "Committing changes..."
    git commit -m $CommitMessage
}

# Pull latest changes
Write-Host "Pulling latest changes (rebase)..."
git pull --rebase

# Push changes
Write-Host "Pushing changes..."
git push

Write-Host "Synchronization complete!" -ForegroundColor Green

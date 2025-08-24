# MongoDB Atlas Keep-Alive PowerShell Task Scheduler Setup
# This script creates a Windows scheduled task to keep MongoDB Atlas alive

Write-Host "🚀 Setting up MongoDB Atlas Keep-Alive Windows Task..." -ForegroundColor Green

# Get current directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
$KeepAliveScript = Join-Path $ScriptDir "keep-atlas-alive.js"

# Check if Node.js is available
$NodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $NodePath) {
    Write-Host "❌ Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js or add it to your PATH" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Node.js found at: $($NodePath.Source)" -ForegroundColor Green
Write-Host "✅ Keep-alive script: $KeepAliveScript" -ForegroundColor Green

# Create logs directory
$LogsDir = Join-Path $ProjectDir "logs"
if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
}

# Task details
$TaskName = "MongoDB Atlas Keep-Alive"
$LogFile = Join-Path $LogsDir "keep-alive.log"

try {
    # Remove existing task if it exists
    $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($ExistingTask) {
        Write-Host "⚠️ Removing existing task..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    }

    # Create action
    $Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c cd /d `"$ProjectDir`" && `"$($NodePath.Source)`" `"$KeepAliveScript`" >> `"$LogFile`" 2>&1"

    # Create trigger (every 20 minutes)
    $Trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 20) -RepetitionDuration (New-TimeSpan -Days 365) -At (Get-Date)

    # Create settings
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

    # Create principal (run as SYSTEM)
    $Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest

    # Register the task
    Write-Host "📝 Creating Windows scheduled task..." -ForegroundColor Cyan
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Force | Out-Null

    Write-Host "✅ Windows scheduled task created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Task Details:" -ForegroundColor Cyan
    Write-Host "   Name: $TaskName"
    Write-Host "   Schedule: Every 20 minutes"
    Write-Host "   Script: $KeepAliveScript"
    Write-Host "   Log: $LogFile"
    Write-Host ""
    Write-Host "🔍 To view the task:" -ForegroundColor Yellow
    Write-Host "   Get-ScheduledTask -TaskName '$TaskName'"
    Write-Host ""
    Write-Host "📊 To view logs:" -ForegroundColor Yellow
    Write-Host "   Get-Content '$LogFile' -Tail 20"
    Write-Host ""
    Write-Host "🗑️ To delete the task:" -ForegroundColor Yellow
    Write-Host "   Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
    Write-Host ""
    Write-Host "🎯 MongoDB Atlas will now stay alive with pings every 20 minutes!" -ForegroundColor Green

} catch {
    Write-Host "❌ Failed to create scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"

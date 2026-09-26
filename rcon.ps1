# Sends Project Zomboid admin commands to the server over RCON.
# Settings come from .env next to this script: RCON_IP, RCON_PORT, RCON_PASSWORD
# and RCON_EXE (path to gorcon's rcon.exe).
# Usage: .\rcon.ps1            prompts for commands until you enter an empty line or "exit"
#        .\rcon.ps1 players    runs one command and quits

$envFile = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path $envFile)) { Write-Error "No .env found at $envFile"; exit 1 }

$config = @{}
foreach ($line in Get-Content $envFile) {
    if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
        $config[$Matches[1]] = $Matches[2].Trim('"', "'")
    }
}

foreach ($key in 'RCON_IP', 'RCON_PORT', 'RCON_PASSWORD', 'RCON_EXE') {
    if (-not $config[$key]) { Write-Error "$key is missing from .env"; exit 1 }
}

$exe = $config['RCON_EXE']
if (-not (Test-Path $exe)) { Write-Error "rcon.exe not found at $exe (check RCON_EXE in .env)"; exit 1 }

$address = "$($config['RCON_IP']):$($config['RCON_PORT'])"

function Send-Rcon([string]$command) {
    # PZ commands over RCON have no leading slash.
    $command = $command.TrimStart('/')
    & $exe -a $address -p $config['RCON_PASSWORD'] $command
}

if ($args.Count -gt 0) {
    Send-Rcon ($args -join ' ')
    exit $LASTEXITCODE
}

Write-Host "Connected to $address. Enter a command, or an empty line to quit."
while ($true) {
    $command = Read-Host 'rcon'
    if (-not $command -or $command -eq 'exit') { break }
    Send-Rcon $command
}

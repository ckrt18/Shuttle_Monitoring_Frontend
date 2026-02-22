$paths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:LOCALAPPDATA\Android\android-sdk",
    "$env:ProgramFiles\Android\Android Studio",
    "$env:ProgramFiles(x86)\Android\Android Studio",
    "C:\Android\android-sdk"
)

Write-Host "Searching for Android in common locations..."
foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Found: $path"
        if (Test-Path "$path\platform-tools\adb.exe") {
            Write-Host "ADB found at: $path\platform-tools\adb.exe"
            exit 0
        }
        if (Test-Path "$path\bin\studio64.exe") {
             Write-Host "Android Studio executable found at: $path\bin\studio64.exe"
        }
    }
}
Write-Host "Android SDK not found in common locations."
exit 1

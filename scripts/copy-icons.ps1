$densities = @('mipmap-mdpi','mipmap-hdpi','mipmap-xhdpi','mipmap-xxhdpi','mipmap-xxxhdpi')
$base = "C:\Users\Morta\Downloads\steve-adventure\android\app\src\main\res"
foreach ($d in $densities) {
  $p = Join-Path $base $d
  Copy-Item (Join-Path $p 'ic_launcher.png') (Join-Path $p 'ic_launcher_foreground.png') -Force
  Copy-Item (Join-Path $p 'ic_launcher.png') (Join-Path $p 'ic_launcher_round.png') -Force
}
Write-Host "copied foreground/round from ic_launcher.png"
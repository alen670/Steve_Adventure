Add-Type -AssemblyName System.Drawing
$root = "C:\Users\Morta\Downloads\steve-adventure"
$srcItem = Get-ChildItem -Path $root -File -Filter "*.jpg" | Select-Object -First 1
if (-not $srcItem) {
  Write-Error "No jpg found in $root"
  exit 1
}
$src = $srcItem.FullName
$sizes = @{ 'mipmap-mdpi' = 48; 'mipmap-hdpi' = 72; 'mipmap-xhdpi' = 96; 'mipmap-xxhdpi' = 144; 'mipmap-xxxhdpi' = 192 }
$base = "C:\Users\Morta\Downloads\steve-adventure\android\app\src\main\res"

$img = [System.Drawing.Image]::FromFile($src)
foreach ($k in $sizes.Keys) {
  $size = $sizes[$k]
  $dir = Join-Path $base $k
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $dest = Join-Path $dir 'ic_launcher.png'
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($img, 0, 0, $size, $size)
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Saved $dest"
}
$img.Dispose()

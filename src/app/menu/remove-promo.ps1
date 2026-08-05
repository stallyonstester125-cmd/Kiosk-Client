$content = Get-Content 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Raw
$pattern = '(?s)// TODO: Use actual promotional database campaign data when API supports it\..*?const openProductDetail = \(product: ApiProduct\) => \{'
$replacement = 'const openProductDetail = (product: ApiProduct) => {'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)
Set-Content -Path 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Value $content -Encoding UTF8
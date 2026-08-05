$content = Get-Content 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Raw
$pattern = '(?s)// TODO: Use actual promotional database campaign data when API supports it\..*?const promoBadge = promoProduct \? `\$\{promoProduct\.price\.toFixed\(2\)\}` : "Special";\s*'
$replacement = ''
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)
Set-Content -Path 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Value $content -Encoding UTF8
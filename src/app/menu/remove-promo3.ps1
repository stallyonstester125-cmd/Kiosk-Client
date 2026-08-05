$content = Get-Content 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Raw
$old = @"
// TODO: Use actual promotional database campaign data when API supports it.
// Fallback to the first product of the active category as requested.
const promoProduct = filteredProducts[0];
const promoTitle = promoProduct ? promoProduct.name : \"Fresh & Delicious\";
const promoSubtitle = promoProduct
    ? promoProduct.description
    : \"Explore our premium selection of kiosk meals made fresh for you everyday.\";
const promoImage = promoProduct ? promoProduct.image : \"\";
const promoBadge = promoProduct ? `\$\{promoProduct.price.toFixed(2)\}` : \"Special\";

"
$content = $content -replace [System.Text.RegularExpressions.Regex]::Escape($old), ""
Set-Content -Path 'D:\POS Kiosk Application\Client\src\app\menu\page.tsx' -Value $content -Encoding UTF8
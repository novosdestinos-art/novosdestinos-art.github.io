$files = @('livro-7-dias.html', 'livro-arte-aco.html', 'livro-auto-sabota.html', 'livro-vazio-presenca.html')

$index = Get-Content 'index.html' -Raw

$headerPattern = '(?s)<header id="header">.*?</header>'
$header = [regex]::Match($index, $headerPattern).Value

$footerPattern = '(?s)<footer>.*?</footer>'
$footer = [regex]::Match($index, $footerPattern).Value

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        $content = $content -replace '<html lang="pt-BR">', '<html lang="pt-BR" data-theme="dark">'
        $content = $content -replace '(?s)<header id="header">.*?</header>', $header
        $content = $content -replace '(?s)<footer>.*?</footer>', $footer
        
        $content = [regex]::Replace($content, '(?s)<div class="product-image reveal">\s*(<img.*?>)\s*</div>', {
            param($match)
            $img = $match.Groups[1].Value
            if ($img -notmatch 'class="book-cover"') {
                if ($img -match 'class="') {
                    $img = $img -replace 'class="([^"]*)"', 'class="$1 book-cover"'
                } else {
                    $img = $img -replace '<img ', '<img class="book-cover" '
                }
            }
            return '<div class="product-image reveal">`n<div class="book-cover-wrapper">`n' + $img + '`n</div>`n</div>'
        })
        
        $content = $content -replace 'background:\s*var\(--accent-gold\);', ''
        $content = $content -replace 'border:\s*none;', ''
        
        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
Write-Host "Done"

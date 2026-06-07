$files = @('livro-7-dias.html', 'livro-arte-aco.html', 'livro-auto-sabota.html', 'livro-vazio-presenca.html')
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content.Replace("``n", "")
        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
Write-Host "Fixed"

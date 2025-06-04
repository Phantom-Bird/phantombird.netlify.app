# type anything else means no
$response = Read-Host "Build? (Y/n)"
if ($response -eq "Y" -or $response -eq "y" -or $response -eq ""){
    pnpm docs:build
    # copy netlify.toml docs/.vuepress/dist
}

$response = Read-Host "Push to gitee? (Y/n) Plz commit first."
if ($response -eq "Y" -or $response -eq "y" -or $response -eq ""){
    git push gitee master
}

$response = Read-Host "Publish to github -> netlify? (Y/n) Plz commit first."
if ($response -eq "Y" -or $response -eq "y" -or $response -eq ""){
    git push github master
}

$response = Read-Host "Preview? (y/N)"
if ($response -eq "Y" -or $response -eq "y"){
    pnpm docs:preview
}

pnpm docs:build
# copy netlify.toml docs/.vuepress/dist

# type anything else means no
$response = Read-Host "Push to github? (Y/n) Plz commit first."
if ($response -eq "Y" -or $response -eq "y" -or $response -eq ""){
    git push origin master
}

$response = Read-Host "Preview? (y/N)"
if ($response -eq "Y" -or $response -eq "y"){
    pnpm docs:preview
}

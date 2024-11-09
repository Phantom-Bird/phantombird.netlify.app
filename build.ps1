pnpm docs:build
copy netlify.toml docs/.vuepress/dist
# pnpm docs:preview
echo "Commit changes in git, or press Ctrl-C to exit."
pause
git push origin master

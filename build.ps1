pnpm docs:build
copy netlify.toml docs/.vuepress/dist
# pnpm docs:preview
echo "请在 git 中提交更改，或按 Ctrl-C 退出"
pause
git push origin master

@echo off
echo 检查Git状态...
git status
echo.
echo 检查远程仓库连接...
git ls-remote origin
echo.
echo 检查最近的提交...
git log --oneline -3
pause
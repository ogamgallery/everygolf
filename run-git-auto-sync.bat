@echo off
chcp 65001 > nul
title 에브리골프 GitHub 자동 동기화 엔진
echo 에브리골프 깃허브 자동 업데이트 스크립트를 실행합니다...
powershell -ExecutionPolicy Bypass -File "%~dp0git-auto-sync.ps1"
pause

@echo off
chcp 65001 > nul
title 에브리골프 GitHub 연동 설정기
echo 에브리골프 GitHub 연동 가이드 스크립트를 실행합니다...
powershell -ExecutionPolicy Bypass -File "%~dp0setup-github.ps1"
pause

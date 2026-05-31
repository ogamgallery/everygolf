@echo off
chcp 65001 > nul
title 에브리골프 GitHub 계정 로그인 연동
echo.
echo ========================================================
echo        에브리골프 GitHub 계정 연동 및 로그인 설정
echo ========================================================
echo.
echo 이 프로그램은 GitHub 계정을 안전하게 연동해 줍니다.
echo 잠시 후 인터넷 브라우저 창이 열리면 GitHub 로그인을 완료해 주세요.
echo.
echo [안내] 
echo 1. 'GitHub.com'을 선택하고 Enter를 누르세요.
echo 2. 'HTTPS'를 선택하고 Enter를 누르세요.
echo 3. 'Yes'를 선택하여 GitHub 자격 증명을 등록하세요.
echo 4. 'Login with a web browser'를 선택한 뒤 엔터를 누르면
echo    웹페이지가 열리면서 일회용 보안 코드(One-time code)가 화면에 표시됩니다.
echo    그 코드를 웹페이지에 입력해 주시면 로그인 완료됩니다!
echo.
echo --------------------------------------------------------
echo.
pause
echo.
gh auth login
echo.
echo ========================================================
echo GitHub 계정 연동 상태 확인:
gh auth status
echo ========================================================
echo.
pause

# setup-github.ps1
# 이 스크립트는 프로젝트를 GitHub 원격 저장소와 처음 연동하는 것을 돕습니다.

# UTF-8 출력 보장
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Git 경로 확인 및 설정
$GitPath = "git"
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\bin\git.exe") {
        $GitPath = "C:\Program Files\Git\bin\git.exe"
    } else {
        Write-Host "오류: 시스템에서 Git을 찾을 수 없습니다. Git을 먼저 설치해 주세요." -ForegroundColor Red
        Exit
    }
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "     에브리골프 GitHub 연동 설정 가이드     " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# 원격 저장소 origin이 등록되어 있는지 확인
$ExistingRemote = & $GitPath remote get-url origin 2>$null
if ($ExistingRemote) {
    Write-Host "현재 이미 연동된 GitHub 주소가 있습니다:" -ForegroundColor Yellow
    Write-Host "=> $ExistingRemote" -ForegroundColor Cyan
    Write-Host ""
    $Choice = Read-Host "주소를 변경하고 다시 설정하시겠습니까? (Y/N)"
    if ($Choice -ne 'Y' -and $Choice -ne 'y') {
        Write-Host "설정을 유지하고 종료합니다." -ForegroundColor Green
        Exit
    }
    # 기존 원격 제거
    & $GitPath remote remove origin
}

# 깃허브 원격 저장소 URL 입력받기
$Url = Read-Host "연동할 GitHub 저장소 URL을 입력해 주세요 (예: https://github.com/사용자명/저장소명.git)"
$Url = $Url.Trim()

if (-not $Url) {
    Write-Host "잘못된 주소입니다. 설정을 취소합니다." -ForegroundColor Red
    Exit
}

# 원격 저장소 추가
Write-Host ""
Write-Host "1. GitHub 원격 저장소를 등록 중입니다..." -ForegroundColor Gray
& $GitPath remote add origin $Url

# 기본 브랜치 이름을 main으로 설정
Write-Host "2. 브랜치를 'main'으로 구성하는 중..." -ForegroundColor Gray
& $GitPath branch -M main

# 로컬 변경 사항 커밋 여부 확인
Write-Host "3. 로컬 파일 스테이징 및 커밋 생성 중..." -ForegroundColor Gray
& $GitPath add .
& $GitPath commit -m "Initial commit from setup script" 2>$null

Write-Host ""
Write-Host "-----------------------------------------"
Write-Host "GitHub와 연동 설정이 성공적으로 등록되었습니다!" -ForegroundColor Green
Write-Host "이제 첫 업로드(Push)를 수행합니다." -ForegroundColor Yellow
Write-Host "※ 주의: 브라우저나 로그인 창이 뜨면 GitHub 로그인을 완료해 주셔야 업로드가 완료됩니다." -ForegroundColor Magenta
Write-Host "-----------------------------------------"
Write-Host ""

# 최초 푸시
& $GitPath push -u origin main

Write-Host ""
Write-Host "모든 과정이 완료되었습니다. 자동으로 업데이트를 원하시면 'run-git-auto-sync.bat'을 구동해 주세요!" -ForegroundColor Green

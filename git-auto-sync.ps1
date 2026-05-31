# git-auto-sync.ps1
# 이 스크립트는 프로젝트 디렉터리의 변경 사항을 실시간으로 감지하여 자동으로 Git 커밋 및 GitHub 푸시를 수행합니다.

# UTF-8 출력 보장
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Git 경로 확인 및 설정
$GitPath = "git"
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\bin\git.exe") {
        $GitPath = "C:\Program Files\Git\bin\git.exe"
    } else {
        Write-Host "오류: 시스템에서 Git을 찾을 수 없습니다. Git을 설치해 주세요." -ForegroundColor Red
        Exit
    }
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  에브리골프 Git 자동 동기화 엔진 구동 중  " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "감지 경로: $(Get-Location)"
Write-Host "Git 실행기: $GitPath"
Write-Host "변경이 감지되면 자동으로 커밋 후 Push를 수행합니다." -ForegroundColor Yellow
Write-Host "종료하려면 Ctrl + C를 누르세요." -ForegroundColor DarkGray
Write-Host "-----------------------------------------"

# 변경 감지기 설정
$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = Get-Location
$Watcher.IncludeSubdirectories = $true
$Watcher.EnableRaisingEvents = $true

# 변경 사항 수집을 위한 해시테이블
$Global:PendingChanges = $false
$Global:LastChangeTime = [DateTime]::MinValue

# 이벤트 처리 등록 함수
$Action = {
    # .git, node_modules, dist, .gemini 디렉터리는 제외
    $Path = $Event.SourceEventArgs.FullPath
    if ($Path -match '\\\.git\\' -or $Path -match '\\node_modules\\' -or $Path -match '\\dist\\' -or $Path -match '\\\.gemini\\') {
        return
    }
    
    # 변경 플래그 설정 및 최종 변경 시간 업데이트
    $Global:PendingChanges = $true
    $Global:LastChangeTime = [DateTime]::Now
    Write-Host "[변경 감지] $Path" -ForegroundColor Cyan
}

# 파일 시스템 이벤트 바인딩
$Created = Register-ObjectEvent $Watcher "Created" -Action $Action
$Changed = Register-ObjectEvent $Watcher "Changed" -Action $Action
$Deleted = Register-ObjectEvent $Watcher "Deleted" -Action $Action
$Renamed = Register-ObjectEvent $Watcher "Renamed" -Action $Action

try {
    # 무한 루프 돌며 버퍼링 기간(3초) 대기 후 푸시
    while ($true) {
        Start-Sleep -Seconds 1
        
        if ($Global:PendingChanges) {
            $TimePassed = ([DateTime]::Now - $Global:LastChangeTime).TotalSeconds
            if ($TimePassed -ge 3) {
                # 버퍼링 시간이 지났으므로 동기화 실행
                $Global:PendingChanges = $false
                Write-Host "=========================================" -ForegroundColor Blue
                Write-Host "동기화 시작 시간: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Blue
                
                # Git 동기화 프로세스 실행
                Write-Host "1. 변경된 파일 스테이징 중..." -ForegroundColor Gray
                & $GitPath add .
                
                $Status = & $GitPath status --porcelain
                if (-not $Status) {
                    Write-Host "변경된 사항이 없습니다." -ForegroundColor Yellow
                    continue
                }
                
                Write-Host "2. 로컬 커밋 생성 중..." -ForegroundColor Gray
                $CommitMsg = "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                & $GitPath commit -m $CommitMsg
                
                Write-Host "3. GitHub 원격 저장소로 Push 진행 중..." -ForegroundColor Gray
                $PushResult = & $GitPath push origin main 2>&1
                
                # Push 결과 출력
                $PushOutput = $PushResult | Out-String
                Write-Host $PushOutput
                
                if ($PushOutput -match "fatal:" -or $PushOutput -match "error:") {
                    Write-Host "동기화 실패: 원격 저장소 설정을 확인해 주시거나 로그인 상태를 점검해 주세요." -ForegroundColor Red
                } else {
                    Write-Host "GitHub 자동 동기화 성공 완료!" -ForegroundColor Green
                }
                Write-Host "=========================================" -ForegroundColor Blue
            }
        }
    }
}
finally {
    # 등록한 이벤트 제거 및 감지기 리소스 해제
    Unregister-Event -SourceIdentifier $Created.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $Changed.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $Deleted.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $Renamed.Name -ErrorAction SilentlyContinue
    $Watcher.Dispose()
    Write-Host "동기화 감지가 안전하게 중단되었습니다." -ForegroundColor Yellow
}

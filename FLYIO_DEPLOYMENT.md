# Fly.io 배포 가이드

RISS MCP Server를 Fly.io에 배포하는 완전한 가이드입니다.

## 🌏 왜 Fly.io인가?

| 항목 | Fly.io | Railway |
|------|--------|---------|
| **한국 리전** | ✅ 도쿄(nrt) | ❌ 없음 |
| **레이턴시** | ~30-50ms | ~150-200ms |
| **무료 플랜** | ✅ 제한적 | $5/월 크레딧 |
| **배포 방식** | CLI | GitHub 연동 |
| **한국 사용자** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## 📋 사전 준비

### 1. Fly.io 계정

1. [Fly.io](https://fly.io) 가입
2. 신용카드 등록 (무료 플랜도 필요)

### 2. Flyctl CLI 설치

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**macOS:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 3. 로그인

```bash
fly auth login
```

## 🚀 배포 방법

### 방법 1: GitHub에서 배포 (권장) ⭐⭐⭐⭐⭐

#### 1단계: GitHub 레포지토리 업데이트

```bash
# 로컬 클론 (이미 있으면 스킵)
git clone https://github.com/auraweon7-ship-it/riss.git
cd riss

# 또는 PowerShell에서 (Windows)
cd C:\Users\park9\riss

# 최신 파일 다운로드 (새 ZIP 압축 해제)
# riss-mcp-server-flyio.zip 압축 해제
# 파일들을 riss 폴더로 복사

# Git 커밋
git add .
git commit -m "Add Fly.io deployment configuration"
git push origin main
```

#### 2단계: Fly.io 앱 생성

```bash
# riss 폴더에서 실행
cd C:\Users\park9\riss

# Fly.io 앱 생성 (대화형)
fly launch

# 프롬프트 응답:
# App Name: riss-mcp-korea (또는 원하는 이름)
# Region: Tokyo, Japan (nrt) ← 선택
# PostgreSQL: No
# Redis: No
# Deploy now: Yes
```

#### 3단계: 배포 완료 확인

```bash
# 상태 확인
fly status

# 앱 URL
fly apps list

# 로그 확인
fly logs
```

### 방법 2: 직접 배포 (빠른 테스트)

```bash
cd C:\Users\park9\riss

# 즉시 배포
fly deploy

# 또는 특정 리전 지정
fly deploy --region nrt
```

## 🔧 배포 후 설정

### 1. 도메인 확인

```bash
fly info
```

**생성된 URL:**
```
https://riss-mcp-korea.fly.dev
```

### 2. 환경 변수 설정 (선택사항)

```bash
# Fly.io Secrets 설정
fly secrets set NODE_ENV=production

# 확인
fly secrets list
```

**참고**: `PORT`는 Fly.io가 자동으로 설정하므로 추가 불필요

### 3. 스케일 조정 (선택사항)

```bash
# VM 크기 확인
fly scale show

# 메모리 증가 (필요시)
fly scale memory 512

# 리전별 인스턴스 수
fly scale count 1 --region nrt
```

## 🧪 배포 테스트

### 1. 헬스체크

```bash
# PowerShell
curl https://riss-mcp-korea.fly.dev/health

# 또는
fly checks list
```

**예상 응답:**
```json
{
  "status": "healthy",
  "service": "riss-mcp-server",
  "version": "1.0.0"
}
```

### 2. 루트 엔드포인트

```bash
curl https://riss-mcp-korea.fly.dev/
```

### 3. MCP 엔드포인트

```bash
curl "https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_API_KEY"
```

## 🔌 Claude.ai 연동

### 커넥터 URL

```
https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_RISS_API_KEY
```

**예시 (API Key가 "mykey123"인 경우):**
```
https://riss-mcp-korea.fly.dev/mcp?oc=mykey123
```

### Claude.ai 설정

1. Claude.ai → **Settings** → **Integrations**
2. **"Add connector"** 클릭
3. 정보 입력:
   - **Name**: `RISS Academic Search`
   - **URL**: `https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_API_KEY`
4. **"Connect"** 클릭

## 📊 Fly.io 관리 명령어

### 일반 관리

```bash
# 앱 상태
fly status

# 실시간 로그
fly logs

# 앱 정보
fly info

# 대시보드 열기
fly dashboard
```

### 배포 관리

```bash
# 재배포
fly deploy

# 특정 Dockerfile 사용
fly deploy --dockerfile Dockerfile

# 빌드만 (배포 안 함)
fly deploy --build-only

# 이전 버전으로 롤백
fly releases
fly releases rollback <version>
```

### VM 관리

```bash
# VM 목록
fly machines list

# VM 재시작
fly machines restart <machine-id>

# VM 중지
fly machines stop <machine-id>

# VM 시작
fly machines start <machine-id>
```

### 리전 관리

```bash
# 리전 추가 (다중 리전 배포)
fly regions add nrt sin hkg

# 리전 제거
fly regions remove sin

# 리전 목록
fly regions list
```

## 💰 비용 관리

### 무료 플랜

Fly.io 무료 플랜 포함 사항:
- 최대 3개의 작은 VM (shared-cpu-1x, 256MB RAM)
- 월 160시간 실행 시간
- 3GB 영구 볼륨 스토리지

### 비용 절감 팁

1. **Auto-stop/start 활성화** (기본 설정)
   ```toml
   auto_stop_machines = true
   auto_start_machines = true
   min_machines_running = 0
   ```

2. **단일 리전 사용**
   ```bash
   fly scale count 1 --region nrt
   ```

3. **작은 VM 사용**
   ```bash
   fly scale vm shared-cpu-1x --memory 256
   ```

### 비용 확인

```bash
# 현재 사용량
fly dashboard billing
```

웹 대시보드: https://fly.io/dashboard/personal/billing

## ⚠️ 문제 해결

### 빌드 실패

**증상:**
```
Build failed: Docker build error
```

**해결:**
```bash
# Dockerfile 빌드 로그 확인
fly deploy --verbose

# 로컬에서 Docker 빌드 테스트
docker build -t riss-mcp-server .
docker run -p 8080:8080 riss-mcp-server
```

### 서버 시작 실패

**증상:**
```
Health checks failed
```

**해결:**
```bash
# 로그 확인
fly logs

# VM SSH 접속
fly ssh console

# 앱 재시작
fly apps restart riss-mcp-korea
```

### 포트 바인딩 오류

**증상:**
```
Error: Address already in use
```

**해결:**
- Fly.io는 `PORT` 환경 변수를 자동 주입
- 코드에서 `process.env.PORT || 8080` 사용 확인
- `fly.toml`의 `internal_port` 확인

### 메모리 부족

**증상:**
```
Out of memory
```

**해결:**
```bash
# 메모리 증가
fly scale memory 512

# 또는 1GB
fly scale memory 1024
```

## 🔄 CI/CD 자동 배포

### GitHub Actions

`.github/workflows/fly-deploy.yml`:

```yaml
name: Fly.io Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**설정:**
1. Fly.io API Token 생성: `fly auth token`
2. GitHub Secrets에 `FLY_API_TOKEN` 추가

## 📈 모니터링

### Fly.io 내장 모니터링

```bash
# 메트릭 확인
fly dashboard metrics

# 로그 스트리밍
fly logs --verbose
```

### 외부 모니터링 (선택사항)

- **Sentry**: 오류 추적
- **LogTail**: 로그 집계
- **UptimeRobot**: 가동 시간 모니터링

## 🌐 커스텀 도메인

### 도메인 연결

```bash
# 도메인 추가
fly certs add yourdomain.com

# 인증서 확인
fly certs show yourdomain.com
```

### DNS 설정

도메인 등록업체에서 CNAME 레코드 추가:

```
CNAME riss → riss-mcp-korea.fly.dev
```

## 🔐 보안

### HTTPS

- Fly.io는 자동으로 HTTPS 활성화
- Let's Encrypt 인증서 자동 발급

### Secrets 관리

```bash
# Secret 추가
fly secrets set API_KEY=your_secret_key

# Secret 목록
fly secrets list

# Secret 삭제
fly secrets unset API_KEY
```

## 📚 추가 자료

- [Fly.io 공식 문서](https://fly.io/docs)
- [Fly.io Node.js 가이드](https://fly.io/docs/languages-and-frameworks/node/)
- [Fly.io CLI 레퍼런스](https://fly.io/docs/flyctl/)
- [Fly.io 커뮤니티](https://community.fly.io)

## 🎯 빠른 시작 요약

```bash
# 1. Flyctl 설치 (Windows PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# 2. 로그인
fly auth login

# 3. 배포
cd C:\Users\park9\riss
fly launch --region nrt

# 4. 테스트
curl https://riss-mcp-korea.fly.dev/health

# 5. Claude.ai 연동
# URL: https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_API_KEY
```

완료! 🚀

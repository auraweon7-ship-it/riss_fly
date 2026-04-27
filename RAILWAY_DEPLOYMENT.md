# Railway 배포 가이드

## Railway란?

Railway는 현대적인 클라우드 배포 플랫폼으로, GitHub 연동을 통한 자동 배포를 제공합니다.

### Railway 장점

- ✅ **간편한 배포**: GitHub 푸시만으로 자동 배포
- ✅ **무료 크레딧**: 매월 $5 무료 크레딧 제공
- ✅ **자동 빌드**: Nixpacks를 통한 자동 환경 감지
- ✅ **직관적 UI**: 웹 대시보드에서 모든 관리 가능
- ✅ **무료 도메인**: 자동 HTTPS 도메인 제공

## 배포 방법

### 1. GitHub에 코드 업로드

```bash
# 레포지토리 클론 (또는 ZIP 압축 해제)
cd riss-mcp-server

# Git 초기화 (새 프로젝트인 경우)
git init
git add .
git commit -m "Initial commit"

# GitHub 레포지토리 연결
git remote add origin https://github.com/YOUR_USERNAME/riss-mcp-server.git
git branch -M main
git push -u origin main
```

### 2. Railway 프로젝트 생성

#### 방법 A: 웹 UI (추천)

1. [Railway](https://railway.app) 접속 및 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. `riss-mcp-server` 레포지토리 선택
5. 자동 배포 시작 (약 2-3분 소요)

#### 방법 B: Railway CLI

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 배포
railway up
```

### 3. 환경 변수 설정

Railway 대시보드에서:

1. 프로젝트 선택
2. "Variables" 탭 클릭
3. 변수 추가:

```
NODE_ENV=production
PORT=8080
```

**참고**: RISS_API_KEY는 URL 파라미터(`?oc=`)로 전달하므로 환경 변수 설정 불필요

### 4. 도메인 확인

1. "Settings" 탭 → "Networking"
2. "Generate Domain" 클릭
3. 생성된 도메인 복사 (예: `riss-mcp-server-production.up.railway.app`)

### 5. Claude.ai 연동

#### 커넥터 URL

```
https://riss-mcp-server-production.up.railway.app/mcp?oc=YOUR_RISS_API_KEY
```

#### Claude.ai 설정

1. Claude.ai → Settings → Integrations
2. "Add connector" 클릭
3. 정보 입력:
   - Name: `RISS Academic Search`
   - URL: 위 커넥터 URL 입력
4. "Connect" 클릭

## Railway 관리

### 로그 확인

**웹 UI:**
- 프로젝트 → "Deployments" 탭 → 최신 배포 클릭

**CLI:**
```bash
railway logs
```

### 재배포

**자동 재배포:**
- GitHub에 푸시하면 자동으로 재배포됨

**수동 재배포:**
```bash
railway up
```

### 환경 변수 관리

**CLI로 추가:**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=8080
```

**CLI로 확인:**
```bash
railway variables
```

### 프로젝트 정보

```bash
railway status
```

### 로컬 개발

```bash
# Railway 환경 변수를 로컬에서 사용
railway run npm run dev
```

## 커스텀 도메인 설정

### 1. 도메인 준비

Railway는 무료 도메인을 제공하지만, 커스텀 도메인도 연결 가능합니다.

### 2. Railway 설정

1. Settings → Networking
2. "Custom Domain" 클릭
3. 도메인 입력 (예: `riss.yourdomain.com`)
4. DNS 레코드 복사

### 3. DNS 설정

도메인 등록 업체에서 CNAME 레코드 추가:

```
CNAME riss → railway-provided-domain
```

## 비용 관리

### 무료 플랫폼 ($5/월 크레딧)

- 사용량: ~$2-3/월 (소규모 트래픽 기준)
- 남는 크레딧: $2-3/월

### 사용량 확인

1. 프로젝트 → "Usage" 탭
2. 월별 사용량 및 예상 비용 확인

### 비용 절감 팁

1. **슬립 모드 활성화**: 5분 이상 요청 없으면 자동 슬립
2. **리전 최적화**: 가장 가까운 리전 선택
3. **불필요한 서비스 제거**: 미사용 서비스 삭제

## 문제 해결

### 빌드 실패

**증상:**
```
Build failed: npm run build exited with code 1
```

**해결:**
1. 로컬에서 `npm run build` 테스트
2. `package.json`의 `engines` 필드 확인
3. Railway 로그에서 상세 오류 확인

### 배포 성공했지만 서버 응답 없음

**증상:**
```
502 Bad Gateway
```

**해결:**
1. `/health` 엔드포인트 확인
2. Railway 로그에서 서버 시작 확인
3. `PORT` 환경 변수가 8080인지 확인

### Railway와 GitHub 연동 끊김

**해결:**
1. Railway → Settings → "Source"
2. "Reconnect to GitHub" 클릭

## Railway vs Fly.io

| 항목 | Railway | Fly.io |
|------|---------|--------|
| **배포 방식** | GitHub 자동배포 | CLI 수동배포 |
| **빌드 시스템** | Nixpacks (자동) | Dockerfile 필요 |
| **무료 플랜** | $5/월 크레딧 | 무료 티어 |
| **한국 리전** | ❌ | ✅ (도쿄) |
| **UI** | 직관적 대시보드 | CLI 중심 |
| **추천 용도** | 빠른 배포, 개발/테스트 | 프로덕션, 한국 사용자 |

## GitHub Actions 자동 배포

### Railway Token 발급

1. Railway → Account Settings → Tokens
2. "Create Token" 클릭
3. Token 복사

### GitHub Secrets 설정

1. GitHub 레포 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `RAILWAY_TOKEN`
4. Value: 복사한 Token

### 자동 배포 확인

- `main` 브랜치에 푸시하면 자동으로 Railway에 배포됨
- GitHub Actions 탭에서 배포 상태 확인

## 추가 자료

- [Railway 공식 문서](https://docs.railway.app)
- [Nixpacks 문서](https://nixpacks.com/docs)
- [Railway CLI 가이드](https://docs.railway.app/develop/cli)
- [Railway 커뮤니티](https://discord.gg/railway)

## 지원

문제가 발생하면 다음 정보와 함께 이슈를 생성해주세요:

1. Railway 로그 (최근 100줄)
2. 배포 시도 시간
3. 오류 메시지 전문
4. 환경 변수 설정 (민감 정보 제외)

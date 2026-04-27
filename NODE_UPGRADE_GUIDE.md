# Node.js 18 EOL 오류 해결

## 문제

Railway 배포 중 다음 오류 발생:
```
error: Node.js 18.x has reached End-Of-Life and has been removed
```

## 원인

- Node.js 18.x가 2025년 4월 30일 EOL(End-Of-Life) 도달
- Railway Nixpacks가 보안상 이유로 EOL 버전 제거
- 2024년 4월 27일 현재, Node.js 18.x 지원 중단

## 해결 방법

### 1. Node.js 20으로 업그레이드

**수정된 파일:**

#### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs-20_x"]  # 18_x → 20_x
```

#### package.json
```json
{
  "engines": {
    "node": ">=20.0.0",  # 18.0.0 → 20.0.0
    "npm": ">=10.0.0"    # 9.0.0 → 10.0.0
  }
}
```

### 2. GitHub에 푸시

```bash
cd riss

# 수정된 파일 확인
git status

# 파일 추가
git add nixpacks.toml package.json

# 커밋
git commit -m "Fix: Upgrade to Node.js 20 (Node 18 EOL)"

# 푸시
git push origin main
```

### 3. Railway 자동 재배포

푸시 후 Railway가 자동으로 재배포합니다 (약 2-3분 소요).

**또는 수동 재배포:**

Railway CLI:
```bash
railway up --detach
```

Railway 웹:
- Deployments 탭 → "Redeploy" 버튼

## Node.js 버전별 EOL 일정

| 버전 | 릴리스 | EOL |
|------|--------|-----|
| Node.js 16 | 2021-10 | 2023-09-11 ✅ 종료 |
| Node.js 18 | 2022-04 | 2025-04-30 ✅ 종료 |
| Node.js 20 | 2023-04 | 2026-04-30 ✅ LTS |
| Node.js 22 | 2024-04 | 2027-04-30 ✅ Current |

**권장:** Node.js 20 LTS (Long Term Support)

## 호환성 확인

Node.js 18 → 20 업그레이드는 대부분의 프로젝트에서 문제없이 작동합니다.

**주요 변경사항:**
- npm 10.x (npm 9.x에서 업그레이드)
- V8 엔진 업데이트
- 성능 개선

**RISS MCP 서버 영향:**
- ✅ TypeScript 5.4 호환
- ✅ Express 4.x 호환
- ✅ @modelcontextprotocol/sdk 호환
- ✅ 모든 의존성 정상 작동

## 배포 성공 확인

### 로그 확인
```bash
railway logs
```

**성공 메시지:**
```
✓ [setup] nodejs-20_x installed
✓ [install] npm install completed
✓ [build] npm run build completed
✓ [deploy] Server running on port 8080
🚀 RISS MCP Server running
```

### 헬스체크
```bash
curl https://riss-mcp-server-production.up.railway.app/health
```

**예상 응답:**
```json
{
  "status": "healthy",
  "service": "riss-mcp-server",
  "version": "1.0.0"
}
```

## 문제 해결

### 로컬 Node.js 버전 확인
```bash
node --version  # v20.x.x 이상 권장
npm --version   # v10.x.x 이상 권장
```

### 로컬 빌드 테스트
```bash
# Node.js 20 설치 (Windows)
# https://nodejs.org/en/download/

# 의존성 설치
npm install

# 빌드 테스트
npm run build

# 서버 실행 테스트
npm start
```

## 추가 정보

- [Node.js Release Schedule](https://github.com/nodejs/release#release-schedule)
- [Railway Nixpacks Docs](https://nixpacks.com/docs)
- [Node.js 20 Release Notes](https://nodejs.org/en/blog/release/v20.0.0)

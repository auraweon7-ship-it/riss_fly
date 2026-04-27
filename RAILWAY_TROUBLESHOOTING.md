# Railway 배포 오류 해결 가이드

## 문제: "npm ci" 실패

### 증상
```
"npm ci" did not complete successfully: exit code: 1
```

### 원인
1. `package-lock.json` 파일 누락
2. `npm ci` 명령은 lockfile이 반드시 필요함
3. Railway Nixpacks가 자동으로 `npm ci`를 실행하지만 lockfile이 없어 실패

### 해결 방법

#### 방법 1: package-lock.json 생성 후 푸시 (권장)

```bash
# 로컬에서 실행
cd riss-mcp-server

# package-lock.json 생성
npm install

# .gitignore에서 package-lock.json이 제외되어 있는지 확인
# (있다면 해당 줄 삭제)

# Git에 추가
git add package-lock.json
git commit -m "Add package-lock.json for Railway"
git push

# Railway가 자동으로 재배포됨
```

#### 방법 2: npm install 사용 (lockfile 없이 배포)

이미 수정된 파일에 적용되어 있습니다:

**railway.json**:
```json
{
  "build": {
    "buildCommand": "npm install && npm run build"
  }
}
```

**nixpacks.toml**:
```toml
[phases.install]
cmds = ["npm install"]
```

### 수정 사항 요약

| 파일 | 변경 전 | 변경 후 |
|------|---------|---------|
| `railway.json` | `npm run build` | `npm install && npm run build` |
| `nixpacks.toml` | `npm ci` | `npm install` |
| `package.json` | `prepare` 스크립트 포함 | `prepare` 스크립트 제거 |

### 재배포 방법

```bash
# 수정된 파일 커밋
git add railway.json nixpacks.toml package.json
git commit -m "Fix Railway build: use npm install instead of npm ci"
git push

# Railway가 자동으로 재배포
```

### 배포 성공 확인

1. Railway 대시보드 → Deployments
2. 새 배포가 "Success" 상태인지 확인
3. 로그에서 다음 메시지 확인:
   ```
   ✓ Build completed successfully
   ✓ Server running on port 8080
   ```

### 추가 문제 해결

#### TypeScript 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build

# 오류가 있다면 수정 후 재푸시
```

#### 환경 변수 누락
Railway → Variables 탭:
```
NODE_ENV=production
PORT=8080
```

#### 헬스체크 실패
서버가 `/health` 엔드포인트를 제공하는지 확인:
```bash
curl https://your-app.up.railway.app/health
```

## 완료!

위 방법 중 하나를 적용하면 Railway 배포가 성공합니다.

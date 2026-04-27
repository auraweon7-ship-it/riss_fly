# RISS MCP Server

<div align="center">

**RISS 학술정보 검색을 위한 Claude MCP 커넥터**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.4.0-blue)](https://www.typescriptlang.org/)
[![Railway](https://img.shields.io/badge/Deploy%20on-Railway-blueviolet)](https://railway.app)

[English](#english) | [한국어](#korean)

</div>

---

## 한국어

### 개요

RISS(Research Information Sharing Service) Open API를 Claude AI와 연결하는 MCP(Model Context Protocol) 서버입니다. Claude가 국내 학위논문 및 학술지 논문을 검색하고 분석할 수 있도록 지원합니다.

### 주요 기능

- 🎓 **학위논문 검색**: 석사/박사 학위논문 통합 검색
- 📚 **학술지 논문 검색**: KCI 등재지 및 국내외 학술지 논문 검색
- 🔍 **통합 검색**: 학위논문 + 학술지 논문 동시 검색
- 📄 **상세 정보**: 목차, 참고문헌, 원문 파일 정보 제공
- 👤 **저자 프로필**: 저자별 논문 목록 및 연구 동향 분석
- 📅 **최신 논문**: 특정 주제의 최근 몇 년간 논문 검색

### 사전 준비

#### 1. RISS API Key 발급

1. [RISS 웹사이트](https://www.riss.kr) 회원가입
2. [API 센터](https://www.riss.kr/apicenter/apiSearchThesis.do) 접속
3. API Key 신청 및 발급
4. 발급받은 API Key 저장

#### 2. Railway 계정

- [Railway](https://railway.app) 가입 (GitHub 계정으로 로그인 가능)
- 신용카드 등록 (무료 플랜: $5/월 크레딧 제공)

### Railway 배포 방법

#### 방법 1: GitHub 연동 배포 (추천)

##### 1단계: GitHub에 업로드

```bash
# 레포지토리 클론 또는 다운로드
git clone https://github.com/YOUR_USERNAME/riss-mcp-server.git
cd riss-mcp-server

# 또는 ZIP 다운로드 후
unzip riss-mcp-server.zip
cd riss-mcp-server

# Git 초기화 (새 레포인 경우)
git init
git add .
git commit -m "Initial commit: RISS MCP Server v1.0"

# GitHub 레포지토리 연결
git remote add origin https://github.com/YOUR_USERNAME/riss-mcp-server.git
git branch -M main
git push -u origin main
```

##### 2단계: Railway 프로젝트 생성

1. [Railway 대시보드](https://railway.app/dashboard) 접속
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. `riss-mcp-server` 레포지토리 선택
5. 자동 배포 시작

##### 3단계: 환경 변수 설정

Railway 프로젝트 → Variables 탭에서:

```
NODE_ENV=production
PORT=8080
```

(RISS_API_KEY는 URL 파라미터로 전달하므로 선택사항)

##### 4단계: 도메인 확인

1. Settings 탭 → Networking
2. "Generate Domain" 클릭
3. 생성된 도메인 확인 (예: `riss-mcp-server-production.up.railway.app`)

#### 방법 2: Railway CLI 배포

##### 1단계: Railway CLI 설치

```bash
# macOS/Linux
npm install -g @railway/cli

# 또는 Homebrew (macOS)
brew install railway
```

##### 2단계: 로그인 및 배포

```bash
cd riss-mcp-server

# Railway 로그인
railway login

# 프로젝트 초기화
railway init

# 배포
railway up

# 도메인 생성
railway domain

# 환경 변수 설정
railway variables set NODE_ENV=production
railway variables set PORT=8080
```

#### 방법 3: Railway Button (원클릭 배포)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/riss-mcp-server)

**README.md에 위 버튼을 추가하면 원클릭 배포 가능**

### Claude.ai 커넥터 등록

#### Railway 배포 URL 확인

배포 완료 후 Railway에서 생성된 도메인:
```
https://riss-mcp-server-production.up.railway.app
```

#### Claude.ai 설정

##### 방법 1: Web UI

1. Claude.ai → Settings → Integrations
2. "Add connector" 클릭
3. 정보 입력:
   - **Name**: RISS Academic Search
   - **URL**: `https://riss-mcp-server-production.up.railway.app/mcp?oc=YOUR_RISS_API_KEY`
4. "Connect" 클릭

##### 방법 2: Claude Desktop App

`claude_desktop_config.json` 파일 수정:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "riss": {
      "url": "https://riss-mcp-server-production.up.railway.app/mcp?oc=YOUR_RISS_API_KEY"
    }
  }
}
```

**예시 (API Key가 "honggildong"인 경우):**
```
https://riss-mcp-server-production.up.railway.app/mcp?oc=honggildong
```

### 사용 예시

#### 1. 학위논문 검색

```
사용자: RISS에서 "인공지능 교육" 관련 박사논문 찾아줘

Claude: [riss_search_thesis 도구 사용]
검색 결과:
1. "초등학교 인공지능 교육 프로그램 개발 및 효과 분석"
   - 저자: 김OO (한국교원대학교, 2023)
   - 학위: 박사
   - 초록: 본 연구는...
   - 원문: [PDF 링크]
...
```

#### 2. 저자별 논문 검색

```
사용자: 박정원 교수의 논문 목록 보여줘

Claude: [riss_search_author 도구 사용]
저자 프로필:
- 총 논문 수: 15편
- 학위논문: 2편
- 학술지 논문: 13편
- 연구 기간: 2015-2024
- 주요 연구 분야: AI 교육, 디지털 인문학, 중국문학
...
```

#### 3. 최신 논문 검색

```
사용자: "디지털 인문학" 최근 3년간 논문 동향 분석해줘

Claude: [riss_search_recent 도구 사용]
최근 3년 (2022-2024) 논문 동향:
- 총 42편 발표
- 주요 키워드: 텍스트 마이닝, AI, 고전문학, 데이터베이스
- 연도별 추이: 2022(10편) → 2023(15편) → 2024(17편)
...
```

### MCP 도구 목록

| 도구명 | 설명 | 주요 파라미터 |
|--------|------|---------------|
| `riss_search_thesis` | 학위논문 검색 | query, searchField, count, sort, yearFrom, yearTo |
| `riss_search_article` | 학술지 논문 검색 | query, searchField, count, sort, yearFrom, yearTo |
| `riss_search_all` | 통합 검색 | query, searchField, count, yearFrom, yearTo |
| `riss_get_detail` | 논문 상세 정보 | controlNo |
| `riss_search_author` | 저자별 논문 검색 | authorName, count |
| `riss_search_recent` | 최신 논문 검색 | keyword, years |

### Railway 관리 명령어

```bash
# 로그 확인
railway logs

# 환경 변수 확인
railway variables

# 프로젝트 정보
railway status

# 재배포
railway up

# 로컬 개발
railway run npm run dev
```

### 프로젝트 구조

```
riss-mcp-server/
├── src/
│   ├── index.ts          # 메인 진입점
│   ├── server.ts         # MCP 서버 구현 (HTTP SSE)
│   ├── riss-api.ts       # RISS API 클라이언트
│   ├── parsers.ts        # XML 파서
│   └── types.ts          # TypeScript 타입 정의
├── package.json          # 프로젝트 설정
├── tsconfig.json         # TypeScript 설정
├── railway.json          # Railway 배포 설정
├── nixpacks.toml         # Nixpacks 빌드 설정
├── .gitignore            # Git 제외 파일
├── .env.example          # 환경 변수 예시
├── README.md             # 문서
├── CONTRIBUTING.md       # 기여 가이드
└── LICENSE               # MIT 라이선스
```

### API 엔드포인트

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/` | GET | 서비스 정보 |
| `/health` | GET | 헬스체크 |
| `/mcp?oc=API_KEY` | GET | MCP 연결 (SSE) |

### Railway vs Fly.io 비교

| 항목 | Railway | Fly.io |
|------|---------|--------|
| **배포 난이도** | ⭐⭐⭐⭐⭐ 매우 쉬움 | ⭐⭐⭐ 보통 |
| **무료 플랜** | $5/월 크레딧 | 무료 티어 제공 |
| **배포 방법** | GitHub 연동 자동배포 | CLI 수동 배포 |
| **빌드 시스템** | Nixpacks (자동) | Dockerfile 필요 |
| **모니터링** | 대시보드 제공 | 로그 중심 |
| **한국 리전** | ❌ 없음 (미국/유럽) | ✅ 도쿄(nrt) |
| **추천 용도** | 개발/테스트, 빠른 배포 | 프로덕션, 한국 사용자 |

### 문제 해결

#### Railway 빌드 실패

```bash
# 로그 확인
railway logs

# 일반적인 원인:
# 1. Node.js 버전 불일치 → package.json의 engines 확인
# 2. TypeScript 빌드 오류 → 로컬에서 npm run build 테스트
# 3. 환경 변수 누락 → Railway Variables 확인
```

#### API Key 인증 실패
```
오류: RISS API 인증 실패: API 키를 확인해주세요.
해결: 
1. RISS 웹사이트에서 API Key 재확인
2. URL의 oc 파라미터 값 확인
3. API Key에 특수문자가 있는 경우 URL 인코딩
```

#### 검색 결과 없음
```
해결:
1. 검색어 단순화 (띄어쓰기, 따옴표 제거)
2. searchField를 'all'로 변경
3. 연도 범위 확대 (yearFrom, yearTo)
```

### 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

### 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 지원

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/YOUR_USERNAME/riss-mcp-server/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/YOUR_USERNAME/riss-mcp-server/discussions)
- 📧 **이메일**: your.email@example.com

### 관련 프로젝트

- [korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp) - 대한민국 법령 검색 MCP 서버
- [KCI MCP Server](https://github.com/YOUR_USERNAME/kci-mcp-server) - 한국학술지인용색인 MCP 서버

---

## English

### Overview

An MCP (Model Context Protocol) server that connects RISS (Research Information Sharing Service) Open API with Claude AI, enabling Claude to search and analyze Korean academic theses and journal articles.

### Quick Deploy on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/riss-mcp-server)

### Features

- 🎓 **Thesis Search**: Search master's and doctoral theses
- 📚 **Article Search**: Search KCI-indexed and international journal articles
- 🔍 **Integrated Search**: Search both theses and articles simultaneously
- 📄 **Detailed Information**: Access table of contents, references, and full-text files
- 👤 **Author Profile**: Analyze author's publications and research trends
- 📅 **Recent Papers**: Search recent publications on specific topics

### Railway Deployment

#### Method 1: GitHub Integration

1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Deploy automatically

#### Method 2: Railway CLI

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

Your MCP endpoint: `https://your-app.up.railway.app/mcp?oc=YOUR_API_KEY`

### Claude.ai Integration

Add to Claude.ai Settings → Integrations:
- **Name**: RISS Academic Search
- **URL**: `https://your-app.up.railway.app/mcp?oc=YOUR_API_KEY`

### License

MIT License

---

<div align="center">

Made with ❤️ for Korean Academic Research

**Deployed on** [![Railway](https://railway.app/brand/logo-light.svg)](https://railway.app)

[Report Bug](https://github.com/YOUR_USERNAME/riss-mcp-server/issues) · [Request Feature](https://github.com/YOUR_USERNAME/riss-mcp-server/discussions)

---

### 개발자 정보

**박정원 | 朴正元 | Park Jeong Weon** 교수  
한국외국어대학교 중국학대학 중국언어문화학부

🌐 [K-AI 교육네트워크](https://k-ai.it.kr/)  
📧 [park9626@hanmail.net](mailto:park9626@hanmail.net)  
🔗 APP: [kletter.kr](http://kletter.kr) / [kteacher.kr](http://kteacher.kr)

</div>

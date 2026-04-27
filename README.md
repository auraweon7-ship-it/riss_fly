# RISS MCP Server

<div align="center">

**RISS 학술정보 검색을 위한 Claude MCP 커넥터**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.4.0-blue)](https://www.typescriptlang.org/)
[![Fly.io](https://img.shields.io/badge/Deploy%20on-Fly.io-blueviolet)](https://fly.io)

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

#### 2. Fly.io 계정

- [Fly.io](https://fly.io) 가입
- 신용카드 등록 (무료 플랜 사용 가능)

### Fly.io 배포

#### Flyctl CLI 설치

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

#### 배포 방법

```bash
# 1. Fly.io 로그인
fly auth login

# 2. 레포지토리 클론
git clone https://github.com/auraweon7-ship-it/riss.git
cd riss

# 3. 앱 생성 및 배포
fly launch --region nrt

# 프롬프트 응답:
# - App Name: riss-mcp-korea (또는 원하는 이름)
# - Region: Tokyo, Japan (nrt) ← 한국과 가장 가까움
# - PostgreSQL: No
# - Redis: No
# - Deploy now: Yes
```

#### 배포 URL 확인

배포 완료 후:
```
https://riss-mcp-korea.fly.dev
```

### Claude.ai 커넥터 등록

#### 커넥터 URL

```
https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_RISS_API_KEY
```

**예시 (API Key가 "mykey123"인 경우):**
```
https://riss-mcp-korea.fly.dev/mcp?oc=mykey123
```

#### Claude.ai 설정

1. Claude.ai → Settings → Integrations
2. "Add connector" 클릭
3. 정보 입력:
   - **Name**: `RISS Academic Search`
   - **URL**: 위 커넥터 URL
4. "Connect" 클릭

### 사용 예시

#### 학위논문 검색

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

#### 저자별 논문 검색

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

### MCP 도구 목록

| 도구명 | 설명 | 주요 파라미터 |
|--------|------|---------------|
| `riss_search_thesis` | 학위논문 검색 | query, searchField, count, sort, yearFrom, yearTo |
| `riss_search_article` | 학술지 논문 검색 | query, searchField, count, sort, yearFrom, yearTo |
| `riss_search_all` | 통합 검색 | query, searchField, count, yearFrom, yearTo |
| `riss_get_detail` | 논문 상세 정보 | controlNo |
| `riss_search_author` | 저자별 논문 검색 | authorName, count |
| `riss_search_recent` | 최신 논문 검색 | keyword, years |

### Fly.io 관리 명령어

```bash
# 상태 확인
fly status

# 로그 확인
fly logs

# 재배포
fly deploy

# 앱 정보
fly info

# VM 재시작
fly apps restart riss-mcp-korea
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
├── Dockerfile            # Docker 이미지 빌드
├── fly.toml              # Fly.io 배포 설정
├── package.json          # 프로젝트 설정
├── tsconfig.json         # TypeScript 설정
├── .dockerignore         # Docker 제외 파일
├── .gitignore            # Git 제외 파일
├── FLYIO_DEPLOYMENT.md   # Fly.io 상세 가이드
└── README.md             # 문서
```

### API 엔드포인트

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/` | GET | 서비스 정보 |
| `/health` | GET | 헬스체크 |
| `/mcp?oc=API_KEY` | GET | MCP 연결 (SSE) |

### 문제 해결

#### 빌드 실패

```bash
# 로그 확인
fly logs

# 로컬 Docker 빌드 테스트
docker build -t riss-mcp-server .
docker run -p 8080:8080 riss-mcp-server
```

#### 서버 응답 없음

```bash
# 헬스체크 확인
fly checks list

# VM 재시작
fly apps restart riss-mcp-korea
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

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/auraweon7-ship-it/riss/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/auraweon7-ship-it/riss/discussions)
- 📧 **이메일**: park9626@hanmail.net

### 관련 프로젝트

- [korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp) - 대한민국 법령 검색 MCP 서버
- [KCI MCP Server](https://github.com/auraweon7-ship-it/kci-mcp) - 한국학술지인용색인 MCP 서버

---

## English

### Overview

An MCP (Model Context Protocol) server that connects RISS (Research Information Sharing Service) Open API with Claude AI, enabling Claude to search and analyze Korean academic theses and journal articles.

### Features

- 🎓 **Thesis Search**: Search master's and doctoral theses
- 📚 **Article Search**: Search KCI-indexed and international journal articles
- 🔍 **Integrated Search**: Search both theses and articles simultaneously
- 📄 **Detailed Information**: Access table of contents, references, and full-text files
- 👤 **Author Profile**: Analyze author's publications and research trends
- 📅 **Recent Papers**: Search recent publications on specific topics

### Quick Start

```bash
# Install Fly.io CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
git clone https://github.com/auraweon7-ship-it/riss.git
cd riss
fly launch --region nrt
```

Your MCP endpoint: `https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_API_KEY`

### Claude.ai Integration

Add to Claude.ai Settings → Integrations:
- **Name**: RISS Academic Search
- **URL**: `https://riss-mcp-korea.fly.dev/mcp?oc=YOUR_API_KEY`

### License

MIT License

---

<div align="center">

Made with ❤️ for Korean Academic Research

**Deployed on** [![Fly.io](https://fly.io/ui/images/brand/logo.svg)](https://fly.io)

[Report Bug](https://github.com/auraweon7-ship-it/riss/issues) · [Request Feature](https://github.com/auraweon7-ship-it/riss/discussions)

---

### 개발자 정보

**박정원 | 朴正元 | Park Jeong Weon** 교수  
한국외국어대학교 중국학대학 중국언어문화학부

🌐 [K-AI 교육네트워크](https://k-ai.it.kr/)  
📧 [park9626@hanmail.net](mailto:park9626@hanmail.net)  
🔗 APP: [kletter.kr](http://kletter.kr) / [kteacher.kr](http://kteacher.kr)

</div>

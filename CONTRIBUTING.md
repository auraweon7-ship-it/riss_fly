# Contributing to RISS MCP Server

RISS MCP Server에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 개발 환경 설정

### 1. Repository Fork 및 Clone

```bash
# Fork 후 클론
git clone https://github.com/YOUR_USERNAME/riss-mcp-server.git
cd riss-mcp-server

# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/ORIGINAL_OWNER/riss-mcp-server.git
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 브랜치 전략

- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 새로운 기능 개발
- `bugfix/*`: 버그 수정
- `hotfix/*`: 긴급 수정

## 커밋 메시지 규칙

```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드/설정 변경

### 예시
```
feat: RISS 저자 프로필 분석 기능 추가

- 저자별 논문 통계 제공
- 연구 분야 키워드 추출
- 연도별 발행 추이 분석

Closes #123
```

## Pull Request 프로세스

1. Feature 브랜치 생성
```bash
git checkout -b feature/amazing-feature
```

2. 변경사항 커밋
```bash
git add .
git commit -m "feat: add amazing feature"
```

3. 원격 저장소에 푸시
```bash
git push origin feature/amazing-feature
```

4. GitHub에서 Pull Request 생성

5. 코드 리뷰 대기

## 코드 스타일

- TypeScript Strict Mode 준수
- ESLint 규칙 준수
- 명확한 변수/함수명 사용
- JSDoc 주석 작성

```typescript
/**
 * RISS에서 논문을 검색합니다
 * @param query 검색어
 * @param count 결과 수
 * @returns 검색 결과
 */
async function searchPaper(query: string, count: number): Promise<Result> {
  // 구현
}
```

## 테스트

```bash
# 테스트 실행
npm test

# 빌드 테스트
npm run build
```

## 문서화

- README.md 업데이트
- API 변경 시 문서 수정
- 예시 코드 제공

## 이슈 제출

### 버그 리포트

```markdown
**버그 설명**
간단한 버그 설명

**재현 방법**
1. ...
2. ...

**예상 동작**
...

**실제 동작**
...

**환경**
- OS: 
- Node.js 버전:
- 기타:
```

### 기능 제안

```markdown
**제안 배경**
이 기능이 필요한 이유

**제안 내용**
구체적인 기능 설명

**예상 효과**
사용자에게 제공되는 가치
```

## 질문 및 논의

- [GitHub Discussions](https://github.com/YOUR_USERNAME/riss-mcp-server/discussions) 활용
- 이슈 템플릿 사용

## 라이선스

기여하신 코드는 MIT 라이선스 하에 배포됩니다.

감사합니다! 🙏

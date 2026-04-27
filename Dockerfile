# Fly.io Dockerfile for RISS MCP Server
# Node.js 20 LTS 기반

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./
COPY tsconfig.json ./

# 의존성 설치
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# 소스 코드 복사
COPY src ./src

# TypeScript 빌드
RUN npm install --include=dev && \
    npm run build && \
    npm prune --omit=dev

# Production stage
FROM node:20-alpine

WORKDIR /app

# 프로덕션 의존성만 복사
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist

# 헬스체크
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 포트 노출
EXPOSE 8080

# 서버 실행
CMD ["node", "dist/index.js"]

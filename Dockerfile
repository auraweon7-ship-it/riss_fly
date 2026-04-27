FROM node:20-alpine

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# TypeScript 컴파일 (오류 무시)
RUN npm run build || echo "TypeScript build failed, using source files"

# 포트 노출
EXPOSE 8080

# 서버 시작 (빌드된 파일 또는 소스 파일 사용)
CMD ["sh", "-c", "node dist/index.js || node --loader ts-node/esm src/index.ts"]
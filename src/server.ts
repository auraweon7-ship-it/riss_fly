/**
 * RISS MCP Server (HTTP SSE Transport)
 * Claude.ai 커넥터 URL 제공: https://your-app.fly.dev/mcp?oc=YOUR_API_KEY
 */

import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { RISSApiClient } from './riss-api.js';
import { RISSParser } from './parsers.js';
import type { SearchParams } from './types.js';

const app = express();
const PORT = process.env.PORT || 8080;

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/**
 * 헬스체크 엔드포인트
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'riss-mcp-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 루트 엔드포인트 - 사용 안내
 */
app.get('/', (req, res) => {
  res.json({
    name: 'RISS MCP Server',
    description: 'RISS 학술정보 검색을 위한 Claude MCP 커넥터',
    usage: {
      endpoint: '/mcp',
      parameter: 'oc (RISS API Key)',
      example: 'https://your-app.fly.dev/mcp?oc=YOUR_API_KEY',
    },
    tools: [
      'riss_search_thesis - 학위논문 검색',
      'riss_search_article - 학술지 논문 검색',
      'riss_search_all - 통합 검색',
      'riss_get_detail - 논문 상세 정보',
      'riss_search_author - 저자별 논문 검색',
      'riss_search_recent - 최신 논문 검색',
    ],
    documentation: 'https://github.com/YOUR_USERNAME/riss-mcp-server',
  });
});

/**
 * MCP 엔드포인트
 */
app.get('/mcp', async (req, res) => {
  const apiKey = req.query.oc as string;

  if (!apiKey) {
    return res.status(400).json({
      error: 'API Key가 필요합니다',
      usage: '/mcp?oc=YOUR_RISS_API_KEY',
    });
  }

  console.log(`[MCP] 연결 시작 - API Key: ${apiKey.substring(0, 4)}***`);

  // RISS API 클라이언트 생성
  const rissClient = new RISSApiClient({ apiKey });

  // MCP 서버 생성
  const server = new Server(
    {
      name: 'riss-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 도구 목록 등록
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'riss_search_thesis',
          description:
            'RISS에서 국내 학위논문(석사/박사)을 검색합니다. 제목, 저자, 키워드로 검색 가능하며, 초록 및 원문 링크를 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '검색어 (제목, 저자명, 키워드 등)',
              },
              searchField: {
                type: 'string',
                enum: ['all', 'title', 'author', 'keyword', 'abstract'],
                description: '검색 필드 (기본값: all)',
              },
              count: {
                type: 'number',
                description: '검색 결과 수 (기본값: 10, 최대: 100)',
                default: 10,
              },
              sort: {
                type: 'string',
                enum: ['title', 'author', 'year', 'relation'],
                description: '정렬 기준 (기본값: year)',
                default: 'year',
              },
              yearFrom: {
                type: 'number',
                description: '시작 연도 (예: 2020)',
              },
              yearTo: {
                type: 'number',
                description: '종료 연도 (예: 2024)',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'riss_search_article',
          description:
            'RISS에서 학술지 논문을 검색합니다. KCI 등재지 및 국내외 학술지 논문의 서지사항, DOI, 초록을 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '검색어',
              },
              searchField: {
                type: 'string',
                enum: ['all', 'title', 'author', 'keyword', 'abstract'],
                description: '검색 필드 (기본값: all)',
              },
              count: {
                type: 'number',
                description: '검색 결과 수 (기본값: 10)',
                default: 10,
              },
              sort: {
                type: 'string',
                enum: ['title', 'author', 'year', 'relation'],
                description: '정렬 기준 (기본값: year)',
              },
              yearFrom: {
                type: 'number',
                description: '시작 연도',
              },
              yearTo: {
                type: 'number',
                description: '종료 연도',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'riss_search_all',
          description:
            'RISS에서 학위논문과 학술지 논문을 동시에 검색합니다. 통합 검색으로 모든 유형의 논문을 한 번에 찾을 수 있습니다.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '검색어',
              },
              searchField: {
                type: 'string',
                enum: ['all', 'title', 'author', 'keyword', 'abstract'],
                description: '검색 필드 (기본값: all)',
              },
              count: {
                type: 'number',
                description: '각 유형별 검색 결과 수 (기본값: 10)',
                default: 10,
              },
              yearFrom: {
                type: 'number',
                description: '시작 연도',
              },
              yearTo: {
                type: 'number',
                description: '종료 연도',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'riss_get_detail',
          description:
            '논문의 상세 정보를 조회합니다. 목차, 참고문헌, 원문 파일 정보 등을 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              controlNo: {
                type: 'string',
                description: '논문 ID (검색 결과의 id 또는 controlNo 필드)',
              },
            },
            required: ['controlNo'],
          },
        },
        {
          name: 'riss_search_author',
          description:
            '특정 저자의 모든 논문을 검색합니다. 저자 프로필 및 연구 동향 분석에 유용합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              authorName: {
                type: 'string',
                description: '저자명 (예: 홍길동)',
              },
              count: {
                type: 'number',
                description: '검색 결과 수 (기본값: 20)',
                default: 20,
              },
            },
            required: ['authorName'],
          },
        },
        {
          name: 'riss_search_recent',
          description:
            '특정 키워드의 최신 논문을 검색합니다. 최근 몇 년간의 연구 동향 파악에 유용합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '검색 키워드',
              },
              years: {
                type: 'number',
                description: '최근 몇 년간의 논문 (기본값: 5년)',
                default: 5,
              },
            },
            required: ['keyword'],
          },
        },
      ],
    };
  });

  // 도구 실행 핸들러
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      // 1. 학위논문 검색
      if (name === 'riss_search_thesis') {
        const params = args as SearchParams;
        const xmlData = await rissClient.searchThesis(params);
        const result = RISSParser.parseThesisResults(xmlData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // 2. 학술지 논문 검색
      if (name === 'riss_search_article') {
        const params = args as SearchParams;
        const xmlData = await rissClient.searchArticle(params);
        const result = RISSParser.parseArticleResults(xmlData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // 3. 통합 검색
      if (name === 'riss_search_all') {
        const params = args as SearchParams;
        const { thesis: thesisXml, article: articleXml } = await rissClient.searchAll(params);

        const thesisResult = thesisXml ? RISSParser.parseThesisResults(thesisXml) : null;
        const articleResult = articleXml ? RISSParser.parseArticleResults(articleXml) : null;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  thesis: thesisResult,
                  article: articleResult,
                  totalResults:
                    (thesisResult?.total || 0) + (articleResult?.total || 0),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // 4. 상세 정보 조회
      if (name === 'riss_get_detail') {
        const { controlNo } = args as { controlNo: string };
        const xmlData = await rissClient.getDetail(controlNo);
        const result = RISSParser.parseDetailResult(xmlData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // 5. 저자 검색
      if (name === 'riss_search_author') {
        const { authorName, count = 20 } = args as {
          authorName: string;
          count?: number;
        };

        const { thesis: thesisXml, article: articleXml } =
          await rissClient.searchByAuthor(authorName, count);

        const thesisResult = thesisXml ? RISSParser.parseThesisResults(thesisXml) : null;
        const articleResult = articleXml ? RISSParser.parseArticleResults(articleXml) : null;

        const authorProfile = RISSParser.createAuthorProfile(
          authorName,
          thesisResult || { success: true, total: 0, displayCount: 0, startCount: 1, data: [] },
          articleResult || { success: true, total: 0, displayCount: 0, startCount: 1, data: [] }
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(authorProfile, null, 2),
            },
          ],
        };
      }

      // 6. 최신 논문 검색
      if (name === 'riss_search_recent') {
        const { keyword, years = 5 } = args as {
          keyword: string;
          years?: number;
        };

        const { thesis: thesisXml, article: articleXml } =
          await rissClient.searchRecent(keyword, years);

        const thesisResult = thesisXml ? RISSParser.parseThesisResults(thesisXml) : null;
        const articleResult = articleXml ? RISSParser.parseArticleResults(articleXml) : null;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  keyword,
                  period: `최근 ${years}년`,
                  thesis: thesisResult,
                  article: articleResult,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      throw new Error(`알 수 없는 도구: ${name}`);
    } catch (error: any) {
      console.error(`[MCP Error] ${name}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `오류 발생: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // SSE Transport 생성
  const transport = new SSEServerTransport('/message', res);
  await server.connect(transport);

  console.log('[MCP] 서버 연결 완료');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 RISS MCP Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 MCP endpoint: http://localhost:${PORT}/mcp?oc=YOUR_API_KEY`);
});

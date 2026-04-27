/**
 * RISS MCP Server - Type Definitions
 * RISS Open API 응답 및 내부 데이터 타입 정의
 */

// RISS API 설정
export interface RISSConfig {
  apiKey: string;
  baseURL?: string;
}

// 학위논문 검색 결과
export interface ThesisResult {
  id: string;
  title: string;
  author: string;
  degree: string; // 석사, 박사
  university: string;
  department: string;
  year: string;
  language: string;
  abstract: string;
  keyword: string[];
  fullTextUrl: string;
  controlNo: string;
}

// 학술지 논문 검색 결과
export interface ArticleResult {
  id: string;
  controlNo: string;
  title: string;
  author: string;
  authorEmail: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  year: string;
  publisher: string;
  issn: string;
  abstract: string;
  keyword: string[];
  doi: string;
  url: string;
  language: string;
}

// 논문 상세 정보
export interface DetailResult {
  id: string;
  controlNo: string;
  type: 'thesis' | 'article';
  title: string;
  alternativeTitle: string;
  author: string;
  authorInfo: {
    name: string;
    affiliation: string;
    email: string;
  }[];
  abstract: string;
  keyword: string[];
  tableOfContents: string;
  references: string[];
  publisher: string;
  publishDate: string;
  language: string;
  fileInfo: {
    format: string;
    size: string;
    url: string;
    availability: boolean;
  };
}

// 검색 파라미터
export interface SearchParams {
  query: string;
  searchField?: 'all' | 'title' | 'author' | 'keyword' | 'abstract';
  displayCount?: number;
  startCount?: number;
  sort?: 'title' | 'author' | 'year' | 'relation';
  yearFrom?: number;
  yearTo?: number;
}

// 저자 검색 결과
export interface AuthorProfile {
  name: string;
  totalPapers: number;
  thesisCount: number;
  articleCount: number;
  yearRange: {
    earliest: number;
    latest: number;
  };
  publications: (ThesisResult | ArticleResult)[];
  affiliations: string[];
  researchFields: string[];
}

// API 응답 래퍼
export interface RISSResponse<T> {
  success: boolean;
  total: number;
  displayCount: number;
  startCount: number;
  data: T[];
  error?: string;
}

// MCP 도구 실행 결과
export interface ToolResult {
  content: {
    type: string;
    text: string;
  }[];
  isError?: boolean;
}

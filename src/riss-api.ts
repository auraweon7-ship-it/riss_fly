/**
 * RISS API Client
 * RISS Open API와 통신하는 클라이언트 클래스
 */

import axios, { AxiosInstance } from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import type { RISSConfig, SearchParams } from './types.js';

const parseXML = promisify(parseString);

export class RISSApiClient {
  private apiKey: string;
  private baseURL: string;
  private client: AxiosInstance;

  constructor(config: RISSConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'http://www.riss.kr/openapi';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'RISS-MCP-Server/1.0',
      },
    });
  }

  /**
   * 학위논문 검색
   */
  async searchThesis(params: SearchParams): Promise<any> {
    try {
      const response = await this.client.get('/thesisSearch', {
        params: {
          apikey: this.apiKey,
          query: params.query,
          searchField: params.searchField || 'all',
          displayCount: Math.min(params.displayCount || 10, 100),
          startCount: params.startCount || 1,
          sort: params.sort || 'year',
          yearFrom: params.yearFrom,
          yearTo: params.yearTo,
        },
      });

      return await parseXML(response.data, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('RISS API 인증 실패: API 키를 확인해주세요.');
      }
      if (error.response?.status === 429) {
        throw new Error('RISS API 요청 한도 초과: 잠시 후 다시 시도해주세요.');
      }
      throw new Error(`RISS 학위논문 검색 실패: ${error.message}`);
    }
  }

  /**
   * 학술지 논문 검색
   */
  async searchArticle(params: SearchParams): Promise<any> {
    try {
      const response = await this.client.get('/articleSearch', {
        params: {
          apikey: this.apiKey,
          query: params.query,
          searchField: params.searchField || 'all',
          displayCount: Math.min(params.displayCount || 10, 100),
          startCount: params.startCount || 1,
          sort: params.sort || 'year',
          yearFrom: params.yearFrom,
          yearTo: params.yearTo,
        },
      });

      return await parseXML(response.data, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('RISS API 인증 실패: API 키를 확인해주세요.');
      }
      throw new Error(`RISS 학술지 논문 검색 실패: ${error.message}`);
    }
  }

  /**
   * 논문 상세 정보 조회
   */
  async getDetail(controlNo: string): Promise<any> {
    try {
      const response = await this.client.get('/detail', {
        params: {
          apikey: this.apiKey,
          id: controlNo,
        },
      });

      return await parseXML(response.data, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('논문을 찾을 수 없습니다: 잘못된 ID입니다.');
      }
      throw new Error(`RISS 상세 정보 조회 실패: ${error.message}`);
    }
  }

  /**
   * 통합 검색 (학위논문 + 학술지 논문)
   */
  async searchAll(params: SearchParams): Promise<{
    thesis: any;
    article: any;
  }> {
    try {
      const [thesisResult, articleResult] = await Promise.allSettled([
        this.searchThesis(params),
        this.searchArticle(params),
      ]);

      return {
        thesis: thesisResult.status === 'fulfilled' ? thesisResult.value : null,
        article: articleResult.status === 'fulfilled' ? articleResult.value : null,
      };
    } catch (error: any) {
      throw new Error(`RISS 통합 검색 실패: ${error.message}`);
    }
  }

  /**
   * 저자명으로 검색
   */
  async searchByAuthor(authorName: string, count: number = 20): Promise<any> {
    return await this.searchAll({
      query: authorName,
      searchField: 'author',
      displayCount: count,
      sort: 'year',
    });
  }

  /**
   * 키워드로 최신 논문 검색
   */
  async searchRecent(keyword: string, years: number = 5): Promise<any> {
    const currentYear = new Date().getFullYear();
    return await this.searchAll({
      query: keyword,
      searchField: 'all',
      displayCount: 20,
      sort: 'year',
      yearFrom: currentYear - years,
      yearTo: currentYear,
    });
  }
}

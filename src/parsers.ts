/**
 * RISS XML Parser
 * RISS API XML 응답을 구조화된 JSON으로 변환
 */

import type {
  ThesisResult,
  ArticleResult,
  DetailResult,
  RISSResponse,
  AuthorProfile,
} from './types.js';

export class RISSParser {
  /**
   * 배열 정규화 헬퍼
   */
  private static normalizeArray(data: any): any[] {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }

  /**
   * 안전한 문자열 추출
   */
  private static safeString(value: any, defaultValue: string = ''): string {
    if (!value) return defaultValue;
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object' && value._) return value._.trim();
    return String(value).trim();
  }

  /**
   * 키워드 배열 파싱
   */
  private static parseKeywords(keywordStr: string): string[] {
    if (!keywordStr) return [];
    return keywordStr
      .split(/[;,|]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  }

  /**
   * 학위논문 검색 결과 파싱
   */
  static parseThesisResults(xmlData: any): RISSResponse<ThesisResult> {
    try {
      const response = xmlData?.response || xmlData;
      const result = response?.result || {};
      const items = this.normalizeArray(result?.item);

      const total = parseInt(result?.totalCount || '0', 10);
      const displayCount = parseInt(result?.displayCount || '0', 10);
      const startCount = parseInt(result?.startCount || '1', 10);

      const parsedItems: ThesisResult[] = items.map((item: any) => ({
        id: this.safeString(item?.id || item?.controlNo),
        title: this.safeString(item?.title || item?.dc_title),
        author: this.safeString(item?.author || item?.dc_creator),
        degree: this.safeString(item?.degree || item?.dc_type),
        university: this.safeString(item?.university || item?.publisher),
        department: this.safeString(item?.department),
        year: this.safeString(item?.pubDate || item?.dc_date),
        language: this.safeString(item?.language || item?.dc_language, 'ko'),
        abstract: this.safeString(item?.abstract || item?.dc_description),
        keyword: this.parseKeywords(this.safeString(item?.keyword || item?.dc_subject)),
        fullTextUrl: this.safeString(item?.url || item?.dc_identifier),
        controlNo: this.safeString(item?.controlNo || item?.id),
      }));

      return {
        success: true,
        total,
        displayCount,
        startCount,
        data: parsedItems,
      };
    } catch (error: any) {
      return {
        success: false,
        total: 0,
        displayCount: 0,
        startCount: 1,
        data: [],
        error: `파싱 실패: ${error.message}`,
      };
    }
  }

  /**
   * 학술지 논문 검색 결과 파싱
   */
  static parseArticleResults(xmlData: any): RISSResponse<ArticleResult> {
    try {
      const response = xmlData?.response || xmlData;
      const result = response?.result || {};
      const items = this.normalizeArray(result?.item);

      const total = parseInt(result?.totalCount || '0', 10);
      const displayCount = parseInt(result?.displayCount || '0', 10);
      const startCount = parseInt(result?.startCount || '1', 10);

      const parsedItems: ArticleResult[] = items.map((item: any) => ({
        id: this.safeString(item?.id || item?.controlNo),
        controlNo: this.safeString(item?.controlNo || item?.id),
        title: this.safeString(item?.title || item?.dc_title),
        author: this.safeString(item?.author || item?.dc_creator),
        authorEmail: this.safeString(item?.authorEmail),
        journal: this.safeString(item?.journal || item?.dc_source),
        volume: this.safeString(item?.volume),
        issue: this.safeString(item?.issue),
        pages: this.safeString(item?.startPage && item?.endPage 
          ? `${item.startPage}-${item.endPage}` 
          : item?.pages),
        year: this.safeString(item?.pubDate || item?.dc_date),
        publisher: this.safeString(item?.publisher),
        issn: this.safeString(item?.issn),
        abstract: this.safeString(item?.abstract || item?.dc_description),
        keyword: this.parseKeywords(this.safeString(item?.keyword || item?.dc_subject)),
        doi: this.safeString(item?.doi),
        url: this.safeString(item?.url || item?.dc_identifier),
        language: this.safeString(item?.language || item?.dc_language, 'ko'),
      }));

      return {
        success: true,
        total,
        displayCount,
        startCount,
        data: parsedItems,
      };
    } catch (error: any) {
      return {
        success: false,
        total: 0,
        displayCount: 0,
        startCount: 1,
        data: [],
        error: `파싱 실패: ${error.message}`,
      };
    }
  }

  /**
   * 상세 정보 파싱
   */
  static parseDetailResult(xmlData: any): DetailResult {
    try {
      const response = xmlData?.response || xmlData;
      const detail = response?.detail || response?.result || {};

      // 저자 정보 파싱
      const authors = this.normalizeArray(detail?.author || detail?.dc_creator);
      const authorInfo = authors.map((author: any) => ({
        name: this.safeString(typeof author === 'string' ? author : author?.name),
        affiliation: this.safeString(author?.affiliation),
        email: this.safeString(author?.email),
      }));

      // 참고문헌 파싱
      const refsString = this.safeString(detail?.reference || detail?.dc_relation);
      const references = refsString
        ? refsString.split(/\n|;/).map((ref) => ref.trim()).filter((ref) => ref)
        : [];

      return {
        id: this.safeString(detail?.id || detail?.controlNo),
        controlNo: this.safeString(detail?.controlNo || detail?.id),
        type: detail?.type || (detail?.degree ? 'thesis' : 'article'),
        title: this.safeString(detail?.title || detail?.dc_title),
        alternativeTitle: this.safeString(detail?.alternativeTitle),
        author: this.safeString(detail?.author || detail?.dc_creator),
        authorInfo,
        abstract: this.safeString(detail?.abstract || detail?.dc_description),
        keyword: this.parseKeywords(this.safeString(detail?.keyword || detail?.dc_subject)),
        tableOfContents: this.safeString(detail?.tableOfContents || detail?.toc),
        references,
        publisher: this.safeString(detail?.publisher),
        publishDate: this.safeString(detail?.pubDate || detail?.dc_date),
        language: this.safeString(detail?.language || detail?.dc_language, 'ko'),
        fileInfo: {
          format: this.safeString(detail?.fileFormat || 'PDF'),
          size: this.safeString(detail?.fileSize),
          url: this.safeString(detail?.fileUrl || detail?.url || detail?.dc_identifier),
          availability: Boolean(detail?.fileUrl || detail?.url),
        },
      };
    } catch (error: any) {
      throw new Error(`상세 정보 파싱 실패: ${error.message}`);
    }
  }

  /**
   * 저자 프로필 생성
   */
  static createAuthorProfile(
    authorName: string,
    thesisData: RISSResponse<ThesisResult>,
    articleData: RISSResponse<ArticleResult>
  ): AuthorProfile {
    const allPubs = [
      ...(thesisData?.data || []),
      ...(articleData?.data || []),
    ];

    const years = allPubs
      .map((p) => parseInt(p.year, 10))
      .filter((y) => !isNaN(y));

    const affiliations = new Set<string>();
    const researchFields = new Set<string>();

    allPubs.forEach((pub) => {
      if ('university' in pub && pub.university) {
        affiliations.add(pub.university);
      }
      pub.keyword?.forEach((kw) => researchFields.add(kw));
    });

    return {
      name: authorName,
      totalPapers: allPubs.length,
      thesisCount: thesisData?.data?.length || 0,
      articleCount: articleData?.data?.length || 0,
      yearRange: {
        earliest: years.length > 0 ? Math.min(...years) : 0,
        latest: years.length > 0 ? Math.max(...years) : 0,
      },
      publications: allPubs,
      affiliations: Array.from(affiliations),
      researchFields: Array.from(researchFields).slice(0, 10),
    };
  }
}

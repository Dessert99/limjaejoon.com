import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { HttpService } from '@nestjs/axios';

import { TourService } from './tour.service';

// ─── 외부 API 응답 픽스처 ────────────────────────────────────────────────────

// searchKeyword2 정상 응답 — 한글 필드 그대로 (외부 계약)
const makeSearchResponse = (
  pageNo: number,
  totalCount: number,
  firstImage = 'https://img.example.com/photo.jpg'
) => ({
  data: {
    response: {
      header: { resultCode: '0000', resultMsg: 'OK' },
      body: {
        totalCount,
        pageNo,
        numOfRows: 20,
        items: {
          item: [
            {
              contentid: '125508',
              title: '경복궁',
              firstimage: firstImage,
              addr1: '서울특별시 종로구 사직로 161',
              mapx: '126.9769930',
              mapy: '37.5796212',
            },
          ],
        },
      },
    },
  },
});

// detailCommon2 정상 응답 — contenttypeid가 detailIntro2 호출 시 필수 파라미터로 사용됨
const makeCommonResponse = () => ({
  data: {
    response: {
      header: { resultCode: '0000', resultMsg: 'OK' },
      body: {
        items: {
          item: [
            {
              contentid: '125508',
              contenttypeid: '12',
              title: '경복궁',
              overview: '<p>조선 왕조의 법궁</p>',
              homepage: 'http://www.royalpalace.go.kr',
              addr1: '서울특별시 종로구 사직로 161',
              firstimage: 'https://img.example.com/photo.jpg',
            },
          ],
        },
      },
    },
  },
});

// detailIntro2 정상 응답 — contentTypeId마다 필드가 달라 raw 그대로 전달
const makeIntroResponse = () => ({
  data: {
    response: {
      header: { resultCode: '0000', resultMsg: 'OK' },
      body: {
        items: {
          item: [
            {
              contentid: '125508',
              contenttypeid: '12',
              accomcount: '500',
              heritage1: '1',
            },
          ],
        },
      },
    },
  },
});

// 비정상 resultCode 응답
const makeErrorResponse = (resultCode: string) => ({
  data: {
    response: {
      header: { resultCode, resultMsg: 'SERVICE ERROR' },
      body: {},
    },
  },
});

// serviceKey·config가 박힌 axios 에러 객체 생성
function makeAxiosError(status: number) {
  return Object.assign(new Error('boom'), {
    code: 'ECONNABORTED',
    config: {
      url: '/searchKeyword2',
      params: { serviceKey: 'SECRET_API_KEY_VALUE', keyword: '서울' },
    },
    response: { status },
  });
}

// ─── 테스트 ──────────────────────────────────────────────────────────────────

describe('TourService', () => {
  let service: TourService;

  // HttpService를 mock으로 교체 — 실제 외부 API 호출 차단
  const mockHttp = {
    get: jest.fn(),
  };

  // ConfigService mock — HttpModule에서 쓰는 키를 반환
  const mockCs = {
    get: jest.fn((key: string) => {
      if (key === 'TOUR_API_KEY') return 'TEST_KEY';
      return undefined;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourService,
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockCs },
      ],
    }).compile();

    service = module.get(TourService);
  });

  // ─── searchByKeyword ────────────────────────────────────────────────────

  describe('searchByKeyword', () => {
    it('외부 한글 필드를 영문 DTO로 정확히 매핑한다', async () => {
      // 정상 검색 응답 주입
      mockHttp.get.mockReturnValue(of(makeSearchResponse(1, 200)));

      const result = await service.searchByKeyword('서울', 1);

      // 매핑 검증 — 외부 contentid → contentId 등
      expect(result.items).toHaveLength(1);
      const item = result.items[0];
      expect(item.contentId).toBe('125508');
      expect(item.title).toBe('경복궁');
      expect(item.firstImage).toBe('https://img.example.com/photo.jpg');
      expect(item.addr).toBe('서울특별시 종로구 사직로 161');
      // string → number 변환 검증
      expect(item.mapX).toBeCloseTo(126.976993);
      expect(item.mapY).toBeCloseTo(37.5796212);
    });

    it('totalCount=200, pageNo=1, numOfRows=20 → hasMore=true', async () => {
      mockHttp.get.mockReturnValue(of(makeSearchResponse(1, 200)));

      const result = await service.searchByKeyword('서울', 1);

      expect(result.hasMore).toBe(true);
      expect(result.page).toBe(1);
    });

    it('totalCount=200, pageNo=10, numOfRows=20 → hasMore=false (마지막 페이지)', async () => {
      mockHttp.get.mockReturnValue(of(makeSearchResponse(10, 200)));

      const result = await service.searchByKeyword('서울', 10);

      // 10 * 20 = 200 === totalCount 이므로 더 이상 페이지 없음
      expect(result.hasMore).toBe(false);
    });

    it('firstimage가 빈 문자열인 경우 null로 정규화된다', async () => {
      // 외부 API가 이미지 없는 관광지에 빈 문자열을 반환하는 경우
      mockHttp.get.mockReturnValue(of(makeSearchResponse(1, 20, '')));

      const result = await service.searchByKeyword('서울', 1);

      expect(result.items[0].firstImage).toBeNull();
    });

    it('axios 에러 발생 시 ServiceUnavailableException으로 변환된다 (원본 메시지 미노출)', async () => {
      // 네트워크 에러 시뮬레이션 — 원본 'boom' 메시지가 클라이언트에 노출되면 안 됨
      mockHttp.get.mockReturnValue(throwError(() => makeAxiosError(502)));

      await expect(service.searchByKeyword('서울', 1)).rejects.toThrow(
        ServiceUnavailableException
      );

      // 고정 메시지만 노출 — 내부 상세 노출 금지
      await expect(service.searchByKeyword('서울', 1)).rejects.toThrow(
        '외부 관광 API 호출 실패'
      );
    });

    it('resultCode가 0000이 아닌 비정상 응답도 503으로 변환된다', async () => {
      // 외부 API가 resultCode='99' 같은 에러 코드를 반환하는 경우
      mockHttp.get.mockReturnValue(of(makeErrorResponse('99')));

      await expect(service.searchByKeyword('서울', 1)).rejects.toThrow(
        ServiceUnavailableException
      );
    });
  });

  // ─── serializeAxiosError ────────────────────────────────────────────────

  describe('serializeAxiosError — logger 시리얼라이저', () => {
    it('serviceKey·config.url이 박힌 에러를 넘겨도 반환 객체와 JSON에 serviceKey 값이 포함되지 않는다', () => {
      const err = makeAxiosError(502);

      // private 메서드를 타입 단언으로 접근 — 단위 테스트 목적
      const safe = (
        service as unknown as { serializeAxiosError(e: unknown): unknown }
      ).serializeAxiosError(err);

      // 반환 객체에 serviceKey가 없어야 함
      const json = JSON.stringify(safe);
      expect(json).not.toContain('SECRET_API_KEY_VALUE');
      expect(json).not.toContain('/searchKeyword2');

      // 안전 필드(status, code, message)는 포함되어야 함
      expect(safe).toEqual(
        expect.objectContaining({
          status: 502,
          code: 'ECONNABORTED',
          message: 'boom',
        })
      );
    });
  });

  // ─── fetchCommon ────────────────────────────────────────────────────────

  describe('fetchCommon', () => {
    it('detailCommon2 응답을 TourCommonDto로 매핑한다', async () => {
      mockHttp.get.mockReturnValue(of(makeCommonResponse()));

      const result = await service.fetchCommon('125508');

      expect(result.contentId).toBe('125508');
      // detailIntro2 호출에 필요한 contentTypeId가 응답에 포함되어야 함
      expect(result.contentTypeId).toBe('12');
      expect(result.title).toBe('경복궁');
      expect(result.overview).toBe('<p>조선 왕조의 법궁</p>');
      expect(result.homepage).toBe('http://www.royalpalace.go.kr');
      expect(result.addr).toBe('서울특별시 종로구 사직로 161');
      expect(result.firstImage).toBe('https://img.example.com/photo.jpg');
    });
  });

  // ─── fetchIntro ─────────────────────────────────────────────────────────

  describe('fetchIntro', () => {
    it('detailIntro2 응답의 item[0]을 raw 그대로 반환한다', async () => {
      mockHttp.get.mockReturnValue(of(makeIntroResponse()));

      const result = await service.fetchIntro('125508', '12');

      expect(result.contentId).toBe('125508');
      // 외부 필드가 그대로 raw에 들어 있어야 함
      expect(result.raw).toMatchObject({
        contentid: '125508',
        contenttypeid: '12',
        accomcount: '500',
      });
    });

    it('contentTypeId를 detailIntro2의 필수 query 파라미터로 전달한다', async () => {
      // KorService2 detailIntro2는 contentTypeId가 필수 — 누락 시 외부 API가 비정상 응답
      mockHttp.get.mockReturnValue(of(makeIntroResponse()));

      await service.fetchIntro('125508', '12');

      expect(mockHttp.get).toHaveBeenCalledWith(
        '/detailIntro2',
        expect.objectContaining({
          params: expect.objectContaining({
            contentId: '125508',
            contentTypeId: '12',
          }),
        })
      );
    });
  });
});

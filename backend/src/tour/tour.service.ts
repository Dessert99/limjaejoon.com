import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { TourCommonDto, TourIntroDto } from './dto/tour-detail.dto';
import { TourItemDto } from './dto/tour-item.dto';
import { TourSearchResponseDto } from './dto/tour-search-response.dto';

// 외부 KorService2 searchKeyword2 응답의 item 한 건 — 외부 계약 타입 (ACL 경계)
interface RawSearchItem {
  contentid: string;
  title: string;
  firstimage: string;
  addr1: string;
  mapx: string;
  mapy: string;
}

// 외부 KorService2 detailCommon2 응답의 item 한 건
interface RawCommonItem {
  contentid: string;
  // contenttypeid: detailIntro2 호출 시 필수 파라미터 — common 응답에서 추출해 클라이언트에 노출
  contenttypeid: string;
  title: string;
  overview: string;
  homepage: string;
  addr1: string;
  firstimage: string;
}

// 외부 KorService2 응답의 공통 envelope — http.get 제네릭에 명시해 res.data 타입 추론
interface KorServiceResponse<TItem> {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      totalCount?: number;
      pageNo?: number;
      numOfRows?: number;
      items?: { item?: TItem[] } | '';
    };
  };
}

@Injectable()
export class TourService {
  // NestJS 기본 Logger — 서비스 이름을 컨텍스트로 사용
  private readonly logger = new Logger(TourService.name);

  constructor(private readonly http: HttpService) {}

  // 키워드 검색 — 외부 searchKeyword2 호출 후 ACL 변환
  async searchByKeyword(
    keyword: string,
    page: number
  ): Promise<TourSearchResponseDto> {
    // numOfRows는 고정 20 — 외부 API 부하 제한
    const numOfRows = 20;

    try {
      // 제네릭으로 응답 타입을 명시 — strict 모드에서 res.data가 unknown으로 추론되는 것을 방지
      const res = await firstValueFrom(
        this.http.get<KorServiceResponse<RawSearchItem>>('/searchKeyword2', {
          params: {
            keyword,
            pageNo: page,
            numOfRows,
          },
        })
      );

      const { header, body } = res.data.response;

      // 외부 API 비정상 응답 코드 — 0000이 아니면 서비스 불가로 처리
      if (header.resultCode !== '0000') {
        this.logger.error('tour API 비정상 resultCode', {
          resultCode: header.resultCode,
          resultMsg: header.resultMsg,
        });
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // 페이지네이션 계산 — 현재 페이지 소비량이 totalCount 미만이면 다음 페이지 존재
      const hasMore = page * numOfRows < (body.totalCount ?? 0);

      // 외부 API는 결과 없을 때 items에 빈 문자열을 넣기도 함 — 객체일 때만 item 배열 추출
      const rawItems =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];

      const items: TourItemDto[] = rawItems.map((raw) =>
        this.mapSearchItem(raw)
      );

      return { items, page, hasMore };
    } catch (err) {
      // ServiceUnavailableException은 이미 우리가 던진 것 — 그대로 재전파
      if (err instanceof ServiceUnavailableException) throw err;

      this.logger.error('tour API 호출 실패', this.serializeAxiosError(err));
      throw new ServiceUnavailableException('외부 관광 API 호출 실패');
    }
  }

  // 관광지 공통 정보 — 외부 detailCommon2 호출 후 ACL 변환
  async fetchCommon(contentId: string): Promise<TourCommonDto> {
    try {
      const res = await firstValueFrom(
        this.http.get<KorServiceResponse<RawCommonItem>>('/detailCommon2', {
          params: { contentId },
        })
      );

      const { header, body } = res.data.response;

      if (header.resultCode !== '0000') {
        this.logger.error('tour API 비정상 resultCode', {
          resultCode: header.resultCode,
        });
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // 결과가 비어 있으면 외부에 해당 contentId가 없는 경우 — 503으로 처리(404 차이는 학습 범위 밖)
      const items =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];
      const raw = items[0];
      if (!raw) {
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      return {
        contentId: raw.contentid,
        // detailIntro2 후속 호출 + 클라이언트 분기에 사용 — 외부 응답 그대로 전달
        contentTypeId: raw.contenttypeid,
        title: raw.title,
        // overview·homepage는 HTML 태그 포함 가능 — 그대로 전달, 빈값은 null 정규화
        overview: raw.overview || null,
        homepage: raw.homepage || null,
        addr: raw.addr1 || null,
        firstImage: raw.firstimage || null,
      };
    } catch (err) {
      if (err instanceof ServiceUnavailableException) throw err;

      this.logger.error('tour API 호출 실패', this.serializeAxiosError(err));
      throw new ServiceUnavailableException('외부 관광 API 호출 실패');
    }
  }

  // 관광지 소개 정보 — contentTypeId마다 구조가 달라 raw 그대로 반환
  // contentTypeId는 KorService2 detailIntro2의 필수 파라미터 — 누락 시 외부가 비정상 응답
  async fetchIntro(
    contentId: string,
    contentTypeId: string
  ): Promise<TourIntroDto> {
    try {
      const res = await firstValueFrom(
        this.http.get<KorServiceResponse<Record<string, unknown>>>(
          '/detailIntro2',
          {
            params: { contentId, contentTypeId },
          }
        )
      );

      const { header, body } = res.data.response;

      if (header.resultCode !== '0000') {
        this.logger.error('tour API 비정상 resultCode', {
          resultCode: header.resultCode,
        });
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // item[0] 전체를 raw로 노출 — 타입별 필드 파싱은 프론트에서 처리
      const items =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];
      const raw = items[0];
      if (!raw) {
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      return {
        // contentId는 raw에서 추출해 최상위 필드로 노출 — 클라이언트 식별 편의
        contentId: raw['contentid'] as string,
        raw,
      };
    } catch (err) {
      if (err instanceof ServiceUnavailableException) throw err;

      this.logger.error('tour API 호출 실패', this.serializeAxiosError(err));
      throw new ServiceUnavailableException('외부 관광 API 호출 실패');
    }
  }

  // 외부 한글 필드 → 영문 TourItemDto ACL 변환 헬퍼
  private mapSearchItem(raw: RawSearchItem): TourItemDto {
    return {
      contentId: raw.contentid,
      title: raw.title,
      // 빈 문자열도 이미지 없음으로 간주 → null 정규화
      firstImage: raw.firstimage || null,
      addr: raw.addr1 || null,
      // 외부는 문자열 숫자 — parseFloat으로 변환, 빈값은 null
      mapX: raw.mapx ? parseFloat(raw.mapx) : null,
      mapY: raw.mapy ? parseFloat(raw.mapy) : null,
    };
  }

  // axios 에러에서 serviceKey·URL 등 민감 정보를 제거한 안전 객체만 반환
  // ADR 0002: serviceKey는 어떤 경로로도 로그에 포함되면 안 됨
  private serializeAxiosError(err: unknown): {
    status: number | undefined;
    code: string | undefined;
    message: string;
  } {
    if (err instanceof Error) {
      const axiosErr = err as Error & {
        code?: string;
        response?: { status?: number };
        // config는 의도적으로 타입에 포함하지 않아 접근을 차단
      };
      return {
        // HTTP 상태 코드 — 네트워크 에러 시 undefined
        status: axiosErr.response?.status,
        // ECONNABORTED·ENOTFOUND 등 axios 에러 코드
        code: axiosErr.code,
        // Error.message만 — 원본 메시지가 serviceKey를 포함하지 않음
        message: axiosErr.message,
      };
    }
    // Error 인스턴스가 아닌 경우 — 알 수 없는 에러 형태
    return { status: undefined, code: undefined, message: String(err) };
  }
}

// 관광지 외부 API 클라이언트 — KorService2 호출 + ACL(외부 한글 필드 → 영문 DTO) 변환 + 에러 정규화. 컨트롤러는 이 서비스만 통하고 axios·외부 응답 형태를 모름
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

// 외부 searchKeyword2 응답의 item 한 건 — 외부 계약 타입(원본 한글 필드명 그대로)
interface RawSearchItem {
  contentid: string;
  title: string;
  firstimage: string;
  addr1: string;
  mapx: string;
  mapy: string;
}

// 외부 detailCommon2 응답의 item 한 건 — contenttypeid가 detailIntro2 후속 호출에 필수라 응답에 노출
interface RawCommonItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  overview: string;
  homepage: string;
  addr1: string;
  firstimage: string;
}

// KorService2 공통 envelope — header에 resultCode/Msg, body에 페이지네이션 + items.item 배열. items가 빈 문자열인 경우도 외부에서 발생
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
  // Logger(Service.name) — Nest 표준 로거. 출력 시 [TourService] 컨텍스트 라벨이 자동으로 붙는다
  private readonly logger = new Logger(TourService.name);

  // HttpService — TourModule.HttpModule.registerAsync가 만든 axios 인스턴스(baseURL/serviceKey 자동 주입)를 주입
  constructor(private readonly http: HttpService) {}

  // searchByKeyword(keyword, page) — 외부 검색 호출 → header.resultCode 검증 → 한글 필드를 TourItemDto 배열로 매핑 → 페이지네이션 응답
  async searchByKeyword(
    keyword: string,
    page: number
  ): Promise<TourSearchResponseDto> {
    // numOfRows 고정 — 외부 API 부하 제한 + 클라 페이지 크기 일정화
    const numOfRows = 20;

    try {
      // firstValueFrom — RxJS Observable을 Promise로 변환. http.get은 Observable<AxiosResponse>를 반환
      const res = await firstValueFrom(
        // 제네릭으로 응답 타입 명시 — strict 모드에서 res.data가 unknown으로 추론되는 것 방지
        this.http.get<KorServiceResponse<RawSearchItem>>('/searchKeyword2', {
          params: {
            keyword,
            pageNo: page,
            numOfRows,
          },
        })
      );

      const { header, body } = res.data.response;

      // resultCode '0000'이 정상 — 그 외는 외부 장애로 간주해 503 변환 (404와 503의 차이는 학습 범위 밖)
      if (header.resultCode !== '0000') {
        this.logger.error('tour API 비정상 resultCode', {
          resultCode: header.resultCode,
          resultMsg: header.resultMsg,
        });
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // page * 20이 totalCount 미만이면 다음 페이지가 남음 — 무한 스크롤 종료 신호
      const hasMore = page * numOfRows < (body.totalCount ?? 0);

      // 외부 API는 결과 없을 때 items에 빈 문자열을 넣음 — typeof object 분기로 정상 응답일 때만 item 배열 추출
      const rawItems =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];

      // RawSearchItem[](한글 필드) → TourItemDto[](영문 필드) ACL 매핑
      const items: TourItemDto[] = rawItems.map((raw) =>
        this.mapSearchItem(raw)
      );

      return { items, page, hasMore };
    } catch (err) {
      // 우리가 던진 503은 그대로 재전파 — 아래에서 다시 잡아 503으로 변환하면 메시지 중복 로깅 발생
      if (err instanceof ServiceUnavailableException) throw err;

      this.logger.error('tour API 호출 실패', this.serializeAxiosError(err));
      throw new ServiceUnavailableException('외부 관광 API 호출 실패');
    }
  }

  // fetchCommon(contentId) — detailCommon2 호출 후 raw → TourCommonDto 변환. contentTypeId를 응답에 포함시켜 클라가 intro 호출 시 사용
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

      const items =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];
      const raw = items[0];
      // 정상 응답인데 item 배열이 비었다 = 외부에 해당 contentId가 없음 — 503으로 단순화 (404 분기는 학습 범위 밖)
      if (!raw) {
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // RawCommonItem(한글 필드) → TourCommonDto(영문 필드) 변환. 빈 문자열은 null로 정규화해 클라에서 truthy 체크 일관성 확보
      return {
        contentId: raw.contentid,
        contentTypeId: raw.contenttypeid,
        title: raw.title,
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

  // fetchIntro(contentId, contentTypeId) — detailIntro2 호출. contentTypeId마다 응답 필드가 달라(관광지/문화시설/축제 등) raw 객체를 그대로 노출
  async fetchIntro(
    contentId: string,
    contentTypeId: string
  ): Promise<TourIntroDto> {
    try {
      const res = await firstValueFrom(
        // Record<string, unknown> — 타입별 필드 차이를 백엔드에서 분기하지 않고 raw 형태 그대로 통과
        this.http.get<KorServiceResponse<Record<string, unknown>>>(
          '/detailIntro2',
          {
            // contentTypeId 누락 시 외부 API가 비정상 응답 — common 응답에서 받아 클라가 같이 보내야 함
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

      const items =
        typeof body.items === 'object' ? (body.items.item ?? []) : [];
      const raw = items[0];
      if (!raw) {
        throw new ServiceUnavailableException('외부 관광 API 호출 실패');
      }

      // contentId만 최상위로 끌어올리고 raw 전체를 그대로 통과 — 프론트에서 contentTypeId별로 필드 분기 처리
      return {
        contentId: raw['contentid'] as string,
        raw,
      };
    } catch (err) {
      if (err instanceof ServiceUnavailableException) throw err;

      this.logger.error('tour API 호출 실패', this.serializeAxiosError(err));
      throw new ServiceUnavailableException('외부 관광 API 호출 실패');
    }
  }

  // mapSearchItem(raw) — 외부 한글 필드 한 건을 영문 DTO로 변환. 빈 문자열을 null로, 좌표 string을 number로 정규화
  private mapSearchItem(raw: RawSearchItem): TourItemDto {
    return {
      contentId: raw.contentid,
      title: raw.title,
      // 빈 문자열도 "이미지 없음"으로 간주 — 클라 truthy 체크 + Next/Image src 빈 문자열 에러 방지
      firstImage: raw.firstimage || null,
      addr: raw.addr1 || null,
      // KorService2는 좌표를 문자열로 반환 — 빈값/널 안전한 parseFloat 분기
      mapX: raw.mapx ? parseFloat(raw.mapx) : null,
      mapY: raw.mapy ? parseFloat(raw.mapy) : null,
    };
  }

  // serializeAxiosError(err) — axios 에러에서 status/code/message만 추출. config 객체는 의도적으로 빼서 serviceKey가 로그에 새지 않게 차단
  private serializeAxiosError(err: unknown): {
    status: number | undefined;
    code: string | undefined;
    message: string;
  } {
    if (err instanceof Error) {
      const axiosErr = err as Error & {
        code?: string;
        response?: { status?: number };
      };
      return {
        status: axiosErr.response?.status,
        code: axiosErr.code,
        message: axiosErr.message,
      };
    }
    // Error 인스턴스가 아닌 경우(이론상 거의 없음) — 문자열로 강제 변환해 최소한의 메시지 확보
    return { status: undefined, code: undefined, message: String(err) };
  }
}

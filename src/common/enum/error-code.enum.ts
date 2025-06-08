import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // 인증 관련 에러
  UNAUTHORIZED = 'AUTH_001',
  INVALID_TOKEN = 'AUTH_002',
  INCORRECT_EMAIL_OR_PASSWORD = 'AUTH_003',
  REQUIRED_LOGIN = 'AUTH_004',

  // 사용자 관련 에러
  USER_NOT_FOUND = 'USER_001',
  DUPLICATE_EMAIL = 'USER_002',
  NOT_FOUND_EMAIL = 'USER_003',
  SAME_ORIGINAL_PASSWORD = 'USER_004',
  NOT_ALLOWED_SOCIAL_USER = 'USER_005',
  VERIFICATION_EMAIL_TOKEN_FAILED = 'USER_006',
  USER_ALREADY_EXISTS = 'USER_007',

  // 숙소 관련 에러
  ROOM_NOT_FOUND = 'ROOM_001',

  // 이미지 관련 에러
  IMAGE_NOT_FOUND = 'IMAGE_001',
  IMAGE_FILES_MOVE_ERROR = 'IMAGE_002',

  // 댓글 관련 에러
  COMMENT_NOT_FOUND = 'COMMENT_001',

  // 예약 관련 에러
  BOOKING_NOT_FOUND = 'BOOKING_001',
  BOOKING_ALREADY_CANCELLED = 'BOOKING_002',

  // 결제 관련 에러
  PAYMENT_NOT_FOUND = 'PAYMENT_001',

  // 카테고리 관련 에러
  CATEGORY_NOT_FOUND = 'CATEGORY_001',

  // 기타 일반 에러
  INTERNAL_SERVER_ERROR = 'SERVER_001',
  BAD_REQUEST = 'COMMON_001',
  FORBIDDEN = 'COMMON_002',
}

export const ErrorCodeMap: Record<
  ErrorCode,
  { status: HttpStatus; message: string }
> = {
  // 인증 관련
  [ErrorCode.UNAUTHORIZED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '인증 정보가 유효하지 않습니다.',
  },
  [ErrorCode.INVALID_TOKEN]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않거나 만료된 토큰입니다.',
  },
  [ErrorCode.INCORRECT_EMAIL_OR_PASSWORD]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  [ErrorCode.REQUIRED_LOGIN]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '로그인이 필요합니다.',
  },
  [ErrorCode.NOT_ALLOWED_SOCIAL_USER]: {
    status: HttpStatus.FORBIDDEN,
    message: '소셜 로그인 사용자는 이용이 불가능합니다.',
  },

  // 사용자 관련
  [ErrorCode.USER_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 유저를를 찾을 수 없습니다.',
  },
  [ErrorCode.DUPLICATE_EMAIL]: {
    status: HttpStatus.CONFLICT,
    message: '이미 사용 중인 이메일입니다.',
  },
  [ErrorCode.NOT_FOUND_EMAIL]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 이메일을 찾을 수 없습니다.',
  },
  [ErrorCode.SAME_ORIGINAL_PASSWORD]: {
    status: HttpStatus.CONFLICT,
    message: '기존 비밀번호와 동일합니다.',
  },
  [ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 인증 토큰이 유효하지 않습니다.',
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    status: HttpStatus.CONFLICT,
    message: '이미 존재하는 유저입니다.',
  },

  // 숙소 관련
  [ErrorCode.ROOM_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 숙소를 찾을 수 없습니다.',
  },

  // 이미지 관련
  [ErrorCode.IMAGE_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '이미지를 찾을 수 없습니다.',
  },
  [ErrorCode.IMAGE_FILES_MOVE_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '이미지 파일 이동 중 오류가 발생했습니다.',
  },

  // 댓글 관련
  [ErrorCode.COMMENT_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 후기를 찾을 수 없습니다.',
  },

  // 예약 관련
  [ErrorCode.BOOKING_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 예약을 찾을 수 없습니다.',
  },
  [ErrorCode.BOOKING_ALREADY_CANCELLED]: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 취소된 예약입니다.',
  },

  // 결제 관련
  [ErrorCode.PAYMENT_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 결제를 찾을 수 없습니다.',
  },

  // 카테고리 관련
  [ErrorCode.CATEGORY_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 카테고리를 찾을 수 없습니다.',
  },

  // 기타 일반
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 내부 오류가 발생했습니다.',
  },
  [ErrorCode.BAD_REQUEST]: {
    status: HttpStatus.BAD_REQUEST,
    message: '잘못된 요청입니다.',
  },
  [ErrorCode.FORBIDDEN]: {
    status: HttpStatus.FORBIDDEN,
    message: '잘못된 접근입니다.',
  },
};

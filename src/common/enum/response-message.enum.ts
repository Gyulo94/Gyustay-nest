export enum ResponseMessage {
  SIGNUP_SUCCESS = '회원가입이 완료되었습니다!',
  RESET_PASSWORD_SUCCESS = '비밀번호가 변경되었습니다!',
  LOGIN_SUCCESS = 'GyuStay에 오신 것을 환영합니다!',
  SEND_EMAIL_SUCCESS = '이메일을 성공적으로 보냈습니다. 링크를 통해 진행해주세요.',

  USER_EDIT_SUCCESS = '회원 정보가 수정되었습니다.',

  COMMENT_CREATE_SUCCESS = '후기가 등록되었습니다.',
  COMMENT_UPDATE_SUCCESS = '후기가 수정되었습니다.',
  COMMENT_DELETE_SUCCESS = '후기가 삭제되었습니다.',

  BOOKING_CREATE_SUCCESS = '예약이 완료되었습니다.',
  BOOKING_CANCEL_SUCCESS = '예약이 취소되었습니다.',

  ROOM_CREATE_SUCCESS = '숙소가 등록되었습니다.',
  ROOM_UPDATE_SUCCESS = '숙소가 수정되었습니다.',
  ROOM_DELETE_SUCCESS = '숙소가 삭제되었습니다.',

  PAYMENT_CREATE_SUCCESS = '결제가 완료되었습니다.',
  PAYMENT_APPROVE_SUCCESS = '결제가 승인되었습니다.',
}

export class WebResponseDto<T> {
  data: T;
  errors?: string[] | string;
}

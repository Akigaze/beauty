package akigaze.beauty.server.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException {
  public BadRequestException(String message) {
    super(message);
  }

  @Override
  public HttpStatus getStatus() {
    return HttpStatus.BAD_REQUEST;
  }
}

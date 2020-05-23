package akigaze.beauty.server.common.exception;

import org.springframework.http.HttpStatus;

public class JsonException extends BaseException {

  public JsonException(String message, Throwable cause) {
    super(message, cause);
  }

  @Override
  public HttpStatus getStatus() {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

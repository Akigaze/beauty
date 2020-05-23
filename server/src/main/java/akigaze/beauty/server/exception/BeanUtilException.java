package akigaze.beauty.server.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class BeanUtilException extends BaseException {

  public BeanUtilException(String message, Throwable cause) {
    super(message, cause);
  }

  @Override
  public HttpStatus getStatus() {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

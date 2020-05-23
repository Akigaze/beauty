package akigaze.beauty.server.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BaseException extends RuntimeException {
  private Object data;

  public BaseException(String message) {
    super(message);
  }

  public BaseException(String message, Throwable cause) {
    super(message, cause);
  }

  public abstract HttpStatus getStatus();

  public BaseException setData(Object data) {
    this.data = data;
    return this;
  }
}

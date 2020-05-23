package akigaze.beauty.server.model.base;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class BaseResponse<T> {
  private T data;

  private String message;

  private HttpStatus status;

  private String devMessage;

  public Integer getStatus() {
    return status.value();
  }

  @SuppressWarnings("unchecked")
  public <X> BaseResponse<T> setData(X data) {
    this.data = (T) data;
    return this;
  }
}

package akigaze.beauty.server.model.base;

import akigaze.beauty.server.util.JsonSerializers;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class BaseResponse<T> {
  private T data;

  private String message;

  @JsonSerialize(using = JsonSerializers.HttpStatusJsonSerializer.class)
  private HttpStatus status;

  private String devMessage;

  public Integer getStatus() {
    return status.value();
  }

  @SuppressWarnings("unchecked")
  public <X> BaseResponse<T> setData(X data) {
    this.data = (T)data;
    return this;
  }
}

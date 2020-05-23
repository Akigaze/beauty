package akigaze.beauty.server.config;

import akigaze.beauty.server.exception.BaseException;
import akigaze.beauty.server.model.base.BaseResponse;
import akigaze.beauty.server.util.ExceptionUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("akigaze.beauty.server.controller")
public class ControllerExceptionHandler {

  @ExceptionHandler(BaseException.class)
  public ResponseEntity<BaseResponse<?>> handleBaseException(BaseException exception) {
    BaseResponse<?> baseResponse = this.buildBaseResponse(exception);
    baseResponse.setStatus(exception.getStatus());
    baseResponse.setData(exception.getData());
    return ResponseEntity.status(exception.getStatus()).body(baseResponse);

  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public BaseResponse<?> handleException(Exception exception) {
    BaseResponse<?> baseResponse = this.buildBaseResponse(exception);
    baseResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    return baseResponse;
  }

  private BaseResponse<?> buildBaseResponse(@NonNull Exception e) {
    Assert.notNull(e, "throwable should be not null");

    BaseResponse<?> response = new BaseResponse<>();
    response.setDevMessage(ExceptionUtil.getStackTrace(e));
    response.setMessage(e.getMessage());
    return response;
  }
}
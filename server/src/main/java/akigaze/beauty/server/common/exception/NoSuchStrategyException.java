package akigaze.beauty.server.common.exception;

public class NoSuchStrategyException extends BadRequestException {

  public NoSuchStrategyException(String type) {
    super(type);
  }
}

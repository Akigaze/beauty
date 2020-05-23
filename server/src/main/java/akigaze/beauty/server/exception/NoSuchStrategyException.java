package akigaze.beauty.server.exception;

public class NoSuchStrategyException extends BadRequestException {

  public NoSuchStrategyException(String type) {
    super(type);
  }
}

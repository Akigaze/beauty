package akigaze.beauty.server.search.wrapper;

import akigaze.beauty.server.search.enums.StrategyType;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

public class CaseStrategyWrapper implements StrategyWrapper {
  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.ignoreCase;
  }

  @Override
  public @NonNull String wrap(@NonNull String keyword) {
    Assert.hasText(keyword, "keyword should not be null, empty or blank");
    return keyword + "%";
  }
}

package akigaze.beauty.server.service.search.wrapper;

import akigaze.beauty.server.constant.enums.StrategyType;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

public class RegexStrategyWrapper implements StrategyWrapper {

  private boolean caseIgnored;

  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.regex;
  }

  @Override
  public @NonNull String wrap(@NonNull String keyword) {
    Assert.hasText(keyword, "keyword should not be null, empty or blank");
    return keyword;
  }

  public boolean ignoreCase() {
    return caseIgnored;
  }

  public RegexStrategyWrapper ignoreCase(boolean caseIgnored) {
    this.caseIgnored = caseIgnored;
    return this;
  }
}

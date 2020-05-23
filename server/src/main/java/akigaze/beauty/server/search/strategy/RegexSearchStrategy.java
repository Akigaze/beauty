package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.RegexStrategyWrapper;
import lombok.NonNull;

import java.util.List;
import java.util.function.Function;

public class RegexSearchStrategy extends AbstractSearchStrategy<RegexStrategyWrapper> {
  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.regex;
  }

  @Override
  protected <T> Function<String, List<T>> getExecutor(SearchableRepository<T> repository, RegexStrategyWrapper wrapper) {
    return wrapper.ignoreCase() ? repository::findAllMatchRegexIgnoreCase : repository::findAllMatchRegex;
  }
}

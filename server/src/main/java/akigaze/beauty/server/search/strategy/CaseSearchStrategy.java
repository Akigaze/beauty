package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.CaseStrategyWrapper;
import lombok.NonNull;

import java.util.List;
import java.util.function.Function;

public class CaseSearchStrategy extends AbstractSearchStrategy<CaseStrategyWrapper> {
  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.ignoreCase;
  }

  @Override
  protected <T, ID> Function<String, List<T>> getExecutor(SearchableRepository<T, ID> repository, CaseStrategyWrapper wrapper) {
    return repository::findAllStartWithKeywordIgnoreCase;
  }
}

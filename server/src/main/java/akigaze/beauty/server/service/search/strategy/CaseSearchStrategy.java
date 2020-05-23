package akigaze.beauty.server.service.search.strategy;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.repository.SearchableRepository;
import akigaze.beauty.server.service.search.wrapper.CaseStrategyWrapper;
import lombok.NonNull;

import java.util.List;
import java.util.function.Function;

public class CaseSearchStrategy extends AbstractSearchStrategy<CaseStrategyWrapper> {
  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.ignoreCase;
  }

  @Override
  protected <T> Function<String, List<T>> getExecutor(SearchableRepository<T> repository, CaseStrategyWrapper wrapper) {
    return repository::findAllStartWithKeywordIgnoreCase;
  }
}

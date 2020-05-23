package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.SimpleStrategyWrapper;
import lombok.NonNull;

import java.util.List;
import java.util.function.Function;

public class SimpleSearchStrategy extends AbstractSearchStrategy<SimpleStrategyWrapper> {
  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.simple;
  }

  @Override
  protected <T> Function<String, List<T>> getExecutor(SearchableRepository<T> repository, SimpleStrategyWrapper wrapper) {
    return repository::findAllStartWithKeyword;
  }
}

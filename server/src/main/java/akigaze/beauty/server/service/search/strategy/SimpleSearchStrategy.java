package akigaze.beauty.server.service.search.strategy;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.repository.SearchableRepository;
import akigaze.beauty.server.service.search.wrapper.SimpleStrategyWrapper;
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

package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.WordStrategyWrapper;
import lombok.NonNull;

import java.util.List;
import java.util.function.Function;

public class WordSearchStrategy extends AbstractSearchStrategy<WordStrategyWrapper> {

  @Override
  public @NonNull StrategyType getType() {
    return StrategyType.word;
  }

  @Override
  protected <T> Function<String, List<T>> getExecutor(SearchableRepository<T> repository, WordStrategyWrapper wrapper) {
    return wrapper.ignoreCase() ? repository::findAllMatchWordIgnoreCase : repository::findAllMatchWord;
  }
}

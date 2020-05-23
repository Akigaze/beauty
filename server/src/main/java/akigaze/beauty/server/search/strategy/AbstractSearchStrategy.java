package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.StrategyWrapper;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.util.List;
import java.util.function.Function;

public abstract class AbstractSearchStrategy<S extends StrategyWrapper> implements SearchStrategy {

  @SuppressWarnings("unchecked")
  public @NonNull <T> List<T> search(@NonNull SearchableRepository<T> repository, @NonNull StrategyWrapper wrapper, @NonNull String keyword) {
    Assert.notNull(repository, "repository should not be null");
    Assert.notNull(wrapper, "strategy wrapper should not be null");
    Assert.hasText(keyword, "keyword should not be null, empty or blank");

    Function<String, List<T>> executor = this.getExecutor(repository, (S)wrapper);
    return executor.apply(wrapper.wrap(keyword));
  }

  @NonNull
  protected abstract <T> Function<String, List<T>> getExecutor(@NonNull SearchableRepository<T> repository, @NonNull S wrapper);

}

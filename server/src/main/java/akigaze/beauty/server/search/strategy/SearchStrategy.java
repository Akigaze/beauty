package akigaze.beauty.server.search.strategy;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.repository.SearchableRepository;
import akigaze.beauty.server.search.wrapper.StrategyWrapper;
import org.springframework.lang.NonNull;

import java.util.List;

public interface SearchStrategy {
  @NonNull
  StrategyType getType();

  @NonNull
  <T> List<T> search(@NonNull SearchableRepository<T> repository, @NonNull StrategyWrapper wrapper, @NonNull String keyword);
}

package akigaze.beauty.server.service.search.strategy;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.repository.SearchableRepository;
import akigaze.beauty.server.service.search.wrapper.StrategyWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface SearchStrategy {
  @NonNull
  StrategyType getType();

  @NonNull
  <T> List<T> search(@NonNull SearchableRepository<T> repository, @NonNull StrategyWrapper wrapper, @NonNull String keyword);
}

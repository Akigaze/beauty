package akigaze.beauty.server.service.search;

import akigaze.beauty.server.exception.NoSuchStrategyException;
import akigaze.beauty.server.repository.SearchableRepository;
import akigaze.beauty.server.service.search.strategy.*;
import akigaze.beauty.server.service.search.wrapper.StrategyWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SearchService {

  private final List<SearchStrategy> strategies;

  public SearchService() {
    this.strategies = Arrays.asList(new SimpleSearchStrategy(), new CaseSearchStrategy(), new WordSearchStrategy(), new RegexSearchStrategy());
  }

  public <T> List<T> search(SearchableRepository<T> repository, StrategyWrapper wrapper, String keyword) {
    SearchStrategy strategy = this.getStrategy(wrapper);
    return strategy.search(repository, wrapper, keyword);
  }

  private SearchStrategy getStrategy(StrategyWrapper wrapper) {
    for (SearchStrategy strategy : this.strategies) {
      if (strategy.getType().equals(wrapper.getType())) {
        return strategy;
      }
    }
    throw new NoSuchStrategyException(wrapper.getType().name());
  }
}

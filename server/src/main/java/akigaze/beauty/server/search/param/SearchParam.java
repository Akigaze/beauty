package akigaze.beauty.server.search.param;

import akigaze.beauty.server.search.enums.StrategyType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SearchParam {
  private String keyword;

  private List<StrategyType> strategies;
}

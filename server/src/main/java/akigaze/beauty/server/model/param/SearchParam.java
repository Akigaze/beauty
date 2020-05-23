package akigaze.beauty.server.model.param;

import akigaze.beauty.server.constant.enums.StrategyType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SearchParam {
  private String keyword;

  private List<StrategyType> strategies;
}

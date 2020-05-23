package akigaze.beauty.server.service.search.wrapper;

import akigaze.beauty.server.constant.enums.StrategyType;
import org.springframework.lang.NonNull;

public interface StrategyWrapper {
  @NonNull
  StrategyType getType();

  @NonNull
  String wrap(@NonNull String keyword);

}

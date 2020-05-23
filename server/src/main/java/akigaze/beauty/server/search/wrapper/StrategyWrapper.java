package akigaze.beauty.server.search.wrapper;

import akigaze.beauty.server.search.enums.StrategyType;
import org.springframework.lang.NonNull;

public interface StrategyWrapper {
  @NonNull
  StrategyType getType();

  @NonNull
  String wrap(@NonNull String keyword);

}

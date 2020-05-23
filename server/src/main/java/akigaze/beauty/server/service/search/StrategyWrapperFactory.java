package akigaze.beauty.server.service.search;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.service.search.wrapper.*;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.List;

public class StrategyWrapperFactory {
  @NonNull
  public static StrategyWrapper create(@NonNull List<StrategyType> strategies) {
    Assert.noNullElements(strategies, "strategies contains at least one of " + Arrays.toString(StrategyType.values()));
    StrategyWrapper wrapper = StrategyWrapperFactory.createRegexWrapper(strategies);
    if (wrapper == null) {
      wrapper = StrategyWrapperFactory.createWordWrapper(strategies);
    }
    if (wrapper == null) {
      wrapper = StrategyWrapperFactory.createCaseWrapper(strategies);
    }
    if (wrapper == null) {
      wrapper = StrategyWrapperFactory.createSimpleWrapper(strategies);
    }
    Assert.notNull(wrapper, "unknown strategy type: " + Arrays.toString(strategies.toArray(new StrategyType[0])));
    return wrapper;
  }

  private static StrategyWrapper createSimpleWrapper(@NonNull List<StrategyType> strategies) {
    if (strategies.contains(StrategyType.simple)) {
      return new SimpleStrategyWrapper();
    }
    return null;
  }

  private static StrategyWrapper createWordWrapper(@NonNull List<StrategyType> strategies) {
    if (strategies.contains(StrategyType.word)) {
      return new WordStrategyWrapper().ignoreCase(strategies.contains(StrategyType.ignoreCase));
    }
    return null;
  }

  private static StrategyWrapper createCaseWrapper(@NonNull List<StrategyType> strategies) {
    if (strategies.contains(StrategyType.ignoreCase)) {
      return new CaseStrategyWrapper();
    }
    return null;
  }

  private static StrategyWrapper createRegexWrapper(@NonNull List<StrategyType> strategies) {
    if (strategies.contains(StrategyType.regex)) {
      return new RegexStrategyWrapper().ignoreCase(strategies.contains(StrategyType.ignoreCase));
    }
    return null;
  }
}

package akigaze.beauty.server.util;

import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

public class DateUtil {

  private DateUtil() {
  }

  @NonNull
  public static Instant add(@NonNull Instant now, long time, @NonNull TimeUnit unit) {
    Assert.notNull(now, "Instant now should be not null");
    Assert.isTrue(time >= 0, "time should be greater than or equal to 0");
    Assert.notNull(unit, "TimeUnit should be not null");

    long nanos = unit.toNanos(time);
    return now.plusNanos(nanos);
  }
}

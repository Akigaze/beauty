package akigaze.beauty.server.common.util;

import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.io.PrintWriter;
import java.io.StringWriter;

public class ExceptionUtil {
  private ExceptionUtil() {
  }

  @NonNull
  public static String getStackTrace(@NonNull Exception e) {
    Assert.notNull(e, "exception should not be null");
    StringWriter stringWriter = new StringWriter();
    e.printStackTrace(new PrintWriter(stringWriter));
    return stringWriter.toString();
  }
}

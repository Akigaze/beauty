package akigaze.beauty.server.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

public class JsonUtil {

  private JsonUtil() {
  }

  private static final ObjectMapper objectMapper = createDefaultObjectMapper();

  @NonNull
  private static ObjectMapper createDefaultObjectMapper() {
    return createObjectMapper(null);
  }

  @NonNull
  public static ObjectMapper createObjectMapper(PropertyNamingStrategy strategy) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    if (strategy != null) {
      mapper.setPropertyNamingStrategy(strategy);
    }
    return mapper;
  }

  @NonNull
  public static <T> String toJson(@NonNull T obj) throws JsonProcessingException {
    Assert.notNull(obj, "source object should not be null");

    return objectMapper.writeValueAsString(obj);
  }

  @NonNull
  public static <T> T toObject(@NonNull String json, @NonNull Class<T> type) throws JsonProcessingException {
    Assert.hasText(json, "json string should not be null or blank");
    Assert.notNull(type, "output type should not be null or blank");

    return objectMapper.readValue(json, type);
  }
}

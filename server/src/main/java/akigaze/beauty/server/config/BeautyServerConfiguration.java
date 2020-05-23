package akigaze.beauty.server.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class BeautyServerConfiguration {
  @Bean
  public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
    builder.failOnEmptyBeans(false);
    builder.featuresToDisable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    return builder.build();
  }

}

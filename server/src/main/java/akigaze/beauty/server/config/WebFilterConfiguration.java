package akigaze.beauty.server.config;

import akigaze.beauty.server.config.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

import java.util.Collections;

@Configuration
public class WebFilterConfiguration {

  @Bean
  public FilterRegistrationBean<CorsFilter> corsFilter() {
    FilterRegistrationBean<CorsFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new CorsFilter());
    registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);
    registrationBean.setUrlPatterns(Collections.singleton("/api/*"));
    return registrationBean;
  }
}

package akigaze.beauty.server.config.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public class CorsFilter extends GenericFilterBean {

  public static final String ALLOW_HEADERS = String.join(",", HttpHeaders.CONTENT_TYPE);

  public static final String ALLOW_METHODS = Arrays.stream(HttpMethod.values()).map(Enum::name).collect(Collectors.joining(","));

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpServletRequest = (HttpServletRequest) request;
    HttpServletResponse httpServletResponse = (HttpServletResponse) response;
    log.debug("[CorsFilter] doFilter {}", httpServletRequest.getServletPath());

    String origin = httpServletRequest.getHeader(HttpHeaders.ORIGIN);

    httpServletResponse.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
    httpServletResponse.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, ALLOW_HEADERS);
    httpServletResponse.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, ALLOW_METHODS);
    httpServletResponse.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, String.valueOf(true));
    httpServletResponse.setHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE, String.valueOf(3600));

    if (!CorsUtils.isPreFlightRequest(httpServletRequest)) {
      chain.doFilter(request, response);
    }
  }
}

package akigaze.beauty.server.service;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.model.dto.EventDTO;
import akigaze.beauty.server.model.entity.Event;
import akigaze.beauty.server.repository.EventRepository;
import akigaze.beauty.server.service.search.SearchService;
import akigaze.beauty.server.service.search.StrategyWrapperFactory;
import akigaze.beauty.server.service.search.wrapper.StrategyWrapper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
  private final EventRepository eventRepository;

  private final SearchService searchService;

  @NonNull
  public List<EventDTO> search(@NonNull String keyword, @NonNull List<StrategyType> strategies) {
    Assert.noNullElements(strategies, "strategies contains at least one of " + Arrays.toString(StrategyType.values()));
    Assert.hasText(keyword, "keyword should not be null, empty or blank");
    return searchService.search(eventRepository, StrategyWrapperFactory.create(strategies), keyword).stream()
      .map(event -> new EventDTO().convertFrom(event)).collect(Collectors.toList());
  }
}

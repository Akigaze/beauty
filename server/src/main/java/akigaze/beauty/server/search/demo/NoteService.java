package akigaze.beauty.server.search.demo;

import akigaze.beauty.server.search.SearchService;
import akigaze.beauty.server.search.StrategyWrapperFactory;
import akigaze.beauty.server.search.enums.StrategyType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {
  private final NoteRepository noteRepository;

  private final SearchService searchService;

  @NonNull
  public List<NoteDTO> search(@NonNull String keyword, @NonNull List<StrategyType> strategies) {
    Assert.noNullElements(strategies, "strategies contains at least one of " + Arrays.toString(StrategyType.values()));
    Assert.hasText(keyword, "keyword should not be null, empty or blank");
    return searchService.search(noteRepository, StrategyWrapperFactory.create(strategies), keyword).stream()
      .map(note -> new NoteDTO().convertFrom(note)).collect(Collectors.toList());
  }
}

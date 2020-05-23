package akigaze.beauty.server.search.demo;

import akigaze.beauty.server.search.enums.StrategyType;
import akigaze.beauty.server.search.param.SearchParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/demo/notes")
public class NoteController {
  private final NoteService noteService;

  @GetMapping("/search")
  public List<NoteDTO> search(@RequestParam("k") String keyword, @RequestParam("s") List<StrategyType> strategies) {
    return noteService.search(keyword, strategies);
  }

  @PostMapping("/search")
  public List<NoteDTO> search(@RequestBody SearchParam param) {
    return noteService.search(param.getKeyword(), param.getStrategies());
  }
}

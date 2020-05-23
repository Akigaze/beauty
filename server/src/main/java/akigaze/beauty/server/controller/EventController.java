package akigaze.beauty.server.controller;

import akigaze.beauty.server.constant.enums.StrategyType;
import akigaze.beauty.server.model.dto.EventDTO;
import akigaze.beauty.server.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
  private final EventService eventService;

  @GetMapping("/search")
  public List<EventDTO> search(@RequestParam("k") String keyword, @RequestParam("s") List<StrategyType> strategies) {
    return eventService.search(keyword, strategies);
  }
}

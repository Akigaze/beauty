package akigaze.beauty.server.model.dto;

import akigaze.beauty.server.model.base.OutputConverter;
import akigaze.beauty.server.model.entity.Event;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventDTO implements OutputConverter<EventDTO, Event> {

  private Integer id;
  private String title;
}

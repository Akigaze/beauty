package akigaze.beauty.server.model.dto;

import akigaze.beauty.server.model.base.OutputConverter;
import akigaze.beauty.server.model.entity.Event;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventDTO implements OutputConverter<EventDTO, Event> {

  private Integer id;
  @JsonProperty("value")
  private String title;
}

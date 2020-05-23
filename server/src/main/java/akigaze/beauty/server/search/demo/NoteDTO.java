package akigaze.beauty.server.search.demo;

import akigaze.beauty.server.common.model.base.OutputConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteDTO implements OutputConverter<NoteDTO, Note> {
  private Integer id;

  @JsonProperty("value")
  private String note;

  @JsonIgnore
  private String author;
}

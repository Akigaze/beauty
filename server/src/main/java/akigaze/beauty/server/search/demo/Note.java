package akigaze.beauty.server.search.demo;

import akigaze.beauty.server.model.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "demo_notes")
public class Note extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "note", columnDefinition = "varchar(255) not null")
  private String note;

  @Column(name = "author", columnDefinition = "varchar(64)")
  private String author;
}



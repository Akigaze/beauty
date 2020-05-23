package akigaze.beauty.server.model.entity;

import akigaze.beauty.server.constant.enums.Category;
import akigaze.beauty.server.constant.enums.Status;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Event extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "title", columnDefinition = "varchar(255) not null")
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", columnDefinition = "char(20) default 'none'")
  private Category category;

  @Column(name = "start_time", columnDefinition = "timestamp")
  private Instant startTime;

  @Column(name = "end_time", columnDefinition = "timestamp")
  private Instant endTime;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", columnDefinition = "char(20) default 'created'")
  private Status status;

  @Column(name = "completed_time", columnDefinition = "timestamp")
  private Instant completedTime;

  @Override
  public void prePersist() {
    if (this.category == null) {
      this.category = Category.none;
    }
    if (this.status == null) {
      this.status = Status.created;
    }
    super.prePersist();
  }
}

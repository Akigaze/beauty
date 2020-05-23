package akigaze.beauty.server.model.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.Instant;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity {
  @Column(name = "deleted", columnDefinition = "bit not null default 0")
  private boolean deleted;

  @Column(name = "created_time", columnDefinition = "timestamp not null default current_timestamp")
  private Instant createdTime;

  @Column(name = "updated_time", columnDefinition = "timestamp not null default current_timestamp on update current_timestamp")
  private Instant updatedTime;

  @PrePersist
  public void prePersist() {
    Instant now = Instant.now();
    if (createdTime == null) {
      createdTime = now;
    }
    if (updatedTime == null) {
      updatedTime = now;
    }
  }

  @PreUpdate
  public void preUpdate() {
    updatedTime = Instant.now();
  }

  @PreRemove
  public void preRemove() {
    updatedTime = Instant.now();
  }
}

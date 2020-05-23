package akigaze.beauty.server.common.model.base;

import akigaze.beauty.server.common.util.BeanUtil;
import org.springframework.lang.NonNull;

public interface OutputConverter<D extends OutputConverter<D, E>, E> {
  @SuppressWarnings("unchecked")
  @NonNull
  default D convertFrom(E entity) {
    BeanUtil.updateProperties(entity, this);
    return (D) this;
  }

  default void updateBy(E entity) {

  }
}

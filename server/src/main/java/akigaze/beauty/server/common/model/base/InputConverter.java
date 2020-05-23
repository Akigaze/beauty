package akigaze.beauty.server.common.model.base;


import akigaze.beauty.server.common.util.BeanUtil;
import akigaze.beauty.server.common.util.ReflectionUtil;

import java.lang.reflect.ParameterizedType;
import java.util.Objects;

public interface InputConverter<E> {
  @SuppressWarnings("unchecked")
  default E convertTo() {
    ParameterizedType type = this.getParameterizedType();
    Objects.requireNonNull(type, "Could not fetch actual class because parameterized type id null");
    Class<E> clazz = (Class<E>) type.getActualTypeArguments()[0];
    return BeanUtil.transformFrom(this, clazz);
  }

  default void update(E entity) {

  }

  default ParameterizedType getParameterizedType() {
    return ReflectionUtil.getParameterizedType(InputConverter.class, this.getClass());
  }
}

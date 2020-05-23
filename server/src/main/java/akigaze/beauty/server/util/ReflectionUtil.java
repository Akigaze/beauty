package akigaze.beauty.server.util;

import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class ReflectionUtil {

  private ReflectionUtil() {
  }

  public static ParameterizedType getParameterizedType(@NonNull Class<?> interfaceType, Class<?> implementationType) {
    Assert.notNull(interfaceType, "Interface class should not be null");
    Assert.isTrue(interfaceType.isInterface(), "Interface class should be an interface");

    if (implementationType == null) {
      return null;
    }

    ParameterizedType type = ReflectionUtil.getParameterizedType(interfaceType, implementationType.getGenericInterfaces());
    if (type != null) {
      return type;
    }

    Class<?> superType = implementationType.getSuperclass();
    return ReflectionUtil.getParameterizedType(interfaceType, superType);
  }

  public static ParameterizedType getParameterizedType(Class<?> superType, Type... genericTypes) {
    Assert.notNull(superType, "Super class should not be null");

    for (Type genericType : genericTypes) {
      if (genericType instanceof ParameterizedType) {
        ParameterizedType parameterizedType = (ParameterizedType) genericType;
        if (parameterizedType.getRawType().getTypeName().equals(superType.getTypeName())) {
          return parameterizedType;
        }
      }
    }
    return null;
  }
}

package akigaze.beauty.server.common.util;


import akigaze.beauty.server.common.exception.BeanUtilException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.Set;

public class BeanUtil {

  private BeanUtil() {
  }

  public static <T> T transformFrom(Object source, @NonNull Class<T> clazz) {
    Assert.notNull(clazz, "target class should not be null");
    if (source == null) {
      return null;
    }
    try {
      T instance = clazz.newInstance();
      BeanUtils.copyProperties(source, instance, BeanUtil.getNullPropertyNames(source));
      return instance;
    } catch (IllegalAccessException | InstantiationException e) {
      throw new BeanUtilException("Fail to create " + clazz.getSimpleName() + " instance or copy properties", e);
    }

  }

  private static String[] getNullPropertyNames(@NonNull Object obj) {
    Assert.notNull(obj, "source object must not be null");
    return BeanUtil.getNullPropertyNameSet(obj).toArray(new String[0]);
  }

  @NonNull
  private static Set<String> getNullPropertyNameSet(@NonNull Object obj) {
    Assert.notNull(obj, "source object must not be null");
    BeanWrapperImpl wrapper = new BeanWrapperImpl(obj);
    PropertyDescriptor[] descriptors = wrapper.getPropertyDescriptors();
    Set<String> nullPropertyNameSet = new HashSet<>();
    for (PropertyDescriptor descriptor : descriptors) {
      String name = descriptor.getName();
      Object value = wrapper.getPropertyValue(name);
      if (value == null) {
        nullPropertyNameSet.add(name);
      }
    }
    return nullPropertyNameSet;
  }

  public static void updateProperties(@NonNull Object source, @NonNull Object target) {
    Assert.notNull(source, "source object must not be null");
    Assert.notNull(target, "target object must not be null");
    try {
      BeanUtils.copyProperties(source, target, getNullPropertyNames(source));
    } catch (Exception e) {
      throw new BeanUtilException("fail to copy properties", e);
    }
  }
}

package akigaze.beauty.server.search.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface SearchableRepository<T, ID> extends JpaRepository<T, ID> {
  List<T> findAllStartWithKeyword(String keyword);

  List<T> findAllStartWithKeywordIgnoreCase(String keyword);

  List<T> findAllMatchWord(String word);

  List<T> findAllMatchWordIgnoreCase(String word);

  List<T> findAllMatchRegex(String regex);

  List<T> findAllMatchRegexIgnoreCase(String regex);
}

package akigaze.beauty.server.repository;

import akigaze.beauty.server.model.entity.Event;
import akigaze.beauty.server.search.repository.SearchableRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends SearchableRepository<Event> {

  @Query(value = "select * from events where title like binary :keyword", nativeQuery = true)
  List<Event> findAllByTitleStartsWith(@Param("keyword") String keyword);

  @Query(value = "select * from events where title like :keyword", nativeQuery = true)
  List<Event> findAllByTitleStartsWithIgnoreCase(@Param("keyword") String keyword);

  @Query(value = "select * from events where title regexp binary :regex", nativeQuery = true)
  List<Event> findAllByTitleMatchesRegex(@Param("regex") String regex);

  @Query(value = "select * from events where title regexp :regex", nativeQuery = true)
  List<Event> findAllByTitleMatchesRegexIgnoreCase(@Param("regex") String regex);

  @Override
  default List<Event> findAllStartWithKeyword(String keyword) {
    return this.findAllByTitleStartsWith(keyword);
  }

  @Override
  default List<Event> findAllStartWithKeywordIgnoreCase(String keyword) {
    return this.findAllByTitleStartsWithIgnoreCase(keyword);
  }

  @Override
  default List<Event> findAllMatchWord(String word) {
    return this.findAllByTitleMatchesRegex(word);
  }

  @Override
  default List<Event> findAllMatchWordIgnoreCase(String word) {
    return this.findAllByTitleMatchesRegexIgnoreCase(word);
  }

  @Override
  default List<Event> findAllMatchRegex(String regex) {
    return this.findAllByTitleMatchesRegex(regex);
  }

  @Override
  default List<Event> findAllMatchRegexIgnoreCase(String regex) {
    return this.findAllByTitleMatchesRegexIgnoreCase(regex);
  }
}

package akigaze.beauty.server.search.demo;

import akigaze.beauty.server.search.repository.SearchableRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends SearchableRepository<Note, Integer> {

  @Query(value = "select * from demo_notes where note like binary :keyword", nativeQuery = true)
  List<Note> findAllByNoteStartsWith(@Param("keyword") String keyword);

  @Query(value = "select * from demo_notes where note like :keyword", nativeQuery = true)
  List<Note> findAllByNoteStartsWithIgnoreCase(@Param("keyword") String keyword);

  @Query(value = "select * from demo_notes where note regexp binary :regex", nativeQuery = true)
  List<Note> findAllByNoteMatchesRegex(@Param("regex") String regex);

  @Query(value = "select * from demo_notes where note regexp :regex", nativeQuery = true)
  List<Note> findAllByNoteMatchesRegexIgnoreCase(@Param("regex") String regex);

  @Override
  default List<Note> findAllStartWithKeyword(String keyword) {
    return this.findAllByNoteStartsWith(keyword);
  }

  @Override
  default List<Note> findAllStartWithKeywordIgnoreCase(String keyword) {
    return this.findAllByNoteStartsWithIgnoreCase(keyword);
  }

  @Override
  default List<Note> findAllMatchWord(String word) {
    return this.findAllByNoteMatchesRegex(word);
  }

  @Override
  default List<Note> findAllMatchWordIgnoreCase(String word) {
    return this.findAllByNoteMatchesRegexIgnoreCase(word);
  }

  @Override
  default List<Note> findAllMatchRegex(String regex) {
    return this.findAllByNoteMatchesRegex(regex);
  }

  @Override
  default List<Note> findAllMatchRegexIgnoreCase(String regex) {
    return this.findAllByNoteMatchesRegexIgnoreCase(regex);
  }
}

package com.kluksa.financije.repository;

import com.kluksa.financije.domain.Ledger;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ledger entity.
 */
@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    @Query(
        value = "select distinct ledger from Ledger ledger left join fetch ledger.tags",
        countQuery = "select count(distinct ledger) from Ledger ledger"
    )
    Page<Ledger> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct ledger from Ledger ledger left join fetch ledger.tags")
    List<Ledger> findAllWithEagerRelationships();

    @Query("select ledger from Ledger ledger left join fetch ledger.tags where ledger.id =:id")
    Optional<Ledger> findOneWithEagerRelationships(@Param("id") Long id);
}

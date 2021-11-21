package com.kluksa.financije.repository;

import com.kluksa.financije.domain.Accountt;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Accountt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccounttRepository extends JpaRepository<Accountt, Long> {
    @Query("select accountt from Accountt accountt where accountt.user.login = ?#{principal.username}")
    List<Accountt> findByUserIsCurrentUser();
}

package com.kluksa.financije.repository;

import com.kluksa.financije.domain.AccountType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountTypeRepository extends JpaRepository<AccountType, Long> {}

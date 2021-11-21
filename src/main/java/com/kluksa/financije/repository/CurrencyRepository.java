package com.kluksa.financije.repository;

import com.kluksa.financije.domain.Currency;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Currency entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {}

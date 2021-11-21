package com.kluksa.financije.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kluksa.financije.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccounttTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Accountt.class);
        Accountt accountt1 = new Accountt();
        accountt1.setId(1L);
        Accountt accountt2 = new Accountt();
        accountt2.setId(accountt1.getId());
        assertThat(accountt1).isEqualTo(accountt2);
        accountt2.setId(2L);
        assertThat(accountt1).isNotEqualTo(accountt2);
        accountt1.setId(null);
        assertThat(accountt1).isNotEqualTo(accountt2);
    }
}

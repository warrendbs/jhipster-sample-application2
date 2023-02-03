package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MSPDTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MSPD.class);
        MSPD mSPD1 = new MSPD();
        mSPD1.setId(1L);
        MSPD mSPD2 = new MSPD();
        mSPD2.setId(mSPD1.getId());
        assertThat(mSPD1).isEqualTo(mSPD2);
        mSPD2.setId(2L);
        assertThat(mSPD1).isNotEqualTo(mSPD2);
        mSPD1.setId(null);
        assertThat(mSPD1).isNotEqualTo(mSPD2);
    }
}

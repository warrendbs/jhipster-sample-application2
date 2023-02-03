package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.MSPD;
import com.mycompany.myapp.repository.MSPDRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MSPDResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MSPDResourceIT {

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_POSTAL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POSTAL_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_STATE_PROVINCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mspds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MSPDRepository mSPDRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMSPDMockMvc;

    private MSPD mSPD;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MSPD createEntity(EntityManager em) {
        MSPD mSPD = new MSPD()
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .postalCode(DEFAULT_POSTAL_CODE)
            .city(DEFAULT_CITY)
            .stateProvince(DEFAULT_STATE_PROVINCE);
        return mSPD;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MSPD createUpdatedEntity(EntityManager em) {
        MSPD mSPD = new MSPD()
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);
        return mSPD;
    }

    @BeforeEach
    public void initTest() {
        mSPD = createEntity(em);
    }

    @Test
    @Transactional
    void createMSPD() throws Exception {
        int databaseSizeBeforeCreate = mSPDRepository.findAll().size();
        // Create the MSPD
        restMSPDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mSPD)))
            .andExpect(status().isCreated());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeCreate + 1);
        MSPD testMSPD = mSPDList.get(mSPDList.size() - 1);
        assertThat(testMSPD.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testMSPD.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testMSPD.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testMSPD.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void createMSPDWithExistingId() throws Exception {
        // Create the MSPD with an existing ID
        mSPD.setId(1L);

        int databaseSizeBeforeCreate = mSPDRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMSPDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mSPD)))
            .andExpect(status().isBadRequest());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMSPDS() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        // Get all the mSPDList
        restMSPDMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mSPD.getId().intValue())))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].postalCode").value(hasItem(DEFAULT_POSTAL_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].stateProvince").value(hasItem(DEFAULT_STATE_PROVINCE)));
    }

    @Test
    @Transactional
    void getMSPD() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        // Get the mSPD
        restMSPDMockMvc
            .perform(get(ENTITY_API_URL_ID, mSPD.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mSPD.getId().intValue()))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.postalCode").value(DEFAULT_POSTAL_CODE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.stateProvince").value(DEFAULT_STATE_PROVINCE));
    }

    @Test
    @Transactional
    void getNonExistingMSPD() throws Exception {
        // Get the mSPD
        restMSPDMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMSPD() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();

        // Update the mSPD
        MSPD updatedMSPD = mSPDRepository.findById(mSPD.getId()).get();
        // Disconnect from session so that the updates on updatedMSPD are not directly saved in db
        em.detach(updatedMSPD);
        updatedMSPD
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restMSPDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMSPD.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMSPD))
            )
            .andExpect(status().isOk());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
        MSPD testMSPD = mSPDList.get(mSPDList.size() - 1);
        assertThat(testMSPD.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testMSPD.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testMSPD.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testMSPD.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void putNonExistingMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mSPD.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mSPD))
            )
            .andExpect(status().isBadRequest());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mSPD))
            )
            .andExpect(status().isBadRequest());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mSPD)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMSPDWithPatch() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();

        // Update the mSPD using partial update
        MSPD partialUpdatedMSPD = new MSPD();
        partialUpdatedMSPD.setId(mSPD.getId());

        partialUpdatedMSPD.streetAddress(UPDATED_STREET_ADDRESS);

        restMSPDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMSPD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMSPD))
            )
            .andExpect(status().isOk());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
        MSPD testMSPD = mSPDList.get(mSPDList.size() - 1);
        assertThat(testMSPD.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testMSPD.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testMSPD.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testMSPD.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void fullUpdateMSPDWithPatch() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();

        // Update the mSPD using partial update
        MSPD partialUpdatedMSPD = new MSPD();
        partialUpdatedMSPD.setId(mSPD.getId());

        partialUpdatedMSPD
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restMSPDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMSPD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMSPD))
            )
            .andExpect(status().isOk());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
        MSPD testMSPD = mSPDList.get(mSPDList.size() - 1);
        assertThat(testMSPD.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testMSPD.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testMSPD.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testMSPD.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void patchNonExistingMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mSPD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mSPD))
            )
            .andExpect(status().isBadRequest());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mSPD))
            )
            .andExpect(status().isBadRequest());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMSPD() throws Exception {
        int databaseSizeBeforeUpdate = mSPDRepository.findAll().size();
        mSPD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMSPDMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mSPD)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MSPD in the database
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMSPD() throws Exception {
        // Initialize the database
        mSPDRepository.saveAndFlush(mSPD);

        int databaseSizeBeforeDelete = mSPDRepository.findAll().size();

        // Delete the mSPD
        restMSPDMockMvc
            .perform(delete(ENTITY_API_URL_ID, mSPD.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MSPD> mSPDList = mSPDRepository.findAll();
        assertThat(mSPDList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

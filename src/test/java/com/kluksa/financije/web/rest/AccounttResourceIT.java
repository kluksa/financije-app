package com.kluksa.financije.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kluksa.financije.IntegrationTest;
import com.kluksa.financije.domain.Accountt;
import com.kluksa.financije.repository.AccounttRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link AccounttResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccounttResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/accountts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccounttRepository accounttRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccounttMockMvc;

    private Accountt accountt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accountt createEntity(EntityManager em) {
        Accountt accountt = new Accountt()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .creation(DEFAULT_CREATION)
            .active(DEFAULT_ACTIVE);
        return accountt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accountt createUpdatedEntity(EntityManager em) {
        Accountt accountt = new Accountt()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .creation(UPDATED_CREATION)
            .active(UPDATED_ACTIVE);
        return accountt;
    }

    @BeforeEach
    public void initTest() {
        accountt = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountt() throws Exception {
        int databaseSizeBeforeCreate = accounttRepository.findAll().size();
        // Create the Accountt
        restAccounttMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountt)))
            .andExpect(status().isCreated());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeCreate + 1);
        Accountt testAccountt = accounttList.get(accounttList.size() - 1);
        assertThat(testAccountt.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAccountt.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAccountt.getCreation()).isEqualTo(DEFAULT_CREATION);
        assertThat(testAccountt.getActive()).isEqualTo(DEFAULT_ACTIVE);
    }

    @Test
    @Transactional
    void createAccounttWithExistingId() throws Exception {
        // Create the Accountt with an existing ID
        accountt.setId(1L);

        int databaseSizeBeforeCreate = accounttRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccounttMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountt)))
            .andExpect(status().isBadRequest());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountts() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        // Get all the accounttList
        restAccounttMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountt.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getAccountt() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        // Get the accountt
        restAccounttMockMvc
            .perform(get(ENTITY_API_URL_ID, accountt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountt.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.creation").value(DEFAULT_CREATION.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAccountt() throws Exception {
        // Get the accountt
        restAccounttMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountt() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();

        // Update the accountt
        Accountt updatedAccountt = accounttRepository.findById(accountt.getId()).get();
        // Disconnect from session so that the updates on updatedAccountt are not directly saved in db
        em.detach(updatedAccountt);
        updatedAccountt.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).creation(UPDATED_CREATION).active(UPDATED_ACTIVE);

        restAccounttMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountt))
            )
            .andExpect(status().isOk());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
        Accountt testAccountt = accounttList.get(accounttList.size() - 1);
        assertThat(testAccountt.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountt.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAccountt.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testAccountt.getActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccounttWithPatch() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();

        // Update the accountt using partial update
        Accountt partialUpdatedAccountt = new Accountt();
        partialUpdatedAccountt.setId(accountt.getId());

        partialUpdatedAccountt.name(UPDATED_NAME).creation(UPDATED_CREATION).active(UPDATED_ACTIVE);

        restAccounttMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountt))
            )
            .andExpect(status().isOk());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
        Accountt testAccountt = accounttList.get(accounttList.size() - 1);
        assertThat(testAccountt.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountt.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAccountt.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testAccountt.getActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateAccounttWithPatch() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();

        // Update the accountt using partial update
        Accountt partialUpdatedAccountt = new Accountt();
        partialUpdatedAccountt.setId(accountt.getId());

        partialUpdatedAccountt.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).creation(UPDATED_CREATION).active(UPDATED_ACTIVE);

        restAccounttMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountt))
            )
            .andExpect(status().isOk());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
        Accountt testAccountt = accounttList.get(accounttList.size() - 1);
        assertThat(testAccountt.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountt.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAccountt.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testAccountt.getActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountt() throws Exception {
        int databaseSizeBeforeUpdate = accounttRepository.findAll().size();
        accountt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccounttMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(accountt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accountt in the database
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountt() throws Exception {
        // Initialize the database
        accounttRepository.saveAndFlush(accountt);

        int databaseSizeBeforeDelete = accounttRepository.findAll().size();

        // Delete the accountt
        restAccounttMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountt.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Accountt> accounttList = accounttRepository.findAll();
        assertThat(accounttList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

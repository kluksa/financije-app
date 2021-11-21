package com.kluksa.financije.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kluksa.financije.IntegrationTest;
import com.kluksa.financije.domain.AccountType;
import com.kluksa.financije.repository.AccountTypeRepository;
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
 * Integration tests for the {@link AccountTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountTypeRepository accountTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountTypeMockMvc;

    private AccountType accountType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountType createEntity(EntityManager em) {
        AccountType accountType = new AccountType().name(DEFAULT_NAME);
        return accountType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountType createUpdatedEntity(EntityManager em) {
        AccountType accountType = new AccountType().name(UPDATED_NAME);
        return accountType;
    }

    @BeforeEach
    public void initTest() {
        accountType = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountType() throws Exception {
        int databaseSizeBeforeCreate = accountTypeRepository.findAll().size();
        // Create the AccountType
        restAccountTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountType)))
            .andExpect(status().isCreated());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeCreate + 1);
        AccountType testAccountType = accountTypeList.get(accountTypeList.size() - 1);
        assertThat(testAccountType.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createAccountTypeWithExistingId() throws Exception {
        // Create the AccountType with an existing ID
        accountType.setId(1L);

        int databaseSizeBeforeCreate = accountTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountType)))
            .andExpect(status().isBadRequest());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountTypes() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        // Get all the accountTypeList
        restAccountTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getAccountType() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        // Get the accountType
        restAccountTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, accountType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingAccountType() throws Exception {
        // Get the accountType
        restAccountTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountType() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();

        // Update the accountType
        AccountType updatedAccountType = accountTypeRepository.findById(accountType.getId()).get();
        // Disconnect from session so that the updates on updatedAccountType are not directly saved in db
        em.detach(updatedAccountType);
        updatedAccountType.name(UPDATED_NAME);

        restAccountTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountType))
            )
            .andExpect(status().isOk());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
        AccountType testAccountType = accountTypeList.get(accountTypeList.size() - 1);
        assertThat(testAccountType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountTypeWithPatch() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();

        // Update the accountType using partial update
        AccountType partialUpdatedAccountType = new AccountType();
        partialUpdatedAccountType.setId(accountType.getId());

        restAccountTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountType))
            )
            .andExpect(status().isOk());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
        AccountType testAccountType = accountTypeList.get(accountTypeList.size() - 1);
        assertThat(testAccountType.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateAccountTypeWithPatch() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();

        // Update the accountType using partial update
        AccountType partialUpdatedAccountType = new AccountType();
        partialUpdatedAccountType.setId(accountType.getId());

        partialUpdatedAccountType.name(UPDATED_NAME);

        restAccountTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountType))
            )
            .andExpect(status().isOk());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
        AccountType testAccountType = accountTypeList.get(accountTypeList.size() - 1);
        assertThat(testAccountType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountType() throws Exception {
        int databaseSizeBeforeUpdate = accountTypeRepository.findAll().size();
        accountType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(accountType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountType in the database
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountType() throws Exception {
        // Initialize the database
        accountTypeRepository.saveAndFlush(accountType);

        int databaseSizeBeforeDelete = accountTypeRepository.findAll().size();

        // Delete the accountType
        restAccountTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountType> accountTypeList = accountTypeRepository.findAll();
        assertThat(accountTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

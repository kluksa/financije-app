package com.kluksa.financije.web.rest;

import static com.kluksa.financije.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kluksa.financije.IntegrationTest;
import com.kluksa.financije.domain.Ledger;
import com.kluksa.financije.repository.LedgerRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LedgerResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LedgerResourceIT {

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/ledgers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LedgerRepository ledgerRepository;

    @Mock
    private LedgerRepository ledgerRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLedgerMockMvc;

    private Ledger ledger;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ledger createEntity(EntityManager em) {
        Ledger ledger = new Ledger().timestamp(DEFAULT_TIMESTAMP).date(DEFAULT_DATE).amount(DEFAULT_AMOUNT);
        return ledger;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ledger createUpdatedEntity(EntityManager em) {
        Ledger ledger = new Ledger().timestamp(UPDATED_TIMESTAMP).date(UPDATED_DATE).amount(UPDATED_AMOUNT);
        return ledger;
    }

    @BeforeEach
    public void initTest() {
        ledger = createEntity(em);
    }

    @Test
    @Transactional
    void createLedger() throws Exception {
        int databaseSizeBeforeCreate = ledgerRepository.findAll().size();
        // Create the Ledger
        restLedgerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ledger)))
            .andExpect(status().isCreated());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeCreate + 1);
        Ledger testLedger = ledgerList.get(ledgerList.size() - 1);
        assertThat(testLedger.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testLedger.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testLedger.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void createLedgerWithExistingId() throws Exception {
        // Create the Ledger with an existing ID
        ledger.setId(1L);

        int databaseSizeBeforeCreate = ledgerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLedgerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ledger)))
            .andExpect(status().isBadRequest());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLedgers() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        // Get all the ledgerList
        restLedgerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ledger.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLedgersWithEagerRelationshipsIsEnabled() throws Exception {
        when(ledgerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLedgerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ledgerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLedgersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(ledgerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLedgerMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ledgerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getLedger() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        // Get the ledger
        restLedgerMockMvc
            .perform(get(ENTITY_API_URL_ID, ledger.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ledger.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingLedger() throws Exception {
        // Get the ledger
        restLedgerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLedger() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();

        // Update the ledger
        Ledger updatedLedger = ledgerRepository.findById(ledger.getId()).get();
        // Disconnect from session so that the updates on updatedLedger are not directly saved in db
        em.detach(updatedLedger);
        updatedLedger.timestamp(UPDATED_TIMESTAMP).date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restLedgerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLedger.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLedger))
            )
            .andExpect(status().isOk());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
        Ledger testLedger = ledgerList.get(ledgerList.size() - 1);
        assertThat(testLedger.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testLedger.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLedger.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ledger.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ledger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ledger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ledger)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLedgerWithPatch() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();

        // Update the ledger using partial update
        Ledger partialUpdatedLedger = new Ledger();
        partialUpdatedLedger.setId(ledger.getId());

        restLedgerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLedger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLedger))
            )
            .andExpect(status().isOk());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
        Ledger testLedger = ledgerList.get(ledgerList.size() - 1);
        assertThat(testLedger.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testLedger.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testLedger.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateLedgerWithPatch() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();

        // Update the ledger using partial update
        Ledger partialUpdatedLedger = new Ledger();
        partialUpdatedLedger.setId(ledger.getId());

        partialUpdatedLedger.timestamp(UPDATED_TIMESTAMP).date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restLedgerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLedger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLedger))
            )
            .andExpect(status().isOk());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
        Ledger testLedger = ledgerList.get(ledgerList.size() - 1);
        assertThat(testLedger.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testLedger.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLedger.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ledger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ledger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ledger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLedger() throws Exception {
        int databaseSizeBeforeUpdate = ledgerRepository.findAll().size();
        ledger.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLedgerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ledger)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ledger in the database
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLedger() throws Exception {
        // Initialize the database
        ledgerRepository.saveAndFlush(ledger);

        int databaseSizeBeforeDelete = ledgerRepository.findAll().size();

        // Delete the ledger
        restLedgerMockMvc
            .perform(delete(ENTITY_API_URL_ID, ledger.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ledger> ledgerList = ledgerRepository.findAll();
        assertThat(ledgerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

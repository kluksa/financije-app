package com.kluksa.financije.web.rest;

import com.kluksa.financije.domain.Ledger;
import com.kluksa.financije.repository.LedgerRepository;
import com.kluksa.financije.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.kluksa.financije.domain.Ledger}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LedgerResource {

    private final Logger log = LoggerFactory.getLogger(LedgerResource.class);

    private static final String ENTITY_NAME = "ledger";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LedgerRepository ledgerRepository;

    public LedgerResource(LedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    /**
     * {@code POST  /ledgers} : Create a new ledger.
     *
     * @param ledger the ledger to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ledger, or with status {@code 400 (Bad Request)} if the ledger has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ledgers")
    public ResponseEntity<Ledger> createLedger(@RequestBody Ledger ledger) throws URISyntaxException {
        log.debug("REST request to save Ledger : {}", ledger);
        if (ledger.getId() != null) {
            throw new BadRequestAlertException("A new ledger cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ledger result = ledgerRepository.save(ledger);
        return ResponseEntity
            .created(new URI("/api/ledgers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ledgers/:id} : Updates an existing ledger.
     *
     * @param id the id of the ledger to save.
     * @param ledger the ledger to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ledger,
     * or with status {@code 400 (Bad Request)} if the ledger is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ledger couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ledgers/{id}")
    public ResponseEntity<Ledger> updateLedger(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ledger ledger)
        throws URISyntaxException {
        log.debug("REST request to update Ledger : {}, {}", id, ledger);
        if (ledger.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ledger.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ledgerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ledger result = ledgerRepository.save(ledger);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ledger.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ledgers/:id} : Partial updates given fields of an existing ledger, field will ignore if it is null
     *
     * @param id the id of the ledger to save.
     * @param ledger the ledger to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ledger,
     * or with status {@code 400 (Bad Request)} if the ledger is not valid,
     * or with status {@code 404 (Not Found)} if the ledger is not found,
     * or with status {@code 500 (Internal Server Error)} if the ledger couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ledgers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ledger> partialUpdateLedger(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ledger ledger
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ledger partially : {}, {}", id, ledger);
        if (ledger.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ledger.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ledgerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ledger> result = ledgerRepository
            .findById(ledger.getId())
            .map(existingLedger -> {
                if (ledger.getTimestamp() != null) {
                    existingLedger.setTimestamp(ledger.getTimestamp());
                }
                if (ledger.getDate() != null) {
                    existingLedger.setDate(ledger.getDate());
                }
                if (ledger.getAmount() != null) {
                    existingLedger.setAmount(ledger.getAmount());
                }

                return existingLedger;
            })
            .map(ledgerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ledger.getId().toString())
        );
    }

    /**
     * {@code GET  /ledgers} : get all the ledgers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ledgers in body.
     */
    @GetMapping("/ledgers")
    public List<Ledger> getAllLedgers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Ledgers");
        return ledgerRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /ledgers/:id} : get the "id" ledger.
     *
     * @param id the id of the ledger to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ledger, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ledgers/{id}")
    public ResponseEntity<Ledger> getLedger(@PathVariable Long id) {
        log.debug("REST request to get Ledger : {}", id);
        Optional<Ledger> ledger = ledgerRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(ledger);
    }

    /**
     * {@code DELETE  /ledgers/:id} : delete the "id" ledger.
     *
     * @param id the id of the ledger to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ledgers/{id}")
    public ResponseEntity<Void> deleteLedger(@PathVariable Long id) {
        log.debug("REST request to delete Ledger : {}", id);
        ledgerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

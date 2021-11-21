package com.kluksa.financije.web.rest;

import com.kluksa.financije.domain.Accountt;
import com.kluksa.financije.repository.AccounttRepository;
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
 * REST controller for managing {@link com.kluksa.financije.domain.Accountt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccounttResource {

    private final Logger log = LoggerFactory.getLogger(AccounttResource.class);

    private static final String ENTITY_NAME = "accountt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccounttRepository accounttRepository;

    public AccounttResource(AccounttRepository accounttRepository) {
        this.accounttRepository = accounttRepository;
    }

    /**
     * {@code POST  /accountts} : Create a new accountt.
     *
     * @param accountt the accountt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountt, or with status {@code 400 (Bad Request)} if the accountt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/accountts")
    public ResponseEntity<Accountt> createAccountt(@RequestBody Accountt accountt) throws URISyntaxException {
        log.debug("REST request to save Accountt : {}", accountt);
        if (accountt.getId() != null) {
            throw new BadRequestAlertException("A new accountt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Accountt result = accounttRepository.save(accountt);
        return ResponseEntity
            .created(new URI("/api/accountts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /accountts/:id} : Updates an existing accountt.
     *
     * @param id the id of the accountt to save.
     * @param accountt the accountt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountt,
     * or with status {@code 400 (Bad Request)} if the accountt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/accountts/{id}")
    public ResponseEntity<Accountt> updateAccountt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Accountt accountt
    ) throws URISyntaxException {
        log.debug("REST request to update Accountt : {}, {}", id, accountt);
        if (accountt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accounttRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Accountt result = accounttRepository.save(accountt);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountt.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /accountts/:id} : Partial updates given fields of an existing accountt, field will ignore if it is null
     *
     * @param id the id of the accountt to save.
     * @param accountt the accountt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountt,
     * or with status {@code 400 (Bad Request)} if the accountt is not valid,
     * or with status {@code 404 (Not Found)} if the accountt is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/accountts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Accountt> partialUpdateAccountt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Accountt accountt
    ) throws URISyntaxException {
        log.debug("REST request to partial update Accountt partially : {}, {}", id, accountt);
        if (accountt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accounttRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Accountt> result = accounttRepository
            .findById(accountt.getId())
            .map(existingAccountt -> {
                if (accountt.getName() != null) {
                    existingAccountt.setName(accountt.getName());
                }
                if (accountt.getDescription() != null) {
                    existingAccountt.setDescription(accountt.getDescription());
                }
                if (accountt.getCreation() != null) {
                    existingAccountt.setCreation(accountt.getCreation());
                }
                if (accountt.getActive() != null) {
                    existingAccountt.setActive(accountt.getActive());
                }

                return existingAccountt;
            })
            .map(accounttRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountt.getId().toString())
        );
    }

    /**
     * {@code GET  /accountts} : get all the accountts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountts in body.
     */
    @GetMapping("/accountts")
    public List<Accountt> getAllAccountts() {
        log.debug("REST request to get all Accountts");
        return accounttRepository.findAll();
    }

    /**
     * {@code GET  /accountts/:id} : get the "id" accountt.
     *
     * @param id the id of the accountt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/accountts/{id}")
    public ResponseEntity<Accountt> getAccountt(@PathVariable Long id) {
        log.debug("REST request to get Accountt : {}", id);
        Optional<Accountt> accountt = accounttRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountt);
    }

    /**
     * {@code DELETE  /accountts/:id} : delete the "id" accountt.
     *
     * @param id the id of the accountt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/accountts/{id}")
    public ResponseEntity<Void> deleteAccountt(@PathVariable Long id) {
        log.debug("REST request to delete Accountt : {}", id);
        accounttRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

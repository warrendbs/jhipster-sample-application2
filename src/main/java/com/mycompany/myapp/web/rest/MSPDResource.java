package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.MSPD;
import com.mycompany.myapp.repository.MSPDRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.MSPD}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MSPDResource {

    private final Logger log = LoggerFactory.getLogger(MSPDResource.class);

    private static final String ENTITY_NAME = "jhipsterSampleApplication2Mspd";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MSPDRepository mSPDRepository;

    public MSPDResource(MSPDRepository mSPDRepository) {
        this.mSPDRepository = mSPDRepository;
    }

    /**
     * {@code POST  /mspds} : Create a new mSPD.
     *
     * @param mSPD the mSPD to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mSPD, or with status {@code 400 (Bad Request)} if the mSPD has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mspds")
    public ResponseEntity<MSPD> createMSPD(@RequestBody MSPD mSPD) throws URISyntaxException {
        log.debug("REST request to save MSPD : {}", mSPD);
        if (mSPD.getId() != null) {
            throw new BadRequestAlertException("A new mSPD cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MSPD result = mSPDRepository.save(mSPD);
        return ResponseEntity
            .created(new URI("/api/mspds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mspds/:id} : Updates an existing mSPD.
     *
     * @param id the id of the mSPD to save.
     * @param mSPD the mSPD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mSPD,
     * or with status {@code 400 (Bad Request)} if the mSPD is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mSPD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mspds/{id}")
    public ResponseEntity<MSPD> updateMSPD(@PathVariable(value = "id", required = false) final Long id, @RequestBody MSPD mSPD)
        throws URISyntaxException {
        log.debug("REST request to update MSPD : {}, {}", id, mSPD);
        if (mSPD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mSPD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mSPDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MSPD result = mSPDRepository.save(mSPD);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mSPD.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mspds/:id} : Partial updates given fields of an existing mSPD, field will ignore if it is null
     *
     * @param id the id of the mSPD to save.
     * @param mSPD the mSPD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mSPD,
     * or with status {@code 400 (Bad Request)} if the mSPD is not valid,
     * or with status {@code 404 (Not Found)} if the mSPD is not found,
     * or with status {@code 500 (Internal Server Error)} if the mSPD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mspds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MSPD> partialUpdateMSPD(@PathVariable(value = "id", required = false) final Long id, @RequestBody MSPD mSPD)
        throws URISyntaxException {
        log.debug("REST request to partial update MSPD partially : {}, {}", id, mSPD);
        if (mSPD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mSPD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mSPDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MSPD> result = mSPDRepository
            .findById(mSPD.getId())
            .map(existingMSPD -> {
                if (mSPD.getStreetAddress() != null) {
                    existingMSPD.setStreetAddress(mSPD.getStreetAddress());
                }
                if (mSPD.getPostalCode() != null) {
                    existingMSPD.setPostalCode(mSPD.getPostalCode());
                }
                if (mSPD.getCity() != null) {
                    existingMSPD.setCity(mSPD.getCity());
                }
                if (mSPD.getStateProvince() != null) {
                    existingMSPD.setStateProvince(mSPD.getStateProvince());
                }

                return existingMSPD;
            })
            .map(mSPDRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mSPD.getId().toString())
        );
    }

    /**
     * {@code GET  /mspds} : get all the mSPDS.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mSPDS in body.
     */
    @GetMapping("/mspds")
    public ResponseEntity<List<MSPD>> getAllMSPDS(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of MSPDS");
        Page<MSPD> page = mSPDRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /mspds/:id} : get the "id" mSPD.
     *
     * @param id the id of the mSPD to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mSPD, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mspds/{id}")
    public ResponseEntity<MSPD> getMSPD(@PathVariable Long id) {
        log.debug("REST request to get MSPD : {}", id);
        Optional<MSPD> mSPD = mSPDRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mSPD);
    }

    /**
     * {@code DELETE  /mspds/:id} : delete the "id" mSPD.
     *
     * @param id the id of the mSPD to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mspds/{id}")
    public ResponseEntity<Void> deleteMSPD(@PathVariable Long id) {
        log.debug("REST request to delete MSPD : {}", id);
        mSPDRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

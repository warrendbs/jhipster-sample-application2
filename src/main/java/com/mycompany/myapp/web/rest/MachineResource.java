package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Machine;
import com.mycompany.myapp.repository.MachineRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Machine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MachineResource {

    private final Logger log = LoggerFactory.getLogger(MachineResource.class);

    private static final String ENTITY_NAME = "jhipsterSampleApplication2Machine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MachineRepository machineRepository;

    public MachineResource(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    /**
     * {@code POST  /machines} : Create a new machine.
     *
     * @param machine the machine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new machine, or with status {@code 400 (Bad Request)} if the machine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/machines")
    public ResponseEntity<Machine> createMachine(@RequestBody Machine machine) throws URISyntaxException {
        log.debug("REST request to save Machine : {}", machine);
        if (machine.getId() != null) {
            throw new BadRequestAlertException("A new machine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Machine result = machineRepository.save(machine);
        return ResponseEntity
            .created(new URI("/api/machines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /machines/:id} : Updates an existing machine.
     *
     * @param id the id of the machine to save.
     * @param machine the machine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated machine,
     * or with status {@code 400 (Bad Request)} if the machine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the machine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/machines/{id}")
    public ResponseEntity<Machine> updateMachine(@PathVariable(value = "id", required = false) final Long id, @RequestBody Machine machine)
        throws URISyntaxException {
        log.debug("REST request to update Machine : {}, {}", id, machine);
        if (machine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, machine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!machineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Machine result = machine;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, machine.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /machines/:id} : Partial updates given fields of an existing machine, field will ignore if it is null
     *
     * @param id the id of the machine to save.
     * @param machine the machine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated machine,
     * or with status {@code 400 (Bad Request)} if the machine is not valid,
     * or with status {@code 404 (Not Found)} if the machine is not found,
     * or with status {@code 500 (Internal Server Error)} if the machine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/machines/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Machine> partialUpdateMachine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Machine machine
    ) throws URISyntaxException {
        log.debug("REST request to partial update Machine partially : {}, {}", id, machine);
        if (machine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, machine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!machineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Machine> result = machineRepository
            .findById(machine.getId())
            .map(existingMachine -> {
                return existingMachine;
            })// .map(machineRepository::save)
        ;

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, machine.getId().toString())
        );
    }

    /**
     * {@code GET  /machines} : get all the machines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of machines in body.
     */
    @GetMapping("/machines")
    public List<Machine> getAllMachines() {
        log.debug("REST request to get all Machines");
        return machineRepository.findAll();
    }

    /**
     * {@code GET  /machines/:id} : get the "id" machine.
     *
     * @param id the id of the machine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the machine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/machines/{id}")
    public ResponseEntity<Machine> getMachine(@PathVariable Long id) {
        log.debug("REST request to get Machine : {}", id);
        Optional<Machine> machine = machineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(machine);
    }

    /**
     * {@code DELETE  /machines/:id} : delete the "id" machine.
     *
     * @param id the id of the machine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/machines/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        log.debug("REST request to delete Machine : {}", id);
        machineRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

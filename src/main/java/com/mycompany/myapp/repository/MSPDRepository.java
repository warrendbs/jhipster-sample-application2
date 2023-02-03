package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.MSPD;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MSPD entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MSPDRepository extends JpaRepository<MSPD, Long> {}

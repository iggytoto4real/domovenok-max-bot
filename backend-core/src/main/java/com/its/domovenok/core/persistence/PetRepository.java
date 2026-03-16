package com.its.domovenok.core.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<PetEntity, Long> {

    Optional<PetEntity> findByUserId(Long userId);
}

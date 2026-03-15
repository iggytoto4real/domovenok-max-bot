package com.its.domovenok.core.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<PetEntity, Long> {

    List<PetEntity> findAllByUserIdOrderByIdAsc(Long userId);
}

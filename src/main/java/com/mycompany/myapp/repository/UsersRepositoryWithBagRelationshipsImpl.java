package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Users;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class UsersRepositoryWithBagRelationshipsImpl implements UsersRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Users> fetchBagRelationships(Optional<Users> users) {
        return users.map(this::fetchMachines);
    }

    @Override
    public Page<Users> fetchBagRelationships(Page<Users> users) {
        return new PageImpl<>(fetchBagRelationships(users.getContent()), users.getPageable(), users.getTotalElements());
    }

    @Override
    public List<Users> fetchBagRelationships(List<Users> users) {
        return Optional.of(users).map(this::fetchMachines).orElse(Collections.emptyList());
    }

    Users fetchMachines(Users result) {
        return entityManager
            .createQuery("select users from Users users left join fetch users.machines where users is :users", Users.class)
            .setParameter("users", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Users> fetchMachines(List<Users> users) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, users.size()).forEach(index -> order.put(users.get(index).getId(), index));
        List<Users> result = entityManager
            .createQuery("select distinct users from Users users left join fetch users.machines where users in :users", Users.class)
            .setParameter("users", users)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}

package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Machine.
 */
@Entity
@Table(name = "machine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Machine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "machine")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "machine" }, allowSetters = true)
    private Set<MSPD> mSPDS = new HashSet<>();

    @ManyToMany(mappedBy = "machines")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "machines" }, allowSetters = true)
    private Set<Users> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Machine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<MSPD> getMSPDS() {
        return this.mSPDS;
    }

    public void setMSPDS(Set<MSPD> mSPDS) {
        if (this.mSPDS != null) {
            this.mSPDS.forEach(i -> i.setMachine(null));
        }
        if (mSPDS != null) {
            mSPDS.forEach(i -> i.setMachine(this));
        }
        this.mSPDS = mSPDS;
    }

    public Machine mSPDS(Set<MSPD> mSPDS) {
        this.setMSPDS(mSPDS);
        return this;
    }

    public Machine addMSPD(MSPD mSPD) {
        this.mSPDS.add(mSPD);
        mSPD.setMachine(this);
        return this;
    }

    public Machine removeMSPD(MSPD mSPD) {
        this.mSPDS.remove(mSPD);
        mSPD.setMachine(null);
        return this;
    }

    public Set<Users> getUsers() {
        return this.users;
    }

    public void setUsers(Set<Users> users) {
        if (this.users != null) {
            this.users.forEach(i -> i.removeMachine(this));
        }
        if (users != null) {
            users.forEach(i -> i.addMachine(this));
        }
        this.users = users;
    }

    public Machine users(Set<Users> users) {
        this.setUsers(users);
        return this;
    }

    public Machine addUsers(Users users) {
        this.users.add(users);
        users.getMachines().add(this);
        return this;
    }

    public Machine removeUsers(Users users) {
        this.users.remove(users);
        users.getMachines().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Machine)) {
            return false;
        }
        return id != null && id.equals(((Machine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Machine{" +
            "id=" + getId() +
            "}";
    }
}

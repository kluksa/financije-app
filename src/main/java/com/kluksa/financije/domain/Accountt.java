package com.kluksa.financije.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Accountt.
 */
@Entity
@Table(name = "accountt")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Accountt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "creation")
    private LocalDate creation;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    private User user;

    @ManyToOne
    private Currency currency;

    @ManyToOne
    private AccountType type;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Accountt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Accountt name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Accountt description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getCreation() {
        return this.creation;
    }

    public Accountt creation(LocalDate creation) {
        this.setCreation(creation);
        return this;
    }

    public void setCreation(LocalDate creation) {
        this.creation = creation;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Accountt active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Accountt user(User user) {
        this.setUser(user);
        return this;
    }

    public Currency getCurrency() {
        return this.currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Accountt currency(Currency currency) {
        this.setCurrency(currency);
        return this;
    }

    public AccountType getType() {
        return this.type;
    }

    public void setType(AccountType accountType) {
        this.type = accountType;
    }

    public Accountt type(AccountType accountType) {
        this.setType(accountType);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Accountt)) {
            return false;
        }
        return id != null && id.equals(((Accountt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Accountt{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", creation='" + getCreation() + "'" +
            ", active='" + getActive() + "'" +
            "}";
    }
}

package com.kluksa.financije.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ledger.
 */
@Entity
@Table(name = "ledger")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ledger implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "amount", precision = 21, scale = 2)
    private BigDecimal amount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "currency", "type" }, allowSetters = true)
    private Accountt creditor;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "currency", "type" }, allowSetters = true)
    private Accountt debitor;

    @ManyToMany
    @JoinTable(name = "rel_ledger__tag", joinColumns = @JoinColumn(name = "ledger_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ledgers" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ledger id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Ledger timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Ledger date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public Ledger amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Accountt getCreditor() {
        return this.creditor;
    }

    public void setCreditor(Accountt accountt) {
        this.creditor = accountt;
    }

    public Ledger creditor(Accountt accountt) {
        this.setCreditor(accountt);
        return this;
    }

    public Accountt getDebitor() {
        return this.debitor;
    }

    public void setDebitor(Accountt accountt) {
        this.debitor = accountt;
    }

    public Ledger debitor(Accountt accountt) {
        this.setDebitor(accountt);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Ledger tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Ledger addTag(Tag tag) {
        this.tags.add(tag);
        tag.getLedgers().add(this);
        return this;
    }

    public Ledger removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getLedgers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ledger)) {
            return false;
        }
        return id != null && id.equals(((Ledger) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ledger{" +
            "id=" + getId() +
            ", timestamp='" + getTimestamp() + "'" +
            ", date='" + getDate() + "'" +
            ", amount=" + getAmount() +
            "}";
    }
}

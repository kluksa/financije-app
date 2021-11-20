package com.kluksa.financije;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.kluksa.financije");

        noClasses()
            .that()
            .resideInAnyPackage("com.kluksa.financije.service..")
            .or()
            .resideInAnyPackage("com.kluksa.financije.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.kluksa.financije.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}

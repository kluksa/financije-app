package com.kluksa.financije.cucumber;

import com.kluksa.financije.FinancijeApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = FinancijeApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}

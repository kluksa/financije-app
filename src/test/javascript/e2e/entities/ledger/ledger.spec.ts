import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LedgerComponentsPage, LedgerDeleteDialog, LedgerUpdatePage } from './ledger.page-object';

const expect = chai.expect;

describe('Ledger e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ledgerComponentsPage: LedgerComponentsPage;
  let ledgerUpdatePage: LedgerUpdatePage;
  let ledgerDeleteDialog: LedgerDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Ledgers', async () => {
    await navBarPage.goToEntity('ledger');
    ledgerComponentsPage = new LedgerComponentsPage();
    await browser.wait(ec.visibilityOf(ledgerComponentsPage.title), 5000);
    expect(await ledgerComponentsPage.getTitle()).to.eq('financijeApp.ledger.home.title');
    await browser.wait(ec.or(ec.visibilityOf(ledgerComponentsPage.entities), ec.visibilityOf(ledgerComponentsPage.noResult)), 1000);
  });

  it('should load create Ledger page', async () => {
    await ledgerComponentsPage.clickOnCreateButton();
    ledgerUpdatePage = new LedgerUpdatePage();
    expect(await ledgerUpdatePage.getPageTitle()).to.eq('financijeApp.ledger.home.createOrEditLabel');
    await ledgerUpdatePage.cancel();
  });

  it('should create and save Ledgers', async () => {
    const nbButtonsBeforeCreate = await ledgerComponentsPage.countDeleteButtons();

    await ledgerComponentsPage.clickOnCreateButton();

    await promise.all([
      ledgerUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      ledgerUpdatePage.setDateInput('2000-12-31'),
      ledgerUpdatePage.setAmountInput('5'),
      ledgerUpdatePage.creditorSelectLastOption(),
      ledgerUpdatePage.debitorSelectLastOption(),
      // ledgerUpdatePage.tagSelectLastOption(),
    ]);

    await ledgerUpdatePage.save();
    expect(await ledgerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await ledgerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Ledger', async () => {
    const nbButtonsBeforeDelete = await ledgerComponentsPage.countDeleteButtons();
    await ledgerComponentsPage.clickOnLastDeleteButton();

    ledgerDeleteDialog = new LedgerDeleteDialog();
    expect(await ledgerDeleteDialog.getDialogTitle()).to.eq('financijeApp.ledger.delete.question');
    await ledgerDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(ledgerComponentsPage.title), 5000);

    expect(await ledgerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

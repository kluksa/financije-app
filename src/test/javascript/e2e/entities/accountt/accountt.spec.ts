import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AccounttComponentsPage, AccounttDeleteDialog, AccounttUpdatePage } from './accountt.page-object';

const expect = chai.expect;

describe('Accountt e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let accounttComponentsPage: AccounttComponentsPage;
  let accounttUpdatePage: AccounttUpdatePage;
  let accounttDeleteDialog: AccounttDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Accountts', async () => {
    await navBarPage.goToEntity('accountt');
    accounttComponentsPage = new AccounttComponentsPage();
    await browser.wait(ec.visibilityOf(accounttComponentsPage.title), 5000);
    expect(await accounttComponentsPage.getTitle()).to.eq('financijeApp.accountt.home.title');
    await browser.wait(ec.or(ec.visibilityOf(accounttComponentsPage.entities), ec.visibilityOf(accounttComponentsPage.noResult)), 1000);
  });

  it('should load create Accountt page', async () => {
    await accounttComponentsPage.clickOnCreateButton();
    accounttUpdatePage = new AccounttUpdatePage();
    expect(await accounttUpdatePage.getPageTitle()).to.eq('financijeApp.accountt.home.createOrEditLabel');
    await accounttUpdatePage.cancel();
  });

  it('should create and save Accountts', async () => {
    const nbButtonsBeforeCreate = await accounttComponentsPage.countDeleteButtons();

    await accounttComponentsPage.clickOnCreateButton();

    await promise.all([
      accounttUpdatePage.setNameInput('name'),
      accounttUpdatePage.setDescriptionInput('description'),
      accounttUpdatePage.setCreationInput('2000-12-31'),
      accounttUpdatePage.getActiveInput().click(),
      accounttUpdatePage.userSelectLastOption(),
      accounttUpdatePage.currencySelectLastOption(),
      accounttUpdatePage.typeSelectLastOption(),
    ]);

    await accounttUpdatePage.save();
    expect(await accounttUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await accounttComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Accountt', async () => {
    const nbButtonsBeforeDelete = await accounttComponentsPage.countDeleteButtons();
    await accounttComponentsPage.clickOnLastDeleteButton();

    accounttDeleteDialog = new AccounttDeleteDialog();
    expect(await accounttDeleteDialog.getDialogTitle()).to.eq('financijeApp.accountt.delete.question');
    await accounttDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(accounttComponentsPage.title), 5000);

    expect(await accounttComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

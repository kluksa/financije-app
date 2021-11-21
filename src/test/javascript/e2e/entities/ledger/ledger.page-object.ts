import { element, by, ElementFinder } from 'protractor';

export class LedgerComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ledger div table .btn-danger'));
  title = element.all(by.css('jhi-ledger div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class LedgerUpdatePage {
  pageTitle = element(by.id('jhi-ledger-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  timestampInput = element(by.id('field_timestamp'));
  dateInput = element(by.id('field_date'));
  amountInput = element(by.id('field_amount'));

  creditorSelect = element(by.id('field_creditor'));
  debitorSelect = element(by.id('field_debitor'));
  tagSelect = element(by.id('field_tag'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTimestampInput(timestamp: string): Promise<void> {
    await this.timestampInput.sendKeys(timestamp);
  }

  async getTimestampInput(): Promise<string> {
    return await this.timestampInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getAttribute('value');
  }

  async creditorSelectLastOption(): Promise<void> {
    await this.creditorSelect.all(by.tagName('option')).last().click();
  }

  async creditorSelectOption(option: string): Promise<void> {
    await this.creditorSelect.sendKeys(option);
  }

  getCreditorSelect(): ElementFinder {
    return this.creditorSelect;
  }

  async getCreditorSelectedOption(): Promise<string> {
    return await this.creditorSelect.element(by.css('option:checked')).getText();
  }

  async debitorSelectLastOption(): Promise<void> {
    await this.debitorSelect.all(by.tagName('option')).last().click();
  }

  async debitorSelectOption(option: string): Promise<void> {
    await this.debitorSelect.sendKeys(option);
  }

  getDebitorSelect(): ElementFinder {
    return this.debitorSelect;
  }

  async getDebitorSelectedOption(): Promise<string> {
    return await this.debitorSelect.element(by.css('option:checked')).getText();
  }

  async tagSelectLastOption(): Promise<void> {
    await this.tagSelect.all(by.tagName('option')).last().click();
  }

  async tagSelectOption(option: string): Promise<void> {
    await this.tagSelect.sendKeys(option);
  }

  getTagSelect(): ElementFinder {
    return this.tagSelect;
  }

  async getTagSelectedOption(): Promise<string> {
    return await this.tagSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class LedgerDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ledger-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ledger'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Dialog} from './dialog';

@inject(DialogService)
export class App {
  constructor (dialogService) {
    this.dialogService = dialogService;
    this.message = 'Hello World!';
  }

  openDialog () {
      this.dialogService.open({
          viewModel: Dialog
      });
  }
}

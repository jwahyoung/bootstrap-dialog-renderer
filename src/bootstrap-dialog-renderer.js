import 'bootstrap'
import {inject, TemplatingEngine} from 'aurelia-framework';

@inject(TemplatingEngine)
export class BootstrapDialogRenderer {
	constructor (templatingEngine) {
        this.templatingEngine = templatingEngine;
		this.dialogs = [];
	}

	getDialogContainer () {
        return document.createElement('template');
	}

	showDialog (dialogController) {
		if (!dialogController.showDialog) {
			return this.createDialogHost(dialogController)
				.then(() => {
					return dialogController.showDialog();
				});
		}

		return dialogController.showDialog();
	}

	hideDialog (dialogController) {
		return dialogController.hideDialog();
	}
}

BootstrapDialogRenderer.prototype.createDialogHost = function (dialogController) {
	var options = Object.assign(dialogController.settings, {
		show: false,
	});

    var element = createDOMNodes(document.createElement('div'));
    var childrenArray = [];
    [].push.apply(childrenArray, dialogController.slot.anchor.children);

    Array.from(dialogController.slot.anchor.children).forEach((child) => {
        element.querySelector('bootstrap-dialog')
            .appendChild(child);
    });

    var view = this.templatingEngine.enhance({
        element: element,
        bindingContext: dialogController.viewModel,
		container: dialogController.view.container
    });

	var dialog = $(element).modal(options);

    $('.modal-dialog:first', dialog).addClass(options.className);

	dialogController.showDialog = () => {
		return new Promise((resolve, reject) => {
			var underlyingModals = $(document.body).children('.modal');

			$(element).on('hidden.bs.modal', () => {
				dialogController.hideDialog();
			});

			$(element).off('shown.bs.modal', () => {
				$(element).off('shown.bs.modal');
				resolve();
			});

			dialogController.slot.attached();

			if (underlyingModals.length) {
				underlyingModals.last().after(element);
			} else {
				document.body.insertBefore(element, document.body.firstChild);
			}

			this.dialogs.push(dialog);
			dialog.modal('show');
		});
	};

	dialogController.hideDialog = () => {
		$(element).off('hidden.bs.modal');

		var dialog = this.dialogs.pop(); // Might need to do a seek and splice here.
		dialog.modal('hide');
		dialogController.slot.detached();
		dialog.get(0).remove();

		return Promise.resolve();
	};

    return Promise.resolve();
}

function createDOMNodes (element) {
	var modalHTML = `<div class="modal fade"><bootstrap-dialog></bootstrap-dialog></div>`;

	element.innerHTML = modalHTML;
	return element.firstChild;
}

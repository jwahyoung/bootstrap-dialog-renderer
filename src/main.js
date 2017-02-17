import environment from './environment';
import {BootstrapDialogRenderer} from './bootstrap-dialog-renderer';

//Configure Bluebird Promises.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use.globalResources(['./bootstrap-dialog.html']);

  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.use.plugin('aurelia-dialog', (config) => {
      config.useRenderer(BootstrapDialogRenderer);
  });

  aurelia.start().then(() => aurelia.setRoot());
}

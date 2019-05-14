// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

const settings = new Store({ name: 'settings' });

export { settings };

// @title Metabase Login Code
// @description Automatically logs into the Metabase platform to retrieve invoices, for example.
// @param {any} username
// @param {any} password

await $loginRemember({
  loginUrl: 'https://store.metabase.com/login',
  loginRecipe: async () => {
      await $clickElement('button[type=button]', { textMatch: 'with password' });
      await $fillInput('input[name=email]', username);
      await $fillInput('input[name=password]', password);
      await $clickElement('button[type=submit]', { textMatch: 'Log' });
  },
  loggedUrl: 'https://store.metabase.com/account/manage/billing',
  loggedMarkerCondition: {
      selector: 'a[href="/account/manage"]',
      textMatch: 'ogged',
      textFilter: 'contains',
      operator: 'exists',
  },
});
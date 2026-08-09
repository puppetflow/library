// @title Metabase Login Code
// @description Automatically logs into the Metabase platform to retrieve invoices, for example.
// @param {any} username
// @param {any} password

await $loginRemember({
  loginUrl: 'https://store.metabase.com',
  loginRecipe: async () => {
      await $clickElement('button[type=button]');
      await $fillInput('input[name=email]', email);
      await $clickElement('button[type=submit]');
      await $fillInput('input[name=password]', password);
      await $clickElement('button[type=submit]');
  },
  loggedUrl: 'https://store.metabase.com/account/manage/billing',
  loggedMarkerCondition: async () => {
      const spans = Array.from(document.querySelectorAll('a[href="/account/manage"]'));
      return spans.some(span => span.textContent && span.textContent.trim().indexOf('ogged') > 0);
  },
});
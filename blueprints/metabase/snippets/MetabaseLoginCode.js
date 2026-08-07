// @title Login Metabase Code
// @description Automatically logs into the Metabase platform to retrieve invoices, for example.
// @param {any} username
// @param {any} password

await $loginRemember({
  loginUrl: 'https://store.metabase.com',
  loginRecipe: async () => {
      await $buttonClick('button[type=button]');
      await $fillInput('input[name=email]', email);
      await $buttonClick('button[type=submit]');
      await $fillInput('input[name=password]', password);
      await $buttonClick('button[type=submit]');
  },
  loggedUrl: 'https://store.metabase.com/account/manage/billing',
  loggedMarkerCondition: async () => {
      const spans = Array.from(document.querySelectorAll('a[href="/account/manage"]'));
      return spans.some(span => span.textContent && span.textContent.trim().indexOf('ogged') > 0);
  },
});
// @title Metabase Get Invoices Flow
// @description Get the invoice for the previous month from Metabase.
// @input username [string]
// @input password [string]
// @input monthLabels [array]: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
async function run($page, $input) {
  if (
      !Array.isArray($input.monthLabels) ||
      $input.monthLabels.length !== 12 ||
      $input.monthLabels.some(monthLabel => typeof monthLabel !== 'string' || !monthLabel.trim())
  ) {
      return $generateResponseError('monthLabels must contain the 12 month labels in calendar order');
  }

  const monthMap = Object.fromEntries(
      $input.monthLabels.map((monthLabel, index) => [
          monthLabel.trim().toLowerCase(),
          index + 1,
      ])
  );

  await $$metabase_MetabaseLogin($input.username, $input.password);

  async function findLinkByMonthAndYear(page, monthIndex, yearInt) {
      const rows = await page.$$('tbody > tr');
      
      for (const row of rows) {
          const tds = await row.$$('td');
          if (tds.length < 2) continue;
          
          const dateText = await (await tds[0].getProperty('innerText')).jsonValue();
          const match = dateText.trim().match(/^[a-zéû]+\s+(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);
          if (!match) continue;
          
          const [whole, day, monthTranslated, year] = match;
          const month = monthMap[monthTranslated.toLowerCase()];
          
          if (month === monthIndex && parseInt(year) === yearInt) {
              const link = await tds[3].$('a');
              return link;
          }
      }
      
      return null;
  }

  await $goto('https://store.metabase.com/account/manage/billing', { waitUntil: 'domcontentloaded' });
  const { year, month } = $currentDateMinusOneMonth();
  await $meta({ month, year });
  await $legend('Invoice for ' + year + '-' + month);
  await $clickElement('#mantine-r5-control-invoices-' + year);

  const link = await findLinkByMonthAndYear($page, parseInt(month), parseInt(year));

  if (!link) {
      return $generateResponseError('No invoice link found');
  }

  const href = await $page.evaluate(anchor => anchor.getAttribute('href'), link);
  await $goto(href);
  await $clickElementAtIndex('button[type=button]', 1);
  await $sleep(3000);
  await $waitForFile();

  return $generateResponseSuccess('Flow completed', {
      month,
      year,
  });
}
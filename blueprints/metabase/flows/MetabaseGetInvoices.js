// @title Metabase Get Invoices Flow
// @description Get the invoices for the current month and year from Metabase.
// @input username [string]
// @input password [string]
async function run($page, $input) {    
  await $$loginMetabase($input.username, $input.password);
  
  async function findLinkByMonthAndYear(page, monthIndex, yearInt) {
      const monthMap = {
          january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
          july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
      };
      
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
  await $meta({month, year});
  await $legend('Facture du ' + year + '-' + month);
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
      my_custom_data: 'hello',
  });
}
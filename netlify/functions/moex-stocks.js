// ============================================================================
// NETLIFY FUNCTION: MOEX STOCKS PROXY
// ============================================================================
//
// Эта serverless функция проксирует запросы к MOEX ISS API для получения
// котировок российских акций. Решает проблему CORS для браузерных приложений.
//
// Endpoint: /.netlify/functions/moex-stocks
// Method: GET
// Response: JSON с котировками акций

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    // Кэшируем на 5 минут (300 секунд)
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
  };

  // Обрабатываем preflight запросы
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('📊 Fetching MOEX stocks data...');

    // Популярные российские акции
    const tickers = ['SBER', 'GAZP', 'YDEX', 'LKOH', 'GMKN'];

    // MOEX ISS API endpoint
    // Документация: https://iss.moex.com/iss/reference/
    const moexUrl = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json?securities=${tickers.join(',')}`;

    const response = await fetch(moexUrl);

    if (!response.ok) {
      throw new Error(`MOEX API error: ${response.status}`);
    }

    const data = await response.json();

    // Проверяем наличие данных
    if (!data.securities || !data.marketdata) {
      throw new Error('Invalid MOEX API response format');
    }

    // Парсим данные в удобный формат
    const securities = data.securities;
    const marketdata = data.marketdata;

    // Создаём индекс колонок
    const secColIndex = {};
    securities.columns.forEach((col, idx) => {
      secColIndex[col] = idx;
    });

    const mktColIndex = {};
    marketdata.columns.forEach((col, idx) => {
      mktColIndex[col] = idx;
    });

    // Собираем данные по каждой акции
    const stocks = [];

    for (let i = 0; i < securities.data.length; i++) {
      const secRow = securities.data[i];
      const mktRow = marketdata.data[i];

      const ticker = secRow[secColIndex['SECID']];
      const name = secRow[secColIndex['SHORTNAME']] || secRow[secColIndex['SECNAME']];
      const price = mktRow[mktColIndex['LAST']] || mktRow[mktColIndex['PREVPRICE']] || 0;
      const change = mktRow[mktColIndex['CHANGE']] || 0;
      const changePercent = mktRow[mktColIndex['LASTTOPREVPRICE']] || 0;
      const volume = mktRow[mktColIndex['VOLTODAY']] || 0;

      if (ticker && price > 0) {
        stocks.push({
          ticker,
          name,
          price,
          change,
          changePercent,
          volume,
        });
      }
    }

    console.log(`✅ Successfully fetched ${stocks.length} stocks`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: stocks
      })
    };

  } catch (error) {
    console.error('❌ Error fetching MOEX stocks:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch MOEX stocks data'
      })
    };
  }
};

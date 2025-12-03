// ============================================================================
// NETLIFY FUNCTION: MOEX BONDS PROXY
// ============================================================================
//
// Эта serverless функция проксирует запросы к MOEX ISS API для получения
// котировок российских облигаций (ОФЗ). Решает проблему CORS.
//
// Endpoint: /.netlify/functions/moex-bonds
// Method: GET
// Response: JSON с котировками облигаций

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
    console.log('📊 Fetching MOEX bonds data...');

    // Популярные ОФЗ (облигации федерального займа)
    const tickers = ['SU26238RMFS4', 'SU26240RMFS9', 'SU26241RMFS7'];

    // MOEX ISS API endpoint для облигаций
    const moexUrl = `https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQOB/securities.json?securities=${tickers.join(',')}`;

    const response = await fetch(moexUrl);

    if (!response.ok) {
      throw new Error(`MOEX API error: ${response.status}`);
    }

    const data = await response.json();

    // Проверяем наличие данных
    if (!data.securities || !data.marketdata) {
      throw new Error('Invalid MOEX API response format');
    }

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

    // Собираем данные по каждой облигации
    const bonds = [];

    for (let i = 0; i < securities.data.length; i++) {
      const secRow = securities.data[i];
      const mktRow = marketdata.data[i];

      const ticker = secRow[secColIndex['SECID']];
      const name = secRow[secColIndex['SHORTNAME']] || secRow[secColIndex['SECNAME']];
      const price = mktRow[mktColIndex['LAST']] || mktRow[mktColIndex['PREVPRICE']] || 0;
      const faceValue = secRow[secColIndex['FACEVALUE']] || 1000;
      const yieldValue = mktRow[mktColIndex['YIELD']] || 0;
      const couponRate = secRow[secColIndex['COUPONPERCENT']] || 0;
      const maturityDate = secRow[secColIndex['MATDATE']];

      if (ticker && price > 0) {
        bonds.push({
          ticker,
          name,
          price,
          faceValue,
          yield: yieldValue,
          couponRate,
          maturityDate,
        });
      }
    }

    console.log(`✅ Successfully fetched ${bonds.length} bonds`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: bonds
      })
    };

  } catch (error) {
    console.error('❌ Error fetching MOEX bonds:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch MOEX bonds data'
      })
    };
  }
};

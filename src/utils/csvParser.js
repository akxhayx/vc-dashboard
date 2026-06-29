import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const validateStartupData = (data) => {
  const requiredFields = [
    'Startup',
    'Revenue_Monthly',
    'Users',
    'CAC',
    'Expenses',
    'ARR',
    'LTV',
    'Burn_Rate',
    'ARR_PrevYear',
    'COGS',
    'Cash_Balance',
    'Sales_Marketing_Spend',
    'Sector'
  ];

  const optionalFields = {
    'Investment_Amount': 0,
    'Entry_Valuation': 0,
    'Last_Round_Valuation': 0,
    'Ownership_Pct': 0,
    'Investment_Date': '',
    'Round': ''
  };

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CSV must contain startup data');
  }

  const firstRow = data[0];
  const missingFields = requiredFields.filter(field => !(field in firstRow));

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Enrich data with defaults for optional fields
  const enrichedData = data.map(row => {
    const enrichedRow = { ...row };

    // Add default values for optional fields if missing
    Object.entries(optionalFields).forEach(([field, defaultValue]) => {
      if (!(field in enrichedRow) || enrichedRow[field] === null || enrichedRow[field] === undefined || enrichedRow[field] === '') {
        enrichedRow[field] = defaultValue;
      }
    });

    return enrichedRow;
  });

  return enrichedData;
};

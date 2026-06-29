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
    'Burn_Rate'
  ];
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CSV must contain startup data');
  }
  
  const firstRow = data[0];
  const missingFields = requiredFields.filter(field => !(field in firstRow));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};



// Dropdown Utility Functions: 

export const generateDropdownMonths = (start: string, end: string): string[] => {
  if (!start || !end) return [];

  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

  let startMonth = startDate.getMonth();
  let endMonth = endDate.getMonth() + (endDate.getFullYear() - startDate.getFullYear()) * 12;
  let months: string[] = [];
  
  for (let i = startMonth; i <= endMonth; i++) {
    let month = new Date(startDate.getFullYear(), i).toLocaleString('default', { month: 'long', year: 'numeric' });
    months.push(month);
  }
  return months;
}

export function limitDropdownMonths(dateString: string, monthsToGoBack: number): string {
  if (!dateString || typeof dateString !== 'string') return '';

  const dateParts = dateString.split(' ');
  if (dateParts.length !== 2) return '';

  const year = parseInt(dateParts[1], 10);
  if (isNaN(year)) return '';

  const date = new Date(`${dateParts[0]} 1, ${year}`);
  if (isNaN(date.getTime())) return '';

  date.setMonth(date.getMonth() - monthsToGoBack);

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

//////////////////////

// Sorting Utility Functions ( for sorting columns in tables ): 

interface Column {
  Header: string;
  [key: string]: any;
}

export function sortQuarterlyColumns(columns: Column[]): Column[] {
  const marketColumn = columns.find(col => col.Header === 'Market / Region');
  const quarterColumns = columns.filter(col => col.Header !== 'Market / Region');

  const sortedQuarterColumns = quarterColumns.sort((a, b) => {
    const [aQuarter, aYear] = a.Header.split(' ');
    const [bQuarter, bYear] = b.Header.split(' ');

    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear);
    }

    const quarterOrder: { [key: string]: number } = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
    return quarterOrder[aQuarter] - quarterOrder[bQuarter];
  });

  return [marketColumn!, ...sortedQuarterColumns];
}

export function sortQuarterlyColumnsNetworkTotals(columns: Column[]): Column[] {
  const marketColumn = columns.find(col => col.Header === 'Network Group');
  const quarterColumns = columns.filter(col => col.Header !== 'Network Group');

  const sortedQuarterColumns = quarterColumns.sort((a, b) => {
    const [aQuarter, aYear] = a.Header.split(' ');
    const [bQuarter, bYear] = b.Header.split(' ');

    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear);
    }

    const quarterOrder: { [key: string]: number } = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
    return quarterOrder[aQuarter] - quarterOrder[bQuarter];
  });

  return [marketColumn!, ...sortedQuarterColumns];
}

export function formatHeaderOvertimeColumns(header: string): string {
  if (header === "Market / Region") {
    return 'Market / Region';
  }

  const [year, month] = header.split('_').map(Number);

  if (isNaN(year) || year < 1000 || year > 9999 || isNaN(month) || month < 1 || month > 12) {
    return header;
  }

  const date = new Date(year, month - 1);
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
  return formatter.format(date);
}

// Date utility functions


export const getFirstMonthOfYear = (selectedMonth: string): string => {
  const year = new Date(selectedMonth).getFullYear();
  return new Date(year, 0).toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getPreviousMonth = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getSevenMonthsAgo = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setMonth(date.getMonth() - 7);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getOneYearAgo = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setFullYear(date.getFullYear() - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getTwoYearsAgo = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setFullYear(date.getFullYear() - 2);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getElevenMonthsAgo = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setMonth(date.getMonth() - 11);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const getTwentyThreeMonthsAgo = (selectedMonth: string): string => {
  const date = new Date(selectedMonth);
  date.setMonth(date.getMonth() - 23);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function getLastMonthOfPreviousQuarter(selectedMonth: string): string {
  const date = new Date(selectedMonth);
  const month = date.getMonth();
  const year = date.getFullYear();

  const currentQuarter = Math.floor(month / 3);

  if (month % 3 !== 2) {
    const lastMonthOfPreviousQuarter = (currentQuarter * 3) - 1;
    date.setMonth(lastMonthOfPreviousQuarter);
    
    if (lastMonthOfPreviousQuarter < 0) {
      date.setFullYear(year - 1);
      date.setMonth(11);
    }
  }

  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}
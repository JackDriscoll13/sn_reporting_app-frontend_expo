// formatCells.js
// TODO: change this to engagementFormatters.js

/**
 * Formats the value in the cell based on the column header.
 * @param {number | string | null | undefined} value - The value to format.
 * @returns {string} The formatted value.
 */
export function formatCellPercent(value: number | string | null | undefined): string {
    let formattedValue: string = '-'; // Default value

    // Ensure value is not undefined before formatting
    if (value !== undefined && value !== null) {
        if (typeof value === 'number') {
            // Format the value as a percentage
            formattedValue = `${value.toFixed(1)}%`;
        }
        // Default case: format as a string
        else {
            formattedValue = String(value);
        }
    }
    return formattedValue;
}

/**
 * Formats the header for overtime columns.
 * 
 * @param {string} header - The header string to be formatted.
 * @returns {string} The formatted header string.
 * 
 * @description
 * This function takes a header string in the format "YYYY_MM" or "Market / Region"
 * and formats it appropriately. For date headers, it converts them to "MMM YYYY" format.
 * For "Market / Region", it returns the string as is. If the input is invalid, it returns
 * the original header.
 */
export function formatHeaderOvertimeColumns(header: string): string {
        // Split the string into year and month
        const [year, month] = header.split('_').map(Number);
    
        // Check if the header is the "market/region" column 
        if (header === "Market / Region") { 
            return 'Market / Region';
        }
    
        // Check if year and month are valid
        if (isNaN(year) || year < 1000 || year > 9999 || isNaN(month) || month < 1 || month > 12) {
            return header; // Return the original header if year or month is invalid
        }
    
        // Create a date object with the year and month
        const date = new Date(year, month - 1);
    
        // Format the date into "MMM YYYY" format
        const formatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
        return formatter.format(date);
    }


interface Column {
    Header: string;
    // Add other properties as needed
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
  
    return marketColumn ? [marketColumn, ...sortedQuarterColumns] : sortedQuarterColumns;
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
  
    return marketColumn ? [marketColumn, ...sortedQuarterColumns] : sortedQuarterColumns;
  }


  
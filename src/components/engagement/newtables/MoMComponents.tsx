// import { useState, useMemo } from 'react';
// import { useReactTable } from '@tanstack/react-table';

// // MOM Dashboard Component
// // First we define abstract 
// // MoM Dashboard Formatters 
// const DashboardEngPercent = ({ value }: { value: number | undefined }) => {
//     return value !== undefined ? (
//         <div className='text-xl'>{value.toFixed(1)}%</div>
//     ) : null;
// };

// const DashboardEngPercentChange = ({ value1, value2 }: { value1: number | undefined, value2: number | undefined }) => {
//     if (value1 === undefined || value2 === undefined) {
//         return null;
//     }

//     const change = ((value2 - value1) / value1) * 100;
//     const isPositive = change >= 0;

//     return (
//         <div style={{ color: isPositive ? 'green' : 'red' }} className='text-xl'>
//             {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
//         </div>
//     );
// };
  

// interface MoMDashboardProps {
//     momDashboardData: any;
//     uniqueMarkets: string[];
//     selectedMonth: string;
//     oneYearAgo: string;
//     previousMonth: string;
// }

// /**
//  * MoMDashboard Component
//  * 
//  * This component renders a dashboard for Month-over-Month (MoM) engagement data.
//  * It allows users to select a market and displays engagement metrics for Spectrum News,
//  * Big 4, and Cable News networks.
//  *
//  * @param {Object} props
//  * @param {Array} props.momDashboardData - Array of objects containing MoM engagement data for different markets
//  * @param {Array} props.uniqueMarkets - Array of unique market names for the dropdown
//  * @param {string} props.selectedMonth - The currently selected month for data display
//  * @param {string} props.oneYearAgo - The month one year prior to the selected month
//  * @param {string} props.previousMonth - The month immediately preceding the selected month
//  *
//  * @returns {JSX.Element} A dashboard displaying MoM engagement metrics with market selection
//  */
// export function MoMDashboard({momDashboardData, uniqueMarkets, selectedMonth, oneYearAgo, previousMonth}: MoMDashboardProps) {
//     // Filter state 
//     const [marketFilter, setMarketFilter] = useState('Total');

//     // Filter the data based on the selected market
//     const dashboardData = momDashboardData.filter((item:any) => item['Market / Region'] === marketFilter)[0];


//     return ( 
//         <div className="flex flex-col items-center">
//         <div className="flex justify-center space-x-8 shadow-md rounded-full p-3">
//             <div>Select Market:</div>
//             <div> 
//                 {uniqueMarkets && uniqueMarkets.length > 0 && (
//                     <select 
//                         className="flex mr-2 border-2 bg-white shadow-inner" 
//                         value={marketFilter} 
//                         onChange={(e) => setMarketFilter(e.target.value)}
//                     >
//                         {uniqueMarkets.map((market, index) => 
//                             <option key={index} value={market}>{market}</option>
//                         )}
//                     </select>
//                 )}
//             </div>
//         </div>
//     {/* Dashboard Container */}
// <div className="flex justify-center mt-6 w-full text-lg">
//     <div className="rounded-lg p-2">
//     {/* Dashboard Content Here */}
//         <div className="relative flex flex-col items-center mt-4 border-2 border-charterdeepblue shadow-lg bg-gray-100">
//         <div className="absolute top-0 left-0 p-1 text-sm bg-white rounded-md text-center font-semibold min-w-32 text-charterdeepblue text-wrap">
//         {marketFilter}</div>
//             <div className="w-full max-w-4xl">
//                 <div className="grid grid-cols-custom gap-4">
//                     {/* Row Labels Column */}
//                     <div className="p-2 rounded-lg col-span-1 border-r border-gray-300">
//                         <ul className="grid grid-rows-5 gap-3.5 mt-5 text-right">
//                             <li></li> {/* Empty for spacing */}
//                             <li></li> {/* Empty for spacing */}
//                             <li className="font-bold text-xl">Spectrum News</li>
//                             <li className="font-bold text-xl">Big 4</li>
//                             <li className="font-bold text-xl">Cable News</li>
//                         </ul>
//                     </div>

//                     {/* Current Period Column */}
//                     <div className="bg-gray-100 p-4 rounded-lg col-span-1 border-r border-gray-300">
//                         <div className="font-bold text-center text-base">Current Month</div>
//                         <div className="text-sm text-center mb-2">({selectedMonth})</div>
//                         <ul className="grid text-center grid-rows-5 gap-4">
//                             <li className='text-sm text-center mt-2'>% Engaged</li> {/* Adjust content as needed */}
//                             <li><DashboardEngPercent value={dashboardData[`SN_${selectedMonth}`]}/></li> {/* Adjust content as needed */}
//                             <li><DashboardEngPercent value={dashboardData[`Big 4_${selectedMonth}`]}/></li>
//                             <li><DashboardEngPercent value={dashboardData[`Cable News_${selectedMonth}`]}/></li>
//                         </ul>
//                     </div>

//                     {/* Previous Period Column */}
//                     <div className="bg-gray-100 p-4 rounded-lg col-span-1 border-r border-gray-300 min-w-[210px]">
//                         <div className="font-bold text-center text-base">VS. Previous Month</div>
//                         <div className="text-sm text-center mb-2">({previousMonth})</div>
//                         <div className="grid grid-rows-5 gap-4">
//                         <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-sm text-center mt-2'>% Change</div>
//                                 <div className='text-sm text-center mt-2'>% Engaged</div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`SN_${previousMonth}`]} value2={dashboardData[`SN_${selectedMonth}`]}/></div>
//                                 <div className='text-center'><DashboardEngPercent value={dashboardData[`SN_${previousMonth}`]}/></div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`Big 4_${previousMonth}`]} value2={dashboardData[`Big 4_${selectedMonth}`]}/></div>
//                                 <div className='text-center'><DashboardEngPercent value={dashboardData[`Big 4_${previousMonth}`]}/></div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`Cable News_${previousMonth}`]} value2={dashboardData[`Cable News_${selectedMonth}`]}/></div>
//                                 <div className='text-center'><DashboardEngPercent value={dashboardData[`Cable News_${previousMonth}`]}/></div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Previous 12 Period Column */}
//                     <div className="bg-gray-100 p-4 rounded-lg col-span-1 min-w-[210px]">
//                         <div className="font-bold text-center text-base">VS. Previous 12 Months</div>
//                         <div className="text-sm text-center mb-2">({oneYearAgo} - {previousMonth})</div>
//                         <div className="grid grid-rows-5 gap-4">
//                         <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-sm text-center mt-2'>% Change</div>
//                                 <div className='text-sm text-center mt-2'>% Engaged</div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`SN_${oneYearAgo} - ${previousMonth}`]} value2={dashboardData[`SN_${selectedMonth}`]}/></div>
//                                 <div className='text-center'> <DashboardEngPercent value={dashboardData[`SN_${oneYearAgo} - ${previousMonth}`]}/></div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`Big 4_${oneYearAgo} - ${previousMonth}`]} value2={dashboardData[`Big 4_${selectedMonth}`]}/></div>
//                                 <div className='text-center'><DashboardEngPercent value={dashboardData[`Big 4_${oneYearAgo} - ${previousMonth}`]}/></div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <div className='text-center'><DashboardEngPercentChange value1={dashboardData[`Cable News_${oneYearAgo} - ${previousMonth}`]} value2={dashboardData[`Cable News_${selectedMonth}`]}/></div>
//                                 <div className='text-center'><DashboardEngPercent value={dashboardData[`Cable News_${oneYearAgo} - ${previousMonth}`]}/></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     </div>
// </div>
//     )

// }

// interface MoMNetworkChangeTableProps {
//     momTableData: any;
//     selectedMonth: string;
//     oneYearAgo: string;
//     previousMonth: string;
// }

// // This is a unique component becuase it has data filtering and column creation logic built in. 
// // It has this because it uses a network filter and also creates custom columns based on the network filter. 
// export const MoMNetworkChangeTable = ({ momTableData, selectedMonth, oneYearAgo, previousMonth }: MoMNetworkChangeTableProps) => {
//     // First thing we want to do is create a filter for network
//     const [networkFilter, setNetworkFilter] = useState('SN');

//     // A function to filter the data (we only want the specified network's columns, the Market / Region column, and the sorting column)
//     const filterSNKeys = (row:any) => {
//         return Object.entries(row)
//             .filter(([key, _]) => key.startsWith(`${networkFilter}_`) || key === "Market / Region" || key === "sorting_column")
//             .reduce((acc:any, [key, value]) => {
//                 acc[key] = value;
//                 return acc;
//             }, {});
//         };
    
//     // A function to create columns from the filtered data
//     function createColumnsFromData(data:any, networkFilter:any) {
//         const allKeys = new Set();
//         data.forEach((row:any) => {
//             Object.keys(row).forEach(key => {
//                 if (key !== 'sorting_column') { // Exclude 'sorting_column' from being added
//                     allKeys.add(key);
//                 }
//             });
//         });
    
//         const groupedColumns = Array.from(allKeys).map((key:any) => {
//             // For keys with an underscore, drop everything before (and including) the underscore
//             const columnName = key.includes('_') ? key.split('_').slice(1).join('_') : key;
    
//             return {
//                 Header: columnName, // Use the transformed key as the column header
//                 accessor: key // Use the original key as the accessor
//             };
//         });
    
//         // Separate the Market / Region column if it exists and keep it at the top level
//         const marketRegionColumn = groupedColumns.find(column => column.accessor === 'Market / Region');
//         const nonMarketRegionColumns:any = groupedColumns.filter(column => column.accessor !== 'Market / Region');
    
//         // Add sub-columns to the last, second to last, and third to last columns as specified
//         if (nonMarketRegionColumns.length >= 3) {
//             nonMarketRegionColumns[nonMarketRegionColumns.length - 1].columns = [
//                 { header: '% Change', accessorKey: nonMarketRegionColumns[nonMarketRegionColumns.length - 1].accessor + '_change' },
//                 { header: '% Engaged', accessorKey: nonMarketRegionColumns[nonMarketRegionColumns.length - 1].accessor + '_engaged' }
//             ];
//             nonMarketRegionColumns[nonMarketRegionColumns.length - 2].columns = [
//                 { header: '% Change', accessorKey: nonMarketRegionColumns[nonMarketRegionColumns.length - 2].accessor + '_change' },
//                 { header: '% Engaged', accessorKey: nonMarketRegionColumns[nonMarketRegionColumns.length - 2].accessor + '_engaged' }
//             ];
//             nonMarketRegionColumns[nonMarketRegionColumns.length - 3].columns = [
//                 { header: '% Engaged', accessorKey: nonMarketRegionColumns[nonMarketRegionColumns.length - 3].accessor}
//             ];
//         }
    
//         // Define the top-level columns
//         const columns = [
//             // Market / Region column remains at the top level
//             ...(marketRegionColumn ? [marketRegionColumn] : []),
//             // Group other columns under the Network Filter
//             {
//                 Header: networkFilter,
//                 // Use the accessor of the first column as a placeholder if needed
//                 accessor: nonMarketRegionColumns.length > 0 ? nonMarketRegionColumns[0].accessor : 'Market / Region',
//                 columns: nonMarketRegionColumns
//             }
//         ];
    
//         return columns;
//     }

//     // Here we apply the filter and create the columns
//     const { filteredData, columns } = useMemo(() => {
//         const filtered = momTableData.map(filterSNKeys);
//         const cols = createColumnsFromData(filtered, networkFilter);
//         return { filteredData: filtered, columns: cols };
//         }, [momTableData, networkFilter]); 

//     // This function will prepare the data by calculating the percentage change for the previous month and the previous 12 months
//     // It also assigns the new accessors for the columns and removes the old keys
//     const prepareData = (data:any, current_month:any, previous_month:any, oneYearAgo:any, networkFilter:any) => {
//         const processedData = data.map((row:any) => {
//             const currentEng = row[`${networkFilter}_${current_month}`];
//             const previousEng = row[`${networkFilter}_${previous_month}`];
//             const prev12Eng = row[`${networkFilter}_${oneYearAgo} - ${previous_month}`];
    
//             const percentchangeprev = ((currentEng - previousEng) / previousEng) * 100;
//             const percentchange12 = ((currentEng - prev12Eng) / prev12Eng) * 100;
    
//             // Create a new object to avoid mutating the original row
//             const newRow = { 
//                 ...row,
//                 [`${networkFilter}_${previous_month}_engaged`]: previousEng,
//                 [`${networkFilter}_${previous_month}_change`]: percentchangeprev,
//                 [`${networkFilter}_${oneYearAgo} - ${previous_month}_engaged`]: prev12Eng,
//                 [`${networkFilter}_${oneYearAgo} - ${previous_month}_change`]: percentchange12
//             };
    
//             // Define an array of keys you want to remove
//             const keysToRemove = [
//                 `${networkFilter}_${previous_month}`,
//                 `${networkFilter}_${oneYearAgo} - ${previous_month}`,
//                 // Add more keys as needed
//             ];
    
//             // Remove the specified keys from the new row
//             keysToRemove.forEach(key => delete newRow[key]);
    
//             return newRow;
//         });
    
//         return processedData;
//     };

//     const processedData = prepareData(filteredData, selectedMonth, previousMonth, oneYearAgo, networkFilter);

//     const table = useReactTable({
//         columns: columns,
//         data: processedData,
//         getCoreRowModel: getCoreRowModel(),
//       });

//     return (
//         <div className="flex flex-col items-center">
//             <div className="flex justify-center space-x-8 shadow-md rounded-full p-3">
//                 <div>Select Network Group:</div>
//                 <div> 
//                     <select
//                         className="flex mr-2 border-2 bg-white shadow-inner"
//                         value={networkFilter}
//                         onChange={(e) => setNetworkFilter(e.target.value)}
//                     >
//                         <option value="SN">Spectrum News</option>
//                         <option value="Big 4">Big 4</option>
//                         <option value="Cable News">Cable News</option>
//                     </select>
                
//                 </div>
//             </div>
//             <div id="tablecontainer" className="max-h-[600px] overflow-y-auto mt-8">
//                 <table className="min-w-full bg-white border border-gray-200" {...getTableProps()}>
//                 <thead className='sticky top-0 z-10 bg-gray-200 text-charterdeepblue'>
//                     {headerGroups.map((headerGroup,groupIndex) => (
//                         <tr className='bg-gray-200'{...headerGroup.getHeaderGroupProps()}> 
//                             {headerGroup.headers.map((column, index) => {
//                                 // Example condition to adjust width. Adjust according to your actual logic.
//                                 const widthStyle = index === 0 ? 'min-w-[150px]' : 'min-w-[120px] max-w-[130px]';
//                                 // Determine the level of the header to adjust font size
//                                 const fontSizeStyle = column.depth > 0 ? 'text-sm' : 'text-base';
//                                 const borderStyle = ((index === 0 && column.depth==0 )|| column.depth===2 ) ? 'border-b-2 border-gray-300' : '';
//                                 const borderStyleVert = (column.depth===1 || index===0 || (column.depth===2 && (index===1 || index===3))) ? 'border-r-2 border-gray-300' : '';
//                                 const stickyStyle = groupIndex === 1 ? 'sticky top-0 bg-gray-200' : (column.depth === 2 || index === 0) ? 'sticky top-[21px] bg-gray-200' : '';

//                                 return (
//                                     <th 
//                                         {...column.getHeaderProps()} 
//                                         className={`${widthStyle} ${fontSizeStyle} ${borderStyle} ${borderStyleVert} ${stickyStyle}  ${index === 0 ? 'text-left' : 'text-center'}`}
//                                     >
//                                         {column.render('Header')}
//                                     </th>
//                                 );
//                             })}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                     {rows && rows.length > 0 ? (
//                         rows.map((row:any) => {
//                             prepareRow(row);
//                             const isTotalRow = Number.isInteger(row.original.sorting_column);
//                             return (
//                                 <tr {...row.getRowProps()} className="bg-white">
//                                     {row.cells.map((cell:any, index:any) => {
//                                         const columnHeader = cell.column.Header;
//                                         let formattedValue = 'N/A'; // Default value
//                                         let style = '';
//                                         let arrow = '';

//                                         // Ensure cell.value is not undefined before formatting
//                                         if (cell.value !== undefined && cell.value !== null) {
//                                             // Check if the accessor ends with "change"
//                                             if (columnHeader.endsWith('Change')) {
//                                                 // Determine style and arrow based on the cell value
//                                                 if (cell.value > 0) {
//                                                     style = 'text-green-600';
//                                                     arrow = '↑';
//                                                 } else if (cell.value < 0) {
//                                                     style = 'text-red-600';
//                                                     arrow = '↓';
//                                                 }
//                                                 // Format the value with the arrow
//                                                 formattedValue = `${cell.value.toFixed(1)}% ${arrow}`;
//                                             }
//                                             // Check if the accessor ends with "engaged"
//                                             else if (columnHeader.endsWith('Engaged')) {
//                                                 // Format the value as a percentage
//                                                 formattedValue = `${cell.value.toFixed(1)}%`;
//                                             }
//                                             // Default case: format as a string
//                                             else {
//                                                 formattedValue = cell.value;
//                                             }
//                                         }

//                                         return (
//                                             <td key={index} className={`group hover:bg-blue-100 ${index === 0 ? 'min-w-[150px] text-left text-sm px-2' : 'text-center text-sm px-2'} ${isTotalRow ? 'font-bold border-t' : ''} ${style}`}  {...cell.getCellProps()}>
//                                                 {formattedValue}
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             );
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan={100}>No data available</td>
//                         </tr>
//                     )}
//                 </tbody>
//                 </table> 

//             </div>
//         </div>
//     ) 
// };
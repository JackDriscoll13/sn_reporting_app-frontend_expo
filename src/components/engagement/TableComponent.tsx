// Reuseable table component used across our engagement tables
// @ts-nocheck
import React from 'react';
import { useTable } from 'react-table';
import { formatCellPercent, formatHeaderOvertimeColumns } from '../../utils/engagementFormatters';
import { useMemo } from 'react';

// This table is used to Display the data for each market, and has builtin logic for styling the total rows
// Its good boilerplate, but in practice its easier to define each table seperatley
export const EngagementTableMarket = ({ columns, data, customRowRender }) => { 
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });

    return ( 
        <div className="max-h-[600px] overflow-y-auto"> 
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200"> 
                <thead className="sticky top-0 z-10 bg-gray-200"> 
                    {headerGroups.map((headerGroup, groupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, index) => (
                                <th 
                                    {...column.getHeaderProps()} 
                                    className={`px-3 py-1.5 ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider`}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        const isTotalRow = Number.isInteger(row.original.sorting_column);
                        return customRowRender ? customRowRender(row, i) : (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell, index) => {
                                    const textStyle = index === 0 ? 'text-left min-w-[150px]' : 'text-center';
                                    return (
                                        <td {...cell.getCellProps()} 
                                        className={`px-3 py-1.5 text-sm hover:bg-blue-100 border-gray-200 ${isTotalRow ? 'font-bold border-t' : ''} ${textStyle}`}
                                        title={`${row.original['Market / Region']}  - ${cell.column.id}, ${cell.value || 'N/A'}`}
                                        >
                                            {formatCellPercent(cell.value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// YTD Table 
export const EngagementTableYTD = ({ columns, data }) => {
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });
    return (
        <div className="max-h-[600px] overflow-y-auto">
            <table {...getTableProps()} className='w-full table-auto'>
            <thead className="sticky top-0 z-10">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                                {headerGroup.headers.map((column, index) => {
                                    const widthStyle = index===0 ? 'min-w-[200px]' : 'min-w-[170px] max-w-[170px]';
                                    const borderStyle = (index===0 || index===1 || index===3) ? 'border-r-2 border-gray-300' : '';
                                    return (
                                        <th 
                                            {...column.getHeaderProps()} 
                                            className={`${widthStyle} ${borderStyle} ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider px-4 py-2`}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        const isTotalRow = Number.isInteger(row.original.sorting_column);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell, index) => {
                                    const borderStyle = (index===0 || index===1|| index===3 ) ? 'border-r border-gray-300' : '';
                                    const textStyle = index === 0 ? 'text-left min-w-[150px]' : 'text-center';
                                    const columnHeader = cell.column.Header;
                                    let formattedValue = 'N/A';
                                    if ((columnHeader === "Service Subs (000's)" || 
                                        columnHeader === "Engaged Viewers (000's)" || 
                                        columnHeader === "Highly Engaged Viewers (000s)") && 
                                        cell.value !== null && 
                                        cell.value !== undefined) {
                                            formattedValue = cell.value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                                    }
                                    else if (typeof cell.value === 'number' && cell.value !== null && cell.value !== undefined) {
                                        formattedValue = `${cell.value.toFixed(1)}%`;
                                    }
                                    else {
                                        formattedValue = cell.value;
                                    }
    
                                    return (
                                        <td 
                                            key={index} 
                                            className={`group hover:bg-blue-100 text-sm px-2 py-1 ${isTotalRow ? 'font-bold border-t-2 border-gray-300 ' : ''} ${borderStyle} ${textStyle}`}
                                            {...cell.getCellProps()}
                                            title={`${row.original['Market / Region'] || 'N/A'}  - ${cell.column.id}, ${cell.value || 'N/A'}`}
                                        >
                                            {formattedValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        )
    
}


// MoM Table 1
export const EngagementTableMoMAll = ({ columns, data }) => {
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div className="max-h-[600px] overflow-y-auto">
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-200">
                    {headerGroups.map((headerGroup, groupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()} className={`${groupIndex === 0 ? 'text-charterdeepblue' : ''}`}>
                            {headerGroup.headers.map((column, index) => {
                                const widthStyle = index === 0 ? 'min-w-[150px] text-left' : 'text-center min-w-[90px] max-w-[90px]';
                                const borderStyle = (index === 0 || index === 3 || index === 6) ? 'border-r-2 border-gray-300' : '';
                                return (
                                    <th 
                                        {...column.getHeaderProps()} 
                                        key={index} 
                                        className={`px-3 py-1.5 text-sm font-semibold text-charterdeepblue tracking-wider ${widthStyle} ${borderStyle} ${groupIndex === 0 ? '' : 'top-[21px]'}`}
                                    >
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        const isTotalRow = Number.isInteger(row.original.sorting_column);
                        return (
                            <tr {...row.getRowProps()} className={`bg-white ${isTotalRow ? 'font-bold' : ''}`}>
                                {row.cells.map((cell, index) => {
                                    const formattedValue = typeof cell.value === 'number' 
                                        ? cell.value.toFixed(1) + '%' 
                                        : cell.value || 'N/A';
                                    return (
                                        <td 
                                            key={index}
                                            className={`group hover:bg-blue-100 ${index === 0 ? 'min-w-[150px] text-left text-sm px-2' : 'text-center text-sm px-2'} ${isTotalRow ? 'font-bold border-t' : ''}`}
                                            {...cell.getCellProps()}
                                        >
                                            {formattedValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const EngagementTableOvertime = ({ columns, data }) => {
    const formattedColumns = useMemo(() => {
        return columns.map(column => ({
            Header: column === 'Market / Region' ? column : formatHeaderOvertimeColumns(column),
            accessor: column,
            width: column === 'Market / Region' ? 180 : 80,
        }));
    }, [columns]);

    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns: formattedColumns, data });

    return ( 
        <div className="max-h-[600px] overflow-auto"> 
            <div className="inline-block min-w-full align-middle">
                <table {...getTableProps()} className="min-w-full border border-gray-200">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-200">
                            {formattedColumns.map((column, index) => (
                                <th 
                                    key={column.accessor}
                                    className={`
                                        ${index === 0 ? 'text-left min-w-[180px]' : 'text-center min-w-[80px]'}
                                        ${index === 0 ? 'border-r-2 border-gray-300' : ''}
                                        px-2 py-2 text-sm font-semibold text-charterdeepblue tracking-wider whitespace-nowrap
                                    `}
                                >
                                    {column.Header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white">
                        {rows.map(row => {
                            prepareRow(row);
                            const isTotalRow = Number.isInteger(row.original.sorting_column_);
                            return (
                                <tr {...row.getRowProps()} className={isTotalRow ? 'font-bold' : ''}>
                                    {row.cells.map((cell, index) => {
                                        const borderStyle = index === 0 ? 'border-r border-gray-300' : '';
                                        const textStyle = index === 0 ? 'text-left' : 'text-center';
                                        let value = cell.value !== null && cell.value !== undefined ? 
                                            (typeof cell.value === 'number' ? formatCellPercent(cell.value) : cell.value) : 
                                            'N/A';
                                        
                                        return (
                                            <td 
                                                {...cell.getCellProps()} 
                                                className={`group hover:bg-blue-100 text-sm px-2 py-2 ${borderStyle} ${textStyle} ${isTotalRow ? 'font-bold border-t border-gray-300' : ''}`}
                                                title={`${row.original['Market / Region']} - ${cell.column.id}: ${value}`}
                                            >
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ... rest of the file ...
export const EngagementTableRank = ({ columns, data }) => {
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });
    return (
    <div className="max-h-[600px] overflow-y-auto">
        <table {...getTableProps()} className='w-full table-auto'>
        <thead className="sticky top-0 z-10">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                            {headerGroup.headers.map((column, index) => {
                                const widthStyle = index===0 ? 'min-w-[150px]' : 'min-w-[120px] max-w-[130px]';
                                const borderStyle = (index===0 || index===2) ? 'border-r-2 border-gray-300' : '';
                                return (
                                    <th 
                                        {...column.getHeaderProps()} 
                                        className={`${widthStyle} ${borderStyle} ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider px-4 py-2`}
                                    >
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    const isTotalRow = Number.isInteger(row.original.sorting_column);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, index) => {
                                const borderStyle = (index===0 || index===2) ? 'border-r border-gray-300' : '';
                                const textStyle = index === 0 ? 'text-left min-w-[150px]' : 'text-center';
                                const columnHeader = cell.column.Header;
                                let formattedValue = 'N/A';
                                if (columnHeader === 'SN Rank' && cell.value !== null && cell.value !== undefined) {
                                    formattedValue = `#${cell.value.toFixed(0)}`;
                                }
                                else if (typeof cell.value === 'number' && cell.value !== null && cell.value !== undefined) {
                                    formattedValue = `${cell.value.toFixed(1)}%`;
                                }
                                else {
                                    formattedValue = cell.value;
                                }

                                return (
                                    <td 
                                        key={index} 
                                        className={`group hover:bg-blue-100 text-sm px-2 py-1 ${isTotalRow ? 'font-bold border-t-2 border-gray-300 ' : ''} ${borderStyle} ${textStyle}`}
                                        {...cell.getCellProps()}
                                        title={`${row.original['Market / Region'] || 'N/A'}  - ${cell.column.id}, ${cell.value || 'N/A'}`}
                                    >
                                        {formattedValue}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    )
} 

// Rank Table Over Time (Tab 2)
export const EngagementTableRankOvt = ({ columns, data }) => {
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });

    return ( 
        <div className="max-h-[600px] overflow-y-auto"> 
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                <thead>
                    {headerGroups.map((headerGroup, groupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()} className={`bg-gray-200 ${groupIndex === 0 ? 'sticky top-0' : 'sticky top-[24px]'}`}>
                            {headerGroup.headers.map((column, index) => {
                                const widthStyle = index === 0 ? 'min-w-[180px] text-right' : 'min-w-[140px]';
                                const borderStyle = index === 0 ? 'border-r border-gray-300' : '';
                                return (
                                    <th 
                                        {...column.getHeaderProps()} 
                                        className={`${widthStyle} ${borderStyle} ${index === 0 ? 'text-left' : 'text-center'} px-3 py-2 text-sm font-semibold text-charterdeepblue tracking-wider`}
                                    >
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                            {row.cells.map((cell, index) => {
                                const borderStyle = index === 0 ? 'border-r border-b border-gray-300' : 'border-b border-gray-300';
                                const textStyle = index === 0 ? 'text-right font-semibold' : 'text-center';

                                const rank = row.original.Rank;
                                const getEngagementInfo = (cell) => {
                                    const engagementProperty = cell.column.id.replace(/_network$/, '_adjeng');
                                    return row.original[engagementProperty];
                                };
                                
                                let engagementInfo = null;
                                if (cell.column.Header !== 'Rank') {
                                    engagementInfo = getEngagementInfo(cell);
                                }
                                const formattedEngPercent = engagementInfo ? `${engagementInfo.toFixed(1)}%` : null;

                                const getRankChangeInfo = (cell) => {
                                    const rankChangeProperty = cell.column.id.replace(/_network$/, '_rankchange');
                                    return row.original[rankChangeProperty];
                                };
                                let rankChangeInfo = null;
                                if (cell.column.Header !== 'Rank') {
                                    rankChangeInfo = getRankChangeInfo(cell);
                                }
                                const arrow = rankChangeInfo ? (rankChangeInfo > 0 ? ` +${rankChangeInfo}↑` : ` ${rankChangeInfo}↓`) : '';
                                const arrowStyle = rankChangeInfo ? (rankChangeInfo > 0 ? 'text-green-700' : 'text-red-700') : '';

                                // Format the cell value
                                let cellValue = cell.value;
                                if (index === 0 && cellValue !== null && cellValue !== undefined) {
                                    cellValue = `#${cellValue}`;
                                }
                                return (
                                    <td 
                                        key={index} 
                                        className={`group hover:bg-blue-100 text-sm px-3 py-2 ${borderStyle} ${textStyle}`}
                                        {...cell.getCellProps()}
                                        title={`Engagement: ${formattedEngPercent} Rank: ${rank} Rank Change: ${rankChangeInfo}`}
                                    >
                                        <span>{cellValue}</span>
                                        <span className={`text-xs ${arrowStyle}`}>{arrow}</span>
                                    </td>
                                );
                            })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// HEV PENN TABLE 
export const EngagementTableHev = ({ columns, data }) => { 
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });

    return ( 
        <div className="max-h-[600px] overflow-y-auto mt-4"> 
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200"> 
                <thead className="sticky top-0 z-10 bg-gray-200"> 
                    {headerGroups.map((headerGroup, groupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, index) => {
                                const borderStyle = (index === 0 || index === 3 || index === 6) ? 'border-r-2 border-gray-300' : '';
                                return (
                                <th 
                                    {...column.getHeaderProps()} 
                                    className={`px-4 py-2 ${borderStyle} ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider`}
                                >
                                    {column.render('Header')}
                                </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        const isTotalRow = Number.isInteger(row.original.sorting_column);
                        return (
                            <tr {...row.getRowProps()} className={`${isTotalRow ? 'font-bold' : ''}`}>
                                {row.cells.map((cell, index) => {
                                    const textStyle = index === 0 ? 'text-left min-w-[170px]' : 'text-center';
                                    const columnHeader = cell.column.Header;
                                    let formattedValue = 'N/A';
                                    let style = '';
                                    let arrow = '';

                                    if (cell.value !== undefined && cell.value !== null) {
                                        if (columnHeader.toLowerCase().includes('change')) {
                                            if (cell.value > 0) {
                                                style = 'text-green-600';
                                                arrow = '↑';
                                            } else if (cell.value < 0) {
                                                style = 'text-red-600';
                                                arrow = '↓';
                                            }
                                            formattedValue = `${cell.value.toFixed(1)}% ${arrow}`;
                                        } else if (typeof cell.value === 'number') {
                                            formattedValue = `${cell.value.toFixed(1)}%`;
                                        } else {
                                            formattedValue = cell.value;
                                        }
                                    }

                                    return (
                                        <td {...cell.getCellProps()} 
                                        className={`px-2 py-1 text-sm hover:bg-blue-100 border-gray-200 ${isTotalRow ? 'font-bold border-t' : ''} ${textStyle} ${style}`}
                                        title={`${row.original['Market / Region']}  - ${cell.column.id}, ${cell.value || 'N/A'}`}
                                        >
                                            {formattedValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// This table is used to Display the data for the totals of each network group
export const QuarterTotalsTable = ({ columns, data }) => { 
    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows, 
        prepareRow,
    } = useTable({ columns, data });

    return ( 
        <div className="max-h-[600px] overflow-y-auto"> 
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200"> 
                <thead> 
                    {headerGroups.map((headerGroup, groupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()} className={`bg-gray-200 font-semibold ${groupIndex === 0 ? 'sticky top-0' : 'sticky top-[18px]'}`}>
                            {headerGroup.headers.map((column, index) => (
                                <th 
                                    {...column.getHeaderProps()} 
                                    className={`px-4 py-2 ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider`}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                            <td {...cell.getCellProps()} 
                            className={`px-4 py-2 text-sm hover:bg-blue-100 border-gray-200`}
                            >
                                {formatCellPercent(cell.value)}
                            </td>
                            ))}
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// ... existing imports ...
// This table is wierd 
export const PeriodicityHistoryTable = ({ columns, data }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div className="max-h-[600px] overflow-auto">
            <table {...getTableProps()} className="min-w-full border border-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-200">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, index) => (
                                <th
                                    {...column.getHeaderProps()}
                                    className={`
                                        ${index === 0 ? 'text-left min-w-[180px]' : 'text-center min-w-[80px]'}
                                        ${index === 0 ? 'border-r-2 border-gray-300' : ''}
                                        px-2 py-2 text-sm font-semibold text-charterdeepblue tracking-wider whitespace-nowrap
                                    `}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white">
                    {rows.map(row => {
                        prepareRow(row);
                        const isTotalRow = Number.isInteger(row.original.sorting_column);
                        return (
                            <tr {...row.getRowProps()} className={isTotalRow ? 'font-bold' : ''}>
                            {row.cells.map((cell, index) => {
                                const borderStyle = index === 0 ? 'border-r border-gray-300' : '';
                                const textStyle = index === 0 ? 'text-left' : 'text-center';
                                let value = cell.value !== null && cell.value !== undefined ? 
                                    (typeof cell.value === 'number' ? formatCellPercent(cell.value) : cell.value) : 
                                    'N/A';
                                
                                return (
                                    <td 
                                        {...cell.getCellProps()} 
                                        className={`group hover:bg-blue-100 text-sm px-2 py-2 ${borderStyle} ${textStyle} ${isTotalRow ? 'font-bold border-t border-gray-300' : ''}`}
                                        title={`${row.original['Market / Region']} - ${cell.column.id}: ${value}`}
                                    >
                                        {value}
                                    </td>
                                );
                            })}
                        </tr>

                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

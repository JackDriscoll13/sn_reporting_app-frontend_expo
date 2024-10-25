// @ts-nocheck
// Quarterly Component
import React, { useMemo, useState } from 'react';
// Custom Imports 
import { fetchEngagementData } from '../../hooks/engagementHook.ts';
import { SectionLayout } from './SectionLayout.tsx';
import { EngagementTableMarket, QuarterTotalsTable } from './TableComponent.tsx';
import { getLastMonthOfPreviousQuarter, sortQuarterlyColumns, sortQuarterlyColumnsNetworkTotals } from '../../utils/engagementUtils.ts';
import { CustomTabs } from './CustomTabs.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';

export const QuarterlySection = ({ datarange }) => {
    // Defining State for the component
    const [activeTab, setActiveTab] = useState(0);
    const [networkFilter, setNetworkFilter] = useState('SN');
    const [displayByTab1, setDisplayByTab1] = useState('Quarterly');
    const [displayByTab2, setDisplayByTab2] = useState('Quarterly');
    const recentQuarterEnd = getLastMonthOfPreviousQuarter(datarange.most_current_month);
    const startDate = new Date(datarange.oldest_month).toLocaleString('default', { month: 'long', year: 'numeric' });
    const { data: responseData, metadata: quarterMetaData, isLoading, error } = fetchEngagementData(
        '/engagement_quarterly', 
        {
            "start_month": startDate, 
            "end_month": recentQuarterEnd, 
        }, 
    );
    // Define the columns based on the metadata
    // Columns for tab 1 
    const columns = useMemo(() => {
        if (!quarterMetaData) return [];

        const columnSource = displayByTab1 === 'Yearly' 
            ? quarterMetaData.by_market_table_columns_yearly 
            : quarterMetaData.by_market_table_columns_quarterly;

        if (!columnSource) return [];

        if (displayByTab1 === 'Yearly') {
            // For yearly data, create a single column group
            return columnSource
                .filter(col => col !== 'sorting_column')
                .map(year => ({
                    Header: year.toString(),
                    accessor: year.toString()
            }));
        } else {
            // For quarterly data, use the existing logic
            const groupedColumns = columnSource
                .filter(col => col !== 'market' && col !== 'sorting_column')
                .reduce((acc, col) => {
                    const [network, ...rest] = col.split('_');
                    const quarter = rest.join('_');
                    if (!acc[network]) {
                        acc[network] = {
                            Header: network,
                            columns: []
                        };
                    }
                    acc[network].columns.push({
                        Header: quarter,
                        accessor: col
                    });
                    return acc;
                }, {});

            return sortQuarterlyColumns([...Object.values(groupedColumns)]);
        }
    }, [quarterMetaData, displayByTab1]);

    // Columns for tab 2
    const networkTotalsColumns = useMemo(() => {
        if (!quarterMetaData?.network_totals_columns_quarterly) return [];

        const columnSource = displayByTab2 === 'Yearly'
            ? quarterMetaData.network_totals_columns_yearly
            : quarterMetaData.network_totals_columns_quarterly;

        if (!columnSource) return [];

        if (displayByTab2 === 'Yearly') {
            return columnSource
                .filter(col => col !== 'sorting_column')
                .map(year => ({
                    Header: year.toString(),
                    accessor: year.toString()
                }));
        } else {
            const quarterColumnsTotal = columnSource
                .filter(col => col !== 'market' && col !== 'sorting_column')
                .reduce((acc, col) => {
                    const [network, ...rest] = col.split('_');
                    const quarter = rest.join('_');
                    if (!acc[network]) {
                        acc[network] = {
                            Header: network,
                            columns: []
                        };
                    }
                    acc[network].columns.push({
                        Header: quarter,
                        accessor: col
                    });
                    return acc;
                }, {});

            return sortQuarterlyColumnsNetworkTotals([...Object.values(quarterColumnsTotal)]);
        }
    }, [quarterMetaData, displayByTab2]);

    
    // Data for tab 1
    // Filter the data based on the network selected
    const tableData = useMemo(() => {
        if (!responseData) return [];

        let filteredData;
        const dataSource = displayByTab1 === 'Yearly' ? 'yearly' : 'quarter';

        switch(networkFilter) {
            case 'SN':
                filteredData = responseData[`${dataSource}_sn`] || [];
                break;
            case 'Big 4':
                filteredData = responseData[`${dataSource}_big4`] || [];
                break;
            case 'Cable News':
                filteredData = responseData[`${dataSource}_cable`] || [];
                break;
            default:
                filteredData = [];
        }

        return filteredData;
    }, [responseData, networkFilter, displayByTab1]);

    // Data for tab 2
    const totalTableData = useMemo(() => {
        if (!responseData) return [];
        const dataSource = displayByTab2 === 'Yearly' ? 'yearly' : 'quarter';
        const totalData = responseData[`${dataSource}_network_totals`] || '[]';
        return totalData;
    }, [responseData, displayByTab2]);


    // RENDERING
    // What to render based on the state of the data
    if (isLoading) {
        return (
            <SectionLayout title='Quarterly Engagement Report'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout title='Quarterly Engagement Report'>
                <div>Error: {error.message}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered quarterly section (activeTab:', activeTab,')');
    return (
        <SectionLayout title='Quarterly Engagement Report' subtitle={`(${startDate} — ${recentQuarterEnd})`}>
            <CustomTabs tabs={['By Market', 'Network Group Totals']} activeTab={activeTab} setActiveTab={setActiveTab}>
                <div id='tab1' className="flex flex-col items-center">
                        <div className="flex justify-between items-center w-full max-w-4xl mb-4">
                            <div className="flex items-center space-x-4 shadow-md rounded-full p-3">
                                <div className="text-sm">Display By:</div>
                                <span className={`text-sm ${displayByTab1 === 'Quarterly' ? 'font-bold' : ''}`}>By Quarter</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="sr-only peer"
                                        checked={displayByTab1 === 'Yearly'}
                                        onChange={() => setDisplayByTab1(prev => prev === 'Quarterly' ? 'Yearly' : 'Quarterly')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                                <span className={`text-sm ${displayByTab1 === 'Yearly' ? 'font-bold' : ''}`}>By Year</span>
                            </div>
                            <div className="flex items-center space-x-4 shadow-md rounded-full p-3">
                                <div>Select Network Group:</div>
                                <select
                                    className="border-2 bg-white shadow-inner"
                                    value={networkFilter}
                                    onChange={(e) => setNetworkFilter(e.target.value)}
                                >
                                    <option value="SN">Spectrum News</option>
                                    <option value="Big 4">Big 4</option>
                                    <option value="Cable News">Cable News</option>
                                </select>
                            </div>
                        </div>
                        <EngagementTableMarket 
                            columns={columns}
                            data={tableData}
                        />
                    </div>
                <div id='tab2' className='flex flex-col items-center'> 
                    <div className="flex items-center space-x-4 shadow-md rounded-full p-3 mb-4">
                        <div className="text-sm">Display By:</div>
                        <span className={`text-sm ${displayByTab2 === 'Quarterly' ? 'font-bold' : ''}`}>By Quarter</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                checked={displayByTab2 === 'Yearly'}
                                onChange={() => setDisplayByTab2(prev => prev === 'Quarterly' ? 'Yearly' : 'Quarterly')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <span className={`text-sm ${displayByTab2 === 'Yearly' ? 'font-bold' : ''}`}>By Year</span>
                    </div>
                    <QuarterTotalsTable
                        columns={networkTotalsColumns}
                        data={totalTableData}
                    />
                </div>
            </CustomTabs>
        </SectionLayout>
    );
};
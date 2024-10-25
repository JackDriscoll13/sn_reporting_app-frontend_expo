
// @ts-nocheck
import React, { useState, useEffect, useMemo} from 'react';
// Custom Imports 
import { fetchEngagementData } from '../../hooks/engagementHook.ts';
import { getTwoYearsAgo } from '../../utils/engagementUtils.ts';
import { SectionLayout } from './SectionLayout.tsx';
import { EngagementTableOvertime} from './TableComponent.tsx';
import { ByMarketOvtChart } from './CustomComponents.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';
import { CustomTabs } from './CustomTabs.tsx';

export const OverTimeSection = ({ datarange }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [networkFilter, setNetworkFilter] = useState('SN');
    // For now we will make the range static, two years ago to the current month
    // TODO: Make this range dyanamic (allow the user to select a different range other than the last 2 years)
    const startMonth = getTwoYearsAgo(datarange.most_current_month);
    const endMonth = new Date(datarange.most_current_month).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Fetch the engagement data from the the over time endpoint in the backend
    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/over_time', 
        {
            "start_month": startMonth, 
            "end_month": endMonth, 
        }, 
    );

    // Define the data objects for the chart and the table
    // Main difference is that we drop the sorting_column from the table on the chart data
    // Define the data objects for the chart
    const snDataChart = useMemo(() => {
        if (!responseData || !responseData.overtime_sn_data) return [];
        return responseData.overtime_sn_data.map(item => {
            const { sorting_column_, ...rest } = item;
            return rest;
        });
    }, [responseData]);

    const cableDataChart = useMemo(() => {
        if (!responseData || !responseData.overtime_cable_data) return [];
        return responseData.overtime_cable_data.map(item => {
            const { sorting_column_, ...rest } = item;
            return rest;
        });
    }, [responseData]);

    const big4DataChart = useMemo(() => {
        if (!responseData || !responseData.overtime_big4_data) return [];
        return responseData.overtime_big4_data.map(item => {
            const { sorting_column_, ...rest } = item;
            return rest;
        });
    }, [responseData]);


    // Data for table in tab 2 ->  Filter the data based on the network selected
    const tableData = useMemo(() => {
        if (!responseData) return [];

        let filteredData;
        switch(networkFilter) {
            case 'SN':
                filteredData = responseData.overtime_sn_data || [];
                break;
            case 'Big 4':
                filteredData = responseData.overtime_big4_data || [];
                break;
            case 'Cable News':
                filteredData = responseData.overtime_cable_data || [];
                break;
            default:
                filteredData = [];
        }

        return filteredData;
    }, [responseData, networkFilter]);

    // Just getting the flat columns from the responseMetaData
    const columns = useMemo(() => {
        if (!responseMetaData || !responseMetaData.data_columns) return [];
        return responseMetaData.data_columns.filter(col => col !== 'sorting_column_');
    }, [responseMetaData]);

    if (isLoading) {
        return (
            <SectionLayout title='Engagement Over the Past 2 Years'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }
    if (error) {
        return (
            <SectionLayout title='Engagement Over the Past 2 Years'>
                <div>Error: {error.message}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered engagement over time section (activeTab:', activeTab,')');
    return (
        <SectionLayout title='Engagement Over the Past 2 Years'>
            <CustomTabs tabs={['Chart View by Market', 'Table View All Markets by Network']} activeTab={activeTab} setActiveTab={setActiveTab}>
                <div id='tab1' className="flex flex-col items-center w-full h-full">
                    <div className="w-full h-[600px]"> {/* Add this wrapper div */}
                        <ByMarketOvtChart snDataChart={snDataChart} cableDataChart={cableDataChart} big4DataChart={big4DataChart} />
                    </div>
                </div>
                <div id='tab2' className='flex flex-col items-center'>
                    <div className="flex justify-center space-x-8 shadow-md rounded-full p-3 mb-4">
                        <div>Select Network Group:</div>
                        <div>
                            <select
                                className="flex mr-2 border-2 bg-white shadow-inner"
                                value={networkFilter}
                                onChange={(e) => setNetworkFilter(e.target.value)}
                            >
                                <option value="SN">Spectrum News</option>
                                <option value="Big 4">Big 4</option>
                                <option value="Cable News">Cable News</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <EngagementTableOvertime columns={columns} data={tableData} />
                    </div>
                </div>
            </CustomTabs>
        </SectionLayout>
    );
}
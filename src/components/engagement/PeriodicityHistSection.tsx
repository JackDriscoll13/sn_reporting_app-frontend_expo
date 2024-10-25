// @ts-nocheck

import React, { useState, useEffect, useMemo} from 'react';
// Custom Imports 
// Hooks
import { fetchEngagementData } from '../../hooks/engagementHook.ts';
// Utils 
import { getTwoYearsAgo } from '../../utils/engagementUtils.ts';
// Components
import { SectionLayout } from './SectionLayout.tsx';
import { CustomTabs } from './CustomTabs.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';
import { PeriodicityHistoryTable } from './TableComponent.tsx';





export const PeriodicityHistSection = ({ datarange }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [networkFilter, setNetworkFilter] = useState('SN');
    // For now we will make the range static, two years ago to the current month
    // TODO: Make this range dyanamic (allow the user to select a different range other than the last 2 years)
    const startMonth = getTwoYearsAgo(datarange.most_current_month);
    const endMonth = new Date(datarange.most_current_month).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Fetch the engagement data from the the over time endpoint in the backend
    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/periodicity_history', 
        {
            "start_month": startMonth, 
            "end_month": endMonth, 
        }, 
    );


    // Data for table in tab 2 ->  Filter the data based on the network selected
    const tableData = useMemo(() => {
        if (!responseData) return [];

        let filteredData;
        switch(networkFilter) {
            case 'SN':
                filteredData = responseData.periodicity_history_sn || [];
                break;
            case 'Big 4':
                filteredData = responseData.periodicity_history_big4 || [];
                break;
            case 'Cable News':
                filteredData = responseData.periodicity_history_cable || [];
                break;
            default:
                filteredData = [];
        }

        return filteredData;
    }, [responseData, networkFilter]);


    const formatDate = (dateString) => {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(month, 10) - 1]} ${year}`;
    };

    // Just getting the flat columns from the responseMetaData
    const columns = useMemo(() => {
        if (tableData.length === 0) return [];

        const sampleRow = tableData[0];
        return [
            {
                Header: 'Market / Region',
                accessor: 'Market / Region',
            },
            ...Object.keys(sampleRow)
                .filter(key => key.match(/^\d{6}$/))
                .sort()
                .map(key => ({
                    Header: formatDate(key),
                    accessor: key,
                }))
        ];
    }, [tableData]);

    if (isLoading) {
        return (
            <SectionLayout title='Periodicity History'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }
    if (error) {
        return (
            <SectionLayout title='Periodicity History'>
                <div>Error: {error.message}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered engagement periodicity history section (activeTab:', activeTab,')');

    return (
        <SectionLayout title='Periodicity History' subtitle='(Previous 2 years)'>
            <CustomTabs tabs={['Periodicity History', 'Periodicity Documentation']} activeTab={activeTab} setActiveTab={setActiveTab}>
                <div id='tab1' className="flex flex-col items-center w-full h-full">
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
                    <div className="w-full">
                        <PeriodicityHistoryTable columns={columns} data={tableData} />
                    </div>
                 </div>
                 <div id='tab2' className="flex flex-col items-left w-full h-full">
                        <div>
                            <h1 className="text-lg font-bold">Periodicity Documentation:</h1> 
                            <p className="ml-4">
                                The periodicity documentation will go here.
                                <br />
                                Periodicity is a measurement provided by Finance that is used to calculate HEV. Etc...
                            </p>
                        </div>
                 </div>
                 
            </CustomTabs>
        </SectionLayout>
    )
}

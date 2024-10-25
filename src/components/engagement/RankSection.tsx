// @ts-nocheck

import React, { useState, useEffect, useMemo} from 'react';
// Custom Imports 
import { fetchEngagementData } from '../../hooks/engagementHook.ts';
import { limitDropdownMonths, generateDropdownMonths } from '../../utils/engagementUtils.ts';
import { getSevenMonthsAgo } from '../../utils/engagementUtils.ts';
import { SectionLayout } from './SectionLayout.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';
import { CustomTabs } from './CustomTabs.tsx';
import { EngagementTableRank, EngagementTableRankOvt } from './TableComponent.tsx';


export const RankSection = ({ datarange }) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Generate the months for the dropdown, we want to limit the dropwn to Dec 2023
    const startDropdown = limitDropdownMonths(datarange.most_current_month, 3);
    const months = generateDropdownMonths(startDropdown, datarange.most_current_month);

    // Set the selected month 
    useEffect(() => {
        if (!selectedMonth) {
            setSelectedMonth(months[months.length - 1]);
        }
    }, [months]);

    // Get the start and end date of the current period
    const endMonth = selectedMonth;
    const startMonth = getSevenMonthsAgo(selectedMonth);   
    
    // Fetch the engagement data
    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/rank', 
        {
            "start_month": startMonth, 
            "end_month": endMonth, 
        }, 
    );
    
    // Get the data for the tab 1 and tab 2
    const dataTab1 = useMemo(() => responseData?.rank_current_period || [], [responseData]);
    const dataTab2 = useMemo(() => responseData?.rank_over_time || [], [responseData]);
    // Define the columns for the tab 1 -> these are unchanging so can be static
    const columnsTab1 = useMemo(
        () => [
            {
                Header: 'Market / Region',
                accessor: 'Market / Region',
            },
            {
                Header: 'Spectrum News',
                accessor: 'SPECNEWS',
            },
            {
                Header: 'SN Rank',
                accessor: 'SN_Rank',
            },
            {
                Header: 'ABC',
                accessor: 'ABC',
            },
            {
                Header: 'CBS',
                accessor: 'CBS',
            },
            {
                Header: 'FOX',
                accessor: 'FOX',
            },
            {
                Header: 'NBC',
                accessor: 'NBC',
            }],
        []
    );

    // Columns for tab 2, these are dynamically generated based on the data in the response 
    const columnsTab2 = useMemo(() => {
        // Define all keys in the data
        const allKeys = dataTab2.reduce((acc, row) => {
            Object.keys(row).forEach(key => {
                if (!acc.includes(key) && (key.endsWith('_network') || key === 'Rank')) {
                    acc.push(key);
                }
            });
            return acc;
        }, []);
    
        // Sort the keys to ensure they're in chronological order
        const sortedKeys = allKeys.sort((a, b) => {
            if (a === 'Rank') return -1;
            if (b === 'Rank') return 1;
            return a.localeCompare(b);
        });
    
        // Keep 'Rank' and all months except the first one
        const keysToInclude = [sortedKeys[0], ...sortedKeys.slice(2)];
    
        const formatColumnHeader = (key) => {
            if (!key) return ''; // Handle undefined key
            if (key.toLowerCase() === 'rank') {
                return 'Rank';
            } else if (key.includes('_network')) {
                const [year, month] = key.split('_')[0].split('-');
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthName = monthNames[parseInt(month, 10) - 1];
                return `${monthName} ${year}`;
            } else {
                return key;
            }
        };
    
        return keysToInclude.map(key => ({
            Header: formatColumnHeader(key),
            accessor: key,
        }));
    }, [dataTab2]);
     // RENDERING
    // What to render based on the state of the data
    if (isLoading) {
        return (
            <SectionLayout title='Engagment Rankings'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout title='Engagment Rankings' >
                <div>Error: {error.message}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered engagement rankings section (activeTab:', activeTab,')');
    return (
        <SectionLayout title='Engagment Rankings'>
            <CustomTabs tabs={['Current Period Rankings', 'Rankings Over Time']} activeTab={activeTab} setActiveTab={setActiveTab}>
                <div id='tab1' className="flex flex-col items-center">
                    <h2 className="font-semibold mb-2">
                        SN Ranking by Market for {endMonth}
                    </h2>
                    <EngagementTableRank
                        columns={columnsTab1}
                        data={dataTab1}
                    />
                </div>
                <div id='tab2' className='flex flex-col items-center'>
                    <h2 className="font-semibold mb-2">
                        Rankings for Previous 6 Months
                    </h2>
                    <EngagementTableRankOvt
                        columns={columnsTab2}
                        data={dataTab2}
                    />
                </div>
            </CustomTabs>
        </SectionLayout>
    );
};
    


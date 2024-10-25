// @ts-nocheck

import { useState, useEffect, useMemo} from 'react';

// Custom Imports
// Hooks
import { fetchEngagementData } from '../../hooks/engagementHook.ts';

// Components
import { MoMDashboard, MoMNetworkChangeTable } from './CustomComponents.tsx';
import { EngagementTableMoMAll } from './TableComponent.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';
import { SectionLayout } from './SectionLayout.tsx';
import { CustomTabs } from './CustomTabs.tsx';
// Utils
import { limitDropdownMonths, generateDropdownMonths } from '../../utils/engagementUtils.ts';
import { getOneYearAgo, getPreviousMonth } from '../../utils/engagementUtils.ts';

export const MoMSection = ({ datarange }: { datarange: any }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('');

    // Generate the months for the dropdown, we want to limit the dropwn to Dec 2023
    const startDropdown = limitDropdownMonths(datarange.most_current_month, 12);
    const months = generateDropdownMonths(startDropdown, datarange.most_current_month);

    // Set the selected month 
    useEffect(() => {
        if (!selectedMonth) {
            setSelectedMonth(months[months.length - 1]);
        }
    }, [months]);

    const startMonth = getOneYearAgo(selectedMonth);
    const previousMonth = getPreviousMonth(selectedMonth);

    // Fetch the engagement data from the the over time endpoint in the backend
        // Fetch the engagement data from the the over time endpoint in the backend
    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/mom', 
        {
            "start_month": startMonth,
            "previous_month": previousMonth,
            "end_month": selectedMonth, 
        }, 
    ); 

    console.log('response meta data', responseMetaData);

    const momData = (responseData as any)?.mom_data || [];
    const uniqueMarkets = momData.map((row:any) => row['Market / Region']);

    // Generate the columns for table 1 (on tab 2)
    // Generate columns dynamically based on momTableData
    const generateColumns = (data:any) => {
        // Step 1: Identify unique keys and group them
        const uniqueKeys = new Set();
        data.forEach((row:any) => {
            Object.keys(row).forEach((key:any) => {
                if (key !== 'sorting_column') { // Exclude 'sorting_column' from being added
                    uniqueKeys.add(key);
                }
            });
        });

        // Step 2: Group keys by prefix (assuming '_' as separator)
        const groupedKeys: Record<string, string[]> = {};
        uniqueKeys.forEach((key:any) => {
            const [prefix, ...rest] = key.split('_');
            const suffix = rest.join('_');
            if (!groupedKeys[prefix]) {
            groupedKeys[prefix] = [];
            }
            if (suffix) {
            groupedKeys[prefix].push(suffix);
            }
        });

        // Step 3: Create column definitions
        const columns = Object.entries(groupedKeys).map(([prefix, suffixes]) => {
            if (suffixes.length === 0) {
            // No sub-columns, just a single column
            return { Header: prefix, accessor: prefix };
            } else {
            // Create sub-columns
            return {
                Header: prefix,
                accessor: prefix,
                columns: suffixes.map(suffix => ({
                Header: suffix.replace(/_/g, ' '), // Replace underscores with spaces for readability
                accessor: `${prefix}_${suffix}`
                }))
            };
            }
        });

        return columns;
    };

    const columnsTab1 = useMemo(() => generateColumns(momData), [momData]);
    const memodataTab1 = useMemo(() => momData, [momData]);

    if (isLoading) {
        return (
            <SectionLayout title='Engagement MoM Change'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }
    if (error) {
        return (
            <SectionLayout title='Engagement MoM Change'>
                <div>Error: {error}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered engagement MoM section (activeTab:', activeTab,')');
    return (
        <SectionLayout title='Engagement MoM Change' 
        subtitle='Current Month vs Previous Month vs. Previous 12 Months'
        monthDropdown={{
            months: months,
            selectedMonth: selectedMonth,
            onMonthChange: (value:any) => setSelectedMonth(value),
        }}>
            <CustomTabs tabs={['MoM Dashboard', 'Table View by Market and Network', 'Table View with % Change']} activeTab={activeTab} setActiveTab={setActiveTab}>
                <div id='tab1' className="flex flex-col items-center w-full h-full">
                    <MoMDashboard momDashboardData={momData} uniqueMarkets={uniqueMarkets} selectedMonth={selectedMonth} oneYearAgo={startMonth} previousMonth={previousMonth} />
                </div>
                <div id='tab2' className='flex flex-col items-center'>
                   <EngagementTableMoMAll columns={columnsTab1} data={memodataTab1} />
                </div>
                <div id='tab3' className='flex flex-col items-center'>
                   <MoMNetworkChangeTable momTableData={momData} selectedMonth={selectedMonth} oneYearAgo={startMonth} previousMonth={previousMonth} />
                </div>
            </CustomTabs>
        </SectionLayout>
    );
}
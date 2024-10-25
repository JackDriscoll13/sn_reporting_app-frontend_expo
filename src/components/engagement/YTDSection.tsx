// Has been transitioned to typescript
// Has been transitioned to use the new TANSTACK TABLE v8 


import { useState, useEffect, useMemo} from 'react';
// Custom Imports
//Hooks
import { fetchEngagementData } from '../../hooks/engagementHook.ts';

// Utils
import { limitDropdownMonths, generateDropdownMonths } from '../../utils/engagementUtils.ts';
import { getFirstMonthOfYear } from '../../utils/engagementUtils.ts';

// Components
import { SectionLayout } from './SectionLayout.tsx';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';
import { EngagementTableYTD } from './newtables/YTDTableComponent.tsx';

// Types
export const YTDSection = ({datarange}: {datarange: any}) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [networkFilter, setNetworkFilter] = useState('SN');

    // Generate the months for the dropdown, we want to limit the dropwn to Dec 2023
    const startDropdown = limitDropdownMonths(datarange.most_current_month, 12);
    const months = generateDropdownMonths(startDropdown, datarange.most_current_month);

    // Set the selected month 
    useEffect(() => {
        if (!selectedMonth) {
            setSelectedMonth(months[months.length - 1]);
        }
    }, [months]);

    const firstMonthOfYear = getFirstMonthOfYear(selectedMonth);

    // Fetch the data from the backend
    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/ytd', 
        {
            "start_month": firstMonthOfYear,
            "end_month": selectedMonth
        }
    );

    console.log(responseMetaData);

    
    // Data for tab 1
    // Filter the data based on the network selected
    const tableData = useMemo(() => {
        if (!responseData) return [];

        let filteredData;
        switch(networkFilter) {
            case 'SN':
                filteredData = (responseData as { ytd_cable?: any[] }).ytd_cable || [];
                break;
            case 'Big 4':
                filteredData = (responseData as { ytd_big4?: any[] }).ytd_big4 || [];
                break;
            case 'Cable News':
                filteredData = (responseData as { ytd_cable?: any[] }).ytd_cable || [];
                break;
            default:
                filteredData = [];
        }

        return filteredData;
    }, [responseData, networkFilter]);


    const ytdcols = [
        {
          header: 'Market / Region',
          accessorKey: 'Market / Region', // accessorKey is the "key" in the data
        },
        {
          header: "Service Subs (000's)",
          accessorKey: 'service_subs',
        },
        {
          header: "Engaged Viewers (000's)",
          accessorKey: 'engaged_viewers',
        },
        {
          header: "Percent Engaged",
          accessorKey: 'percent_engaged',
        },
        {
          header: 'Highly Engaged Viewers (000s)',
          accessorKey: 'highly_engaged_viewers',
        },
        {
          header: 'Percent Highly Engaged', 
          accessorKey: 'percent_highly_engaged',
         }
      ]

    // RENDERING
    // What to render based on the state of the data
    if (isLoading) {
        return (
            <SectionLayout title='Engagement Year to Date'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout title='Engagement Year to Date'>
                <div>Error: {error}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered YTD section.');
    return (
        <SectionLayout title='Engagement Year to Date' 
        subtitle={`(${firstMonthOfYear} - ${selectedMonth})`}
        monthDropdown={{
            months: months,
            selectedMonth: selectedMonth,
            onMonthChange: (value:string) => setSelectedMonth(value),
        }}>
        <div className='flex flex-col items-center'>
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
            <EngagementTableYTD columns={ytdcols} data={tableData} />
            </div>
        </SectionLayout>
    );
}
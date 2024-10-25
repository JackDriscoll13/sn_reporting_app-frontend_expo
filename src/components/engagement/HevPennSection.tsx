// @ts-nocheck

// Quarterly Component
import React, { useMemo, useState, useEffect } from 'react';
// Custom Imports 
import { fetchEngagementData } from '../../hooks/engagementHook.ts';
import { SectionLayout } from './SectionLayout.tsx';
import { EngagementTableHev } from './TableComponent.tsx';
import { generateDropdownMonths, limitDropdownMonths } from '../../utils/engagementUtils.ts';
import { getElevenMonthsAgo, getOneYearAgo, getTwentyThreeMonthsAgo } from '../../utils/engagementUtils.ts';
import { EngagementTableSpinner } from '../common/SpinnerAnimations.tsx';

export const HevPennSection = ({ datarange }) => {
    // Defining State for the component
    const [selectedMonth, setSelectedMonth] = useState('');

    // Generate the months for the dropdown, we want to limit the dropwn to Dec 2023
    const startDropdown = limitDropdownMonths(datarange.most_current_month, 3);
    const months = generateDropdownMonths(startDropdown, datarange.most_current_month);

    useEffect(() => {
        if (!selectedMonth) {
            setSelectedMonth(months[months.length - 1]);
        }
    }, [months]);
    // Get the start and end date of the current period
    const currentPeriodEnd = selectedMonth;
    const currentPeriodStart = getElevenMonthsAgo(selectedMonth);
    
    // Get the start and end date of the previous period
    const previousPeriodStart = getTwentyThreeMonthsAgo(selectedMonth);
    const previousPeriodEnd = getOneYearAgo(selectedMonth);

    const { data: responseData, metadata: responseMetaData, isLoading, error } = fetchEngagementData(
        '/hev', 
        {
            "curr_period_start": currentPeriodStart, 
            "curr_period_end": currentPeriodEnd, 
            "prev_period_start": previousPeriodStart, 
            "prev_period_end": previousPeriodEnd, 
        }, 
    );

    const hevData = responseData?.hev_data || [];

    // Define the columns based on the metadata
    const generateColumns = (hevData) => {
                // Step 1: Identify unique keys and group them
                const uniqueKeys = new Set();
                hevData.forEach(row => {
                    Object.keys(row).forEach(key => {
                        if (key !== 'sorting_column') { // Exclude 'sorting_column' from being added
                            uniqueKeys.add(key);
                        }
                    });
                });
        
                // Step 2: Group keys by prefix (assuming '_' as separator)
                const groupedKeys = {};
                uniqueKeys.forEach(key => {
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
                        // Special handling for 'hevchange' column
                        if (prefix === 'hevchange') {
                            return { Header: "%Change", accessor: prefix }; // Or use "Δ" for Delta
                        }
                        return { Header: prefix, accessor: prefix };
                    } else {
                        return {
                            Header: prefix,
                            accessor: prefix,
                            columns: suffixes.map(suffix => {
                                // Special handling for 'hevchange' column
                                if (`${suffix}` === 'hevchange') {
                                    return { Header: "% Change", accessor: `${prefix}_hevchange` }; // Or use "Δ" for Delta
                                }
                                return {
                                    Header: suffix.replace(/_/g, ' '),
                                    accessor: `${prefix}_${suffix}`
                                };
                            })
                        };
                    }
                });
            
                return columns;
            };
            const columns = useMemo(() => generateColumns(hevData), [hevData]);
            const memodata = useMemo(() => hevData, [hevData]);
    


    // RENDERING
    // What to render based on the state of the data
    if (isLoading) {
        return (
            <SectionLayout title='Highly Engaged Viewers with Competitors'>
                <EngagementTableSpinner />
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout title='Highly Engaged Viewers with Competitors'>
                <div>Error: {error.message}</div>
            </SectionLayout>
        );
    }
    console.log('Successfully rendered HevPennSection.');
    return (
        <SectionLayout title='Highly Engaged Viewers With Competitors' 
        subtitle={`(Current Period vs Pervious Period)`}
        monthDropdown={{
            months: months,
            selectedMonth: selectedMonth,
            onMonthChange: (value) => setSelectedMonth(value),
        }}
        >
    
            <EngagementTableHev
                columns={columns}
                data={memodata}
            />

        </SectionLayout>
    );
};

// Monthly engagement reporting page
import React, { useState, useEffect } from 'react';
import { backendUrl } from '../config.ts';
import { MainEngagementTabs } from '../components/engagement/CustomTabs.tsx';

import { YTDSection } from '../components/engagement/YTDSection.tsx';
import { MoMSection } from '../components/engagement/MoMSection.tsx';
import { OverTimeSection } from '../components/engagement/OverTimeSection.tsx';
import { RankSection } from '../components/engagement/RankSection.tsx';
import { HevPennSection } from '../components/engagement/HevPennSection.tsx';
import { QuarterlySection } from '../components/engagement/QuarterlySection.tsx';
import { PeriodicityHistSection } from '../components/engagement/PeriodicityHistSection.tsx';
import { ExcelPowerpointDownload } from '../components/engagement/ExcelPowerpointDownload.tsx';

interface DataRange {
	oldest_month: string;
	most_current_month: string;
}

interface EngHeaderProps {
	data: DataRange;
	setData: React.Dispatch<React.SetStateAction<DataRange>>;
}

const EngHeader: React.FC<EngHeaderProps> = ({ data, setData }) => {
	useEffect(() => {
		const fetchDataRange = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/engagement/data_range`);
				const responseData = await response.json();
				const data_range: DataRange = responseData.data;
				setData(data_range);
				console.log('Successfully fetched engagement data range:', data_range);
			} catch (error) {
				console.error('Error fetching engagement data range:', error);
			}
		};

		fetchDataRange();
	}, [setData]);

	return (
		<section id='header' className='flex flex-row justify-between items-center w-full z-10'>
			<div>
				<h1 className='text-3xl font-bold text-snbluehero2 text-left'>Engagement Monthly Report</h1>
				<p className='text-md text-left'>Explore our engagement data in detail.</p>
			</div>
			<div className='text-center ml-4 p-4 shadow-lg'>
				<span className='text-lg font-medium text-snbluehero1'>Engagement Data Available: </span>
				<p className='text-xl font-semibold text-snbluehero2'>{data.oldest_month} <span className='text-snbluehero1'>&mdash;</span> {data.most_current_month}</p>
			</div>
		</section>
	);
};

interface EngagementReportProps {
	isNavBarCollapsed: boolean;
}

const EngagementReport: React.FC<EngagementReportProps> = ({ isNavBarCollapsed }) => {
	const pageStyle = {
		width: isNavBarCollapsed ? '94%' : '79%',
		marginLeft: isNavBarCollapsed ? '5%' : '16%',
	};
	const mainStyle = {
		width: '96%',
		marginLeft: '2%',
	};

	const [data_range, setDatarange] = useState<DataRange>({ oldest_month: '', most_current_month: '' });
	const [activeTab, setActiveTab] = useState(0);

	const tabs = [
		'YTD',
		'MoM',
		'Over Time',
		'Rank',
		'Hev Penn',
		'By Quarter / Year',
		'Periodicity History',
		'Excel/PPT Download',
	];

	return (
		<div style={pageStyle} className="flex flex-col justify-end w-full pt-12 h-screen overflow-hidden">
			<main style={mainStyle} className="flex-grow max-h-screen overflow-scroll z-10">
				<EngHeader data={data_range} setData={setDatarange} />
				<div className="pt-16 flex items-center justify-center pb-16">
					<MainEngagementTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
						<YTDSection datarange={data_range} />
						<MoMSection datarange={data_range} />
						<OverTimeSection datarange={data_range} />
						<RankSection datarange={data_range} />
						<HevPennSection datarange={data_range} />
						<QuarterlySection datarange={data_range} />
						<PeriodicityHistSection datarange={data_range} />
						<ExcelPowerpointDownload />
					</MainEngagementTabs>
				</div>
			</main>
		</div>
	);
};

export default EngagementReport;


import React from 'react';

interface SectionLayoutProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  monthDropdown?: any;
}

export const SectionLayout = ({ 
  title, 
  subtitle, 
  children, 
  monthDropdown
}: SectionLayoutProps) => (
  <section className='flex flex-col justify-center items-left w-full mt-16 border-black border-2'>
    <div className='flex flex-row justify-between items-center w-full'>
      <div>
        <h2 className='text-2xl text-left font-bold text-snbluehero1'>{title}</h2>
        <span className='text-md text-left text-snbluehero2'>{subtitle}</span>
      </div>
      {monthDropdown && (
        <select 
          className='mr-6 text-snbluehero1 bg-white border-2 border-snbluehero1 rounded-md p-2'
          value={monthDropdown.selectedMonth} 
          onChange={(e) => monthDropdown.onMonthChange(e.target.value)}
        >
          {monthDropdown.months.map((month:any, index:any) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
      )}
    </div>
    {children}
  </section>
);
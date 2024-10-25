
import React, { ReactNode } from 'react';


interface TabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  children: ReactNode;
}

export const CustomTabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, children }) => {
  return (
    <div className="p-2">
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};


export const MainEngagementTabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, children }) => {
  return (
    <div className="w-full">
      <div className="flex border-b-2 border-gray-200 items-center justify-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 font-bold text-xl ${
              activeTab === index
                ? 'border-b-2 border-snbluehero2 text-snbluehero2'
                : 'text-gray-600 hover:text-snbluehero1'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};
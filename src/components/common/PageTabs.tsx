
import React, { ReactNode } from 'react';


interface TabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  children: ReactNode;
}


const PageTabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, children }) => {
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

  export default PageTabs;
  
  

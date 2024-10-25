import { useState } from "react";
import PageTabs from "../components/common/PageTabs";
// Nielsen Daily Report Components
import NielsenUpload from "../components/nielsen_report/fileUpload";
import SetParameters from "../components/nielsen_report/reportParameters";
import GenerateNielsenReport from "../components/nielsen_report/generateReport";

// Nielsen Config Components
import BenchmarkFileUpload from "../components/nielsen_report/benchmarkFileUpload";
import ConfigReportDetails from "../components/nielsen_report/confgReportDetails";
import ConfigReportAdjustableMappings from "../components/nielsen_report/configReportAdjustableMappings";
import ConfigReportMappingDownload from "../components/nielsen_report/configReportMappingDownload";

// Add this type definition
type FileContent = {
  name: string;
  content: ArrayBuffer;
  type: string;
  verified: boolean;
  warn: boolean;
};

const NielsenDaily = ({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }): JSX.Element => {
  // Custom width for the page based on the navbar state
  const pageStyle = {
    width: isNavBarCollapsed ? '94%' : '79%',
    marginLeft: isNavBarCollapsed ? '5%' : '16%',
  };
  const mainStyle = {
    width: '96%',
    marginLeft: '2%',
  };

  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  /// File State
  const [files, setFiles] = useState<FileContent[]>([]);
  // Report Parameters State
  const [uploadToDb, setUploadToDb] = useState(false);
  const [autoDownloadReports, setAutoDownloadReports] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  // Generate Report State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  return (
    <div style={pageStyle} className="flex flex-col justify-end w-full pt-6 h-screen overflow-hidden">
      <main style={mainStyle} className="flex-grow max-h-screen overflow-scroll z-10">
        <h1 className="text-3xl font-bold mb-4">Nielsen Daily</h1>
        <PageTabs 
          tabs={["Daily Report", "Report Config", "Report Documentation"]} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        >
          <div id="daily-report">
            <NielsenUpload files={files} setFiles={setFiles} />
            <SetParameters
              emailTo={emailTo}
              setEmailTo={setEmailTo}
              uploadToDb={uploadToDb}
              setUploadToDb={setUploadToDb}
              autoDownloadReports={autoDownloadReports}
              setAutoDownloadReports={setAutoDownloadReports}
            />
			<GenerateNielsenReport
				emailTo={emailTo}
				uploadToDb={uploadToDb}
				autoDownloadReports={autoDownloadReports}
				files={files}
        isGeneratingReport={isGeneratingReport}
				setIsGeneratingReport={setIsGeneratingReport}
				
			/>
          </div>	
          <div id="current-benchmark">
            <h2 className="text-lg font-semibold mb-2">Benchmark Data</h2>
			<BenchmarkFileUpload/>
			<h2 className="text-lg font-semibold mb-2 mt-8">Report Details</h2>
			<ConfigReportDetails/>
			<h2 className="text-lg font-semibold mb-2 mt-8">Adjustable DMA Name and Penetration % Mapping</h2>
			<ConfigReportAdjustableMappings/>
			<h2 className="text-lg font-semibold mb-2 mt-8">Additional Mappings</h2>
			<ConfigReportMappingDownload/>

          </div>
          <div id="report-documentation">
            <h2 className="text-2xl font-semibold mb-2">Report Documentation</h2>
            <p>Coming Soon</p>
          </div>
          
        </PageTabs>
      </main>
    </div>
  );
};

export default NielsenDaily;
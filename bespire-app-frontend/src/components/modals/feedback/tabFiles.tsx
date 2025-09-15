/* eslint-disable @typescript-eslint/no-explicit-any */
import FilesSectionTab from "../../file_manager/FilesSectionTab";



export default function TabFilesByType({ linkedToId, linkedToType }: any) {
  
  return (
    <div className="p-6 flex flex-col gap-4">
      <FilesSectionTab 
        linkedToId={linkedToId} 
        linkedToType={linkedToType} 
      />
    </div>
  );
}

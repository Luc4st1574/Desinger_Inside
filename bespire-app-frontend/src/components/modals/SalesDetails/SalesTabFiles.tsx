// components/SalesTabFiles.tsx
import salesData from "@/data/salesData.json";
type Prospect = typeof salesData.prospects.list[0];

export default function SalesTabFiles({ prospect }: { prospect: Prospect }) {
  return (
    <div className="p-6 flex flex-col gap-4">
      <h2 className="font-medium text-lg">All Files</h2>
      {prospect.files.length > 0 ? (
        <ul className="space-y-3">
          {prospect.files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-gray-500">
                  Uploaded by {file.author} on {file.date}
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No files have been uploaded for this prospect.</p>
        </div>
      )}
    </div>
  );
}
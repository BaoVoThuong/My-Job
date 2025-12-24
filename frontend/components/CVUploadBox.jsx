import React, { useRef, useState } from 'react';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';

const CVUploadBox = ({ currentCvUrl, onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(currentCvUrl ? "My_CV.pdf" : "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      // Giả lập upload mất 1.5s
      setTimeout(() => {
        setIsUploading(false);
        const fakeUrl = URL.createObjectURL(file); 
        onUploadSuccess(fakeUrl); 
      }, 1500);
    }
  };

  const handleRemove = () => {
    setFileName("");
    onUploadSuccess(""); 
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
      <input type="file" accept=".pdf,.doc,.docx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      {fileName ? (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText size={20} /></div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{fileName}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">{isUploading ? "Uploading..." : <><CheckCircle size={10} /> Uploaded</>}</p>
            </div>
          </div>
          <button type="button" onClick={handleRemove} className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full transition-colors"><Trash2 size={18} /></button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current.click()} className="cursor-pointer flex flex-col items-center gap-2">
          <div className="bg-gray-100 p-3 rounded-full text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors"><Upload size={24} /></div>
          <div><p className="text-sm font-bold text-gray-700">Upload your CV</p><p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p></div>
        </div>
      )}
    </div>
  );
};

export default CVUploadBox;
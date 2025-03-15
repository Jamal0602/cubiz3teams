
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileText, Upload, FolderOpen, Search, 
  Share2, FilePlus, Trash2, Download,
  Image, File, Video
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Files = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  
  // Demo files data - would be fetched from Supabase in a real implementation
  const files = [
    { id: '1', name: 'Project Proposal.docx', type: 'document', size: '245 KB', owner: 'You', shared: true, created: '2023-05-12' },
    { id: '2', name: 'Team Photo.jpg', type: 'image', size: '1.2 MB', owner: 'Jane Smith', shared: true, created: '2023-05-10' },
    { id: '3', name: 'Budget Spreadsheet.xlsx', type: 'spreadsheet', size: '345 KB', owner: 'You', shared: false, created: '2023-05-08' },
    { id: '4', name: 'Meeting Recording.mp4', type: 'video', size: '24.5 MB', owner: 'John Doe', shared: true, created: '2023-05-05' },
    { id: '5', name: 'Company Logo.png', type: 'image', size: '540 KB', owner: 'You', shared: false, created: '2023-04-28' },
    { id: '6', name: 'API Documentation.pdf', type: 'document', size: '1.8 MB', owner: 'Alice Wang', shared: true, created: '2023-04-25' },
  ];
  
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'document':
        return <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />;
      case 'spreadsheet':
        return <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />;
      case 'video':
        return <Video className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />;
      default:
        return <File className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />;
    }
  };
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };
  
  const handleFileUpload = () => {
    toast.info('File upload functionality will be implemented in the next phase');
  };
  
  const handleCreateFolder = () => {
    toast.info('Create folder functionality will be implemented in the next phase');
  };
  
  const handleDownload = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to download');
      return;
    }
    toast.success(`${selectedFiles.length} file(s) will be downloaded`);
  };
  
  const handleDelete = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to delete');
      return;
    }
    toast.success(`${selectedFiles.length} file(s) deleted`);
    setSelectedFiles([]);
  };
  
  const handleShare = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to share');
      return;
    }
    toast.success(`Share dialog will open for ${selectedFiles.length} file(s)`);
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">File Sharing</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-7 sm:pl-8 text-xs sm:text-sm h-8 sm:h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button 
            onClick={handleFileUpload} 
            className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Upload
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCreateFolder} 
            className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            <FolderOpen className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {isMobile ? "New" : "New Folder"}
          </Button>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 p-1 sm:p-2 bg-muted rounded text-xs sm:text-sm">
          <span>{selectedFiles.length} selected</span>
          <div className="flex-1"></div>
          <Button size="sm" variant="outline" onClick={handleDownload} className="h-7 sm:h-8 px-2 sm:px-3 text-xs">
            <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {!isMobile && "Download"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare} className="h-7 sm:h-8 px-2 sm:px-3 text-xs">
            <Share2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {!isMobile && "Share"}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete} className="h-7 sm:h-8 px-2 sm:px-3 text-xs">
            <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {!isMobile && "Delete"}
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-2 px-3 sm:px-6 py-3 sm:py-4">
          <CardTitle className="text-base sm:text-lg">Your Files</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage and share your files with team members
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredFiles.map(file => (
                <div 
                  key={file.id} 
                  className={`p-3 sm:p-4 border rounded-lg hover:border-primary cursor-pointer transition-all ${
                    selectedFiles.includes(file.id) ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleFileSelection(file.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                        <span className="text-xs text-muted-foreground">{file.created}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <span className="text-xs">{file.owner}</span>
                        {file.shared && (
                          <span className="text-xs flex items-center text-blue-500">
                            <Share2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1" /> Shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <FilePlus className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
              <p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium">No files found</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Try a different search term' : 'Upload your first file to get started'}
              </p>
              <Button className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-10" onClick={handleFileUpload}>
                <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upload File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Files;

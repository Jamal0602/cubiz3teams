
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, Upload, FolderOpen, Search, 
  Share2, FilePlus, Trash2, Download,
  FileIcon, Image, File, Video, Music
} from 'lucide-react';
import { toast } from 'sonner';

const Files = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
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
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-green-500" />;
      case 'spreadsheet':
        return <FileText className="h-6 w-6 text-emerald-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-red-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">File Sharing</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleFileUpload} className="flex-1 sm:flex-none">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" onClick={handleCreateFolder} className="flex-1 sm:flex-none">
            <FolderOpen className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded">
          <span className="text-sm">{selectedFiles.length} selected</span>
          <div className="flex-1"></div>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Files</CardTitle>
          <CardDescription>
            Manage and share your files with team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map(file => (
                <div 
                  key={file.id} 
                  className={`p-4 border rounded-lg hover:border-primary cursor-pointer transition-all ${
                    selectedFiles.includes(file.id) ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleFileSelection(file.id)}
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                        <span className="text-xs text-muted-foreground">{file.created}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs">{file.owner}</span>
                        {file.shared && (
                          <span className="text-xs flex items-center text-blue-500">
                            <Share2 className="h-3 w-3 mr-1" /> Shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FilePlus className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No files found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Try a different search term' : 'Upload your first file to get started'}
              </p>
              <Button className="mt-4" onClick={handleFileUpload}>
                <Upload className="mr-2 h-4 w-4" />
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

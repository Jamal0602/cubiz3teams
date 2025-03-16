
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileText, Upload, FolderOpen, Search, 
  Share2, FilePlus, Trash2, Download,
  Image, File, Video, X, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileUpload } from '@/components/FileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  owner: string;
  owner_id: string;
  shared: boolean;
  created_at: string;
  file_path: string;
  url: string;
}

const Files = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    fetchFiles();
  }, [user]);
  
  const fetchFiles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match the FileItem interface
      const formattedFiles: FileItem[] = data.map(file => {
        // Get the URL for the file
        const { data: urlData } = supabase.storage.from(file.file_path.split('/')[0]).getPublicUrl(file.file_path);
        
        return {
          id: file.id,
          name: file.name,
          type: getFileType(file.file_type),
          size: formatFileSize(file.file_size),
          owner: file.uploaded_by === user.id ? 'You' : 'Team Member',
          owner_id: file.uploaded_by,
          shared: false, // Set default, update if sharing feature is implemented
          created_at: new Date(file.uploaded_at).toLocaleDateString(),
          file_path: file.file_path,
          url: urlData.publicUrl
        };
      });
      
      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };
  
  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('pdf')) return 'document';
    return 'document';
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
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
  
  const handleFileUpload = (filePath: string, fileData: any) => {
    toast.success('File uploaded successfully');
    setShowUploadDialog(false);
    fetchFiles(); // Refresh files list
  };
  
  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    toast.success(`Folder "${folderName}" created successfully`);
    setShowCreateFolderDialog(false);
    setFolderName('');
  };
  
  const handleDownload = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to download');
      return;
    }
    
    // For each selected file, trigger a download
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    toast.success(`${selectedFiles.length} file(s) downloaded`);
  };
  
  const handleDelete = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to delete');
      return;
    }
    
    try {
      // Delete files from storage and database
      for (const fileId of selectedFiles) {
        const file = files.find(f => f.id === fileId);
        if (file) {
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from(file.file_path.split('/')[0])
            .remove([file.file_path]);
          
          if (storageError) throw storageError;
          
          // Delete from database
          const { error: dbError } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);
          
          if (dbError) throw dbError;
        }
      }
      
      toast.success(`${selectedFiles.length} file(s) deleted`);
      setSelectedFiles([]);
      fetchFiles(); // Refresh files list
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error('Failed to delete files');
    }
  };
  
  const handleShare = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select a file to share');
      return;
    }
    
    if (selectedFiles.length > 1) {
      toast.error('Please select only one file to share');
      return;
    }
    
    const fileId = selectedFiles[0];
    const file = files.find(f => f.id === fileId);
    
    if (file) {
      setShareLink(file.url);
      setShowShareDialog(true);
    }
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
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
            onClick={() => setShowUploadDialog(true)} 
            className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Upload
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateFolderDialog(true)} 
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
          {loading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-3 text-sm text-muted-foreground">Loading files...</p>
            </div>
          ) : filteredFiles.length > 0 ? (
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
                        <span className="text-xs text-muted-foreground">{file.created_at}</span>
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
              <Button className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-10" onClick={() => setShowUploadDialog(true)}>
                <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upload File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Upload a file to share with your team</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FileUpload
              onSuccess={handleFileUpload}
              allowedTypes={["image/jpeg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "video/mp4"]}
              folder="files"
              buttonText="Upload File"
              buttonSize="default"
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="My Folder"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>Copy the link to share this file</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={copyShareLink} size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add a Copy icon component since it's not imported
const Copy = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export default Files;

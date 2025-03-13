
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Upload, 
  FolderOpen, 
  File, 
  MoreVertical, 
  Download, 
  Trash, 
  Share2, 
  Info, 
  Users, 
  Lock, 
  Image, 
  FileText, 
  FilePdf, 
  FileSpreadsheet, 
  Video, 
  Music, 
  Archive,
  Filter,
  Search
} from 'lucide-react';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'image':
      return <Image className="h-6 w-6 text-blue-500" />;
    case 'pdf':
      return <FilePdf className="h-6 w-6 text-red-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    case 'document':
      return <FileText className="h-6 w-6 text-yellow-500" />;
    case 'video':
      return <Video className="h-6 w-6 text-purple-500" />;
    case 'audio':
      return <Music className="h-6 w-6 text-indigo-500" />;
    case 'archive':
      return <Archive className="h-6 w-6 text-orange-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};

// Sample data for files
const sampleFiles = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: 2500000,
    uploadedBy: {
      name: 'John Doe',
      avatar: ''
    },
    uploadedAt: '2023-08-15T10:30:00',
    team: 'Marketing',
    accessLevel: 'Team',
    starred: true
  },
  {
    id: '2',
    name: 'Team Budget.xlsx',
    type: 'spreadsheet',
    size: 1800000,
    uploadedBy: {
      name: 'Sarah Johnson',
      avatar: ''
    },
    uploadedAt: '2023-08-14T14:45:00',
    team: 'Finance',
    accessLevel: 'Private',
    starred: false
  },
  {
    id: '3',
    name: 'Website Mockup.png',
    type: 'image',
    size: 4500000,
    uploadedBy: {
      name: 'Michael Chen',
      avatar: ''
    },
    uploadedAt: '2023-08-13T09:15:00',
    team: 'Design',
    accessLevel: 'Public',
    starred: true
  },
  {
    id: '4',
    name: 'Product Roadmap.docx',
    type: 'document',
    size: 1200000,
    uploadedBy: {
      name: 'Emma Davis',
      avatar: ''
    },
    uploadedAt: '2023-08-12T16:20:00',
    team: 'Product',
    accessLevel: 'Team',
    starred: false
  },
  {
    id: '5',
    name: 'Training Video.mp4',
    type: 'video',
    size: 85000000,
    uploadedBy: {
      name: 'Robert Taylor',
      avatar: ''
    },
    uploadedAt: '2023-08-11T11:00:00',
    team: 'HR',
    accessLevel: 'Team',
    starred: false
  }
];

const Files = () => {
  const { profile } = useAuth();
  const [files, setFiles] = useState(sampleFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');
  
  const totalStorageUsed = files.reduce((acc, file) => acc + file.size, 0);
  // 1.5 GB in bytes
  const storageLimit = 1.5 * 1024 * 1024 * 1024;
  const storagePercentage = (totalStorageUsed / storageLimit) * 100;
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const file = selectedFiles[0];
    
    // Check if file size would exceed the limit
    if (totalStorageUsed + file.size > storageLimit) {
      toast.error('Not enough storage space. Upgrade or delete some files.');
      return;
    }
    
    setIsUploading(true);
    setUploadingFileName(file.name);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Add the new file to the list
        const newFile = {
          id: (files.length + 1).toString(),
          name: file.name,
          type: getFileTypeFromName(file.name),
          size: file.size,
          uploadedBy: {
            name: profile?.full_name || 'User',
            avatar: profile?.avatar_url || ''
          },
          uploadedAt: new Date().toISOString(),
          team: profile?.department || 'Unknown',
          accessLevel: 'Team',
          starred: false
        };
        
        setFiles([newFile, ...files]);
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }
    }, 200);
  };
  
  const getFileTypeFromName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (!extension) return 'document';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'spreadsheet';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'document';
    if (['mp4', 'mov', 'wmv', 'avi', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return 'audio';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
    
    return 'document';
  };
  
  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast.success('File deleted successfully');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">File Sharing</h1>
          <p className="text-muted-foreground mt-1">Share and manage files with your team</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              Upload File
            </label>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="recent">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared with me</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
            
            <TabsContent value="recent">
              {isUploading && (
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <File className="h-5 w-5 text-primary" />
                      <span className="font-medium">{uploadingFileName}</span>
                    </div>
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{uploadProgress}%</span>
                        <span>Uploading...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded by</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Access</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map(file => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div>
                                <div className="font-medium">{file.name}</div>
                                <div className="text-sm text-muted-foreground md:hidden">
                                  {formatDate(file.uploadedAt)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={file.uploadedBy.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(file.uploadedBy.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{file.uploadedBy.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(file.uploadedAt)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {file.accessLevel === 'Private' ? (
                                <Lock className="h-3 w-3" />
                              ) : file.accessLevel === 'Team' ? (
                                <Users className="h-3 w-3" />
                              ) : (
                                <Share2 className="h-3 w-3" />
                              )}
                              {file.accessLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shared">
              <Card className="p-8 text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No shared files</h3>
                <p className="text-muted-foreground mb-4">
                  Files shared with you will appear here
                </p>
                <Button variant="outline">Browse Team Files</Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="starred">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded by</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.filter(file => file.starred).map(file => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div>
                                <div className="font-medium">{file.name}</div>
                                <div className="text-sm text-muted-foreground md:hidden">
                                  {formatDate(file.uploadedAt)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={file.uploadedBy.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(file.uploadedBy.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{file.uploadedBy.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(file.uploadedAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>
                {formatFileSize(totalStorageUsed)} used of {formatFileSize(storageLimit)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={storagePercentage} />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-primary" />
                    <div>
                      <div className="text-sm font-medium">Documents</div>
                      <div className="text-xs text-muted-foreground">250 MB</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Images</div>
                      <div className="text-xs text-muted-foreground">120 MB</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-green-500" />
                    <div>
                      <div className="text-sm font-medium">Spreadsheets</div>
                      <div className="text-xs text-muted-foreground">80 MB</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-purple-500" />
                    <div>
                      <div className="text-sm font-medium">Videos</div>
                      <div className="text-xs text-muted-foreground">450 MB</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Upgrade Storage</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Recently accessed files</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {files.slice(0, 3).map(file => (
                  <div key={file.id} className="p-4 flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" className="w-full">View All Files</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Share with Team</CardTitle>
              <CardDescription>Quick share to your teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Marketing', 'Engineering', 'Design', 'Finance'].map(team => (
                  <div key={team} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{team.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{team} Team</span>
                    </div>
                    <Button variant="outline" size="sm">Share</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Files;

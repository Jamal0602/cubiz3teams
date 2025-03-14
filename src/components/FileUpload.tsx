
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onSuccess?: (filePath: string, fileData: any) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  folder?: string;
  teamId?: string;
  projectId?: string;
}

export const FileUpload = ({
  onSuccess,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
  maxSizeMB = 10,
  folder = 'general',
  teamId,
  projectId
}: FileUploadProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [queuedUploads, setQueuedUploads] = useState<{file: File, uploaded: boolean}[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track online/offline status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Process any queued uploads when coming back online
      if (queuedUploads.length > 0) {
        toast.info(`Processing ${queuedUploads.length} queued uploads...`);
        processQueuedUploads();
      }
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline. Files will be uploaded when you reconnect.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedUploads]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    // Check file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError(`File type not allowed. Please upload: ${allowedTypes.join(', ')}`);
      setFile(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File too large. Maximum size is ${maxSizeMB}MB`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const processQueuedUploads = async () => {
    if (!navigator.onLine) return;
    
    // Process each queued upload one by one
    for (const [index, item] of queuedUploads.entries()) {
      if (!item.uploaded) {
        try {
          await uploadToSupabase(item.file);
          // Mark as uploaded
          setQueuedUploads(prev => 
            prev.map((upload, i) => i === index ? {...upload, uploaded: true} : upload)
          );
        } catch (error) {
          console.error('Failed to upload queued file:', error);
        }
      }
    }
    
    // Clear successfully uploaded files from queue
    setQueuedUploads(prev => prev.filter(item => !item.uploaded));
  };

  const uploadToSupabase = async (fileToUpload: File) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Create a unique file path
      const fileExt = fileToUpload.name.split('.').pop();
      const filePath = `${folder}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);
      
      // Record in database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          name: fileToUpload.name,
          file_path: filePath,
          file_type: fileToUpload.type,
          file_size: fileToUpload.size,
          uploaded_by: user.id,
          team_id: teamId || null,
          project_id: projectId || null
        });
      
      if (dbError) throw dbError;
      
      setUploadSuccess(true);
      setProgress(100);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(filePath, { 
          url: urlData.publicUrl,
          name: fileToUpload.name,
          size: fileToUpload.size,
          type: fileToUpload.type
        });
      }
      
      return data;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(error.message || 'An error occurred during upload');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploadError(null);
    
    // If offline, queue the upload for later
    if (!navigator.onLine) {
      setQueuedUploads(prev => [...prev, { file, uploaded: false }]);
      toast.info('You are offline. File will be uploaded when you reconnect.');
      return;
    }
    
    try {
      await uploadToSupabase(file);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Upload File</Label>
        <Input 
          id="file" 
          type="file" 
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          Allowed types: {allowedTypes.join(', ')} | Max size: {maxSizeMB}MB
        </p>
      </div>
      
      {uploadError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{uploadError}</span>
        </div>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Uploading: {progress}%</p>
        </div>
      )}
      
      {uploadSuccess && (
        <div className="bg-primary/10 text-primary p-3 rounded-md flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">File uploaded successfully</span>
        </div>
      )}
      
      {isOffline && queuedUploads.length > 0 && (
        <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 p-3 rounded-md text-sm">
          {queuedUploads.length} file(s) queued for upload when you're back online
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
          isLoading={uploading}
          loadingText="Uploading..."
        >
          {isOffline ? (
            <>Queue for Upload</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
        
        {file && !uploading && (
          <Button
            variant="outline"
            onClick={() => setFile(null)}
            className="w-1/3"
          >
            Clear
          </Button>
        )}
      </div>
      
      {file && (
        <div className="flex items-center p-3 border rounded-md bg-muted/40">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <div className="text-sm">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB • {file.type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

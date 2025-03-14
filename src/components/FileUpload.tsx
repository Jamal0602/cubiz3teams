
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

export interface FileUploadProps {
  onSuccess: (filePath: string, fileData: any) => void;
  allowedTypes: string[];
  folder: string;
  buttonText?: string;
  buttonSize?: 'sm' | 'default' | 'lg' | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onSuccess,
  allowedTypes,
  folder,
  buttonText = "Upload File",
  buttonSize = "default"
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const resetUpload = () => {
    setFile(null);
    setProgress(0);
  };
  
  const uploadFile = async () => {
    if (!file || !user) return;
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (event) => {
            const percentProgress = (event.loaded / event.total) * 100;
            setProgress(percentProgress);
          }
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage.from('files').getPublicUrl(filePath);
      
      // Store file metadata in the database
      const { data: fileRecord, error: fileError } = await supabase
        .from('files')
        .insert({
          file_path: filePath,
          name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single();
      
      if (fileError) throw fileError;
      
      toast.success('File uploaded successfully');
      
      // Pass both the file path and the file data to the callback
      onSuccess(filePath, {
        ...fileRecord,
        url: urlData.publicUrl
      });
      
      resetUpload();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      {!file ? (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-center block">
                Drag & drop a file here, or click to select a file
              </span>
              <span className="text-xs text-muted-foreground text-center block mt-1">
                Allowed types: {allowedTypes.map(type => type.replace('image/', '.')).join(', ')}
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
                accept={allowedTypes.join(',')}
              />
            </Label>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded p-2">
                <Upload className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="font-medium truncate" style={{ maxWidth: '200px' }}>{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetUpload}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">
                {progress.toFixed(0)}%
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={uploadFile}
              disabled={uploading}
              size={buttonSize}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

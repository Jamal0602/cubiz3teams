
import React from 'react';
import { FileUpload } from './FileUpload';

interface FileUploadWrapperProps {
  onSuccess: (filePath: string, fileData: any) => void;
  accept: string;
  multiple: boolean;
  buttonProps: Record<string, any>;
  children?: React.ReactNode;
}

const FileUploadWrapper: React.FC<FileUploadWrapperProps> = ({
  onSuccess,
  accept,
  multiple,
  buttonProps,
  children,
}) => {
  return (
    <FileUpload
      onSuccess={onSuccess}
      allowedTypes={accept.split(',').map(type => type.trim())}
      folder="uploads"
      buttonText={buttonProps.text || "Upload"}
      buttonSize={buttonProps.size || "default"}
    >
      {children}
    </FileUpload>
  );
};

export default FileUploadWrapper;

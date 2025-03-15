
import React, { ReactNode } from 'react';
import { FileUpload } from './FileUpload';
import { Button } from '@/components/ui/button';

interface FileUploadWrapperProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  buttonProps?: Record<string, any>;
  children: ReactNode;
}

const FileUploadWrapper: React.FC<FileUploadWrapperProps> = ({
  onFilesSelected,
  accept,
  multiple,
  buttonProps,
  children
}) => {
  return (
    <FileUpload
      onFilesSelected={onFilesSelected}
      accept={accept}
      multiple={multiple}
      buttonProps={buttonProps}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </FileUpload>
  );
};

export default FileUploadWrapper;

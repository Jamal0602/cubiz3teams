
import React from 'react';
import { FileUpload } from './FileUpload';

interface FileUploadWrapperProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple: boolean;
  buttonProps: Record<string, any>;
}

const FileUploadWrapper: React.FC<FileUploadWrapperProps> = ({
  onFilesSelected,
  accept,
  multiple,
  buttonProps,
}) => {
  return (
    <FileUpload
      onFilesSelected={onFilesSelected}
      accept={accept}
      multiple={multiple}
      buttonProps={buttonProps}
    />
  );
};

export default FileUploadWrapper;

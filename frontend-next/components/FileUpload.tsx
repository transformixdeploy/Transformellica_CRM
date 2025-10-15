"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, XCircle, File as FileIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  fileName?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, onFileChange, accept, fileName: initialFileName, icon }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(initialFileName ? { name: initialFileName } as File : null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError('');
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError(`File type not accepted. Please upload ${accept}.`);
      setUploadedFile(null);
      onFileChange(null);
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileChange(file);
    }
  }, [accept, onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? accept.split(',').reduce((acc: { [key: string]: string[] }, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {}) : undefined,
    multiple: false,
  });

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setUploadedFile(null);
    onFileChange(null);
    setError('');
  };
  
  const displayFileName = uploadedFile?.name || initialFileName;

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70',
          error ? 'border-destructive' : ''
        )}
      >
        <input {...getInputProps()} id={id} />
        {displayFileName ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center text-green-600">
              {icon || <FileIcon className="w-8 h-8 mr-2" />}
              <span className="font-medium truncate max-w-xs">{displayFileName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="mt-2 text-destructive hover:text-destructive/80"
            >
              <XCircle className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <UploadCloud className="w-10 h-10 mb-2" />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>{"Drag 'n' drop a file here, or click to select file"}</p>
            )}
            <p className="text-xs mt-1">({accept || 'Any file type'})</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;

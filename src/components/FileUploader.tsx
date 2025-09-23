import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, disabled }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      setError(t('fileUploader.errors.invalidFileType'));
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <Input {...getInputProps()} />
      {isDragActive ? (
        <p>{t('fileUploader.dropMessage')}</p>
      ) : (
        <div>
          <p className="mb-4">{t('fileUploader.dragAndDrop')}</p>
          <Button type="button" disabled={disabled}>
            {t('fileUploader.selectFile')}
          </Button>
        </div>
      )}
      {error && <p className="text-destructive mt-4">{error}</p>}
    </div>
  );
};

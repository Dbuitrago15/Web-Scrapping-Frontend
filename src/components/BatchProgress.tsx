import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from './ui/progress';

interface BatchProgressProps {
  processed: number;
  total: number;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({ processed, total }) => {
  const { t } = useTranslation();
  const percentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{t('batchProgress.title')}</h3>
      <Progress value={percentage} className="w-full mb-2" />
      <p className="text-sm text-muted-foreground">
        {t('batchProgress.progressText', { processed, total })}
      </p>
    </div>
  );
};

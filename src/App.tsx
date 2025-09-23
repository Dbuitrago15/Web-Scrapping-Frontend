import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploader } from './components/FileUploader';
import { BatchProgress } from './components/BatchProgress';
import { ResultsTable } from './components/ResultsTable';
import { LanguageSelector } from './components/LanguageSelector';
import { uploadFile, getBatchStatus } from './services/api';
import type { Batch } from './types/api';

type AppState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

function App() {
  const { t } = useTranslation();
  const [appState, setAppState] = useState<AppState>('idle');
  const [batch, setBatch] = useState<Batch | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lógica de polling para verificar el estado del lote
  useEffect(() => {
    if (appState === 'processing' && batch?.id) {
      const intervalId = setInterval(async () => {
        try {
          const response = await getBatchStatus(batch.id);
          const updatedBatch = response.data;
          setBatch(updatedBatch);

          if (updatedBatch.status === 'COMPLETED') {
            setAppState('completed');
            clearInterval(intervalId);
          } else if (updatedBatch.status === 'FAILED') {
            setAppState('error');
            setError(t('app.error'));
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error(err);
          setAppState('error');
          setError(t('app.error'));
          clearInterval(intervalId);
        }
      }, 3000); // Polling cada 3 segundos

      return () => clearInterval(intervalId);
    }
  }, [appState, batch?.id, t]);

  const handleFileUpload = async (file: File) => {
    setAppState('uploading');
    setError(null);
    try {
      const response = await uploadFile(file);
      setBatch(response.data);
      setAppState('processing');
    } catch (err) {
      console.error(err);
      setAppState('error');
      setError(t('app.error'));
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'idle':
      case 'uploading':
        return (
          <FileUploader
            onFileUpload={handleFileUpload}
            disabled={appState === 'uploading'}
          />
        );
      case 'processing':
        return (
          <BatchProgress
            processed={batch?.processed_records || 0}
            total={batch?.total_records || 0}
          />
        );
      case 'completed':
        return <ResultsTable data={batch?.results || []} />;
      case 'error':
        return <p className="text-destructive">{error}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative">
      <LanguageSelector />
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('app.title')}</h1>
          <p className="text-muted-foreground">{t('app.description')}</p>
        </header>
        <main>{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;


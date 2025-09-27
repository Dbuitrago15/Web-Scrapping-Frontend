"use client"

import { useMemo } from 'react'
import { useLanguage, Language } from '@/contexts/language-context'

export type TranslationKey = 
  | 'title'
  | 'subtitle'
  | 'start_scraping'
  | 'search_placeholder'
  | 'location_placeholder'
  | 'city_label'
  | 'results_found'
  | 'no_results'
  | 'error_loading'
  | 'error.upload'
  | 'error.processing'
  | 'loading'
  | 'stop_scraping'
  | 'progress'
  | 'name'
  | 'rating'
  | 'rating_count'
  | 'phone'
  | 'address'
  | 'website'
  | 'price_range'
  | 'category'
  | 'monday_hours'
  | 'tuesday_hours'
  | 'wednesday_hours'
  | 'thursday_hours'
  | 'friday_hours'
  | 'saturday_hours'
  | 'sunday_hours'
  | 'view_details'
  | 'completion_time'
  | 'results_statistics'
  | 'success_rate'
  | 'processing_errors'
  | 'data_quality'
  | 'performance_metrics'
  | 'completion_details'
  | 'successful_results'
  | 'failed_results'
  | 'google_errors'
  | 'network_errors'
  | 'parsing_errors'
  | 'timeout_errors'
  | 'avg_processing_time'
  | 'total_processing_time'
  | 'complete_profiles'
  | 'partial_profiles'
  | 'missing_data'
  | 'invalid_format'
  | 'results_breakdown'
  | 'error_breakdown'
  | 'language_selector'
  | 'backend_services_status'
  | 'up'
  | 'down'
  | 'start_backend'
  | 'api_running_redis_worker_unknown'
  | 'check_docker_compose'
  | 'processing_complete'
  | 'successfully_processed'
  | 'businesses_with'
  | 'success_rate_with_details'
  | 'successful'
  | 'failed'
  | 'view_detailed_results'
  | 'upload.title'
  | 'upload.description'
  | 'upload.selectFile'
  | 'upload.button'
  | 'upload.uploading'
  | 'download_csv'
  | 'export_results'
  | 'results.title'
  | 'table.entries'
  | 'table.search'
  | 'table.noResults'
  | 'table.rowsPerPage'
  | 'table.page'
  | 'table.of'
  | 'table.showing'
  | 'processing.status'
  | 'processing.progress'
  | 'processing.button'
  | 'error.title'
  | 'error.retry'
  | 'table.input_name'
  | 'table.found_name'
  | 'table.input_address'
  | 'table.found_phone'
  | 'table.found_website'
  | 'table.found_on_maps'
  | 'table.input_data'
  | 'table.normalized'

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    title: 'Web Scraping Tool',
    subtitle: 'Upload your CSV file and get enhanced business data',
    'error.upload': 'Failed to upload file. Please check the file and try again.',
    'error.processing': 'An error occurred while processing your file.',
    start_scraping: 'Start Scraping',
    search_placeholder: 'Search for businesses...',
    location_placeholder: 'Enter location',
    city_label: 'City',
    results_found: 'results found',
    no_results: 'No results found',
    error_loading: 'Error loading results',
    loading: 'Loading...',
    stop_scraping: 'Stop Scraping',
    progress: 'Progress',
    name: 'Name',
    rating: 'Rating',
    rating_count: 'Reviews',
    phone: 'Phone',
    address: 'Address',
    website: 'Website',
    price_range: 'Price Range',
    category: 'Category',
    monday_hours: 'Monday',
    tuesday_hours: 'Tuesday',
    wednesday_hours: 'Wednesday',
    thursday_hours: 'Thursday',
    friday_hours: 'Friday',
    saturday_hours: 'Saturday',
    sunday_hours: 'Sunday',
    view_details: 'View Details',
    completion_time: 'Completion Time',
    results_statistics: 'Results Statistics',
    success_rate: 'Success Rate',
    processing_errors: 'Processing Errors',
    data_quality: 'Data Quality',
    performance_metrics: 'Performance Metrics',
    completion_details: 'Completion Details',  
    successful_results: 'Successful',
    failed_results: 'Failed',
    google_errors: 'Google Errors',
    network_errors: 'Network Errors',
    parsing_errors: 'Parsing Errors',
    timeout_errors: 'Timeout Errors',
    avg_processing_time: 'Avg Processing Time',
    total_processing_time: 'Total Processing Time',
    complete_profiles: 'Complete Profiles',
    partial_profiles: 'Partial Profiles',
    missing_data: 'Missing Data',
    invalid_format: 'Invalid Format',
    results_breakdown: 'Results Breakdown',
    error_breakdown: 'Error Breakdown',
    language_selector: 'Language',
    backend_services_status: 'Backend Services Status',
    up: 'Up',
    down: 'Down',
    start_backend: 'Start backend',
    api_running_redis_worker_unknown: 'API is running but Redis/Worker status unknown.',
    check_docker_compose: 'Check',
    processing_complete: 'Processing Complete!',
    successfully_processed: 'Successfully processed',
    businesses_with: 'businesses with',
    success_rate_with_details: 'success rate',
    successful: 'successful',
    failed: 'failed',
    view_detailed_results: 'View Detailed Results',
    'upload.title': 'Upload CSV File',
    'upload.description': 'Select a CSV file containing business information to process and enhance.',
    'upload.selectFile': 'Select CSV File',
    'upload.button': 'Process File',
    'upload.uploading': 'Uploading file...',
    download_csv: 'Download CSV',
    export_results: 'Export Results',
    'results.title': 'Results',
    'table.entries': 'entries',
    'table.search': 'Search...',
    'table.noResults': 'No results found.',
    'table.rowsPerPage': 'Rows per page',
    'table.page': 'Page',
    'table.of': 'of',
    'table.showing': 'Showing',
    'processing.status': 'Processing Status',
    'processing.progress': 'Processing {completed} of {total}...',
    'processing.button': 'Processing...',
    'error.title': 'Error',
    'error.retry': 'Retry',
    'table.input_name': 'Input Name',
    'table.found_name': 'Found Name',
    'table.input_address': 'Input Address',
    'table.found_phone': 'Found Phone',
    'table.found_website': 'Found Website',
    'table.found_on_maps': 'Found on Google Maps',
    'table.input_data': 'Input',
    'table.normalized': 'Normalized'
  },
  fr: {
    title: 'Outil de Web Scraping',
    subtitle: 'Téléchargez votre fichier CSV et obtenez des données d\'entreprise améliorées',
    'error.upload': 'Échec du téléchargement du fichier. Veuillez vérifier le fichier et réessayer.',
    'error.processing': 'Une erreur s\'est produite lors du traitement de votre fichier.',
    start_scraping: 'Démarrer le Scraping',
    search_placeholder: 'Rechercher des entreprises...',
    location_placeholder: 'Entrer l\'emplacement',
    city_label: 'Ville',
    results_found: 'résultats trouvés',
    no_results: 'Aucun résultat trouvé',
    error_loading: 'Erreur lors du chargement des résultats',
    loading: 'Chargement...',
    stop_scraping: 'Arrêter le Scraping',
    progress: 'Progrès',
    name: 'Nom',
    rating: 'Note',
    rating_count: 'Avis',
    phone: 'Téléphone',
    address: 'Adresse',
    website: 'Site Web',
    price_range: 'Gamme de Prix',
    category: 'Catégorie',
    monday_hours: 'Lundi',
    tuesday_hours: 'Mardi',
    wednesday_hours: 'Mercredi',
    thursday_hours: 'Jeudi',
    friday_hours: 'Vendredi',
    saturday_hours: 'Samedi',
    sunday_hours: 'Dimanche',
    view_details: 'Voir les Détails',
    completion_time: 'Temps d\'Achèvement',
    results_statistics: 'Statistiques des Résultats',
    success_rate: 'Taux de Réussite',
    processing_errors: 'Erreurs de Traitement',
    data_quality: 'Qualité des Données',
    performance_metrics: 'Métriques de Performance',
    completion_details: 'Détails d\'Achèvement',
    successful_results: 'Réussis',
    failed_results: 'Échoués',
    google_errors: 'Erreurs Google',
    network_errors: 'Erreurs Réseau',
    parsing_errors: 'Erreurs d\'Analyse',
    timeout_errors: 'Erreurs de Délai',
    avg_processing_time: 'Temps de Traitement Moyen',
    total_processing_time: 'Temps de Traitement Total',
    complete_profiles: 'Profils Complets',
    partial_profiles: 'Profils Partiels',
    missing_data: 'Données Manquantes',
    invalid_format: 'Format Invalide',
    results_breakdown: 'Répartition des Résultats',
    error_breakdown: 'Répartition des Erreurs',
    language_selector: 'Langue',
    backend_services_status: 'État des Services Backend',
    up: 'En marche',
    down: 'Arrêté',
    start_backend: 'Démarrer le backend',
    api_running_redis_worker_unknown: 'L\'API fonctionne mais l\'état Redis/Worker est inconnu.',
    check_docker_compose: 'Vérifier',
    processing_complete: 'Traitement Terminé!',
    successfully_processed: 'Traité avec succès',
    businesses_with: 'entreprises avec',
    success_rate_with_details: 'taux de réussite',
    successful: 'réussi',
    failed: 'échoué',
    view_detailed_results: 'Voir les Résultats Détaillés',
    'upload.title': 'Télécharger un Fichier CSV',
    'upload.description': 'Sélectionnez un fichier CSV contenant des informations d\'entreprise à traiter et améliorer.',
    'upload.selectFile': 'Sélectionner un Fichier CSV',
    'upload.button': 'Traiter le Fichier',
    'upload.uploading': 'Téléchargement du fichier...',
    download_csv: 'Télécharger CSV',
    export_results: 'Exporter les Résultats',
    'results.title': 'Résultats',
    'table.entries': 'entrées',
    'table.search': 'Rechercher...',
    'table.noResults': 'Aucun résultat trouvé.',
    'table.rowsPerPage': 'Lignes par page',
    'table.page': 'Page',
    'table.of': 'de',
    'table.showing': 'Affichage',
    'processing.status': 'Statut du traitement',
    'processing.progress': 'Traitement de {completed} sur {total}...',
    'processing.button': 'Traitement...',
    'error.title': 'Erreur',
    'error.retry': 'Réessayer',
    'table.input_name': 'Nom de saisie',
    'table.found_name': 'Nom trouvé',
    'table.input_address': 'Adresse de saisie',
    'table.found_phone': 'Téléphone trouvé',
    'table.found_website': 'Site Web trouvé',
    'table.found_on_maps': 'Trouvé sur Google Maps',
    'table.input_data': 'Saisie',
    'table.normalized': 'Normalisé'
  },
  de: {
    title: 'Web Scraping Tool',
    subtitle: 'Laden Sie Ihre CSV-Datei hoch und erhalten Sie erweiterte Unternehmensdaten',
    'error.upload': 'Fehler beim Hochladen der Datei. Bitte überprüfen Sie die Datei und versuchen Sie es erneut.',
    'error.processing': 'Bei der Verarbeitung Ihrer Datei ist ein Fehler aufgetreten.',
    start_scraping: 'Scraping Starten',
    search_placeholder: 'Nach Unternehmen suchen...',
    location_placeholder: 'Standort eingeben',
    city_label: 'Stadt',
    results_found: 'Ergebnisse gefunden',
    no_results: 'Keine Ergebnisse gefunden',
    error_loading: 'Fehler beim Laden der Ergebnisse',
    loading: 'Laden...',
    stop_scraping: 'Scraping Stoppen',
    progress: 'Fortschritt',
    name: 'Name',
    rating: 'Bewertung',
    rating_count: 'Bewertungen',
    phone: 'Telefon',
    address: 'Adresse',
    website: 'Website',
    price_range: 'Preisbereich',
    category: 'Kategorie',
    monday_hours: 'Montag',
    tuesday_hours: 'Dienstag',
    wednesday_hours: 'Mittwoch',
    thursday_hours: 'Donnerstag',
    friday_hours: 'Freitag',
    saturday_hours: 'Samstag',
    sunday_hours: 'Sonntag',
    view_details: 'Details Anzeigen',
    completion_time: 'Abschlusszeit',
    results_statistics: 'Ergebnisstatistiken',
    success_rate: 'Erfolgsrate',
    processing_errors: 'Verarbeitungsfehler',
    data_quality: 'Datenqualität',
    performance_metrics: 'Leistungsmetriken',
    completion_details: 'Abschlussdetails',
    successful_results: 'Erfolgreich',
    failed_results: 'Fehlgeschlagen',
    google_errors: 'Google-Fehler',
    network_errors: 'Netzwerkfehler',
    parsing_errors: 'Parsing-Fehler',
    timeout_errors: 'Timeout-Fehler',
    avg_processing_time: 'Durchschnittliche Verarbeitungszeit',
    total_processing_time: 'Gesamte Verarbeitungszeit',
    complete_profiles: 'Vollständige Profile',
    partial_profiles: 'Teilweise Profile',
    missing_data: 'Fehlende Daten',
    invalid_format: 'Ungültiges Format',
    results_breakdown: 'Ergebnisaufschlüsselung',
    error_breakdown: 'Fehleraufschlüsselung',
    language_selector: 'Sprache',
    backend_services_status: 'Backend-Dienste Status',
    up: 'Aktiv',
    down: 'Inaktiv',
    start_backend: 'Backend starten',
    api_running_redis_worker_unknown: 'API läuft, aber Redis/Worker-Status unbekannt.',
    check_docker_compose: 'Überprüfen',
    processing_complete: 'Verarbeitung Abgeschlossen!',
    successfully_processed: 'Erfolgreich verarbeitet',
    businesses_with: 'Unternehmen mit',
    success_rate_with_details: 'Erfolgsrate',
    successful: 'erfolgreich',
    failed: 'fehlgeschlagen',
    view_detailed_results: 'Detaillierte Ergebnisse Anzeigen',
    'upload.title': 'CSV-Datei Hochladen',
    'upload.description': 'Wählen Sie eine CSV-Datei mit Unternehmensinformationen zum Verarbeiten und Verbessern aus.',
    'upload.selectFile': 'CSV-Datei Auswählen',
    'upload.button': 'Datei Verarbeiten',
    'upload.uploading': 'Datei wird hochgeladen...',
    download_csv: 'CSV Herunterladen',
    export_results: 'Ergebnisse Exportieren',
    'results.title': 'Ergebnisse',
    'table.entries': 'Einträge',
    'table.search': 'Suchen...',
    'table.noResults': 'Keine Ergebnisse gefunden.',
    'table.rowsPerPage': 'Zeilen pro Seite',
    'table.page': 'Seite',
    'table.of': 'von',
    'table.showing': 'Anzeigen',
    'processing.status': 'Verarbeitungsstatus',
    'processing.progress': 'Verarbeitung von {completed} von {total}...',
    'processing.button': 'Verarbeitung...',
    'error.title': 'Fehler',
    'error.retry': 'Wiederholen',
    'table.input_name': 'Eingabename',
    'table.found_name': 'Gefundener Name',
    'table.input_address': 'Eingabeadresse',
    'table.found_phone': 'Gefundenes Telefon',
    'table.found_website': 'Gefundene Website',
    'table.found_on_maps': 'Auf Google Maps gefunden',
    'table.input_data': 'Eingabe',
    'table.normalized': 'Normalisiert'
  },
  it: {
    title: 'Strumento di Web Scraping',
    subtitle: 'Carica il tuo file CSV e ottieni dati aziendali migliorati',
    'error.upload': 'Caricamento del file non riuscito. Controlla il file e riprova.',
    'error.processing': 'Si è verificato un errore durante l\'elaborazione del file.',
    start_scraping: 'Inizia Scraping',
    search_placeholder: 'Cerca aziende...',
    location_placeholder: 'Inserisci posizione',
    city_label: 'Città',
    results_found: 'risultati trovati',
    no_results: 'Nessun risultato trovato',
    error_loading: 'Errore nel caricamento dei risultati',
    loading: 'Caricamento...',
    stop_scraping: 'Ferma Scraping',
    progress: 'Progresso',
    name: 'Nome',
    rating: 'Valutazione',
    rating_count: 'Recensioni',
    phone: 'Telefono',
    address: 'Indirizzo',
    website: 'Sito Web',
    price_range: 'Fascia di Prezzo',
    category: 'Categoria',
    monday_hours: 'Lunedì',
    tuesday_hours: 'Martedì',
    wednesday_hours: 'Mercoledì',
    thursday_hours: 'Giovedì',
    friday_hours: 'Venerdì',
    saturday_hours: 'Sabato',
    sunday_hours: 'Domenica',
    view_details: 'Visualizza Dettagli',
    completion_time: 'Tempo di Completamento',
    results_statistics: 'Statistiche Risultati',
    success_rate: 'Tasso di Successo',
    processing_errors: 'Errori di Elaborazione',
    data_quality: 'Qualità dei Dati',
    performance_metrics: 'Metriche di Performance',
    completion_details: 'Dettagli di Completamento',
    successful_results: 'Riusciti',
    failed_results: 'Falliti',
    google_errors: 'Errori Google',
    network_errors: 'Errori di Rete',
    parsing_errors: 'Errori di Parsing',
    timeout_errors: 'Errori di Timeout',
    avg_processing_time: 'Tempo di Elaborazione Medio',
    total_processing_time: 'Tempo di Elaborazione Totale',
    complete_profiles: 'Profili Completi',
    partial_profiles: 'Profili Parziali',
    missing_data: 'Dati Mancanti',
    invalid_format: 'Formato Non Valido',
    results_breakdown: 'Suddivisione Risultati',
    error_breakdown: 'Suddivisione Errori',
    language_selector: 'Lingua',
    backend_services_status: 'Stato Servizi Backend',
    up: 'Attivo',
    down: 'Inattivo',
    start_backend: 'Avvia backend',
    api_running_redis_worker_unknown: 'API è in esecuzione ma stato Redis/Worker sconosciuto.',
    check_docker_compose: 'Controlla',
    processing_complete: 'Elaborazione Completata!',
    successfully_processed: 'Elaborato con successo',
    businesses_with: 'aziende con',
    success_rate_with_details: 'tasso di successo',
    successful: 'riuscito',
    failed: 'fallito',
    view_detailed_results: 'Visualizza Risultati Dettagliati',
    'upload.title': 'Carica File CSV',
    'upload.description': 'Seleziona un file CSV contenente informazioni aziendali da elaborare e migliorare.',
    'upload.selectFile': 'Seleziona File CSV',
    'upload.button': 'Elabora File',
    'upload.uploading': 'Caricamento file...',
    download_csv: 'Scarica CSV',
    export_results: 'Esporta Risultati',
    'results.title': 'Risultati',
    'table.entries': 'voci',
    'table.search': 'Cerca...',
    'table.noResults': 'Nessun risultato trovato.',
    'table.rowsPerPage': 'Righe per pagina',
    'table.page': 'Pagina',
    'table.of': 'di',
    'table.showing': 'Mostrando',
    'processing.status': 'Stato del processo',
    'processing.progress': 'Elaborazione di {completed} su {total}...',
    'processing.button': 'Elaborazione...',
    'error.title': 'Errore',
    'error.retry': 'Riprova',
    'table.input_name': 'Nome di input',
    'table.found_name': 'Nome trovato',
    'table.input_address': 'Indirizzo di input',
    'table.found_phone': 'Telefono trovato',
    'table.found_website': 'Sito Web trovato',
    'table.found_on_maps': 'Trovato su Google Maps',
    'table.input_data': 'Input',
    'table.normalized': 'Normalizzato'
  }
}

export function useTranslation() {
  const { language } = useLanguage()
  
  return useMemo(() => {
    const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
      let translation = translations[language][key] || translations.en[key]
      
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value))
        })
      }
      
      return translation
    }
    
    return { t }
  }, [language])
}
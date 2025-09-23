import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Carga las traducciones desde un backend (en este caso, la carpeta `public/locales`)
  .use(HttpApi)
  // Detecta el idioma del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Configuración inicial de i18next
  .init({
    // Idioma por defecto si no se detecta ninguno
    fallbackLng: 'en',
    // Idiomas soportados por la aplicación
    supportedLngs: ['en', 'it', 'de', 'fr'],
    // Activa el modo debug en desarrollo para ver los eventos en la consola
    debug: process.env.NODE_ENV === 'development',
    // Opciones para react-i18next
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar los valores
    },
    // Opciones para el backend de carga de traducciones
    backend: {
      // Ruta donde se encuentran los archivos de traducción
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;

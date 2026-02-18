/*import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}*/

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#AD46FF',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}
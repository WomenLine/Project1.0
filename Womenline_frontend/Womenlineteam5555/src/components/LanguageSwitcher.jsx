import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
      style={{ marginRight: '1rem', borderRadius: '6px', padding: '0.3rem' }}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      {/* Add more languages here */}
    </select>
  );
};

export default LanguageSwitcher; 
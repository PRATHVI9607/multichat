// src/components/PersonaSelector.jsx
import React from 'react';

const PersonaSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  selectedPersona,
  setSelectedPersona,
  enthusiasmLevel,
  setEnthusiasmLevel,
}) => {
  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);
  const handlePersonaChange = (e) => setSelectedPersona(e.target.value);
  const handleEnthusiasmChange = (e) => setEnthusiasmLevel(parseInt(e.target.value, 10));

  return (
    <div className="settings-panel">
      <div className="setting-group">
        <label htmlFor="language-select">Preferred Language</label>
        <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="es">Spanish (Español)</option>
        </select>
      </div>
      <div className="setting-group">
        <label htmlFor="persona-select">Persona Style</label>
        <select id="persona-select" value={selectedPersona} onChange={handlePersonaChange}>
          <option value="witty">Witty</option>
          <option value="caring">Caring</option>
          <option value="geeky">Geeky</option>
        </select>
      </div>
      <div className="setting-group">
        <label htmlFor="enthusiasm-range">Enthusiasm Level ({enthusiasmLevel}%)</label>
        <input
          type="range"
          id="enthusiasm-range"
          min="0"
          max="100"
          value={enthusiasmLevel}
          onChange={handleEnthusiasmChange}
        />
      </div>
    </div>
  );
};

export default PersonaSelector;
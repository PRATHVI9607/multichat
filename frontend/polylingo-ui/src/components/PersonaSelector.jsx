// src/components/PersonaSelector.jsx
import React, { useState, useEffect } from 'react';
import { getPersonas } from '../services/api';

const PersonaSelector = ({ selectedPersona, setSelectedPersona }) => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    getPersonas()
      .then(response => {
        setPersonas(response.data.personas);
      })
      .catch(error => {
        console.error('Error fetching personas:', error);
      });
  }, []);

  const handlePersonaChange = (e) => setSelectedPersona(e.target.value);

  return (
    <div class="settings-panel">
      <div class="setting-group">
        <label htmlFor="persona-select">Persona Style</label>
        <select id="persona-select" value={selectedPersona} onChange={handlePersonaChange}>
          {personas.map(persona => (
            <option key={persona} value={persona}>{persona}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PersonaSelector;
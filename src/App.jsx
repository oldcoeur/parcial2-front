import React, { useState, useEffect } from "react";
import { getQuestions, saveResult } from "./services/api";
import "./App.css";

// Ajustar el formulario para que se muestre completo en una sola pantalla
function App() {
  const [step, setStep] = useState('login'); // login | welcome | form | plan
  const [userData, setUserData] = useState({
    nombre: '',
    edad: '',
    genero: '',
    peso: '',
    estatura: '',
    experiencia: 'principiante',
    objetivo: '',
    condiciones: '',
    preferencias: '',
    tiempo: '',
    equipamiento: '',
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  // Pantalla de inicio de sesión
  if (step === 'login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">¡Bienvenido a CBUM!</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!userData.nombre.trim()) {
                return alert('Por favor, ingresa tu nombre.');
              }
              setStep('welcome');
            }}
          >
            <input
              className="login-input"
              type="text"
              placeholder="Ingresa tu nombre"
              value={userData.nombre}
              onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
            />
            <button className="login-button" type="submit">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pantalla de bienvenida
  if (step === 'welcome') {
    return (
      <div className="welcome-container" style={{ backgroundImage: 'url(/fitness-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className="welcome-title">¡Hola, {userData.nombre}!</h1>
        <p className="welcome-message">Estamos listos para comenzar tu transformación. Completa el formulario para que pueda crear tu plan personalizado.</p>
        <button className="welcome-button" onClick={() => setStep('form')}>
          Continuar
        </button>
      </div>
    );
  }

  // Pantalla de formulario completo
  if (step === 'form') {
    return (
      <div className="form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
        <h1 className="form-title" style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Completa tu perfil para un plan personalizado:</h1>
        <form
          style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
          onSubmit={async (e) => {
            e.preventDefault();
            for (const key in userData) {
              if (!userData[key].toString().trim()) {
                return alert('Por favor, completa todos los campos.');
              }
            }
            setLoading(true);
            try {
              const response = await fetch('/api/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: userData }),
              });
              const data = await response.json();
              if (data.success) {
                setPlan(data.plan);
                setStep('plan');
              } else {
                alert('Error al generar el plan.');
              }
            } catch (error) {
              alert('Hubo un error al enviar los datos.');
            } finally {
              setLoading(false);
            }
          }}
        >
          <label>Edad (años):</label>
          <input className="form-input" type="number" placeholder="Edad" value={userData.edad} onChange={(e) => setUserData({ ...userData, edad: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Peso actual (kg):</label>
          <input className="form-input" type="number" placeholder="Peso actual (kg)" value={userData.peso} onChange={(e) => setUserData({ ...userData, peso: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Estatura (cm):</label>
          <input className="form-input" type="number" placeholder="Estatura (cm)" value={userData.estatura} onChange={(e) => setUserData({ ...userData, estatura: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Objetivo principal:</label>
          <input className="form-input" type="text" placeholder="Objetivo principal" value={userData.objetivo} onChange={(e) => setUserData({ ...userData, objetivo: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Nivel de experiencia:</label>
          <input className="form-input" type="text" placeholder="Nivel de experiencia" value={userData.experiencia} onChange={(e) => setUserData({ ...userData, experiencia: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Condiciones médicas o lesiones:</label>
          <input className="form-input" type="text" placeholder="Condiciones médicas o lesiones" value={userData.condiciones} onChange={(e) => setUserData({ ...userData, condiciones: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Preferencias alimenticias:</label>
          <input className="form-input" type="text" placeholder="Preferencias alimenticias" value={userData.preferencias} onChange={(e) => setUserData({ ...userData, preferencias: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Tiempo disponible para entrenar:</label>
          <input className="form-input" type="text" placeholder="Tiempo disponible para entrenar" value={userData.tiempo} onChange={(e) => setUserData({ ...userData, tiempo: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <label>Equipamiento disponible:</label>
          <input className="form-input" type="text" placeholder="Equipamiento disponible" value={userData.equipamiento} onChange={(e) => setUserData({ ...userData, equipamiento: e.target.value })} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button className="form-button" type="submit" disabled={loading} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Generando plan...' : 'Enviar'}
          </button>
        </form>
      </div>
    );
  }

  // Pantalla del plan
  if (step === 'plan') {
    return (
      <div className="plan-container">
        <h1 className="plan-title">Tu plan personalizado</h1>
        <p className="plan-content">{plan}</p>
        <button className="plan-button" onClick={() => setStep('form')}>
          Editar perfil
        </button>
      </div>
    );
  }

  return null;
}

export default App;

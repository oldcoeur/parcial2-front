import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const initialProfile = {
  nombre: '',
  edad: '',
  genero: '',
  peso: '',
  estatura: '',
  experiencia: '',
  objetivo: '',
  condiciones: '',
  preferencias: '',
  tiempo: '',
  equipamiento: '',
};

const App = () => {
  const [step, setStep] = useState('login'); // login | profile | chat
  const [profile, setProfile] = useState(initialProfile);
  const [plan, setPlan] = useState('');
  const [planLoading, setPlanLoading] = useState(false);

  // Pantalla de inicio de sesión
  if (step === 'login') {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>        
        <View style={styles.loginCard}>
          <Text style={styles.title}>Bienvenido a CBUM</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            onChangeText={(text) => setProfile({ ...profile, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.finishButton}
            onPress={() => setStep('profile')}
          >
            <Text style={styles.finishButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla de perfil
  if (step === 'profile') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>Completa tu perfil</Text>
          {Object.keys(initialProfile).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={profile[key]}
              onChangeText={(text) => setProfile({ ...profile, [key]: text })}
              keyboardType={['edad', 'peso', 'estatura'].includes(key) ? 'numeric' : 'default'}
            />
          ))}
          <TouchableOpacity
            style={styles.finishButton}
            onPress={async () => {
              if (Object.values(profile).every((v) => v && v.toString().trim() !== '')) {
                setPlanLoading(true);
                try {
                  const prompt = `Genera un plan de entrenamiento y nutrición personalizado para este usuario.\n\nDatos del usuario:\n${Object.entries(profile).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\nResponde de forma directa, motivadora y profesional.`;
                  const res = await axios.post('https://parcial2-back-navy.vercel.app/api/chat', {
                    prompt,
                    username: profile.nombre
                  });
                  setPlan(res.data.response);
                  setStep('chat');
                } catch (err) {
                  alert('Hubo un error al generar tu plan. Intenta de nuevo.');
                } finally {
                  setPlanLoading(false);
                }
              } else {
                alert('Por favor, completa todos los campos.');
              }
            }}
          >
            <Text style={styles.finishButtonText}>Generar Plan</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Pantalla de chat
  if (step === 'chat') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Asistente Virtual CBUM</Text>
        {planLoading ? (
          <ActivityIndicator size="large" color="#9333ea" />
        ) : (
          <ScrollView style={{ flex: 1, marginVertical: 20 }}>
            <Text style={{ fontSize: 16, color: '#2C3E50', lineHeight: 24 }}>{plan}</Text>
          </ScrollView>
        )}
        <TextInput
          style={styles.input}
          placeholder="Escribe tus ajustes o preguntas aquí..."
          onSubmitEditing={async (e) => {
            const userMessage = e.nativeEvent.text;
            setPlanLoading(true);
            try {
              const res = await axios.post('https://parcial2-back-navy.vercel.app/api/chat', {
                prompt: `Usuario: ${userMessage}\n\nCBUM, ajusta el plan basado en este comentario.`,
                username: profile.nombre
              });
              setPlan(res.data.response);
            } catch (err) {
              alert('Hubo un error al actualizar tu plan. Intenta de nuevo.');
            } finally {
              setPlanLoading(false);
            }
          }}
        />
        <TouchableOpacity style={styles.finishButton} onPress={() => setStep('profile')}>
          <Text style={styles.finishButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  finishButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryButton: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#3498DB', // Color uniforme para botones
  },
  categoryText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    color: '#2C3E50', // Color más formal
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#ECF0F1', // Fondo más claro para opciones
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2C3E50', // Color más formal
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50', // Color más formal
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2C3E50', // Color más formal
  },
});

export default App;
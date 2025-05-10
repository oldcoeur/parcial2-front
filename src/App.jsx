import React, { useState } from "react";
import { getQuestions, saveResult } from "./services/api";
import "./App.css";

const categories = [
  "Moda",
  "Historia",
  "Ciencia",
  "Deporte",
  "Arte"
];

function App() {
  const [step, setStep] = useState("home"); // home | trivia | result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Elegir categoría y cargar preguntas
  const handleCategory = async (cat) => {
    setLoading(true);
    setSelectedCategory(cat);
    try {
      const qs = await getQuestions(cat);
      setQuestions(qs);
      setStep("trivia");
      setCurrent(0);
      setScore(0);
      setAnswers([]);
    } catch (e) {
      alert("Error al obtener preguntas");
    }
    setLoading(false);
  };

  // Responder pregunta
  const handleAnswer = (isCorrect, answerText) => {
    setAnswers([...answers, { 
      question: questions[current].question, 
      answer: answerText, 
      correct: isCorrect 
    }]);
    if (isCorrect) setScore(score + 1);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // Finalizar trivia
  const handleFinish = async () => {
    setStep("result");
    // Guardar resultado en backend
    await saveResult({
      category: selectedCategory,
      questions: questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        userAnswer: answers[i]?.answer,
        correct: answers[i]?.correct
      })),
      score,
      date: new Date().toISOString()
    });
  };

  // Volver al inicio
  const handleRestart = () => {
    setStep("home");
    setSelectedCategory(null);
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
  };

  // Render
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  if (step === "home") {
    return (
      <div className="home-container">
        <div className="home-card">
          <h1 className="home-title">Aplicacion de Quizzes</h1>
          <p className="home-description">
            Testea que tanto sabes sobre cultura general <br />
            Elige una categoría para comenzar:
          </p>
          <div className="grid grid-cols-1 gap-4 w-full">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className="category-button"
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "trivia") {
    const q = questions[current];
    return (
      <div className="trivia-container">
        <div className="trivia-card">
          <h2 className="trivia-category">{selectedCategory}</h2>
          <div className="trivia-question">{q.question}</div>
          <div className="trivia-options">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.isCorrect, opt.text)}
                disabled={answers.length > current}
              >
                {opt.text}
              </button>
            ))}
          </div>
          <div className="trivia-footer">
            Pregunta {current + 1} de {questions.length}
          </div>
          {answers.length > current && (
            <button
              className="trivia-next-button"
              onClick={() => setCurrent(current + 1)}
            >
              Siguiente
            </button>
          )}
          {current === questions.length - 1 &&
            answers.length === questions.length && (
              <button className="trivia-next-button" onClick={handleFinish}>
                Finalizar trivia
              </button>
            )}
        </div>
      </div>
    );
  }

  if (step === "result") {
    const percent = (score / questions.length) * 100;
    return (
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">¡Resultados!</h2>
          <p className="result-score">
            Puntaje: <b>{score}</b> de {questions.length}
          </p>
          <p className="result-score">
            Porcentaje: <b>{percent.toFixed(1)}%</b>
          </p>
          <button className="result-button" onClick={handleRestart}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import './App.css';

// Links para as imagens
const headerImgLink = "https://github.com/DalvanaRibeiro/UC2-TDS251TPSG---Introducao-a-algoritmos/blob/main/Aulas/Aulas.md";
const middleImgLink = "https://exemplo.com/link2";
const footerImgLink = "https://exemplo.com/link3";
const centeredImageLink = "https://cdn.pensador.com/img/frase/ig/or/igor_barros_da_silva_ser_programador_e_ser_paciente_e_p_trf_nl6dm8g0.jpg";
const centeredImageSrc = "https://www.jornaljoca.com.br/wp-content/uploads/2016/12/tumblr_nocus98SHe1scqekdo1_1280.jpg";

// Imagens locais
const algoritmoImg = '/assets/erro1.png';
const fluxogramaImg = '/assets/saida3.png';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbVkK51KVctHMENX3tEKpZewRh19OtMSA",
  authDomain: "avaliacaoalgoritmo.firebaseapp.com",
  databaseURL: "https://avaliacaoalgoritmo-default-rtdb.firebaseio.com",
  projectId: "avaliacaoalgoritmo",
  storageBucket: "avaliacaoalgoritmo.firebasestorage.app",
  messagingSenderId: "1028707253456",
  appId: "1:1028707253456:web:cce1944413ec263487b2d5",
 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const App = () => {
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '',
    q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '',
    q16: '', q17: '', q18: '', q19: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  // Função para salvar progresso
  const saveProgress = async () => {
    if (!studentName) return;
    
    try {
      await set(ref(db, `progress/${studentName.replace(/\s+/g, '_')}`), {
        answers,
        lastSaved: new Date().toISOString(),
        expiresAt: Date.now() + 14400000 // 4 horas
      });
      setSaveStatus('Progresso salvo - ' + new Date().toLocaleTimeString());
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      setSaveStatus('Erro ao salvar progresso');
    }
  };

  // Função para carregar progresso
  const loadProgress = async () => {
    if (!studentName) return;
    
    try {
      const userRef = ref(db, `progress/${studentName.replace(/\s+/g, '_')}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.expiresAt > Date.now()) {
          setAnswers(data.answers);
          setSaveStatus('Progresso recuperado');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      });
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  // Efeito para salvamento automático
  useEffect(() => {
    const timer = setInterval(() => {
      if (studentName && Object.values(answers).some(a => a !== '')) {
        saveProgress();
      }
    }, 300000); // Salva a cada 5 minutos
    
    return () => clearInterval(timer);
  }, [answers, studentName]);

  // Efeito para carregar ao digitar nome
  useEffect(() => {
    if (studentName) {
      loadProgress();
    }
  }, [studentName]);

  // Efeito para calcular progresso
  useEffect(() => {
    const answered = Object.values(answers).filter(a => a !== '').length;
    setProgress(Math.round((answered / Object.keys(answers).length) * 100));
  }, [answers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }

    try {
      await push(ref(db, 'submissions'), {
        studentName,
        answers,
        timestamp: new Date().toISOString(),
        progress
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar respostas. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <div className="container thank-you-container">
        <div className="thank-you-card">
          <h2 className="thank-you-title">Obrigado, {studentName}!</h2>
          <p className="thank-you-text">Seu Trabalho foi enviada com sucesso.</p>
          <div className="progress-complete">
            <div className="progress-circle" style={{ 
              background: `conic-gradient(#3a86ff ${progress}%, #e2e8f0 ${progress}%)`
            }}>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {saveStatus && <div className="save-status">{saveStatus}</div>}

      <div className="centered-image-container">
        <a href={centeredImageLink} target="_blank" rel="noopener noreferrer">
          <img 
            src={centeredImageSrc} 
            alt="Conceitos Fundamentais de Algoritmos" 
            className="centered-linked-image"
          />
          <p className="image-caption">Agora vamos aplicar nossos conhecimentos. Clique aqui para uma mensagem motivacional 😎</p>
        </a>
      </div>
      <h1 className="title">UC2: Desenvolver algoritmos </h1>
      <h2 className="title2"> Trabalho de Revisão: Teoria e Prática</h2>
      <h5 className="title3"> Professora: Dalvana Ribeiro       |   Turma: TDS261T</h5>
      
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">{progress}% completo</span>
      </div>

      <div className="header-link-container">
        <a href={headerImgLink} target="_blank" rel="noopener noreferrer" className="resource-link">
          📘 Introdução a Algoritmos (clique para acessar o material)
        </a>
      </div>

      


      <form onSubmit={handleSubmit} className="form-animation">
        <div className="form-group">
          <label htmlFor="studentName">Seu Nome:</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
           
            placeholder="Digite seu belo nome completo"
            className="input-field"
          />
        </div>

        {/* Questões Teóricas */}
        <div className="question-card fade-in">
          <h3 className="question-title">1. O que é um algoritmo?</h3>
          <textarea
            name="q1"
            value={answers.q1}
            onChange={handleInputChange}
            placeholder="Clássica né gente 😂. Descreva com suas palavras..."
           
            className="answer-textarea"
          />
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">2. O que é uma linguagem de alto nível e quais os tipos de variáveis em JavaScript? Faça um exemplo de cada e explique.  </h3>
          <textarea
            name="q2"
            value={answers.q2}
            onChange={handleInputChange}
            placeholder="Muito fácil..."
            
            className="answer-textarea"
          />
        </div>

        {/* Questão com Imagem */}
        <div className="question-card fade-in">
          <h3 className="question-title">3. Analise o algoritmo abaixo e descreva os erros:</h3>
          <div className="image-container">
            <img 
              src={algoritmoImg} 
              alt="Algoritmo de ordenação" 
              className="question-image"
            />
            <p className="image-caption"></p>
          </div>
          <textarea
            name="q3"
            value={answers.q3}
            onChange={handleInputChange}
            placeholder="Aqui vocês vão colocar a resposta da seguinte forma: linha tal erro tal... "
          
            className="answer-textarea"
          />
        </div>

        {/* Questões Práticas */}
        <div className="question-card fade-in">
          <h3 className="question-title">4. Gustavo foi em uma pizzaria e fez o seu pedido. O dono ficou entristecido... Faça um código com um laço while que represente esse evento. Gustavo vai comer até 22 pedaços (na realidade não sabemos, mas para esse exercício sim  😆):</h3>
          <textarea
            name="q4"
            value={answers.q4}
            onChange={handleInputChange}
            className="answer-textarea code-input"
            placeholder="Aqui vocês podem seguir o exemplo de ontem das coxinhas, porém o luiz é educado e come uma fatia por vez 😊. Façam o código no vscode e colem aqui."
           
          />
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">5. Dado um array de nomes = ["Ana", "Bruno", "Carlos","Sofia"], faça: <br />
➡ Converta todos os nomes para maiúsculas.<br />
➡ Adicione um novo nome "Lucas" ao final.<br />
➡ Remova o nome do começo. <br />
➡ Mostre a lista atualizada de nomes.</h3>
          <textarea
            name="q5"
            value={answers.q5}
            onChange={handleInputChange}
            placeholder="Aqui também pessoal, faça no vscode e cole aqui o código 💻."
            
            className="answer-textarea"
          />
        </div>

        {/* Questão com Imagem */}
        <div className="question-card fade-in">
          <h3 className="question-title">6. Analise o código abaixo e responda o seguinte:<br />

            ➡ Quais os parâmetros dessa função?<br />
➡ Quais os operadores lógicos que ela utiliza?<br />
➡ Qual é a resposta se testarmos: console.log(verificarPerfil(true, true))<br />
➡ console.log(verificarPerfil(false, false)) <br />
          </h3>
          <div className="image-container">
            <img 
              src={fluxogramaImg} 
              alt="Fluxograma de decisão" 
              className="question-image"
            />
            <p className="image-caption"> </p>
          </div>
          <textarea
            name="q6"
            value={answers.q6}
            placeholder="Coloque aqui sua reposta  💻."
            onChange={handleInputChange}
            
            className="answer-textarea"
          />
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">7. Qual conteúdo você mais gostou? e qual o que mais te desafiou? </h3>
          <textarea
            name="q7"
            value={answers.q7}
            onChange={handleInputChange}
            className="answer-textarea code-input"
            placeholder="👀"
           
          />
        </div>

        {/* Novas Questões de Múltipla Escolha */}
        <div className="question-card fade-in">
          <h3 className="question-title">8. Qual é o resultado de true && false || true?</h3>
          <div className="multiple-choice">
            {['true', 'false', 'undefined', 'null'].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="q8"
                  value={option}
                  checked={answers.q8 === option}
                  onChange={handleRadioChange}
                  
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">9. O que o return em uma função imediatamente executa?</h3>
          <div className="multiple-choice">
            {[' Pausa a função temporariamente', 'Continua a execução normalmente', 'Encerra a função e retorna um valor', 'Não faz nada, está ali de bonito '].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="q9"
                  value={option}
                  checked={answers.q9 === option}
                  onChange={handleRadioChange}
                
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">10. Qual método remove o último item de um array?</h3>
          <div className="multiple-choice">
            {['shift()', 'pop()', 'slice()', 'return()'].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="q10"
                  value={option}
                  checked={answers.q10 === option}
                  onChange={handleRadioChange}
                 
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">11. O que !false retorna?</h3>
          <div className="multiple-choice">
            {['true', 'false', 'null', 'NaN'].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="q11"
                  value={option}
                  checked={answers.q11 === option}
                  onChange={handleRadioChange}
                 
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="question-card fade-in">
          <h3 className="question-title">12.Qual é o tipo de dado de typeof 42?</h3>
          <div className="multiple-choice">
            {['String', 'number', 'boolean', 'object'].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="q12"
                  value={option}
                  checked={answers.q12 === option}
                  onChange={handleRadioChange}
                  
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button pulse-animation">
          Enviar Trabalho
        </button>
      </form>
    </div>
  );
};

export default App;

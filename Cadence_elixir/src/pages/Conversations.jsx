// src/pages/Conversations.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/layout/Navbar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button'; // Importado da primeira versão
import { Input } from '@/components/ui/input'; // Importado da primeira versão
import { fetchMessages, sendMessage } from '@/services/conversations'; // Importado da segunda versão

const Conversations = () => {
  const [messages, setMessages] = useState([]); // Mensagens iniciais vazias para carregar do backend
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Carrega mensagens do backend ao montar o componente (da segunda versão)
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await fetchMessages();
        setMessages(msgs);
      } catch (err) {
        // Trate o erro conforme necessário, por exemplo, mostrando uma mensagem ao utilizador
        console.error("Erro ao carregar mensagens:", err);
        setMessages([]); // Garante que messages é um array mesmo em caso de erro
      }
    }
    loadMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (newMessage.trim() === '') {
      setIsTyping(false);
      return;
    }
    setIsTyping(true);
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
    return () => clearTimeout(typingTimeout);
  }, [newMessage]);

  const handleSend = async () => { // Função assíncrona para enviar mensagem ao backend
    if (!newMessage.trim()) return;
    try {
      // Envia a mensagem para o backend (da segunda versão)
      const msg = await sendMessage(newMessage.trim());
      setMessages((prev) => [...prev, msg]); // Adiciona a mensagem retornada pelo backend
      setNewMessage('');
      setIsTyping(false);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      // Trate o erro conforme necessário, por exemplo, feedback ao utilizador
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Helmet>
        <title>Conversas - Cadence</title>
        <meta
          name="description"
          content="Veja e gerencie todas as suas conversas na plataforma Cadence."
        />
      </Helmet>

      {/* Fundo principal da página usando variáveis CSS (da primeira versão) */}
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-light-primary)', color: 'var(--text-light-primary)' }}>
        <Navbar />

        <div className="flex-1 ml-64 px-6 flex flex-col items-center">
          <Header />

          <div className="mt-20 w-full max-w-3xl flex flex-col flex-grow relative">
            <h1 className="text-center text-4xl font-bold mb-6 select-none" style={{ color: 'var(--color-primary)' }}> {/* Cor do título principal */}
              As Minhas Conversas
            </h1>

            {/* Container das mensagens com scrollbar personalizada (da primeira versão, assume classes em CSS externo) */}
            <div
              className="flex-1 overflow-y-auto pr-4 space-y-6 chat-messages-container" // Adicionada classe para scrollbar no index.css
              style={{ maxHeight: '600px' }} // Altura fixa para scroll
            >
              {messages.map(({ id, from, text }) => (
                <div
                  key={id}
                  className={`flex items-end ${
                    from === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Avatar do Agente */}
                  {from === 'agent' && (
                    <img
                      src="/avatars/agent-avatar.png"
                      alt="Agente"
                      className="w-12 h-12 rounded-full mr-3 select-none avatar" // Usando a classe 'avatar'
                      loading="lazy"
                    />
                  )}
                  {/* Balão da Mensagem */}
                  <div
                    className={`rounded-3xl px-6 py-4 text-lg max-w-[75%] shadow-sm break-words chat-message ${
                      from === 'user' ? 'own' : '' // Aplica 'own' para a mensagem do utilizador
                    }`}
                    style={{ lineHeight: '1.5', userSelect: 'text' }}
                  >
                    {text}
                  </div>
                  {/* Avatar do Utilizador */}
                  {from === 'user' && (
                    <img
                      src="/avatars/user-avatar.png"
                      alt="Usuário"
                      className="w-12 h-12 rounded-full ml-3 select-none avatar" // Usando a classe 'avatar'
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Indicador "Usuário está a escrever..." (da primeira versão) */}
            {isTyping && (
              <div
                className="absolute bottom-28 left-6 right-6 italic font-medium text-lg flex items-center gap-2 select-none"
                style={{ color: 'var(--color-primary)' }} // Cor primária
                aria-live="polite"
              >
                <svg
                  className="animate-pulse h-5 w-5"
                  style={{ color: 'var(--color-primary)' }} // Cor primária
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Usuário está a escrever...
              </div>
            )}

            {/* Barra de escrever fixa (da primeira versão, adaptada) */}
            <div
              className="sticky bottom-0 pt-3 pb-3 flex items-center gap-4 border-t"
              style={{
                backgroundColor: 'var(--bg-light-primary)', // Fundo da barra de input
                borderColor: 'var(--border-color)' // Borda superior da barra de input
              }}
            >
              {/* Utiliza o componente Input importado, mas customizado com classes Tailwind e estilos em linha */}
              {/* Nota: Se o componente Input de '@/components/ui/input' é um input padrão, pode precisar de ser envolvido por ele
                  ou usar as classes diretamente no textarea se for um Input mais genérico que aceita 'asChild' ou 'as="textarea"'.
                  Aqui estou a manter o `textarea` diretamente e a aplicar as classes e estilos da primeira versão. */}
              <textarea
                rows={1}
                maxLength={300}
                placeholder="Escreva a sua mensagem..."
                className="flex-1 px-5 py-2 rounded-full resize-none leading-relaxed input" // Usa a classe 'input' para borda, focus e placeholder
                style={{
                  backgroundColor: 'var(--bg-light-primary)',
                  color: 'var(--text-light-primary)',
                  borderColor: 'var(--border-color)',
                  maxHeight: '3rem'
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Escreva a sua mensagem"
              />
              {/* Utiliza o componente Button importado */}
              <Button
                onClick={handleSend}
                className="btn-primary px-7 py-3 rounded-full text-lg font-semibold shadow-md transition-all select-none" // Usa btn-primary
                aria-label="Enviar mensagem"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversations;
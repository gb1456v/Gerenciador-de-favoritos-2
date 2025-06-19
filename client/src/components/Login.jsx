import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { loginUser, registerUser } from '../api.js';

export function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isRegistering) {
        // Lógica de Registro
        if (!data.username || !data.email || !data.password) {
            throw new Error("Todos os campos são obrigatórios.");
        }
        await registerUser({
            username: data.username,
            email: data.email,
            password: data.password
        });
        alert('Registro bem-sucedido! Por favor, faça o login com suas novas credenciais.');
        setIsRegistering(false); // Muda para a tela de login
      } else {
        // Lógica de Login
        const { token, user } = await loginUser({
            email: data.email,
            password: data.password
        });
        // Chama a função do App.jsx para notificar o sucesso
        onLoginSuccess(token, user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
             <Icon name="bookmark" className="text-primary-600" size="xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isRegistering ? 'Crie Sua Conta' : 'Bem-vindo de Volta!'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isRegistering ? 'Preencha os campos para começar.' : 'Acesse seu gerenciador de favoritos.'}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {isRegistering && (
            <div>
              <label htmlFor="username" className="sr-only">Nome de usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 text-sm bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nome de usuário"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 text-sm bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              required
              className="w-full px-4 py-3 text-sm bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Senha"
            />
          </div>
          
          {error && <p className="text-xs text-center text-red-500">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition-all duration-200"
            >
              {loading ? 'Carregando...' : (isRegistering ? 'Registrar' : 'Entrar')}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }} 
            className="font-medium text-primary-600 hover:text-primary-500 ml-1"
          >
            {isRegistering ? 'Faça login' : 'Registre-se'}
          </button>
        </p>
      </div>
    </div>
  );
}
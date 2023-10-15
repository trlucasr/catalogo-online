document.addEventListener('DOMContentLoaded', () => {
    // Selecione o formulário pelo ID
    const loginForm = document.getElementById('login-form');
  
    // Selecione o botão "Entrar" na página
    const loginButton = document.querySelector('button[type="submit"]');
  
    // Adicione um evento de clique ao botão "Entrar"
    loginButton.addEventListener('click', async (e) => {
      e.preventDefault(); // Impedir o envio padrão do formulário
  
      // Obtenha os dados do formulário
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
  
      // Crie um objeto JSON com os dados
      const data = {
        email: email,
        senha: senha
      };
  
      // Converta o objeto JSON em uma string JSON
      const jsonData = JSON.stringify(data);
  
      // Envie os dados para o servidor usando uma requisição POST
      try {
        const response = await fetch('http://localhost:8000/login/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Defina o cabeçalho Content-Type
          },
          body: jsonData // Use a string JSON como corpo da requisição
        });
  
        if (response.ok) {
          const responseData = await response.json();
          // Faça algo com a resposta do servidor, se necessário
          const token = responseData.token;
  
          if (token) {
            // Autenticação bem-sucedida, redirecione para a página gerenciador.html com o token
            window.location.href = `gerenciador.html`;
          } else {
            // Lida com erros de resposta do servidor
            console.error('Erro no servidor:', 'Token não retornado');
          }
        } else {
          // Lida com erros de resposta do servidor
          console.error('Erro no servidor:', response.status, response.statusText);
        }
      } catch (error) {
        // Lida com erros de rede ou outros erros
        console.error('Erro de rede:', error);
      }
    });
  });
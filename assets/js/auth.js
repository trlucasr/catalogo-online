document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const loginButton = document.querySelector('button[type="submit"]');
  
    loginButton.addEventListener('click', async (e) => {
      e.preventDefault(); 
  
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
  
      const data = {
        email: email,
        senha: senha
      };
  
      const jsonData = JSON.stringify(data);
  
      try {
        const response = await fetch('http://localhost:8000/login/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: jsonData 
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
  
          if (token) {
            window.location.href = `gerenciador.html`;
          } else {
            console.error('Erro no servidor:', 'Token não retornado');
          }
        } else {

          console.error('Erro no servidor:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    });
  });
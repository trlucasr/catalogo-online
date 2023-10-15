document.addEventListener('DOMContentLoaded', () => {
    // Selecione o formulário pelo ID
    const usuarioForm = document.getElementById('usuarios-form');
  
    // Selecione o botão "Cadastrar" na página
    const cadastrarButton = document.querySelector('button[type="submit"]');
  
    // Adicione um evento de clique ao botão "Cadastrar"
    cadastrarButton.addEventListener('click', async (e) => {
      e.preventDefault(); // Impedir o envio padrão do formulário
  
      // Obtenha os dados do formulário
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;      
      const status = document.getElementById('status').value;
      
  
      // Crie um objeto JSON com os dados
      const data = {
        nome: nome,
        email: email,
        senha: senha,
        status: status
      };
  
      // Converta o objeto JSON em uma string JSON
      const jsonData = JSON.stringify(data);
  
      // Envie os dados para o servidor usando uma requisição POST
      try {
        const response = await fetch('http://localhost:8000/login/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Defina o cabeçalho Content-Type
          },
          body: jsonData // Use a string JSON como corpo da requisição
        });
  
        if (response.ok) {
          const responseData = await response.json();
          // Faça algo com a resposta do servidor, se necessário
          alert(responseData.mensagem);
  
          // Feche o modal
          const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
          modal.hide();
  
          location.reload();
  
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

  
document.addEventListener('DOMContentLoaded', () => {
    // Selecione a tabela
    const tabelausuarios = document.querySelector('.table tbody');
  
    // Função para preencher a tabela com os dados
    const preencherTabela = (dados) => {
      tabelausuarios.innerHTML = ''; // Limpa as linhas existentes
  
      dados.forEach((usuario, index) => {
        const newRow = tabelausuarios.insertRow(index);
  
        // Cria células para cada coluna
        const cellId = newRow.insertCell(0);
        const cellNome = newRow.insertCell(1);
        const cellEmail = newRow.insertCell(2);
        const cellStatus = newRow.insertCell(3);
  
        // Preenche as células com os dados da usuario
        cellId.textContent = usuario.id;
        cellNome.textContent = usuario.nome;
        cellEmail.textContent = usuario.email;
        cellStatus.textContent = usuario.status === 'A' ? 'Sim' : 'Não';
      });
    };
  
    // Função para obter dados da API
    const obterDadosDaAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/login/read'); // Substitua com a URL correta da sua API
        if (response.ok) {
          const dados = await response.json();
          preencherTabela(dados); // Preencha a tabela com os dados obtidos
        } else {
          console.error('Erro ao obter dados da API:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };
  
    // Chame a função para obter dados da API
    obterDadosDaAPI();
  });
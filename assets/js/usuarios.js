document.addEventListener('DOMContentLoaded', () => {
  
    const usuarioForm = document.getElementById('usuarios-form');
  
    const cadastrarButton = document.querySelector('button[type="submit"]');
    
    cadastrarButton.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;      
      const status = document.getElementById('status').value;
          
      const data = {
        nome: nome,
        email: email,
        senha: senha,
        status: status
      };
      
      const jsonData = JSON.stringify(data);
    
      try {
        const response = await fetch('http://localhost:8000/login/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonData
        });
  
        if (response.ok) {
          const responseData = await response.json();
        
          alert(responseData.mensagem);
        
          const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
          modal.hide();
  
          location.reload();
  
        } else {
        
          console.error('Erro no servidor:', response.status, response.statusText);
        }
      } catch (error) {
      
        console.error('Erro de rede:', error);
      }
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  
    const tabelausuarios = document.querySelector('.table tbody');
    
    const preencherTabela = (dados) => {
      tabelausuarios.innerHTML = '';
  
      dados.forEach((usuario, index) => {
        const newRow = tabelausuarios.insertRow(index);
        
        const cellId = newRow.insertCell(0);
        const cellNome = newRow.insertCell(1);
        const cellEmail = newRow.insertCell(2);
        const cellStatus = newRow.insertCell(3);
        const cellAcoes = newRow.insertCell(4);
        
        cellId.textContent = usuario.id;
        cellNome.textContent = usuario.nome;
        cellEmail.textContent = usuario.email;
        cellStatus.textContent = usuario.status === 'A' ? 'Sim' : 'Não';

        cellAcoes.innerHTML = `
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-primary">Editar</button>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteUser(${usuario.id})">Excluir</button>
        </div>
      `;

      });
    };
    
    const obterDadosDaAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/login/read');
        if (response.ok) {
          const dados = await response.json();
          preencherTabela(dados);
        } else {
          console.error('Erro ao obter dados da API:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };
    
    obterDadosDaAPI();
  });

  
function deleteUser(UserId) {
  if (confirm("Tem certeza de que deseja excluir este Usuário?")) {
    fetch(`http://localhost:8000/login/delete/${UserId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert('Usuário excluído com sucesso');
          location.reload();
        } else {
          console.error('Erro ao excluir o Usuário:', response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error('Erro de rede:', error);
      });
  }
}
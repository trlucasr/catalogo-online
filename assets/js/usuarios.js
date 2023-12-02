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
        <button type="button" class="btn btn-sm btn-outline-primary" onclick="editarUsuario(${usuario.id})">Editar</button>
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

function editarUsuario(usuarioId) {
  // Abra o modal de edição
  const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicao'));

  async function obterDetalhesUsuario(usuarioId) {
    try {
      const response = await fetch(`http://localhost:8000/login/read/${usuarioId}`);
      if (response.ok) {
        const usuario = await response.json();
        return usuario;
      } else {
        console.error('Erro ao obter detalhes da usuario:', response.status, response.statusText);
        throw new Error('Erro ao obter detalhes da usuario');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      throw new Error('Erro de rede ao obter detalhes da usuario');
    }
  }

  // Preencha os campos do modal com os detalhes da usuario
  obterDetalhesUsuario(usuarioId)
    .then((usuario) => {
      document.getElementById('nomeEdicao').value = usuario.nome;
      document.getElementById('emailEdicao').value = usuario.email;
      document.getElementById('senhaEdicao').value = usuario.senha;
      document.getElementById('statusEdicao').value = usuario.status;
    })
    .catch((error) => {
      console.error('Erro ao obter detalhes da usuario:', error);
    });

    modalEdicao.show();

  // Adicione um evento ao botão de atualização no modal de edição
  const botaoAtualizar = document.getElementById('botaoAtualizar');
  botaoAtualizar.addEventListener('click', async () => {
    // Obtenha os dados atualizados do formulário do modal
    const nomeAtualizada = document.getElementById('nomeEdicao').value;
    const emailAtualizada = document.getElementById('emailEdicao').value;
    const senhaAtualizada = document.getElementById('senhaEdicao').value;
    const statusAtualizada = document.getElementById('statusEdicao').value;
    
    const dataAtualizada = {
      nome: nomeAtualizada,
      email: emailAtualizada,
      senha: senhaAtualizada,
      status: statusAtualizada,
    };

    const jsonDataAtualizado = JSON.stringify(dataAtualizada);

    try {
      const response = await fetch(`http://localhost:8000/login/update/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonDataAtualizado
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.mensagem);

        // Feche o modal de edição
        modalEdicao.hide();

        location.reload();

        // Recarregue os dados da tabela
        obterDadosDaAPI();
      } else {
        console.error('Erro no servidor:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  });
}
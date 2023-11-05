document.addEventListener('DOMContentLoaded', () => {
  
  const categoriaForm = document.getElementById('categoria-form');  
  const cadastrarButton = document.querySelector('button[type="submit"]');
  
  cadastrarButton.addEventListener('click', async (e) => {
    e.preventDefault(); 
    
    const descricao = document.getElementById('descricao').value;
    const status = document.getElementById('status').value;
    
    const data = {
      descricao: descricao,
      status: status
    };
    
    const jsonData = JSON.stringify(data);
    
    try {
      const response = await fetch('http://localhost:8000/categorias/create', {
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
  
  const tabelaCategorias = document.querySelector('.table tbody');

  const preencherTabela = (dados) => {
    tabelaCategorias.innerHTML = ''; 

    dados.forEach((categoria, index) => {
      const newRow = tabelaCategorias.insertRow(index);

      const cellId = newRow.insertCell(0);
      const cellDescricao = newRow.insertCell(1);
      const cellStatus = newRow.insertCell(2);
      const cellAcoes = newRow.insertCell(3);

      
      cellId.textContent = categoria.id;
      cellDescricao.textContent = categoria.descricao;
      cellStatus.textContent = categoria.status === 'A' ? 'Sim' : 'Não';

      cellAcoes.innerHTML = `
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-outline-primary">Editar</button>
        <button type="button" class="btn btn-sm btn-danger" onclick="deleteCategoria(${categoria.id})">Excluir</button>
      </div>
    `;

    });
  };

  const obterDadosDaAPI = async () => {
    try {
      const response = await fetch('http://localhost:8000/categorias/read'); 
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

function deleteCategoria(CategoriaId) {
  if (confirm("Tem certeza de que deseja excluir esta categoria?")) {
    fetch(`http://localhost:8000/categorias/delete/${CategoriaId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert('Categoria excluída com sucesso');
          location.reload();
        } else {
          response.json().then(data => {
            alert(data.mensagem);
          }).catch(error => {
            console.error('Erro de análise JSON:', error);
          });
        }
      })
      .catch((error) => {
        console.error('Erro de rede:', error);
      });
  }
}
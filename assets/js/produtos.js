document.addEventListener('DOMContentLoaded', () => {
  const produtoForm = document.getElementById('produto-form');
  const cadastrarButton = document.querySelector('button[type="submit"]');

  cadastrarButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const valor = document.getElementById('valor').value;
    const categoria = document.getElementById('categoria').value;
    const status = "A";
    
    const imagemInput = document.getElementById('imagem');
    const imagem = imagemInput.files[0];

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('valor', valor);
    formData.append('categoria', categoria);
    formData.append('status', status);
    formData.append('imagem', imagem);
    
    try {
      const response = await fetch('http://localhost:8000/produtos/create', {
        method: 'POST',
        body: formData,
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
  const productCardsContainer = document.getElementById('product-cards');
  const isIndexPage = window.location.href.includes('index.html');
  
  const createProductCard = (produto) => {
    const valorFormatado = parseFloat(produto.valor).toFixed(2).replace('.', ',');

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${produto.imagem}" class="bd-placeholder-img card-img-top" width="70%" height="300" alt="${produto.nome}">
        <div class="card-body">
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text">${produto.descricao}</p>          
          <p class="card-text">${produto.categoria}</p>     
          <div class="d-flex justify-content-between align-items-center">          
          ${
            isIndexPage
              ? `<div class="btn-group">
                  <a href="https://wa.me/5511994698426?text=Estou+interessado+em+produtos+do+seu+catálogo" class="btn btn-sm btn-outline-primary">Eu quero!</a>
                  </button>
                </div>`
              : `<div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-primary" onclick="editarProduto(${produto.id})">Editar</button>
                  <button type="button" class="btn btn-sm btn-danger" onclick="deleteProduct(${produto.id})">Excluir</button>
                </div>`
          }
            <small class="text-body-secondary">R$ ${valorFormatado}</small>
          </div>
        </div>
      </div>
    `;

    return card;
  };
  
  const fetchProductsAndRenderCards = async () => {
    try {
      const response = await fetch('http://localhost:8000/produtos/read');
      if (response.ok) {
        const produtos = await response.json();

        produtos.forEach((produto) => {
          const card = createProductCard(produto);
          productCardsContainer.appendChild(card);
        });
      } else {
        console.error('Erro ao obter produtos da API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };
  
  fetchProductsAndRenderCards();

});


document.addEventListener('DOMContentLoaded', () => {
  const selectCategoria = document.getElementById('categoria');
  const selectCategAlt  = document.getElementById('categoriaEdicao');
  
  fetch('http://localhost:8000/categorias/read') 
    .then((response) => response.json())
    .then((categorias) => {      
      categorias.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.descricao; 
        option.text = categoria.descricao; 
        selectCategoria.appendChild(option);
        selectCategAlt.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Erro ao obter categorias:', error);
    });
});


function deleteProduct(productId) {
  if (confirm("Tem certeza de que deseja excluir este produto?")) {
    fetch(`http://localhost:8000/produtos/delete/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert('Produto excluído com sucesso');
          location.reload();
        } else {
          console.error('Erro ao excluir o produto:', response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error('Erro de rede:', error);
      });
  }
}


function editarProduto(produtoId) {
  // Abra o modal de edição
  const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicao'));

  async function obterDetalhesProduto(produtoId) {
    try {
      const response = await fetch(`http://localhost:8000/produtos/read/${produtoId}`);
      if (response.ok) {
        const produto = await response.json();
        return produto;
      } else {
        console.error('Erro ao obter detalhes da produto:', response.status, response.statusText);
        throw new Error('Erro ao obter detalhes da produto');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      throw new Error('Erro de rede ao obter detalhes da produto');
    }
  }

  // Preencha os campos do modal com os detalhes da produto
  obterDetalhesProduto(produtoId)
    .then((produto) => {
      document.getElementById('nomeEdicao').value = produto.nome;
      document.getElementById('descricaoEdicao').value = produto.descricao;
      document.getElementById('valorEdicao').value = produto.valor;
      document.getElementById('categoriaEdicao').value = produto.categoria;
      document.getElementById('imagemEdicao').value = produto.imagem;
    })
    .catch((error) => {
      console.error('Erro ao obter detalhes da produto:', error);
    });

    modalEdicao.show();

  // Adicione um evento ao botão de atualização no modal de edição
  const botaoAtualizar = document.getElementById('botaoAtualizar');
  botaoAtualizar.addEventListener('click', async () => {
    // Obtenha os dados atualizados do formulário do modal
    const nomeAtualizada = document.getElementById('nomeEdicao').value;
    const descricaoAtualizada = document.getElementById('descricaoEdicao').value;
    const valorAtualizada = document.getElementById('valorEdicao').value;
    const categoriaAtualizada = document.getElementById('categoriaEdicao').value;
    const imagemAtualizada = document.getElementById('imagemEdicao');

    const dataAtualizada = new FormData();
    dataAtualizada.append('nome', nomeAtualizada);
    dataAtualizada.append('descricao', descricaoAtualizada);
    dataAtualizada.append('valor', valorAtualizada);
    dataAtualizada.append('categoria', categoriaAtualizada);

    if (imagemAtualizada.files.length > 0) {
      dataAtualizada.append('imagem', imagemAtualizada.files[0]);
    }

    // const dataAtualizada = {
    //   nome: nomeAtualizada,
    //   descricao: descricaoAtualizada,
    //   valor: valorAtualizada,
    //   categoria: categoriaAtualizada,
    //   imagem: imagemAtualizada,
    // };

    //const jsonDataAtualizado = JSON.stringify(dataAtualizada);

    try {
      const response = await fetch(`http://localhost:8000/produtos/update/${produtoId}`, {
        method: 'PUT',
        body: dataAtualizada
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

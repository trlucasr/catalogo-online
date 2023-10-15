document.addEventListener('DOMContentLoaded', () => {
  // Selecione o formulário pelo ID
  const produtoForm = document.getElementById('produto-form');

  // Selecione o botão "Cadastrar" na página
  const cadastrarButton = document.querySelector('button[type="submit"]');

  // Adicione um evento de clique ao botão "Cadastrar"
  cadastrarButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Impedir o envio padrão do formulário

    // Obtenha os dados do formulário
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const valor = document.getElementById('valor').value;
    const categoria = document.getElementById('categoria').value;
    const status = "A";
    
    // Obtenha o campo de imagem
    const imagemInput = document.getElementById('imagem');
    // O campo de imagem é do tipo "file", portanto, você precisa usar "imagemInput.files[0]" para obter o arquivo selecionado.
    const imagem = imagemInput.files[0];

    // Crie um objeto FormData para enviar os dados, incluindo a imagem
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('valor', valor);
    formData.append('categoria', categoria);
    formData.append('status', status);
    formData.append('imagem', imagem); // Adicione a imagem ao FormData

    // Envie os dados para o servidor usando uma requisição POST
    try {
      const response = await fetch('http://localhost:8000/produtos/create', {
        method: 'POST',
        body: formData, // Use o FormData para enviar os dados, incluindo a imagem
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
  const productCardsContainer = document.getElementById('product-cards');

  // Função para criar um card de produto
  const createProductCard = (produto) => {
    const valorFormatado = parseFloat(produto.valor).toFixed(2).replace('.', ',');

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${produto.imagem}" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="${produto.nome}">
        <div class="card-body">
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text">${produto.descricao}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary">Editar</button>
            </div>
            <small class="text-body-secondary">R$ ${valorFormatado}</small>
          </div>
        </div>
      </div>
    `;

    return card;
  };

  // Função para buscar os produtos na API e criar os cards
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

  console.log('Antes de buscar produtos...');
  // Chame a função para buscar produtos e renderizar os cards
  fetchProductsAndRenderCards();
  console.log('Depois de buscar produtos...');
});

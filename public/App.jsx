// ============================================
// CENTRAL DE COMPRAS - REACT + NODE.JS BACKEND
// ============================================

const { useState, useEffect, useRef } = React;

// ============== CONFIGURAÇÃO DA API ==============
const API_BASE_URL = 'http://localhost:3000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
      return null;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Erro: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert(error.message || 'Erro ao conectar com o servidor');
    throw error;
  }
};

// ============== APIS ==============
const AuthAPI = {
  login: (usuario, senha, tipo) => apiRequest('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email: usuario, senha, tipo })
  })
};

const LojasAPI = {
  getAll: () => apiRequest('/administradores/lojas'),
  getById: (id) => apiRequest(`/lojas/${id}`),
  create: (data) => apiRequest('/administradores/lojas', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/lojas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/administradores/lojas/${id}`, {
    method: 'DELETE'
  })
};

const FornecedoresAPI = {
  getAll: () => apiRequest('/administradores/fornecedores'),
  getById: (id) => apiRequest(`/fornecedores/${id}`),
  create: (data) => apiRequest('/administradores/fornecedores', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/fornecedores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/administradores/fornecedores/${id}`, {
    method: 'DELETE'
  })
};

const ProdutosAPI = {
  getAll: () => apiRequest('/produtos'),
  getById: (id) => apiRequest(`/produtos/${id}`),
  getByFornecedor: () => apiRequest(`/produtos/fornecedor`),
  create: (data) => apiRequest('/administradores/produtos', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/produtos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/administradores/produtos/${id}`, {
    method: 'DELETE'
  })
};

const PedidosAPI = {
  getAll: () => apiRequest('/pedidos'),
  getById: (id) => apiRequest(`/pedidos/${id}`),
  getByLoja: (lojaId) => apiRequest(`/pedidos/loja/${lojaId}`),
  getByFornecedor: () => apiRequest(`/pedidos/fornecedor`),
  create: (data) => apiRequest('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateStatus: (id, status) => apiRequest(`/pedidos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  delete: (id) => apiRequest(`/pedidos/${id}`, {
    method: 'DELETE'
  })
};

const CampanhasAPI = {
  getAll: () => apiRequest('/campanhas'),
  getById: (id) => apiRequest(`/campanhas/${id}`),
  create: (data) => apiRequest('/campanhas', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/campanhas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/campanhas/${id}`, {
    method: 'DELETE'
  })
};

const CondicoesAPI = {
  getAll: () => apiRequest('/condicoes'),
  getById: (id) => apiRequest(`/condicoes/${id}`),
  create: (data) => apiRequest('/condicoes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/condicoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/condicoes/${id}`, {
    method: 'DELETE'
  })
};

// ============== COMPONENTE PRINCIPAL ==============
const CentralCompras = () => {
  // ============== ESTADOS PRINCIPAIS ==============
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null)
  const [currentUserType, setCurrentUserType] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ============== ESTADOS DE DADOS ==============
  const [lojas, setLojas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [condicoes, setCondicoes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosRecebidos, setPedidosRecebidos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  
  // ============== ESTADOS DE FORMULÁRIO ==============
  const [loginData, setLoginData] = useState({
    admin: { usuario: '', senha: '' },
    loja: { usuario: '', senha: '' },
    fornecedor: { usuario: '', senha: '' }
  });
  
  const [formData, setFormData] = useState({
    loja: { id: '', nome: '', cnpj: '', endereco: '', responsavel: '', telefone: '', email: '' },
    fornecedor: { id: '', nome: '', categoria: '', endereco: '', telefone: '', email: '', estado: '' },
    produto: { id: '', nome: '', fornecedor: {}, status: '', preco: '', quantidade_estoque: '', descricao: '' },
    campanha: { id: '', nome: '', data_inicio: '', data_fim: '', tipo: 'valor', valor: 0, produto: {} },
    condicao: { id: '', uf: '', cashback: '', prazo: '', acrescimo: '' }
  });

  // ============== ESTADOS DE MODAL ==============
  const [modalOpen, setModalOpen] = useState('');
  const [deleteData, setDeleteData] = useState({ tipo: '', id: '', nome: '' });

  // ============== CONFIGURAÇÕES ==============
  const menuConfigs = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'lojas', label: 'Lojas', icon: '🏪' },
      { id: 'fornecedores', label: 'Fornecedores', icon: '🚚' },
      { id: 'produtos', label: 'Produtos', icon: '📦' },
    ],
    loja: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'realizarPedido', label: 'Realizar Pedido', icon: '🛒' },
      { id: 'meusPedidos', label: 'Meus Pedidos', icon: '📋' },
      { id: 'catalogoProdutos', label: 'Catálogo', icon: '📦' },
      { id: 'meusDados', label: 'Meus Dados', icon: '👤' }
    ],
    fornecedor: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'pedidosRecebidos', label: 'Pedidos Recebidos', icon: '📥' },
      { id: 'produtos', label: 'Meus Produtos', icon: '📦' },
      { id: 'campanhas', label: 'Campanhas', icon: '📢' },
      { id: 'condicoes', label: 'Condições', icon: '⚙️' }
    ]
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // ============== FUNÇÕES UTILITÁRIAS ==============
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const extractUFFromAddress = (address) => {
    if (!address) return '';
    const match = address.match(/(?:,\s*|-\s*|\s)([A-Za-z]{2})\s*$/);
    return match ? match[1].toUpperCase() : '';
  };

  // ============== HANDLERS DE LOGIN ==============
  const handleLogin = async (type) => {
    setLoading(true);
    const { usuario, senha } = loginData[type];
    
    if (!usuario.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthAPI.login(usuario, senha, type);
      
      const { data: { token, usuario: authUser, perfil} } = response
      setCurrentUser(authUser);
      setCurrentUserType(type);
      setCurrentScreen('main');
      setCurrentPage('dashboard');
      setCurrentProfile(perfil)
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('profile', JSON.stringify(perfil));
      localStorage.setItem('token', token);
      localStorage.setItem('userType', type);
      
    } catch (error) {
      alert('Erro no login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [currentUserType]);

  const loadInitialData = async () => {
    try {
      // Carregar dados com base no tipo de usuário
      switch(currentUserType) {
        case 'admin':
          const [lojasData, fornecedoresData, produtosData, condicoesData] = await Promise.all([
            LojasAPI.getAll(),
            FornecedoresAPI.getAll(),
            ProdutosAPI.getAll(),
            CondicoesAPI.getAll()
          ]);
          if (lojasData.success) {
            setLojas(lojasData.data || []);
          }
          if (fornecedoresData.success) {
            const parsedFornecedores = fornecedoresData.data.map(fornecedor => ({
              ...fornecedor,
              nome: fornecedor.nome_fornecedor,
              email: fornecedor.email_contato,
            }));
            setFornecedores(parsedFornecedores || []);
          }
          if (produtosData.success) {
            setProdutos(produtosData.data || []);
          }
          if (condicoesData.success) {
            setCondicoes(condicoesData.data || []);
          }
          break;
          
        case 'loja':
          const [produtosDisponiveis, pedidosLoja] = await Promise.all([
            ProdutosAPI.getAll(),
            PedidosAPI.getByLoja(currentProfile.id)
          ]);
          if (produtosDisponiveis.success) {
            setProdutos(produtosDisponiveis.data || []);
          }
          
          if (pedidosLoja.success) {
            setPedidos(pedidosLoja.data || []);
          }
          break;
          
        case 'fornecedor':
          const [produtosFornecedor, campanhasData, pedidosFornecedor] = await Promise.all([
            ProdutosAPI.getByFornecedor(),
            CampanhasAPI.getAll(),
            PedidosAPI.getByFornecedor()
          ]);
          if (produtosFornecedor.success) {
            setProdutos(produtosFornecedor.data || []);
          }

          if (campanhasData.success) {
            setCampanhas(campanhasData.data || []);
          }
          if (pedidosFornecedor.success) {
            setPedidosRecebidos(pedidosFornecedor.data || []);
          }
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleLogout = () => {
    if (!confirm('Deseja realmente sair?')) return;
    
    setCurrentUser(null);
    setCurrentUserType('');
    setCurrentScreen('login');
    setCurrentPage('dashboard');
    setCarrinho([]);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  };

  // ============== HANDLERS CRUD ==============
  const handleSaveLoja = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await LojasAPI.create(formData.loja);
      if (response.success) {
        const loja = response.data.loja;

        setLojas([...lojas, loja]);
        setModalOpen('');
        resetForm('loja');
        alert(`Loja criada com sucesso!\nUsuario: ${response.data.credenciais.email}\nSenha: ${response.data.credenciais.senha}`);
      }
      
      
    } catch (error) {
      alert('Erro ao salvar loja: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFornecedor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await FornecedoresAPI.create(formData.fornecedor);
      if (response.success) {
        const fornecedor = {
          ...response.data.fornecedor,
          nome: response.data.fornecedor.nome_fornecedor,
          email: response.data.fornecedor.email_contato
        };
        setFornecedores([...fornecedores, fornecedor]);
        setModalOpen('');
        resetForm('fornecedor');
        alert(`Fornecedor criado com sucesso!\nUsuario: ${response.data.credenciais.email}\nSenha: ${response.data.credenciais.senha}`);
      }
    } catch (error) {
      alert('Erro ao salvar fornecedor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduto = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const produtoData = {
        ...formData.produto,
        preco: parseFloat(formData.produto.preco),
        estoque: parseInt(formData.produto.estoque),
        fornecedor_id: formData.produto.fornecedor ? formData.produto.fornecedor.id_fornecedor : undefined
      };
      
      const response = await ProdutosAPI.create(produtoData);
      if (response.success) {
        const produto = {
          ...response.data,
          fornecedor: formData.produto.fornecedor
        };

        setProdutos([...produtos, produto]);
        setModalOpen('');
        resetForm('produto');
        alert('Produto criado com sucesso!');
      }
      
    } catch (error) {
      alert('Erro ao salvar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCampanha = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const campanhaData = {
        ...formData.campanha,
        produto_id: formData.campanha.produto.id_produto,
        tipo: formData.campanha.tipo || 'quantidade'
      }
      const response = await CampanhasAPI.create(campanhaData);
      if (response.success) {
        const campanha = {
          ...response.data,
          fornecedor: currentProfile,
          produto: formData.campanha.produto
        }
        setCampanhas([...campanhas, campanha]);
        setModalOpen('');
        resetForm('campanha');
        alert('Campanha criada com sucesso!');
      }
      
    } catch (error) {
      alert('Erro ao salvar campanha: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCondicao = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const condicaoData = {
        ...formData.condicao,
        cashback: parseInt(formData.condicao.cashback),
        prazo: parseInt(formData.condicao.prazo),
        acrescimo: parseInt(formData.condicao.acrescimo)
      };
      
      const response = await CondicoesAPI.create(condicaoData);
      setCondicoes([...condicoes, response]);
      setModalOpen('');
      resetForm('condicao');
      alert('Condição salva com sucesso!');
      
    } catch (error) {
      alert('Erro ao salvar condição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    
    try {
      const { tipo, id } = deleteData;
      
      switch(tipo) {
        case 'loja':
          await LojasAPI.delete(id);
          setLojas(lojas.filter(l => l.id !== id));
          break;
          
        case 'fornecedor':
          await FornecedoresAPI.delete(id);
          setFornecedores(fornecedores.filter(f => f.id_fornecedor !== id));
          break;
          
        case 'produto':
          await ProdutosAPI.delete(id);
          setProdutos(produtos.filter(p => p.id_produto !== id));
          break;
          
        case 'campanha':
          await CampanhasAPI.delete(id);
          setCampanhas(campanhas.filter(c => c.id_campanha !== id));
          break;
          
        case 'condicao':
          await CondicoesAPI.delete(id);
          setCondicoes(condicoes.filter(c => c.id !== id));
          break;
      }
      
      alert('Item excluído com sucesso!');
      
    } catch (error) {
      alert('Erro ao excluir item: ' + error.message);
    } finally {
      setLoading(false);
      setDeleteData({ tipo: '', id: '', nome: '' });
    }
  };

  const resetForm = (formType) => {
    setFormData(prev => ({
      ...prev,
      [formType]: Object.keys(prev[formType]).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {})
    }));
  };

  // ============== HANDLERS PEDIDOS ==============
  const handleAddToCart = (produto) => {
    const existingItem = carrinho.find(item => item.id_produto === produto.id_produto);
    
    if (existingItem) {
      if (existingItem.quantidade + 1 > produto.quantidade_estoque) {
        alert('Estoque insuficiente');
        return;
      }
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      if (produto.quantidade_estoque < 1) {
        alert('Estoque insuficiente');
        return;
      }
      setCarrinho([...carrinho, {
        ...produto,
        quantidade: 1
      }]);
    }
  };

  const handleUpdateCartQuantity = (produtoId, delta) => {
    const idx = carrinho.findIndex(item => item.id === produtoId);
    if (idx === -1) return;
    
    const produto = produtos.find(p => p.id === produtoId);
    const newQty = carrinho[idx].quantidade + delta;
    
    if (newQty < 1) {
      handleRemoveFromCart(produtoId);
      return;
    }
    
    if (newQty > produto.estoque) {
      alert('Estoque insuficiente');
      return;
    }
    
    setCarrinho(carrinho.map((item, i) =>
      i === idx ? { ...item, quantidade: newQty } : item
    ));
  };

  const handleRemoveFromCart = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
  };

  const handleFinalizarPedido = async () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    if (!confirm('Deseja finalizar o pedido?')) return;

    setLoading(true);

    try {
      const pedidoData = {
        loja_id: currentProfile.id,
        itens: carrinho.map(item => ({
          produto_id: item.id_produto,
          quantidade: item.quantidade,
          preco: item.preco
        })),
        total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
      };

      await PedidosAPI.create(pedidoData);
      
      // Atualizar estoque dos produtos
      carrinho.forEach(async (item) => {
        await ProdutosAPI.update(item.id_produto, {
          quantidade_estoque: item.quantidade_estoque - item.quantidade
        });
      });

      // Atualizar lista de produtos
      const produtosAtualizados = await ProdutosAPI.getAll();
      if (produtosAtualizados.success) {
        setProdutos(produtosAtualizados.data || []);
      }
      
      // Atualizar lista de pedidos
      const pedidosAtualizados = await PedidosAPI.getByLoja(currentProfile.id);
      if (pedidosAtualizados.success) {
        setPedidos(pedidosAtualizados.data || []);
      }
      
      setCarrinho([]);
      setCurrentPage('meusPedidos');
      alert('Pedido realizado com sucesso!');

    } catch (error) {
      alert('Erro ao finalizar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============== EFFECTS ==============
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('profile');
    const savedType = localStorage.getItem('userType');
    if (savedUser && savedType) {
      const userData = JSON.parse(savedUser);
      const profileData = JSON.parse(savedProfile)
      setCurrentUser(userData);
      setCurrentProfile(profileData);
      setCurrentUserType(savedType);
      setCurrentScreen('main');
      loadInitialData();
    }
  }, []);

  // ============== RENDERIZAÇÃO DAS PÁGINAS ==============
  const renderLoginScreen = () => (
    <div className="screen active" id="loginScreen">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-icon">🛒</div>
          <h1>Central de Compras</h1>
          <p>Casa Guido - Plataforma de Gestão</p>
        </div>

        <div className="login-card">
          <h2>Acesso ao Sistema</h2>
          <p className="subtitle">Selecione seu perfil e faça login</p>

          <div className="tabs">
            {['admin', 'loja', 'fornecedor'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'admin' ? 'Admin' : tab === 'loja' ? 'Loja' : 'Fornecedor'}
              </button>
            ))}
          </div>

          <div className="tab-content active">
            <div className="tab-label">
              <span className="badge">
                {activeTab === 'admin' ? '👨‍💼' : activeTab === 'loja' ? '🏪' : '🚚'}
              </span>
              <span>
                {activeTab === 'admin' ? 'Acesso para administradores' :
                 activeTab === 'loja' ? 'Acesso para lojistas' :
                 'Acesso para fornecedores'}
              </span>
            </div>
            
            <form className="login-form" onSubmit={(e) => {
              e.preventDefault();
              handleLogin(activeTab);
            }}>
              <div className="form-group">
                <label>Usuário</label>
                <input
                  type="text"
                  value={loginData[activeTab].usuario}
                  onChange={(e) => setLoginData({
                    ...loginData,
                    [activeTab]: { ...loginData[activeTab], usuario: e.target.value }
                  })}
                  placeholder={
                    activeTab === 'admin' ? 'admin' :
                    activeTab === 'loja' ? 'loja_001' :
                    'fornecedor_001'
                  }
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  value={loginData[activeTab].senha}
                  onChange={(e) => setLoginData({
                    ...loginData,
                    [activeTab]: { ...loginData[activeTab], senha: e.target.value }
                  })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Carregando...' : 
                 activeTab === 'admin' ? 'Entrar como Administrador' :
                 activeTab === 'loja' ? 'Entrar como Loja' :
                 'Entrar como Fornecedor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const getStats = () => {
      switch(currentUserType) {
        case 'admin':
          return [
            { label: 'Lojas', value: lojas.length, icon: '🏪', color: '#5B7FFF' },
            { label: 'Fornecedores', value: fornecedores.length, icon: '🚚', color: '#4CAF50' },
            { label: 'Produtos', value: produtos.length, icon: '📦', color: '#9C27B0' },
            { label: 'Campanhas', value: campanhas.length, icon: '📢', color: '#FF9800' }
          ];
        case 'loja':
          const meusPedidos = pedidos.filter(p => p.lojaId === currentUser?.id);
          return [
            { label: 'Produtos Disponíveis', value: produtos.reduce((s, p) => s + (p.quantidade_estoque || 0), 0), icon: '📦', color: '#5B7FFF' },
            { label: 'Pedidos Realizados', value: meusPedidos.filter(p => p.status === 'Aprovado').length, icon: '✅', color: '#4CAF50' },
            { label: 'Pedidos Pendentes', value: meusPedidos.filter(p => p.status === 'Pendente').length, icon: '⏳', color: '#FF9800' },
            { label: 'Valor Total', value: formatCurrency(meusPedidos.reduce((s, p) => s + (p.total || 0), 0)), icon: '💰', color: '#00BCD4' }
          ];
        case 'fornecedor':
          const pedidosFornecedor = pedidos.filter(p => p.fornecedor?.id_fornecedor === currentUser?.id);
          return [
            { label: 'Pedidos Novos', value: pedidosFornecedor.filter(p => p.status === 'Pendente').length, icon: '📥', color: '#5B7FFF' },
            { label: 'Produtos Cadastrados', value: produtos.filter(p => p.fornecedor?.id_fornecedor === currentUser?.id).length, icon: '📦', color: '#4CAF50' },
            { label: 'Campanhas Ativas', value: campanhas.filter(c => c.status === 'Ativa').length, icon: '📢', color: '#9C27B0' },
            { label: 'Vendas do Mês', value: formatCurrency(pedidosFornecedor.filter(p => p.status === 'Aprovado').reduce((s, p) => s + (p.total || 0), 0)), icon: '💰', color: '#FF9800' }
          ];
        default:
          return [];
      }
    };

    return (
      <div id="dashboard" className={`page ${currentPage === 'dashboard' ? 'active' : ''}`}>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Bem-vindo, {currentUser?.nome || 'Usuário'}</p>
        </div>

        <div className="stats-grid" id="statsGrid">
          {getStats().map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.color }}>{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.label}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-activity" id="recentActivityContainer">
          <h3>Atividades Recentes</h3>
          <div id="recentActivityList">
            <div className="activity-item">
              <span className="activity-dot"></span>
              <p>Sistema iniciado</p>
              <span className="activity-time">Agora</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot"></span>
              <p>Usuário: {currentUser?.nome || 'Não logado'}</p>
              <span className="activity-time">Logado</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLojas = () => (
    <div id="lojas" className={`page ${currentPage === 'lojas' ? 'active' : ''}`}>
      <div className="page-header">
        <h1>Lojas</h1>
        <p>Gerencie as lojas cadastradas</p>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Buscar" />
        </div>
        <button className="btn-primary" onClick={() => {
          resetForm('loja');
          setModalOpen('lojaModal');
        }}>
          + Nova Loja
        </button>
      </div>

      <table className="data-table" id="lojasTable">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Responsável</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lojas.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Nenhuma loja cadastrada.
              </td>
            </tr>
          ) : (
            lojas.map(loja => (
              <tr key={loja.id}>
                <td>{loja.nome || ''}</td>
                <td>{loja.cnpj || ''}</td>
                <td>{loja.endereco || ''}</td>
                <td>{loja.responsavel || ''}</td>
                <td>{loja.email || ''}</td>
                <td>{loja.telefone || ''}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete" onClick={() => 
                      setDeleteData({ tipo: 'loja', id: loja.id, nome: loja.nome })
                    }>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderFornecedores = () => (
    <div id="fornecedores" className={`page ${currentPage === 'fornecedores' ? 'active' : ''}`}>
      <div className="page-header">
        <h1>Fornecedores</h1>
        <p>Gerencie os fornecedores cadastrados</p>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Buscar" />
        </div>
        <button className="btn-primary" onClick={() => {
          resetForm('fornecedor');
          setModalOpen('fornecedorModal');
        }}>
          + Adicionar Fornecedor
        </button>
      </div>

      <table className="data-table" id="fornecedoresTable">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Nenhum fornecedor cadastrado.
              </td>
            </tr>
          ) : (
            fornecedores.map(fornecedor => (
              <tr key={fornecedor.id_fornecedor}>
                <td>{fornecedor.nome || ''}</td>
                <td>{fornecedor.categoria || ''}</td>
                <td>{fornecedor.endereco || ''}</td>
                <td>{fornecedor.telefone || ''}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete" onClick={() => 
                      setDeleteData({ tipo: 'fornecedor', id: fornecedor.id_fornecedor, nome: fornecedor.nome })
                    }>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderProdutos = () => (
    <div id="produtos" className={`page ${currentPage === 'produtos' ? 'active' : ''}`}>
      <div className="page-header">
        <h1>Produtos</h1>
        <p>Gerencie o catálogo de produtos</p>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Buscar" />
        </div>
        <button className="btn-primary" onClick={() => {
          resetForm('produto');
          setModalOpen('produtoModal');
        }}>
          + Adicionar Produto
        </button>
      </div>

      <table className="data-table" id="produtosTable">
        <thead>
          <tr>
            <th>Nome</th>
            {currentUser.tipo !== 'fornecedor' ? <th>Fornecedor</th> : null}
            <th>Status</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Nenhum produto cadastrado.
              </td>
            </tr>
          ) : (
            produtos.map(produto => (
              <tr key={produto.id_produto}>
                <td>{produto.nome || ''}</td>
                {currentUser.tipo !== 'fornecedor' ? <td>{produto.fornecedor.nome_fornecedor || ''}</td> : null }
                <td>{produto.status || ''}</td>
                <td>{formatCurrency(produto.preco)}</td>
                <td>{produto.quantidade_estoque || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete" onClick={() => 
                      setDeleteData({ tipo: 'produto', id: produto.id_produto, nome: produto.nome })
                    }>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCampanhas = () => (
    <div id="campanhas" className={`page ${currentPage === 'campanhas' ? 'active' : ''}`}>
      <div className="page-header">
        <h1>Campanhas</h1>
        <p>Gerencie campanhas promocionais</p>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Buscar campanhas" />
        </div>
        <button className="btn-primary" onClick={() => {
          resetForm('campanha');
          const today = new Date().toISOString().split('T')[0];
          const future = new Date();
          future.setMonth(future.getMonth() + 1);
          const futureDate = future.toISOString().split('T')[0];
          
          setFormData(prev => ({
            ...prev,
            campanha: {
              ...prev.campanha,
              data_inicio: today,
              data_fim: futureDate
            }
          }));
          
          setModalOpen('campanhaModal');
        }}>
          + Nova Campanha
        </button>
      </div>

      <table className="data-table" id="campanhasTable">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Produto</th>
            <th>Data Inicio</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {campanhas.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Nenhuma campanha cadastrada.
              </td>
            </tr>
          ) : (
            campanhas.map(campanha => (
              <tr key={campanha.id_campanha}>
                <td>{campanha.nome}</td>
                <td>{campanha.produto.nome}</td>
                <td>{campanha.data_inicio.split('T')[0]}</td>
                <td>{campanha.tipo}</td>
                <td>{campanha.valor}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete" onClick={() => 
                      setDeleteData({ tipo: 'campanha', id: campanha.id_campanha, nome: campanha.nome })
                    }>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCondicoes = () => (
    <div id="condicoes" className={`page ${currentPage === 'condicoes' ? 'active' : ''}`}>
      <div className="page-header">
        <h1>Condições por Estado</h1>
        <p>Configure as condições comerciais por estado</p>
      </div>

      <div className="page-toolbar">
        <button className="btn-primary" onClick={() => {
          resetForm('condicao');
          setModalOpen('condicaoModal');
        }}>
          + Adicionar Condição
        </button>
      </div>

      <table className="data-table" id="condicoesTable">
        <thead>
          <tr>
            <th>UF</th>
            <th>Cashback (%)</th>
            <th>Prazo (dias)</th>
            <th>Acréscimo/Desconto (%)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {condicoes.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Nenhuma condição cadastrada.
              </td>
            </tr>
          ) : (
            condicoes.map(condicao => (
              <tr key={condicao.id}>
                <td>{condicao.uf || ''}</td>
                <td>{condicao.cashback || 0}%</td>
                <td>{condicao.prazo || 0} dias</td>
                <td>{condicao.acrescimo > 0 ? '+' : ''}{condicao.acrescimo || 0}%</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete" onClick={() => 
                      setDeleteData({ tipo: 'condicao', id: condicao.id, nome: condicao.uf })
                    }>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderRealizarPedido = () => {
    const totalCarrinho = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    return (
      <div id="realizarPedido" className={`page ${currentPage === 'realizarPedido' ? 'active' : ''}`}>
        <div className="page-header">
          <h1>Realizar Pedido</h1>
          <p>Selecione produtos e finalize seu pedido</p>
        </div>

        <div className="pedido-container">
          {/* PRODUTOS (ESQUERDA) */}
          <div className="produtos-section">
            <div className="filtros">
              <input type="text" placeholder="Buscar produto..." />
              <select defaultValue="">
                <option value="">Todos Fornecedores</option>
                {[...new Set(produtos.map(p => p.fornecedor))].map(fornecedor => (
                  <option key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor}>{fornecedor.nome_fornecedor}</option>
                ))}
              </select>
            </div>

            <div id="listaProdutosPedido" className="lista-produtos">
              {produtos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  Nenhum produto disponível.
                </div>
              ) : (
                produtos.map(produto => (
                  <div key={produto.id_produto} className="produto-item">
                    <h4>{produto.nome}</h4>
                    <p><strong>Fornecedor:</strong> {produto.fornecedor.nome_fornecedor}</p>
                    <p><strong>Estoque:</strong> {produto.quantidade_estoque}</p>
                    <div className="preco">{formatCurrency(produto.preco)}</div>
                    <button onClick={() => handleAddToCart(produto)}>
                      <i className="fas fa-cart-plus"></i> Adicionar
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* CARRINHO (DIREITA) */}
            <div className="carrinho-section">
              <h3><i className="fas fa-shopping-cart"></i> Carrinho ({carrinho.length})</h3>
              <div id="carrinhoItensPedido" className="carrinho-itens">
                {carrinho.length === 0 ? (
                  <div className="carrinho-vazio">Carrinho vazio</div>
                ) : (
                  carrinho.map(item => (
                    <div key={item.id_produto} className="carrinho-item">
                      <div className="carrinho-item-info">
                        <h4>{item.nome}</h4>
                        <p>{item.fornecedor.nome_fornecedor} - {formatCurrency(item.preco)}</p>
                      </div>
                      <div className="carrinho-item-controles">
                        <button onClick={() => handleUpdateCartQuantity(item.id, -1)}>-</button>
                        <span className="carrinho-item-quantidade">{item.quantidade}</span>
                        <button onClick={() => handleUpdateCartQuantity(item.id, 1)}>+</button>
                        <span className="carrinho-item-total">
                          {formatCurrency(item.preco * item.quantidade)}
                        </span>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleRemoveFromCart(item.id)}
                          style={{ marginLeft: '10px' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="carrinho-footer">
                <strong>Total:</strong>
                <span id="totalCarrinhoPedido">{formatCurrency(totalCarrinho)}</span>
                <button 
                  className="btn-primary" 
                  onClick={handleFinalizarPedido}
                  disabled={carrinho.length === 0 || loading}
                >
                  {loading ? 'Processando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const renderPedidosRecebidos = () => {

    const handleApprovePedido = async (pedidoId) => {
      if (!confirm('Deseja aprovar este pedido?')) return;

      await PedidosAPI.updateStatus(pedidoId, 'aprovado');
      setPedidos(pedidosRecebidos.map(p =>
        p.id_pedido === pedidoId ? { ...p, status: 'aprovado' } : p
      ));
      alert('Pedido aprovado com sucesso!');
    };

    const getStatusClass = (status) => {
      switch(status) {
        case 'pendente': return 'status-pendente';
        case 'aprovado': return 'status-aprovado';
        case 'Separado': return 'status-separado';
        case 'Enviado': return 'status-enviado';
        case 'Entregue': return 'status-entregue';
        case 'Cancelado': return 'status-cancelado';
        default: return '';
      }
    };

    return (
      <div id="pedidosRecebidos" className={`page ${currentPage === 'pedidosRecebidos' ? 'active' : ''}`}>
        <div className="page-header">
          <h1>Pedidos Recebidos</h1>
          <p>Gerencie os pedidos recebidos</p>
        </div>

        <div className="page-toolbar">
          <div className="search-box">
            <input type="text" placeholder="Buscar pedidos" />
          </div>
        </div>

        <table className="data-table" id="pedidosRecebidosTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loja</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosRecebidos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Nenhum pedido recebido.
                </td>
              </tr>
            ) : (
              pedidosRecebidos.map(p => (
                <tr key={p.id_pedido}>
                  <td>#{p.id_pedido}</td>
                  <td>{p.loja_nome || ''}</td>
                  <td>{formatDate(p.criado_em.split('T')[0])}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{formatCurrency(p.total)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit">Detalhes</button>
                      {p.status === 'pendente' && (
                        <button className="btn-primary" onClick={() => handleApprovePedido(p.id_pedido)}>Aprovar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  const renderMeusPedidos = () => {
    const meusPedidos = pedidos.filter(p => p.loja_id === currentProfile?.id);

    const getStatusClass = (status) => {
      switch(status) {
        case 'pendente': return 'status-pendente';
        case 'Aprovado': return 'status-aprovado';
        case 'Separado': return 'status-separado';
        case 'Enviado': return 'status-enviado';
        case 'Entregue': return 'status-entregue';
        case 'Cancelado': return 'status-cancelado';
        default: return '';
      }
    };

    return (
      <div id="meusPedidos" className={`page ${currentPage === 'meusPedidos' ? 'active' : ''}`}>
        <div className="page-header">
          <h1>Meus Pedidos</h1>
          <p>Acompanhe seus pedidos</p>
        </div>

        <div className="page-toolbar">
          <div className="search-box">
            <input type="text" placeholder="Buscar pedidos" />
          </div>
        </div>

        <table className="data-table" id="meusPedidosTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {meusPedidos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Nenhum pedido.
                </td>
              </tr>
            ) : (
              meusPedidos.map(p => (
                <tr key={p.id_pedido}>
                  <td>#{p.id_pedido}</td>
                  <td>{formatDate(p.criado_em.split('T')[0])}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{formatCurrency(p.total)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit">Detalhes</button>
                      {p.status === 'Pendente' && (
                        <button className="btn-delete">Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // ============== MODAIS ==============
  const renderLojaModal = () => (
    <div id="lojaModal" className={`modal ${modalOpen === 'lojaModal' ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cadastro de Loja</h2>
          <p>Preencha os dados abaixo</p>
          <button className="modal-close" onClick={() => setModalOpen('')}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSaveLoja}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.loja.nome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, nome: e.target.value }
                }))}
                placeholder="Ex: Loja Centro"
                required
              />
            </div>
            <div className="form-group">
              <label>CNPJ</label>
              <input
                type="text"
                value={formData.loja.cnpj}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, cnpj: e.target.value }
                }))}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Endereço</label>
              <input
                type="text"
                value={formData.loja.endereco.nome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, endereco: e.target.value }
                }))}
                placeholder="Rua, número"
                required
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.loja.estado}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, estado: e.target.value }
                }))}
                required
              >
                <option value="">Selecione o estado</option>
                {estados.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Responsável</label>
              <input
                type="text"
                value={formData.loja.responsavel}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, responsavel: e.target.value }
                }))}
                placeholder="Nome do responsável"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={formData.loja.telefone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loja: { ...prev.loja, telefone: e.target.value }
                }))}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={formData.loja.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                loja: { ...prev.loja, email: e.target.value }
              }))}
              placeholder="contato@loja.com"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen('')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFornecedorModal = () => (
    <div id="fornecedorModal" className={`modal ${modalOpen === 'fornecedorModal' ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Fornecedor</h2>
          <p>Cadastre um novo fornecedor no sistema</p>
          <button className="modal-close" onClick={() => setModalOpen('')}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSaveFornecedor}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.fornecedor.nome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, nome: e.target.value }
                }))}
                placeholder="Ex: Fornecedor XYZ"
                required
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <input
                type="text"
                value={formData.fornecedor.categoria}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, categoria: e.target.value }
                }))}
                placeholder="Categoria"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Endereço</label>
              <input
                type="text"
                value={formData.fornecedor.endereco}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, endereco: e.target.value }
                }))}
                placeholder="Rua, número, cidade"
                required
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.fornecedor.estado}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, estado: e.target.value }
                }))}
                required
              >
                <option value="">Selecione o estado</option>
                {estados.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={formData.fornecedor.telefone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, telefone: e.target.value }
                }))}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={formData.fornecedor.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fornecedor: { ...prev.fornecedor, email: e.target.value }
                }))}
                placeholder="contato@fornecedor.com"
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen('')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderProdutoModal = () => (
    <div id="produtoModal" className={`modal ${modalOpen === 'produtoModal' ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Produto</h2>
          <p>Cadastre um novo produto no sistema</p>
          <button className="modal-close" onClick={() => setModalOpen('')}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSaveProduto}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={formData.produto.nome}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                produto: { ...prev.produto, nome: e.target.value }
              }))}
              placeholder="Nome do produto"
              required
            />
          </div>
          {currentUser && currentUser.tipo === 'fornecedor' ? (
            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                value={formData.produto.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  produto: { ...prev.produto, status: e.target.value }
                }))}
                placeholder="Status do produto"
                required
              />
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label>Fornecedor</label>
                <select
                  value={formData.produto.fornecedor.id_fornecedor}
                  onChange={(e) => setFormData(prev => {
                    const fornecedor = fornecedores.find(f => f.id_fornecedor == e.target.value);
                    return {
                      ...prev,
                      produto: { ...prev.produto, fornecedor: fornecedor }
                    }
                  })}
                  required
                >
                  <option value="">Selecione o fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor}>
                      {fornecedor.nome} | {fornecedor.id_fornecedor}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <input
                  type="text"
                  value={formData.produto.status}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    produto: { ...prev.produto, status: e.target.value }
                  }))}
                  placeholder="Status do produto"
                  required
                />
              </div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                value={formData.produto.preco}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  produto: { ...prev.produto, preco: e.target.value }
                }))}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Estoque</label>
              <input
                type="number"
                value={formData.produto.quantidade_estoque}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  produto: { ...prev.produto, quantidade_estoque: e.target.value }
                }))}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.produto.descricao}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                produto: { ...prev.produto, descricao: e.target.value }
              }))}
              placeholder="Descrição do produto"
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen('')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderCampanhaModal = () => (
    <div id="produtoModal" className={`modal ${modalOpen === 'campanhaModal' ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Campanha</h2>
          <p>Cadastre uma nova campanha no sistema</p>
          <button className="modal-close" onClick={() => setModalOpen('')}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSaveCampanha}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.campanha.nome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  campanha: { ...prev.campanha, nome: e.target.value }
                }))}
                placeholder="Nome da campanha"
                required
              />
            </div>
            <div className="form-group">
              <label>Tipo de campanha</label>
              <select
                value={formData.campanha.tipo}
                defaultValue={'valor'}
                onChange={(e) => setFormData(prev => {
                  return {
                    ...prev,
                    campanha: { ...prev.campanha, tipo: e.target.value }
                  }
                })}
                required
              >
                <option key={'quantidade'} value={'quantidade'}>Quantidade</option>
                <option key={'valor'} value={'valor'}>Valor</option>
              </select>
            </div>
          </div>
          {formData.campanha.tipo === 'valor' ? (
            <div className="form-group">
              <label>Compras acima de:</label>
              <input
                type="number"
                value={formData.campanha.valor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  campanha: { ...prev.campanha, valor: e.target.value }
                }))}
                placeholder="Valor minimo da compra"
                required
              />
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label>Unidades</label>
                <input
                  type="number"
                  value={formData.campanha.valor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    campanha: { ...prev.campanha, valor: e.target.value }
                  }))}
                  placeholder="Desconto a ser aplicado"
                  required
                />
              </div>
              <div className="form-group">
                <label>Produto</label>
                <select
                  value={formData.campanha.produto.id_produto}
                  onChange={(e) => setFormData(prev => {
                    const produto = produtos.find(f => f.id_produto == e.target.value);
                    return {
                      ...prev,
                      campanha: { ...prev.campanha, produto: produto }
                    }
                  })}
                  required
                >
                  <option value="">Selecione o produto</option>
                  {produtos.map(produto => (
                    <option key={produto.id_produto} value={produto.id_produto}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Data Inicio</label>
              <input
                type="date"
                value={formData.campanha.data_inicio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  campanha: { ...prev.campanha, data_inicio: e.target.value }
                }))}
                placeholder="dd/mm/aaaa"
                required
              />
            </div>
            <div className="form-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={formData.campanha.data_fim}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  campanha: { ...prev.campanha, data_fim: e.target.value }
                }))}
                placeholder="dd/mm/aaaa"
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen('')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDeleteModal = () => (
    <div id="confirmDeleteModal" className={`modal ${deleteData.tipo ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirmar Exclusão</h2>
          <p>Tem certeza que deseja excluir "{deleteData.nome}"?</p>
          <button className="modal-close" onClick={() => setDeleteData({ tipo: '', id: '', nome: '' })}>
            &times;
          </button>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-danger" onClick={handleDeleteItem} disabled={loading}>
            {loading ? 'Excluindo...' : 'Sim, Excluir'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setDeleteData({ tipo: '', id: '', nome: '' })}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  // ============== RENDERIZAÇÃO PRINCIPAL ==============
  const renderMainScreen = () => (
    <div id="mainScreen" className="screen active">
      <div className="main-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo-small">🛒</div>
            <h3>Central de<br />Compras</h3>
            <p>{currentUserType === 'admin' ? 'Administrador' : 
                currentUserType === 'loja' ? 'Loja' : 'Fornecedor'}</p>
          </div>

          <nav className="sidebar-menu">
            {(menuConfigs[currentUserType] || []).map(item => (
              <button
                key={item.id}
                className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="btn-logout" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span>Sair</span>
          </button>
        </aside>

        {/* CONTENT AREA */}
        <main className="content">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'lojas' && renderLojas()}
          {currentPage === 'fornecedores' && renderFornecedores()}
          {currentPage === 'produtos' && renderProdutos()}
          {currentPage === 'campanhas' && renderCampanhas()}
          {currentPage === 'condicoes' && renderCondicoes()}
          {currentPage === 'realizarPedido' && renderRealizarPedido()}
          {currentPage === 'meusPedidos' && renderMeusPedidos()}
          {currentPage === 'pedidosRecebidos' && renderPedidosRecebidos()}
          {/* Adicione outras páginas conforme necessário */}
        </main>
      </div>
    </div>
  );

  // ============== RENDER FINAL ==============
  return (
    <div className="central-compras">
      {currentScreen === 'login' ? renderLoginScreen() : renderMainScreen()}

      {/* MODAIS */}
      {renderLojaModal()}
      {renderFornecedorModal()}
      {renderProdutoModal()}
      {renderDeleteModal()}
      {renderCampanhaModal()}
    </div>
  );
};

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CentralCompras />);
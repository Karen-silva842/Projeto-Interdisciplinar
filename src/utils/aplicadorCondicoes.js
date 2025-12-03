const CondicaoComercial = require('../models/condicaoComercial');

class AplicadorCondicoes {
  static async aplicarCondicoesEstado(pedidoData) {
    const { fornecedor_id, estado_loja, itens } = pedidoData;

    const condicao = await CondicaoComercial.buscarPorFornecedorEEstado(
      fornecedor_id,
      estado_loja
    );

    if (!condicao) {
      return {
        condicao_aplicada: false,
        valor_original: pedidoData.valor_total,
        valor_final: pedidoData.valor_total,
        cashback: 0,
        prazo_pagamento: 30, 
        ajustes: []
      };
    }

    let valorTotal = pedidoData.valor_total;
    const ajustes = [];

    if (condicao.ajuste_preco_unitario !== 0) {
      itens.forEach(item => {

        const precoAntigo = item.preco_unitario;
        const precoNovo = precoAntigo + condicao.ajuste_preco_unitario;

        const valorAntigo = item.valor_total;
        const valorNovo = item.quantidade * precoNovo;

        const diferenca = valorNovo - valorAntigo;
        valorTotal += diferenca;

        ajustes.push({
          produto_id: item.produto_id,
          tipo: condicao.ajuste_preco_unitario > 0 ? 'acrescimo' : 'desconto',
          valor: Math.abs(condicao.ajuste_preco_unitario),
          total_ajuste: diferenca
        });
      });
    }

    const cashback = condicao.percentual_cashback
      ? (valorTotal * condicao.percentual_cashback) / 100
      : 0;

    return {
      condicao_aplicada: true,
      condicao_id: condicao.id,
      valor_original: pedidoData.valor_total,
      valor_final: valorTotal,
      cashback: cashback,
      prazo_pagamento: condicao.prazo_pagamento_dias || 30,
      percentual_cashback: condicao.percentual_cashback,
      ajuste_unitario: condicao.ajuste_preco_unitario,
      ajustes: ajustes
    };
  }

  static async verificarCampanha(pedidoData, campanhas) {
    const { itens, valor_total } = pedidoData;
    const recompensas = [];

    for (const campanha of campanhas) {
      let atendeRequisitos = false;

      if (campanha.tipo === 'valor') {
        atendeRequisitos = valor_total >= campanha.valor_minimo;

      } else if (campanha.tipo === 'quantidade') {
        const itemCampanha = itens.find(item => item.produto_id === campanha.produto_id);
        atendeRequisitos =
          itemCampanha && itemCampanha.quantidade >= campanha.quantidade_minima;
      }

      if (atendeRequisitos) {
        recompensas.push({
          campanha_id: campanha.id,
          campanha_nome: campanha.nome,
          tipo_recompensa: campanha.tipo_recompensa,
          valor_recompensa: campanha.valor_recompensa
        });
      }
    }

    return recompensas;
  }
}

module.exports = AplicadorCondicoes;

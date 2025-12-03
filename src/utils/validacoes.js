class Validacoes {

  // =============================
  // VALIDAÇÃO DE EMAIL
  // =============================
  static validarEmail(email) {
    if (!email || email.trim() === "") {
      throw new Error("O email é obrigatório.");
    }

    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Email inválido.");
    }
  }

  // =============================
  // VALIDAÇÃO DE NOME
  // =============================
  static validarNome(nome) {
    if (!nome || nome.trim() === "") {
      throw new Error("O nome é obrigatório.");
    }

    if (nome.length < 3) {
      throw new Error("O nome deve ter pelo menos 3 caracteres.");
    }
  }

  // =============================
  // VALIDAÇÃO DE TIPO DE USUÁRIO
  // =============================
  static validarTipo(tipo) {
    const tiposPermitidos = ["admin", "loja", "fornecedor"];

    if (!tipo || tipo.trim() === "") {
      throw new Error("O tipo do usuário é obrigatório.");
    }

    if (!tiposPermitidos.includes(tipo)) {
      throw new Error("Tipo de usuário inválido.");
    }
  }

  // =============================
  // VALIDAÇÃO DE SENHA
  // =============================
  static validarSenha(senha) {
    if (!senha || senha.trim() === "") {
      throw new Error("A senha é obrigatória.");
    }

    if (senha.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres.");
    }

    if (!/[A-Z]/.test(senha)) {
      throw new Error("A senha deve ter ao menos 1 letra maiúscula.");
    }

    if (!/[a-z]/.test(senha)) {
      throw new Error("A senha deve ter ao menos 1 letra minúscula.");
    }

    if (!/[0-9]/.test(senha)) {
      throw new Error("A senha deve ter ao menos 1 número.");
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\[\]\\]/.test(senha)) {
      throw new Error("A senha deve ter ao menos 1 caractere especial.");
    }
  }

}

module.exports = Validacoes;

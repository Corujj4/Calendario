const CHAVE_EVENTOS = "eventos-trilhas";

export function carregarEventos() {
  const dadosSalvos = localStorage.getItem(CHAVE_EVENTOS);

  if (!dadosSalvos) {
    return [];
  }

  try {
    return JSON.parse(dadosSalvos);
  } catch (erro) {
    console.error("Erro ao carregar eventos:", erro);
    return [];
  }
}

export function salvarEventos(eventos) {
     console.log("Salvando eventos:", eventos);
  localStorage.setItem(
    CHAVE_EVENTOS,
    JSON.stringify(eventos),
  );
}
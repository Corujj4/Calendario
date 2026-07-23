import {
  renderExpedicoesView,
  iniciarExpedicoes
} from "../components/atividades/expedicoesView.js";

import { renderNavbar } from "../components/navbar/navbar.js";

export function renderExpedicoes() {
  return `
    ${renderNavbar()}
    ${renderExpedicoesView()}
  `;
}

export function iniciarPaginaExpedicoes() {
  iniciarExpedicoes();
}
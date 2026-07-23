import {
  renderTrilhasView,
  iniciarTrilhas
} from "../components/atividades/trilhasView.js";

import { renderNavbar } from "../components/navbar/navbar.js";

export function renderTrilhas() {
  return `
    ${renderNavbar()}
    ${renderTrilhasView()}
  `;
}

export function iniciarPaginaTrilhas() {
  iniciarTrilhas();
}
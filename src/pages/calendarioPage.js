import { renderNavbar } from "../components/navbar/navbar.js";
import { renderCalendarioView } from "../components/calendario/calendarioView.js";

export function renderCalendario() {
    return `
        ${renderNavbar()}
        ${renderCalendarioView()}
    `;
}
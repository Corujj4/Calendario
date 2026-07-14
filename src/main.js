import "./style.css";
import { criarCalendario } from "./components/calendario.js";
import { configurarEventos } from "./services/eventos.js";
import { configurarClima } from "./services/clima.js";

configurarEventos();
criarCalendario();
configurarClima();

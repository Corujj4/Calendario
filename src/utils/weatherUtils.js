const icones = {
  sol: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.42 1.42"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.42"></path>
    </svg>
  `,

  solParcial: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="8" r="3"></circle>
      <path d="M8 2v2"></path>
      <path d="M2 8h2"></path>
      <path d="m3.8 3.8 1.4 1.4"></path>
      <path d="m12.2 3.8-1.4 1.4"></path>
      <path d="M17.5 20H7a4 4 0 0 1-.4-7.98A6 6 0 0 1 18.1 11 4.5 4.5 0 0 1 17.5 20Z"></path>
    </svg>
  `,

  parcialmenteNublado: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5"></circle>
      <path d="M7 2v1.5"></path>
      <path d="M2 7h1.5"></path>
      <path d="m3.5 3.5 1 1"></path>
      <path d="M17.5 20H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.2 10.5 4.8 4.8 0 0 1 17.5 20Z"></path>
    </svg>
  `,

  nuvem: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 19H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.2 9.5 4.8 4.8 0 0 1 17.5 19Z"></path>
    </svg>
  `,

  garoa: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 15H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.2 5.5 4.8 4.8 0 0 1 17.5 15Z"></path>
      <path d="M8 19h.01"></path>
      <path d="M12 21h.01"></path>
      <path d="M16 19h.01"></path>
    </svg>
  `,

  chuva: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 15H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.2 5.5 4.8 4.8 0 0 1 17.5 15Z"></path>
      <path d="M8 18l-1 3"></path>
      <path d="M13 18l-1 3"></path>
      <path d="M18 18l-1 3"></path>
    </svg>
  `,

  temporal: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 14H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.2 4.5 4.8 4.8 0 0 1 17.5 14Z"></path>
      <path d="m13 14-3 5h3l-1 3 4-6h-3Z"></path>
    </svg>
  `,

  neblina: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h16"></path>
      <path d="M2 12h16"></path>
      <path d="M6 16h16"></path>
    </svg>
  `,

  neve: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v20"></path>
      <path d="m4.93 6 14.14 12"></path>
      <path d="m19.07 6-14.14 12"></path>
    </svg>
  `,
};

const visuaisClima = {
  "muito-sol": {
    icone: icones.sol,
    classe: "clima-muito-sol",
    descricao: "Muito sol",
  },

  sol: {
    icone: icones.sol,
    classe: "clima-sol",
    descricao: "Ensolarado",
  },

  nublado: {
    icone: icones.nuvem,
    classe: "clima-nublado",
    descricao: "Nublado",
  },

  chuva: {
    icone: icones.chuva,
    classe: "clima-chuva",
    descricao: "Chuva",
  },

  "chuva-forte": {
    icone: icones.temporal,
    classe: "clima-temporal",
    descricao: "Chuva forte ou temporal",
  },
};

export function obterVisualClima(tipoClima) {
  return visuaisClima[tipoClima] ??
    visuaisClima.nublado;
}

const visualPadrao = {
  icone: icones.nuvem,
  classe: "clima-nublado",
  descricao: "Condição desconhecida",
};


export async function buscarCoordenadas(cidade) {
  const endereco =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(cidade)}` +
    "&count=1" +
    "&language=pt" +
    "&format=json" +
    "&countryCode=BR";

  const resposta = await fetch(endereco);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao buscar localização: ${resposta.status}`,
    );
  }

  const dados = await resposta.json();

  if (!dados.results?.length) {
    throw new Error("Cidade não encontrada.");
  }

  const local = dados.results[0];

  return {
    nome: local.name,
    estado: local.admin1,
    latitude: local.latitude,
    longitude: local.longitude,
  };
}

export async function buscarPrevisao16Dias(
  latitude,
  longitude,
) {
  const variaveisDiarias = [
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max",
    "precipitation_sum",
  ].join(",");

  const variaveisHorarias = [
    "weather_code",
    "cloud_cover",
    "precipitation",
  ].join(",");

  const endereco =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=${variaveisDiarias}` +
    `&hourly=${variaveisHorarias}` +
    "&timezone=America%2FSao_Paulo" +
    "&past_days=7" +
    "&forecast_days=16";

  const resposta = await fetch(endereco);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao buscar previsão: ${resposta.status}`,
    );
  }

  const dados = await resposta.json();

  const horasPorDia = agruparHorasPorDia(dados.hourly);

  return dados.daily.time.map((data, indice) => {
    const horas = horasPorDia.get(data) ?? [];

    return {
      data,
      codigoClima: classificarClimaDoDia(horas),

      temperaturaMaxima: Math.round(
        dados.daily.temperature_2m_max[indice],
      ),

      temperaturaMinima: Math.round(
        dados.daily.temperature_2m_min[indice],
      ),

      chanceChuva:
        dados.daily.precipitation_probability_max[indice] ??
        0,

      quantidadeChuva:
        dados.daily.precipitation_sum[indice] ?? 0,
    };
  });
}
function agruparHorasPorDia(dadosHorarios) {
  const horasPorDia = new Map();

  dadosHorarios.time.forEach((dataHora, indice) => {
    const data = dataHora.slice(0, 10);

    if (!horasPorDia.has(data)) {
      horasPorDia.set(data, []);
    }

    horasPorDia.get(data).push({
      codigo: dadosHorarios.weather_code[indice],
      nuvens: dadosHorarios.cloud_cover[indice] ?? 0,
      precipitacao:
        dadosHorarios.precipitation[indice] ?? 0,
    });
  });

  return horasPorDia;
}

function classificarClimaDoDia(horas) {
  const codigosTemporal = [95, 96, 99];
  const codigosChuvaForte = [65, 67, 82];

  const codigosChuva = [
    51, 53, 55, 56, 57,
    61, 63, 66,
    80, 81,
  ];

  const temTemporal = horas.some((hora) =>
    codigosTemporal.includes(hora.codigo),
  );

  const temChuvaForte = horas.some(
    (hora) =>
      codigosChuvaForte.includes(hora.codigo) ||
      hora.precipitacao >= 10,
  );

  if (temTemporal || temChuvaForte) {
    return "chuva-forte";
  }

  const temChuva = horas.some(
    (hora) =>
      codigosChuva.includes(hora.codigo) ||
      hora.precipitacao > 0,
  );

  if (temChuva) {
    return "chuva";
  }

  const horasComSol = horas.filter(
    (hora) => hora.codigo === 0 || hora.codigo === 1,
  ).length;

  if (horasComSol >= 12) {
    return "muito-sol";
  }

  if (horasComSol >= 1) {
    return "sol";
  }

  const horasNubladas = horas.filter(
    (hora) =>
      hora.codigo === 2 ||
      hora.codigo === 3 ||
      hora.nuvens >= 80,
  ).length;

  if (horasNubladas >= 20) {
    return "nublado";
  }

  return "nublado";
}
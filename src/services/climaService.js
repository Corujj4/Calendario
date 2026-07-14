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
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max",
    "precipitation_sum",
    "wind_speed_10m_max",
  ].join(",");

  const endereco =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=${variaveisDiarias}` +
    "&timezone=America%2FSao_Paulo" +
    "&forecast_days=16" +
    "&past_days=7";

  const resposta = await fetch(endereco);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao buscar previsão: ${resposta.status}`,
    );
  }

  const dados = await resposta.json();

  return dados.daily.time.map((data, indice) => ({
    data,
    codigoClima: dados.daily.weather_code[indice],
    temperaturaMaxima:
      Math.round(dados.daily.temperature_2m_max[indice]),
    temperaturaMinima:
      Math.round(dados.daily.temperature_2m_min[indice]),
    chanceChuva:
      dados.daily.precipitation_probability_max[indice] ?? 0,
    quantidadeChuva:
      dados.daily.precipitation_sum[indice] ?? 0,
    ventoMaximo:
      Math.round(dados.daily.wind_speed_10m_max[indice]),
  }));
}
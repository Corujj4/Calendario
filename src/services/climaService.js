import { buscarPrevisaoOpenWeather } from "./openWeatherService.js";

import { buscarPrevisao16Dias } from "./openMeteoService.js";

export async function buscarPrevisaoCombinada(
  latitude,
  longitude,
) {
  const [previsaoOpenMeteo, previsaoOpenWeather] =
    await Promise.all([
      buscarPrevisao16Dias(latitude, longitude),
      buscarPrevisaoOpenWeather(latitude, longitude),
    ]);

  const openMeteoPorData = new Map(
    previsaoOpenMeteo.map((previsao) => [
      previsao.data,
      previsao,
    ]),
  );

  const openWeatherPorData = new Map(
    previsaoOpenWeather
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(0, 5)
      .map((previsao) => [
        previsao.data,
        previsao,
      ]),
  );

  return previsaoOpenMeteo.map((previsaoMeteo) => {
    const previsaoWeather =
      openWeatherPorData.get(previsaoMeteo.data);

    if (!previsaoWeather) {
      return {
        ...previsaoMeteo,
        fonte: "Open-Meteo",
      };
    }

    const horasOpenMeteo =
      openMeteoPorData.get(previsaoWeather.data)?.horas ?? [];

    return {
      ...previsaoMeteo,
      ...previsaoWeather,

      horas: horasOpenMeteo,

      fonte: "OpenWeather",
    };
  });
}
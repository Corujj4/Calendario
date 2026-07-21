import { buscarPrevisaoOpenWeather } from "./openWeatherService.js";
import { buscarPrevisao16Dias } from "./openMeteoService.js";

export async function buscarPrevisaoCombinada(latitude, longitude) {
  const previsaoOpenMeteo = await buscarPrevisao16Dias(latitude, longitude);

  let previsaoOpenWeather = [];

  try {
    previsaoOpenWeather = await buscarPrevisaoOpenWeather(latitude, longitude);
  } catch (erro) {
    console.warn(
      "OpenWeather indisponível. Utilizando somente Open-Meteo.",
      erro,
    );
  }

  const openWeatherPorData = new Map(
    previsaoOpenWeather
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(0, 5)
      .map((previsao) => [previsao.data, previsao]),
  );

  return previsaoOpenMeteo.map((previsaoMeteo) => {
    const previsaoWeather = openWeatherPorData.get(previsaoMeteo.data);

    if (!previsaoWeather) {
      return {
        ...previsaoMeteo,
        fonte: "Open-Meteo",
      };
    }

    return {
      ...previsaoMeteo,
      ...previsaoWeather,
      codigoClima: previsaoMeteo.codigoClima,
      chanceChuva: previsaoMeteo.chanceChuva,
      quantidadeChuva: previsaoMeteo.quantidadeChuva,
      horas: previsaoMeteo.horas ?? [],
      fonte: "OpenWeather + Open-Meteo",
    };
  });
}

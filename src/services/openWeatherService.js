const CHAVE_API =
  import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();

export async function buscarPrevisaoOpenWeather(
  latitude,
  longitude,
) {
  if (!CHAVE_API) {
    throw new Error("Chave da OpenWeather não encontrada.");
  }

  const endereco =
    "https://api.openweathermap.org/data/2.5/forecast" +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&appid=${CHAVE_API}` +
    "&units=metric" +
    "&lang=pt_br";

  const resposta = await fetch(endereco);

  if (!resposta.ok) {
    throw new Error(
      `Erro na OpenWeather: ${resposta.status}`,
    );
  }

  const dados = await resposta.json();

  return resumirOpenWeatherPorDia(
    dados.list,
    dados.city.timezone,
  );
}

function resumirOpenWeatherPorDia(
  previsoes,
  fusoHorario,
) {
  const previsoesPorDia = new Map();

  previsoes.forEach((previsao) => {
    const dataLocal = new Date(
      (previsao.dt + fusoHorario) * 1000,
    );

    const data = dataLocal.toISOString().slice(0, 10);

    if (!previsoesPorDia.has(data)) {
      previsoesPorDia.set(data, []);
    }

    previsoesPorDia.get(data).push(previsao);
  });

  return Array.from(previsoesPorDia.entries()).map(
    ([data, horas]) => {
      const temperaturas = horas.map(
        (hora) => hora.main.temp,
      );

      const chancesChuva = horas.map(
        (hora) => (hora.pop ?? 0) * 100,
      );

      return {
        data,

        temperaturaMinima: Math.round(
          Math.min(...temperaturas),
        ),

        temperaturaMaxima: Math.round(
          Math.max(...temperaturas),
        ),

        chanceChuva: Math.round(
          Math.max(...chancesChuva),
        ),

        quantidadeChuva: horas.reduce(
          (total, hora) =>
            total + (hora.rain?.["3h"] ?? 0),
          0,
        ),

        codigoClima: classificarDiaOpenWeather(horas),

        fonte: "OpenWeather",
      };
    },
  );
}

function classificarDiaOpenWeather(horas) {
  const temTemporal = horas.some(
    (hora) =>
      hora.weather[0].id >= 200 &&
      hora.weather[0].id < 300,
  );

  const temChuvaForte = horas.some(
    (hora) =>
      (hora.rain?.["3h"] ?? 0) >= 10 ||
      [502, 503, 504, 522].includes(
        hora.weather[0].id,
      ),
  );

  if (temTemporal || temChuvaForte) {
    return "chuva-forte";
  }

  const temChuva = horas.some(
    (hora) =>
      hora.weather[0].main === "Rain" ||
      hora.weather[0].main === "Drizzle" ||
      (hora.rain?.["3h"] ?? 0) > 0,
  );

  if (temChuva) {
    return "chuva";
  }

  const periodosComMuitoSol = horas.filter(
    (hora) =>
      hora.sys.pod === "d" &&
      hora.clouds.all <= 20,
  ).length;

  if (periodosComMuitoSol >= 3) {
    return "muito-sol";
  }

  const temSol = horas.some(
    (hora) =>
      hora.sys.pod === "d" &&
      hora.clouds.all <= 45,
  );

  if (temSol) {
    return "sol";
  }

  return "nublado";
}
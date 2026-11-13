export interface BeachWeather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  label: string;
}

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

const PRAIA_GRANDE_LAT = -24.0058;
const PRAIA_GRANDE_LON = -46.4028;

function describeWeatherCode(code: number): string {
  if (code === 0) return 'Céu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 48) return 'Neblina';
  if (code <= 67) return 'Chuva';
  if (code <= 77) return 'Frio intenso';
  if (code <= 82) return 'Pancadas de chuva';
  return 'Tempestade';
}

export async function fetchPraiaGrandeWeather(): Promise<BeachWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${PRAIA_GRANDE_LAT}&longitude=${PRAIA_GRANDE_LON}&current_weather=true&timezone=America%2FSao_Paulo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao consultar clima.');
  const data = await res.json();
  const current = data.current_weather || {};
  const code = Number(current.weathercode || 0);
  return {
    temperature: Math.round(Number(current.temperature || 0)),
    windSpeed: Math.round(Number(current.windspeed || 0)),
    weatherCode: code,
    label: describeWeatherCode(code),
  };
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) throw new Error('CEP deve ter 8 dígitos.');
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) throw new Error('Falha ao consultar CEP.');
  const data = await res.json();
  if (data.erro) throw new Error('CEP não encontrado.');
  return {
    street: data.logradouro || '',
    neighborhood: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
  };
}

CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Outros')),
  location TEXT NOT NULL,
  agency_address TEXT NOT NULL DEFAULT 'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
  beach_distance INTEGER NOT NULL DEFAULT 0,
  area NUMERIC NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  condominium NUMERIC DEFAULT 0,
  iptu NUMERIC DEFAULT 0,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  notes TEXT[] DEFAULT '{}',
  owner_contact TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Vendido', 'Reservado')),
  image_url TEXT NOT NULL,
  original_image_url TEXT,
  ai_enhanced_mode TEXT,
  ai_enhanced_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura e escrita em app_users" ON public.app_users;
CREATE POLICY "Permitir leitura e escrita em app_users"
  ON public.app_users FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita em properties" ON public.properties;
CREATE POLICY "Permitir leitura e escrita em properties"
  ON public.properties FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO public.app_users (name, email, password, role)
VALUES
  ('Taís Leal (Administradora)', 'admin@corretoras.com', '123', 'admin'),
  ('Cliente', 'cliente@email.com', '123', 'client')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.properties (
  id, code, name, type, location, agency_address, beach_distance,
  area, price, condominium, iptu, bedrooms, bathrooms, parking_spaces,
  owner_contact, notes, is_favorite, status, image_url
)
VALUES
  (
    '1',
    'CSI-101',
    'Residencial Alto Padrão Canto do Forte',
    'Apartamento',
    'Canto do Forte, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    0,
    280,
    2800000,
    1000,
    200,
    4,
    5,
    3,
    '(13) 99009-5719',
    ARRAY[
      'Proprietário: (13) 99009-5719 (Sr. Roberto - não divulgar contato ao cliente)',
      'Chaves na recepção da imobiliária (cód. claviculário #14)',
      'Aceita proposta à vista até R$ 2.650.000',
      'Com elevador privativo e sacada gourmet frente mar'
    ],
    true,
    'Disponível',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  ),
  (
    '2',
    'CSI-102',
    'Apartamento Vista Mar Guilhermina',
    'Apartamento',
    'Guilhermina, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    50,
    145,
    950000,
    850,
    180,
    3,
    3,
    2,
    '(13) 98877-1234',
    ARRAY[
      'Proprietária: Dona Helena (13) 98877-1234',
      'Imóvel ocupado, agendar visita com 24h de antecedência',
      'Aceita financiamento bancário e permuta por menor valor',
      'Varanda envidraçada e piscina aquecida no lazer'
    ],
    false,
    'Disponível',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  ),
  (
    '3',
    'CSI-103',
    'Cobertura Duplex Vila Tupi',
    'Cobertura',
    'Vila Tupi, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    120,
    320,
    1850000,
    1400,
    350,
    4,
    4,
    3,
    '(11) 97123-9988',
    ARRAY[
      'Proprietário: Marcos (11) 97123-9988 (mora em SP)',
      'Comissão de 6% autorizada em contrato de exclusividade',
      'Piscina privativa na cobertura e churrasqueira a carvão'
    ],
    true,
    'Disponível',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  ),
  (
    '4',
    'CSI-104',
    'Casa Térrea em Condomínio Fechado',
    'Casa',
    'Boqueirão, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    350,
    260,
    1400000,
    600,
    220,
    3,
    3,
    4,
    '(13) 99123-4567',
    ARRAY[
      'Proprietário: (13) 99123-4567',
      'Proposta em análise jurídica — manter como Reservado',
      'Pé direito duplo na sala e sistema de energia solar'
    ],
    false,
    'Reservado',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
  ),
  (
    '5',
    'CSI-105',
    'Apartamento Compacto Perto da Praia',
    'Apartamento',
    'Aviação, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    180,
    72,
    520000,
    490,
    130,
    2,
    2,
    1,
    '(13) 99765-4321',
    ARRAY[
      'Proprietário: (13) 99765-4321',
      'Documentação 100% regularizada para financiamento Caixa',
      'Imóvel vazio, chaves na imobiliária'
    ],
    false,
    'Disponível',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  ),
  (
    '6',
    'CSI-106',
    'Sobrado Moderno com Piscina',
    'Casa',
    'Ocian, Praia Grande (Bairro)',
    'Av. Pres. Kennedy, 1500 - Canto do Forte, Praia Grande/SP',
    450,
    210,
    890000,
    0,
    150,
    3,
    2,
    2,
    '(13) 98112-9900',
    ARRAY[
      'Proprietário: (13) 98112-9900',
      'Estuda carro como parte de pagamento',
      'Acabamento em porcelanato e cozinha com ilha'
    ],
    false,
    'Disponível',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
  )
ON CONFLICT (id) DO NOTHING;

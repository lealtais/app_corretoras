# Corretoras de Sucesso - Aplicativo Mobile

Aplicativo móvel desenvolvido em **React Native com Expo e TypeScript**, projetado para corretores de imóveis e imobiliárias gerenciarem suas carteiras de propriedades de forma ágil, intuitiva e moderna diretamente no celular.

---

## 🎯 Sobre o Projeto

O **Corretoras de Sucesso** nasceu para suprir a necessidade de corretores no atendimento presencial de campo, onde a agilidade na consulta de dados, valores, regras condominiais e anotações confidenciais de proprietários faz a diferença no fechamento de negócios.

O aplicativo centraliza a gestão imobiliária em uma experiência móvel fluida, com foco em usabilidade, performance e fidelidade visual.

---

## ✨ Principais Funcionalidades

- **Catálogo de Imóveis Interativo:** Listagem dinâmica com fotos, preços formatados em Real (R$), localização, metragens e tipologias (Apartamentos, Casas, Coberturas, Terrenos e Comerciais).
- **Busca & Filtros Avançados:** Pesquisa textual em tempo real e filtros multicritério combinados por faixas de preço, metragem, taxa de condomínio, IPTU e comodidades.
- **Sistema de Favoritos:** Marcação rápida de imóveis com alternância em um toque e aba dedicada para consulta imediata das opções preferidas do cliente.
- **Formulário de Cadastro & Edição:**
  - Sliders interativos (`@react-native-community/slider`) para ajuste dinâmico de quartos, banheiros e vagas de garagem.
  - Seleção de fotos diretamente da galeria do dispositivo via `expo-image-picker` com gerenciamento de permissões nativas.
- **Dashboard Analítico:**
  - Gráfico de pizza vetorial (`PieChart`) em SVG nativo apresentando a distribuição da carteira por categoria.
  - Gráfico de linhas duplas de vendas (`SalesLineChart`) com metas e desempenho mensal através do `react-native-gifted-charts`.
- **Abertura Fluida (Splash Screen):**
  - Animação de entrada e transições orquestradas com a biblioteca de física e movimento **`motion`** (motion.dev).

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [React Native](https://reactnative.dev/) (v0.86) & [Expo](https://expo.dev/) (SDK 57)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Typing)
- **Motor de Animação:** [`motion`](https://motion.dev/) (Motion.dev)
- **Gráficos & Visualização:** [`react-native-gifted-charts`](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) & [`react-native-svg`](https://github.com/software-mansion/react-native-svg)
- **Componentes Interativos:** [`@react-native-community/slider`](https://github.com/callstack/react-native-slider)
- **Mídia & Hardware:** [`expo-image-picker`](https://docs.expo.dev/versions/latest/sdk/image-picker/)
- **Ícones & Estilo:** [`@expo/vector-icons`](https://icons.expo.fyi/) & Safe Area Context

---

## 🏗️ Arquitetura de Software

O projeto é estruturado com foco em desacoplamento, testabilidade e manutenibilidade:

1. **Princípio da Responsabilidade Única (SRP):**
   A camada de regras de negócio é dividida em hooks especializados por domínio:
   - `useProperties`: Gestão da coleção de imóveis e operações de CRUD.
   - `useFavorites`: Controle de marcação e listagem de favoritos.
   - `usePropertyFilters`: Mecanismo de busca e filtragem multicritério em memória otimizado com `useMemo`.
   - `usePropertyStatistics`: Agregação analítica e geração de métricas para a dashboard.

2. **Design System & Componentização:**
   - Primitivas reutilizáveis na pasta `src/components/ui/` (botões com variantes, inputs com tratamento visual, badges de seleção, cards de métricas e grades de comodidades).
   - Telas e modais desacoplados na pasta `src/screens/`.
   - Tokens visuais centralizados no arquivo `src/constants/theme.ts`.

---

## 📂 Estrutura de Pastas

```text
app_corretoras/
├── App.tsx                     # Ponto de entrada e orquestração de telas
├── package.json                # Dependências e scripts do projeto
├── src/
│   ├── components/             # Componentes visuais e gráficos
│   │   ├── ui/                 # Primitivas reutilizáveis do Design System
│   │   ├── BottomNav.tsx       # Navegação inferior
│   │   ├── Header.tsx          # Topbar institucional
│   │   ├── PieChart.tsx        # Gráfico vetorial de pizza em SVG
│   │   ├── PropertyCard.tsx    # Card do imóvel
│   │   └── SalesLineChart.tsx  # Gráfico de linhas de vendas
│   ├── constants/
│   │   └── theme.ts            # Cores, tipografia e raios de borda
│   ├── data/
│   │   └── initialProperties.ts# Base de dados inicial (mock)
│   ├── hooks/                  # Regras de negócio por responsabilidade única
│   │   ├── index.ts            # Ponto de exportação
│   │   ├── useFavorites.ts     # Lógica de favoritos
│   │   ├── useProperties.ts    # CRUD de imóveis
│   │   ├── usePropertyFilters.ts # Busca e filtros
│   │   └── usePropertyStatistics.ts # Métricas analíticas
│   ├── screens/                # Telas e modais do aplicativo
│   │   ├── AdvancedSearchModal.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── PropertyDetailModal.tsx
│   │   ├── PropertyFormModal.tsx
│   │   ├── SplashScreen.tsx
│   │   └── StatisticsScreen.tsx
│   └── types/
│       └── property.ts         # Contratos e tipos TypeScript
```

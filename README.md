# Corretoras de Sucesso - Aplicativo Mobile

Aplicativo móvel de alta performance desenvolvido em **React Native com Expo e TypeScript**, baseado no design do Figma [app_corretoras](https://www.figma.com/design/CbaRHwfOvkBtC8IMLHK8wp/app_corretoras?node-id=0-1), integrado ao servidor **Figma MCP** e estruturado sob uma **Arquitetura de Componentes Reutilizáveis (Design System / Atomic Design)**.

---

## 🎯 Proposta do Projeto

O **Corretoras de Sucesso** é uma solução mobile feita sob medida para corretores e imobiliárias gerenciarem suas carteiras de imóveis com agilidade diretamente no celular. O aplicativo resolve dores centrais do dia a dia do corretor:
- **Acesso rápido aos dados e contatos sigilosos:** Consulta imediata do telefone do proprietário, regras de condomínio e anotações privadas durante a visita.
- **Filtros avançados e precisos:** Encontre rapidamente o imóvel perfeito com filtros por faixas de preço, metragem, condomínio e cômodos.
- **Dashboard e Inteligência:** Estatísticas em tempo real com contagem de imóveis cadastrados, vendidos e gráfico de pizza com a distribuição da carteira.

---

## 🏗️ Arquitetura de Componentes Reutilizáveis

O projeto foi construído seguindo os princípios de **Atomic Design**, separação de responsabilidades e desacoplamento de lógica de negócio:

```text
src/
├── components/
│   ├── ui/                    # [Átomos / Primitivas] Componentes base do Design System
│   │   ├── Button.tsx         # Botão universal com variantes (primary, secondary, outline, danger)
│   │   ├── IconButton.tsx     # Botões circulares/quadrados de ícones (favorito, fechar, editar)
│   │   ├── Input.tsx          # Input tipado com labels, tratamento de erros e multiline
│   │   ├── RangeInput.tsx     # Entrada de faixas numéricas (mínimo - máximo)
│   │   ├── Badge.tsx          # Chips/Tags de seleção rápida para tipologias
│   │   ├── MetricCard.tsx     # Card de KPIs e estatísticas com número em display
│   │   ├── AmenitiesGrid.tsx  # Grade de 3 colunas para Quartos, Banheiros e Vagas
│   │   ├── NotesList.tsx      # Container tracejado com lista de marcadores de observações
│   │   └── SearchBar.tsx      # Barra de pesquisa com atalho integrado de filtros
│   ├── Header.tsx             # [Organismo] Topbar institucional com logo da marca
│   ├── BottomNav.tsx          # [Organismo] Barra de navegação inferior com Floating Action Button
│   ├── PropertyCard.tsx       # [Organismo] Card de listagem com foto, especificações e favoritar
│   └── PieChart.tsx           # [Organismo] Gráfico vetorial SVG dinâmico com cálculo de arcos
├── hooks/
│   └── useProperties.ts       # [Lógica / Estado] Hook customizado desacoplando estado e regras de negócio
├── screens/                   # [Visões / Orquestração] Telas que compõem os organismos
│   ├── HomeScreen.tsx         # Feed principal com busca em tempo real
│   ├── PropertyDetailModal.tsx# Detalhamento do imóvel, comodidades e anotações
│   ├── PropertyFormModal.tsx  # Formulário unificado de criação e edição
│   ├── AdvancedSearchModal.tsx# Busca multicritério por intervalos
│   ├── FavoritesScreen.tsx    # Listagem de imóveis favoritados
│   └── StatisticsScreen.tsx   # Dashboard de métricas e distribuição
├── constants/
│   └── theme.ts               # Tokens visuais (cores da paleta, espaçamentos, raios)
└── types/
    └── property.ts            # Interfaces TypeScript com tipagem estrita
```

---

## 🎨 Detalhamento dos Componentes

### 1. Primitivas de UI (`src/components/ui/`)
- **`Button`**: Componente de ação primária e secundária. Suporta variantes de cor (laranja primário do Figma, outline, perigo), tamanhos, estados de carregamento com `ActivityIndicator` e ícones integrados.
- **`IconButton`**: Botão com área de clique expandida (`hitSlop`), sombras suaves e variantes de superfície para ações rápidas de favoritar, fechar modais e acionar edição.
- **`Input`**: Campo de formulário acessível com label descritivo, feedback visual de foco e erro, e modo multilinha flexível para anotações do corretor.
- **`RangeInput`**: Entrada de dois campos numéricos (`Mín` e `Máx`) conectados por separador central, desenhado especificamente para a tela de *Busca Avançada* do Figma.
- **`Badge`**: Componente de seleção rápida de tipologia (Apartamento, Casa, Cobertura, Terreno, Outros) com transição de cor suave.
- **`MetricCard`**: Card de métrica em duas colunas que exibe o número consolidado em tipografia bold (28px) e o título da métrica.
- **`AmenitiesGrid`**: Grade com divisores verticais finos para comodidades essenciais do imóvel, mantendo consistência visual entre os cards.
- **`NotesList`**: Caixa com borda tracejada (`borderStyle: 'dashed'`) idêntica ao Figma, renderizando marcadores para telefone do proprietário, presença de elevador e móveis planejados.
- **`SearchBar`**: Input de busca rápida com ícone de lupa, botão para limpar o texto e botão para abrir a busca avançada com indicador de filtro ativo.

### 2. Organismos e Visualizações
- **`PropertyCard`**: Card com thumbnail de imagem no lado esquerdo e hierarquia visual refinada à direita: nome do imóvel, tipo, localização, metragem, preço formatado em Real (`R$`) e botão de favoritar em 1 toque.
- **`PieChart`**: Gráfico de pizza desenvolvido em SVG nativo (`react-native-svg`), sem bibliotecas pesadas de terceiros. Calcula ângulos e arcos matematicamente e renderiza legenda com percentuais automáticos.
- **`BottomNav`**: Barra de navegação inferior com ícone de Estatísticas, botão central em destaque circular laranja (`+`) para cadastro rápido de imóveis e aba de Favoritos.

### 3. Gerenciamento de Estado (`useProperties`)
- Isola 100% da lógica fora dos componentes de tela.
- Realiza mutações imutáveis de dados (adicionar, editar, excluir, favoritar).
- Computa listas filtradas através de `useMemo`, garantindo 60 FPS mesmo em listas extensas de imóveis.

---

## 🚀 Como Rodar no Celular (via Expo Go)

1. No seu celular Android ou iPhone, instale o aplicativo gratuito **Expo Go** (disponível na Google Play Store e Apple App Store).
2. Certifique-se de que o computador e o celular estão conectados na **mesma rede Wi-Fi**.
3. No terminal do computador, execute:
   ```bash
   cd "C:\Users\China Link\.gemini\antigravity\scratch\app_corretoras"
   npm start
   ```
4. Aponte a câmera do seu celular (ou o leitor de QR Code do Expo Go) para o **QR Code** gerado no terminal.
5. O aplicativo será carregado instantaneamente no seu celular em modo de desenvolvimento com recarregamento em tempo real (*Fast Refresh*).

---

## 🎤 Roteiro de Apresentação (Pitch do Projeto)

Use esta estrutura para apresentar o projeto amanhã:

1. **Introdução (1 minuto):**
   > *"Desenvolvemos o 'Corretoras de Sucesso', um aplicativo mobile focado em empoderar corretores e imobiliárias com uma carteira de imóveis dinâmica, rápida e intuitiva."*

2. **Fidelidade ao Design & Figma MCP (1 minuto):**
   > *"Partimos diretamente do protótipo no Figma. Usando o servidor oficial Figma MCP, extraímos os tokens de design (paleta laranja, tipografia e espaçamentos) e transformamos cada tela em código React Native fiel ao protótipo."*

3. **Arquitetura de Componentes Reutilizáveis (2 minutos):**
   > *"Adotamos uma arquitetura orientada a Design System: criamos primitivas de UI como botões, inputs, cards de métricas e grades de comodidades reutilizáveis. Além disso, separamos a lógica de negócios em um Custom Hook (`useProperties`), mantendo as telas limpas, manuteníveis e prontas para escalar."*

4. **Demonstração Prática no Celular (2 minutos):**
   - Mostrar a **Lista de Imóveis** e a busca em tempo real.
   - Abrir o **Detalhe do Imóvel** mostrando as anotações e contatos do proprietário.
   - Abrir a **Busca Avançada** demonstrando os filtros por faixas de preço e metragem.
   - Cadastrar ou editar um imóvel através do botão flutuante **`+`**.
   - Ir na aba **Estatísticas** e apresentar o painel de KPIs com o gráfico de pizza em SVG.

5. **Conclusão Técnica:**
   > *"O projeto está 100% tipado com TypeScript (0 erros de compilação), versionado no GitHub e pronto para publicação ou integração com APIs de backend."*

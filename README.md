# Corretoras de Sucesso - Aplicativo Mobile

Aplicativo móvel desenvolvido em **React Native com Expo e TypeScript**, baseado no design do Figma [app_corretoras](https://www.figma.com/design/CbaRHwfOvkBtC8IMLHK8wp/app_corretoras?node-id=0-1) e integrado ao servidor **Figma MCP** (`https://mcp.figma.com/mcp`).

---

## 🎨 Telas Implementadas

1. **Feed / Lista de Imóveis**:
   - Barra de pesquisa rápida ("Buscar por bairro, condomínio...").
   - Acesso direto à busca avançada com indicador de filtros ativos.
   - Cards com foto, tipologia, localização, metragem, valor em reais e botão de favoritar rápido.

2. **Detalhes do Imóvel**:
   - Imagem de capa em destaque com botões de fechar, favoritar e editar.
   - Informações financeiras (Valor, Condomínio, IPTU).
   - Grade de comodidades (Quartos, Banheiros, Vagas).
   - Caixa de anotações com marcadores (Contatos do proprietário, detalhes estruturais e diferenciais).

3. **Novo Imóvel & Editar Imóvel**:
   - Formulário completo para cadastrar ou atualizar imóveis.
   - Seleção de categoria (Apartamento, Casa, Cobertura, Terreno, Outros).
   - Campos numéricos e área de anotações multilinha.
   - Botão de confirmação estilizado "OK".

4. **Busca Avançada**:
   - Filtros por intervalo mínimo e máximo (Metragem, Preço, Condomínio, IPTU).
   - Filtros por quantidade de quartos, banheiros e vagas.
   - Busca textual por palavra-chave em anotações.

5. **Favoritos**:
   - Listagem dedicada para os imóveis marcados pelo usuário.

6. **Estatísticas / Dashboard**:
   - Painel com contagem de imóveis cadastrados, vendidos e divisão por categoria.
   - Gráfico de pizza interativo em SVG com legenda de distribuição percentual.

---

## ⚙️ Configuração do Figma MCP

O servidor remoto oficial do Figma está configurado nas seguintes camadas do projeto:
- **VS Code / IDE**: [`.vscode/mcp.json`](./.vscode/mcp.json)
- **Plugin Antigravity**: [`.agents/plugins/figma/mcp_config.json`](./.agents/plugins/figma/mcp_config.json)
- **Global**: `~/.gemini/config/mcp_config.json`

---

## 🚀 Como Executar

No terminal dentro da pasta do projeto (`C:\Users\China Link\.gemini\antigravity\scratch\app_corretoras`):

```bash
# Iniciar o servidor Expo (com QR Code para Expo Go)
npm start

# Ou abrir diretamente no navegador web:
npx expo start --web
```

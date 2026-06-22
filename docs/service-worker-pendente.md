# Service worker pendente

O MVP mantém apenas `manifest.webmanifest`, sem service worker customizado.

Implementação posterior recomendada:

- Registrar `public/sw.js` no layout público somente em produção.
- Cachear shell estático: ícone, manifest, CSS/JS gerados e página offline.
- Não cachear respostas de admin, uploads de PDF, server actions ou consultas de ranking com dados sensíveis.
- Usar estratégia network-first para páginas públicas dinâmicas (`/`, `/ranking`, `/calendario`, `/pilotos`, `/temporadas/*`) com fallback offline legível.
- Versionar o cache por release e limpar caches antigos no evento `activate`.
- Testar instalação PWA, navegação offline e atualização de nova versão em desktop e mobile.

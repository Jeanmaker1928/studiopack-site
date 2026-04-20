# StudioPack Site

Site da Studio Pack - Packs de Estampas Halftone.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como fazer o build para produção

```bash
npm run build
```

Os arquivos ficam na pasta `dist/`.

## Deploy na Vercel (RECOMENDADO - Grátis)

1. Crie uma conta em https://vercel.com (pode logar com GitHub)
2. Suba este projeto no GitHub
3. Na Vercel, clique "New Project" → Importe o repositório
4. A Vercel detecta automaticamente que é Vite/React
5. Clique "Deploy" - pronto!
6. Para conectar seu domínio: Settings → Domains → Adicione studiopack.site

## Deploy na Netlify (Alternativa - Grátis)

1. Crie uma conta em https://netlify.com
2. Arraste a pasta `dist/` (após o build) para o dashboard
3. Ou conecte via GitHub para deploy automático
4. Para conectar domínio: Domain Settings → Add custom domain

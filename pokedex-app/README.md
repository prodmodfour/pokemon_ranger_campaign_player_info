# PTU Pokedex

A Nuxt 3 static site for browsing the Pokemon Tabletop United Pokedex with interactive, clickable definitions.

## Features

- **877 Pokemon** with full stats, abilities, moves, and breeding info
- **Clickable definitions** - click any move, ability, type, or capability to see details
- **Full search** - search by name, type, ability, or move
- **Filters** - filter by type, habitat, and size
- **Responsive design** - works on mobile and desktop

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run generate
```

## Re-parse Pokedex Data

If you update the markdown files, re-run the parser:

```bash
npm run parse
```

## Deploy to GitHub Pages

1. Build the static site:
   ```bash
   npm run generate
   ```

2. The output is in `.output/public/`

3. Deploy to GitHub Pages:
   - Push `.output/public/` to a `gh-pages` branch, or
   - Configure GitHub Actions to build and deploy

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        working-directory: ./pokemon_ranger_campaign_player_info/pokedex-app
        run: npm ci

      - name: Generate static site
        working-directory: ./pokemon_ranger_campaign_player_info/pokedex-app
        run: npm run generate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./pokemon_ranger_campaign_player_info/pokedex-app/.output/public
```

## Configuration

Edit `nuxt.config.ts` to change the base URL for your GitHub repo:

```ts
app: {
  baseURL: '/your-repo-name/',
}
```

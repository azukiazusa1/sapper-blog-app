# Content Processing Pipeline

## Markdown Processing
The blog uses a unified markdown processing pipeline in `markdownToHtml.ts` with custom plugins:

### Custom Remark Plugins (packages/)
- `remark-link-card` - Generates preview cards for external links
- `remark-video` - Embeds video content 
- `remark-contentful-image` - Processes Contentful image assets

### Custom Rehype Plugins
- `rehype-alert` - Renders custom alert/callout blocks
- Standard plugins: GFM, syntax highlighting, TOC generation, auto-linking

## Content Sources
- **Contentful CMS**: Primary content source via GraphQL API
- **Local Markdown**: Files in `contents/` directory
- **Generated Content**: RSS feeds, sitemaps, OGP images

## Environment Configuration
- **Production**: `CF_ENV=production` - Uses real Contentful API
- **Development**: `NODE_MOCK=true` - Uses mock data for faster development
- **Preview**: Contentful preview API for draft content

## Content Types
- **Blog Posts**: Full articles with metadata, tags, thumbnails
- **Shorts**: Brief posts/microblog content
- **Tags**: Taxonomies for organizing content
- **Assets**: Images and media files from Contentful
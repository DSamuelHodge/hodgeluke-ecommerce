# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-02-02

### Fixed

#### Resolved `useServerFunctions` Error with SlugField

- **Issue**: `slugField()` helper in Payload CMS 3.74.0 was causing a runtime error: `useServerFunctions must be used within a ServerFunctionsProvider`
- **Root Cause**: The `slugField()` helper generates a `SlugField` component that requires the `ServerFunctionsProvider` context, which wasn't properly wrapped in this version (known bug)
- **Solution**: Replaced all `slugField()` usages with manual slug field configurations
  - Implemented custom `beforeValidate` hooks to auto-generate slugs from title fields
  - Removed dependency on buggy `SlugField` component
  - Applied fix to:
    - `src/collections/Categories.ts`
    - `src/collections/Products/index.ts`
    - `src/collections/Pages/index.ts`
- **Result**: Admin panel now loads without errors, slug generation works identically

### Added

#### Cloudflare R2 Storage Integration

- **Storage Provider**: Configured Cloudflare R2 for media asset storage
  - Bucket: `hodgeluke-media`
  - Region: Eastern North America (ENAM)
  - Endpoint: `https://6c2dbbe47de58a74542ad9a5d9dd5b2b.r2.cloudflarestorage.com`
- **Benefits**:
  - Zero egress fees (no bandwidth charges)
  - Fast global CDN distribution
  - S3-compatible API
  - Automatic backups
- **Configuration**:
  - Added `@payloadcms/storage-s3` package
  - Configured S3 storage plugin with R2-specific settings (`forcePathStyle: true`)
  - Updated Media collection to use cloud storage instead of local files
- **Environment Variables**:
  - `S3_BUCKET`: hodgeluke-media
  - `S3_ACCESS_KEY_ID`: R2 access key
  - `S3_SECRET_ACCESS_KEY`: R2 secret key
  - `S3_REGION`: auto
  - `S3_ENDPOINT`: R2 storage endpoint

#### Database Configuration

- **Database Provider**: Neon Postgres (via Vercel)
  - Adapter: `@payloadcms/db-vercel-postgres`
  - Connection: Pooled connection via pgbouncer for optimal performance
  - SSL Mode: Required for secure connections
- **Database URL**: `postgresql://neondb_owner:***@ep-nameless-hat-ahfwkx1n-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Features**:
  - Serverless PostgreSQL with automatic scaling
  - Branch-based development support
  - Connection pooling via pgbouncer
  - SSL/TLS encryption

### Configuration Updates

#### Updated Payload Config (`src/payload.config.ts`)

- Added `importMap` configuration with `baseDir` for proper component resolution
- Configured with `vercelPostgresAdapter` for Neon database

#### Updated Plugin Configuration (`src/plugins/index.ts`)

- Added S3 storage plugin with Cloudflare R2 configuration
- Configured media collection with `prefix: 'media'` for organized bucket structure

#### Environment Variables

- Reorganized storage credentials to use Cloudflare R2
- Added `S3_ENDPOINT` for R2-specific endpoint
- Maintained database connection strings for Neon Postgres

### Changed

#### Media Collection (`src/collections/Media.ts`)

- Changed from local file storage (`staticDir`) to cloud storage (`upload: true`)
- Removed local path dependencies
- Now fully managed by S3 storage plugin

#### Import Map

- Regenerated to remove `SlugField` component references
- Now only includes necessary Lexical editor and plugin components

### Technical Details

#### Database Migration

- Safely removed `generate_slug` columns from:
  - `pages` table (2 items)
  - `categories` table (3 items)
  - `products` table (3 items)
  - `_pages_v` version table (2 items)
  - `_products_v` version table (3 items)
- Note: These were boolean flags for auto-generation; actual slug data was preserved

#### Infrastructure Stack

- **Frontend**: Next.js 15.4.11
- **CMS**: Payload CMS 3.74.0
- **Database**: Neon Postgres (Vercel integration)
- **Storage**: Cloudflare R2
- **Payments**: Stripe
- **Email**: Resend

---

## Notes

- All database operations verified and working correctly
- Media upload/download functionality tested with R2
- Zero breaking changes for existing data
- Improved reliability by removing dependency on buggy `slugField()` helper

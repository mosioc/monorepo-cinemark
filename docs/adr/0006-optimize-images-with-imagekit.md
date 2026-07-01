# ADR-0006: Offload Media Optimization to ImageKit CDN

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  

## Context

Cinemark is a highly visual application. Movie posters must be served in multiple sizes, optimized for modern formats (WebP/AVIF), and delivered with low latency globally.

## Decision

We will use **ImageKit** as our media CDN and transformation engine, integrating it via the `imagekitio-react` SDK and Next.js `Image` component fallbacks.

## Alternatives Considered

- **Next.js Built-in Image Optimization:** Rejected. While convenient, it consumes Vercel's bandwidth and optimization limits. It also lacks advanced transformation features (like dynamic watermarking or complex cropping) without custom code.
- **AWS S3 + CloudFront + Lambda:** Rejected. Building a custom image transformation pipeline using Lambda@Edge is highly complex, expensive, and difficult to maintain for a solo developer.

## Consequences

### Positive

- **Zero Compute Overhead:** Image transformations happen at the CDN edge, saving CPU cycles on our Vercel serverless functions.
- **Bandwidth Savings:** Automatic WebP/AVIF conversion significantly reduces payload sizes, improving Core Web Vitals (LCP/CLS).
- **Bandwidth Offloading:** Offloads image traffic from Vercel's hosting limits to ImageKit's specialized infrastructure.

### Negative & Risks

- **Vendor Lock-in:** Our image URLs and transformation parameters are tied to ImageKit's syntax.
- **Mitigation:** We abstract the ImageKit logic inside a reusable `<MovieCover />` component. If we ever need to migrate, we only update this single component.

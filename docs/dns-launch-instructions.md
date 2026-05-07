# SolarKitGuide DNS / hosting launch plan

Recommendation: do **not** buy a new GoDaddy WordPress hosting plan yet.

## Hosting

Use GitHub Pages for the first launch:

- Current staging: https://clintwooley-cloud.github.io/solarkitguide-website/
- GitHub repo: https://github.com/clintwooley-cloud/solarkitguide-website
- Static site folder: `site/`

This is enough for the calculator, guide pages, affiliate disclosure, privacy page, and content/articles.

## When ready to point SolarKitGuide.com

In GoDaddy DNS, point the domain to GitHub Pages:

### Apex/root domain

Add A records for `@`:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### www subdomain

Add CNAME:

- Host: `www`
- Points to: `clintwooley-cloud.github.io`

Then in GitHub Pages settings, set custom domain:

- `SolarKitGuide.com`

After GitHub accepts the custom domain, add a `CNAME` file to the published site containing:

```text
SolarKitGuide.com
```

## Why wait on CNAME?

Adding the custom-domain CNAME before DNS is configured can make staging awkward. Keep GitHub Pages staging on the GitHub URL until DNS is ready.

# Next.js + Strapi Local App

Yeh ek basic beginner-friendly full-stack setup hai:

- `frontend/` mein Next.js App Router, TypeScript aur Tailwind CSS hai.
- `backend/` mein Strapi 5 aur default local SQLite database hai.
- Strapi mein B2B Products, Blogs, categories, enquiry settings aur domestic/
  export quotation requests ready hain.
- Next.js mein CMS-driven homepage, Products, Categories, Applications, Blogs,
  controlled SEO landing pages aur tracked domestic/export WhatsApp quotation
  handoff ready hain.

Is project mein authentication, PostgreSQL, Docker, Axios, Redux, GraphQL,
inventory, cart, checkout, orders ya payments add nahi kiye gaye hain.

## Prerequisites

Is setup ko in versions ke saath verify kiya gaya hai:

```bash
node --version
# v20.18.0

npm --version
# 11.2.0
```

Next.js 16 ko Node.js `20.9+` chahiye. Generated Strapi project Node.js
`20.0.0` se `26.x.x` tak accept karta hai. Stable LTS release use karna best
hai; Node 20 is project ke liye suitable hai.

Is machine par `nvm` mein Node 20 available hai. Agar terminal kisi aur Node
version ko use kar raha ho, project start karne se pehle:

```bash
source /Users/raj/.nvm/nvm.sh
nvm use 20.18.0
```

## Installation

Fresh clone ya copied project ke baad root folder mein:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

Har folder ka apna `package-lock.json` hai, isliye npm exact compatible
dependency versions install karega.

## Environment variables

`frontend/.env.local` ke URLs Next.js server-side CMS fetching, browser-visible
media URLs aur metadata ke liye use hote hain:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_URL=http://127.0.0.1:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

`STRAPI_URL` private server-to-server URL hai. `NEXT_PUBLIC_STRAPI_URL` uploaded
media ke browser URL ke liye public hona chahiye. Kisi bhi value ko change karne
ke baad Next.js dev server restart karo.

Turnstile backend par disabled ho to frontend site key blank rakho. Production
mein Turnstile enable karte waqt Cloudflare ka public site key
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` mein aur matching private secret sirf backend
`TURNSTILE_SECRET_KEY` mein set karo. Widget action `quotation_submit` hai.

Backend security defaults `backend/.env.example` mein documented hain. Local
development ke useful values:

```env
FRONTEND_URLS=http://localhost:3000
QUOTATION_RATE_LIMIT_MAX=5
QUOTATION_RATE_LIMIT_WINDOW_MS=900000
QUOTATION_MAX_BODY_BYTES=102400
TURNSTILE_ENABLED=false
TRUST_PROXY=false
```

Turnstile optional hai aur default off rehta hai. Quotation spam ya automated
abuse justify kare tab real secret aur frontend widget ke matching
hostname/action ke saath enable karo:

```env
TURNSTILE_ENABLED=true
TURNSTILE_SECRET_KEY=replace-with-production-secret
TURNSTILE_EXPECTED_HOSTNAME=www.example.com
TURNSTILE_EXPECTED_ACTION=quotation_submit
```

`TURNSTILE_SECRET_KEY` frontend ya Git mein expose mat karo. `TRUST_PROXY=true`
sirf tab set karo jab deployment proxy/CDN forwarding headers sanitize karta ho;
warna attacker fake forwarded IP se rate limit bypass kar sakta hai.

## First start

### Sirf Next.js start karna

Root se:

```bash
npm run dev:frontend
```

Open: <http://localhost:3000>

### Sirf Strapi start karna

Root se:

```bash
npm run dev:backend
```

Open: <http://localhost:1337/admin>

### Dono saath start karna

Root se:

```bash
npm run dev
```

`concurrently` ek terminal mein frontend aur backend dono run karega. Stop
karne ke liye `Ctrl+C` press karo.

## First Strapi administrator

Pehli baar <http://localhost:1337/admin> open karne par local administrator
form dikhega. Apna name, email aur strong password manually fill karke account
create karo. Yeh credentials frontend mein use nahi hote aur Git mein commit
nahi hone chahiye.

## Homepage, Product aur Blog CMS

Content types project files mein already defined hain. Inko Content-Type
Builder se dobara create mat karo. Content Manager se sirf entries manage karo.

### Site Settings complete karna

`Site Setting` single type mein `companyName` already `Sharv Enterprises` hai.
Frontend enquiry phase se pehle:

1. **Content Manager → Site Setting** open karo.
2. Real international `whatsappNumber` country code ke saath fill karo.
   `enquiryEmail` aur `phone` general contact ke liye optional hain.
3. Optional `defaultInquiryMessage` add karo.
4. **Save** aur **Publish** click karo.

Fake public contact details use nahi hote. WhatsApp quotation enable karne ke
liye real `whatsappNumber` mandatory hai; missing number par frontend/API
gracefully unavailable rahenge.

### Homepage hero complete karna

`Home Page` single type focused homepage ke editable hero, delivery coverage aur
optional search metadata ko manage karta hai:

1. **Content Manager → Home Page** open karo.
2. Required `heroEyebrow`, `heroTitle` aur `heroDescription` fill karo.
3. Real mechanical seal ya relevant industrial product ka `heroImage` upload
   karo aur Media Library mein meaningful alternative text add karo.
4. `Where we deliver` section ke liye optional `deliveryEyebrow`,
   `deliveryTitle` aur `deliveryDescription` fill karo.
5. Repeatable `deliveryAreas` mein area name, `domestic`/`export` market,
   buyer-facing description aur `sortOrder` add karo. Sirf actually serviceable
   coverage publish karo; freight, lead time aur destination feasibility final
   quotation mein confirm hoti hai.
6. Search/social override chahiye to optional `seo` component add karo.
7. **Save** aur **Publish** click karo.

Entry absent ya Draft hone par frontend approved mechanical-seal fallback copy
aur technical visual use karta hai. Empty `deliveryAreas` par delivery section
hide hota hai. `Why choose us` frontend code mein static hai. Primary homepage
actions intentionally fixed `/products` aur `/quote` routes par hain, isliye
arbitrary CMS links add nahi hote.

Homepage storefront carousel ka first slide isi published `Home Page` hero se
banta hai. Uske baad maximum 3 published featured Products automatically product
slides banate hain. Featured Product rail aur `Shop by requirement` Application
cards bhi existing CMS relations use karte hain; inke liye duplicate homepage
content enter karne ki zaroorat nahi hai.

### Homepage Testimonials manage karna

1. **Content Manager → Testimonials → Create new entry** open karo.
2. Required customer name aur approved review add karo.
3. Optional designation, company name, customer-approved photo aur 1–5 rating
   add kar sakte ho.
4. Homepage par dikhane ke liye `featured` enable karo aur `sortOrder` set karo.
5. Customer se public quote/photo permission confirm karke **Publish** karo.

Homepage maximum 12 featured, published testimonials load karta hai. Do ya zyada
cards par carousel automatically scroll hota hai; hover/focus par pause aur
reduced-motion preference par static horizontal list milti hai. Empty collection
par poora Testimonials section hide rehta hai.

### Product Category banana

Category system parent/subcategory hierarchy support karta hai. Parent category
pehle banao, phir child category mein usko select karo.

1. **Content Manager → Product Category → Create new entry** open karo.
2. Required `name` aur globally unique `slug` fill karo.
3. Root category ke liye `parentCategory` blank rakho.
4. Subcategory ke liye published parent ko `parentCategory` mein select karo.
5. Optional description aur category image add karo.
6. Search/social override chahiye to optional `seo` component add karo. Category
   buying questions ke liye repeatable `faqs` add kar sakte ho.
7. **Save** aur **Publish** click karo.

Example hierarchy:

```text
Security Seals
├── Container Seals
├── Bolt Seals
└── Wire Seals
```

`subcategories` reverse relation automatically maintain hoti hai; ise manually
fill nahi karna hota. Category khud ko parent nahi bana sakti aur circular chain
jaise `A → B → A` backend validation se reject hoti hai. SEO-friendly predictable
URLs ke liye slug poore catalogue mein unique rakha gaya hai.

### Product banana

Category publish hone ke baad:

1. **Content Manager → Product → Create new entry** open karo.
2. Required fields fill karo: `name`, unique `slug`, `shortDescription`,
   Blocks `description`, `coverImage`, aur `category`.
3. Optional `sku`, `modelNumber`, gallery images, Applications,
   Certifications aur `featured` flag add karo.
4. Reusable `specifications`, `features`, `faqs` aur optional `seo` add karo.
5. **Save** aur **Publish** click karo.

Current product model catalogue aur quotation flow ke liye hai. Exact stock
quantity, cart, checkout, orders aur payment processing abhi intentionally add
nahi kiye gaye hain.

### Reusable components kaise fill karein

- **SEO:** component add karne par `metaTitle` aur `metaDescription` required
  hain. Canonical URL Step 10 mein frontend route/slug se automatically generate
  hoga. Open Graph fields blank hon to frontend normal metadata reuse karega.
  `focusKeyword` editorial reference hai; HTML meta keywords generate nahi honge.
  Temporary/thin page ko search se rokne ke liye `noIndex` enable karo.
- **FAQ:** concise unique question aur factual answer do. Display order ke liye
  `sortOrder` use karo.
- **Feature:** benefit-oriented title, optional explanation aur `highlighted`
  flag use karo. Generic duplicate claims avoid karo.
- **Specification:** related rows ko `groupName` jaise `Material`, `Dimensions`
  ya `Performance` se group karo. Value mein unit repeat karne ke bajaye optional
  `unit` field use karo.

SEO component raw JSON-LD accept nahi karta. Product, Offer, FAQ aur Breadcrumb
structured data Step 10 mein validated CMS fields se Next.js generate karega.

V1 SEO placement controlled hai: Home Page, Product, Product Category,
Application aur Blog Post par optional; SEO Landing Page par required. Blog
Author, Blog Tag, Blog Category aur Certification par SEO component nahi hai.

### Application aur Certification

Ye supporting collections Product discovery, proof references aur controlled SEO
landing pages ke liye structured data provide karti hain.

1. **Application** mein required `name`, unique `slug` aur `summary` add karo.
   Optional Blocks `content`, image, FAQ aur SEO component use kar sakte ho.
   Example: Centrifugal Pump Sealing, Mixer Sealing, Equipment Retrofit.
2. **Certification** mein required `name` aur `type` select karo. Standard type
   ke liye `standardCode`, certificate type ke liye unique `certificateNumber`
   required hai. Optional issuing authority, validity dates, verification URL,
   logo aur proof document maintain karo. Homepage par record dikhane ke liye
   `featured` enable karo aur `sortOrder` set karo. Expired records homepage se
   automatically exclude hote hain.
3. Product entry mein relevant `applications` aur `certifications` select karo.
   `relatedProducts` reverse list Certification par
   automatically maintain hoti hain.
4. Supporting entry aur related Product dono publish karo. Draft relation public
   API ya future SEO page mein visible nahi honi chahiye.

Only real certification proof upload karo; unverifiable badge ya standard claim
publish mat karo.

### Blog Category aur Blog Post banana

1. Pehle **Blog Author** mein required `name`, globally unique `slug` aur
   factual `bio` fill karo. Optional role, expertise, photo aur LinkedIn/website
   links add karke publish karo. Author par SEO component intentionally nahi hai.
2. **Blog Category** mein required name/slug create karo. Optional description,
   image, featured flag aur ordering maintain kar sakte ho. Category archive
   V1 mein indexable SEO page nahi hai.
3. Reusable topics ke liye **Blog Tag** entries create karo. Near-duplicate tags
   jaise `bolt-seal` aur `bolt-seals` alag mat banao. Tag SEO component remove
   hai; future tag archive route default `noIndex` rahega.
4. **Blog Post** mein required `title`, unique `slug`, `excerpt`, Blocks
   `content`, `coverImage`, published `category` aur published relational
   `author` select karo.
5. Relevant `tags`, `relatedProducts`, FAQs aur SEO component add karo. Related
   products sirf wahi select karo jo article reader ke buying intent se match
   karte hon.
6. Optional `featured` enable karo, phir **Save** aur **Publish** click karo.

Plain `authorName` field relational Blog Author se replace ho chuki hai. Isse
author profile, expertise aur unke saare published articles consistently reuse
ho sakte hain. Personal/private email CMS author profile mein store mat karo.

### SEO Landing Page

Programmatic pages controlled CMS entries hain; har keyword combination
automatically publish nahi hota.

1. **SEO Landing Page** mein internal name aur unique `path` add karo. Path
   lowercase clean segments mein ho, jaise `/solutions/centrifugal-pump-sealing`
   ya `/solutions/export-mechanical-seals`.
2. `pageType` aur audience select karo, phir required H1, unique summary,
   substantial Blocks content aur required SEO component fill karo.
3. Page type ke according Category, Application ya Certification
   relation select karo. Relevant Products manually curate karo.
4. Useful FAQs, hero image, breadcrumb label aur ordering add karke editorial
   review ke baad publish karo. Thin/incomplete page ko Draft ya SEO `noIndex`
   mein rakho.

Backend reserved paths aur uppercase/trailing-slash/query/hash paths reject
karta hai. Landing Page ka `path` `/` nahi ho sakta; homepage separate Next.js
route rahega.

### WhatsApp-first Domestic aur Export Quotations

Frontend `/quote` short form buyer ki requirement privately save karke structured
`wa.me` handoff return karta hai. Product page se product slug preselect hota hai.

- Pehle **Content Manager → Site Setting** mein real international
  `whatsappNumber` add karke entry Publish karo. Number absent/invalid ho to form
  unavailable state aur API `503` return karti hai; fake fallback use nahi hota.
- Required buyer data: enquiry type, name, WhatsApp number with country code,
  delivery destination, at least one catalogue/custom item aur contact consent.
- Export request mein `companyName` required hai. Product item mein positive
  quantity/unit aur optional 600-character technical/commercial requirement hai.
- Catalogue Product select hone par current name/SKU snapshot save hota hai,
  isliye later CMS rename historical enquiry ko change nahi karta.
- Browser-generated private `submissionToken` retry ko idempotent banata hai:
  same token same request/reference return karta hai, duplicate row nahi.
- Backend unique `QR-YYYYMMDD-XXXXXXXX` reference generate karke recipient sirf
  published Site Setting se resolve karta hai. Response ka WhatsApp message
  reference, product, quantity, destination aur requirement include karta hai.
- `whatsappStatus=initiated` ka matlab handoff prepare hua; message send hona
  confirm nahi hota. Message actual business WhatsApp par aane ke baad admin
  `whatsappStatus=received` aur business `status=in_review` manually update
  kare. Receipt status save hote hi `whatsappReceivedAt` automatically fill hota
  hai.
- Internal notes, quoted amount/currency aur validity public response mein kabhi
  return nahi hote. V1 mein Meta Cloud API/webhook configured nahi hai.

### Quotation security

Step 8 backend security implemented hai:

- Content API par Quotation Request ka sirf `POST /api/quotation-requests`
  route registered hai; public read/update/delete routes exist nahi karte.
- Per Strapi process aur per client IP default 5 requests/15 minutes limit hai.
  Limit cross hone par `429` aur `Retry-After` header milta hai. Multi-instance
  production deployment mein CDN/edge ya shared-store rate limit bhi add karo.
- Request body JSON-only aur maximum 100 KB hai. `website` reserved honeypot
  field hai; frontend is hidden field ko blank rakhega.
- `TURNSTILE_ENABLED=true` hone par `captchaToken` Cloudflare Turnstile
  Siteverify API se backend par validate hota hai. Hostname/action mismatch,
  expired ya reused token reject hota hai. Local development mein official test
  keys use ki ja sakti hain. Default V1 flow Turnstile ke bina rate limit,
  honeypot aur input validation use karta hai.
- Public role allowlist startup par enforce hoti hai. Unused public registration,
  login, password reset aur koi accidental extra API permission remove ho jati
  hai. Strapi Admin login separate hai aur unaffected rehta hai.
- Default security headers active hain aur framework-identifying
  `X-Powered-By` response header disabled hai.
- Buyer PII logs mein security metadata ke roop mein store nahi hoti; private
  quotation record mein sirf allowlisted WhatsApp enquiry fields save hote hain.
  Turnstile token database mein store nahi hota.

Draft Home Page, Product, Product Category, Application,
Certification, Blog Author, Blog Tag, Blog Post, Blog Category aur SEO Landing
Page public API mein nahi dikhte.

## Public API permissions

Application startup required Public permissions automatically add karta hai aur
allowlist ke bahar ki permissions remove karta hai. Admin Panel mein audit ke
liye:

1. **Settings → Users & Permissions Plugin → Roles → Public** open karo.
2. `Product`, `Product Category`, `Application`, `Certification`,
   `Blog Author`, `Blog Tag`, `Blog Post`, `Blog Category` aur `SEO Landing Page`
   ke liye sirf `find` aur `findOne` enabled hone chahiye.
3. `Home Page` aur `Site Setting` ke liye sirf `find` enabled hona chahiye.
4. `Quotation Request` ke liye sirf `create` enable karo. Iske `find`,
   `findOne`, `update` aur `delete` disabled rakho, kyunki enquiries private
   customer data hain.
5. Public role ke Users & Permissions authentication actions disabled rakho;
   customer accounts current scope mein nahi hain.
6. Baaki public content types ke `create`, `update` aur `delete` disabled rakho.
7. Manual change ki ho to **Save** click karo. Agle startup par allowlist dobara
   enforce hogi.

## Product aur Blog REST APIs

Basic endpoints:

```text
GET http://localhost:1337/api/products
GET http://localhost:1337/api/products/:documentId
GET http://localhost:1337/api/product-categories
GET http://localhost:1337/api/applications
GET http://localhost:1337/api/applications/:documentId
GET http://localhost:1337/api/certifications
GET http://localhost:1337/api/certifications/:documentId
GET http://localhost:1337/api/home-page
GET http://localhost:1337/api/blog-authors
GET http://localhost:1337/api/blog-authors/:documentId
GET http://localhost:1337/api/blog-tags
GET http://localhost:1337/api/blog-tags/:documentId
GET http://localhost:1337/api/blog-posts
GET http://localhost:1337/api/blog-posts/:documentId
GET http://localhost:1337/api/blog-categories
GET http://localhost:1337/api/seo-landing-pages
GET http://localhost:1337/api/seo-landing-pages/:documentId
GET http://localhost:1337/api/site-setting
POST http://localhost:1337/api/quotation-requests
```

List pages ke liye limited populate:

```text
GET /api/products?populate[coverImage]=true&populate[category]=true
GET /api/blog-posts?populate[coverImage]=true&populate[category]=true&populate[author]=true&populate[tags]=true
GET /api/blog-authors?populate[photo]=true
GET /api/blog-tags
GET /api/product-categories?populate[image]=true&populate[parentCategory]=true&populate[subcategories]=true
GET /api/applications?populate[image]=true
GET /api/certifications?populate[logo]=true
GET /api/home-page?populate[heroImage]=true&populate[seo][populate][ogImage]=true
GET /api/seo-landing-pages?populate[heroImage]=true&populate[seo][populate][ogImage]=true
```

Detail pages ke liye:

```text
GET /api/products/:documentId?populate[coverImage]=true&populate[gallery]=true&populate[category]=true&populate[applications]=true&populate[certifications]=true&populate[relatedBlogPosts]=true&populate[specifications]=true&populate[features]=true&populate[faqs]=true&populate[seo][populate][ogImage]=true
GET /api/product-categories/:documentId?populate[image]=true&populate[parentCategory]=true&populate[subcategories]=true&populate[faqs]=true&populate[seo][populate][ogImage]=true
GET /api/applications/:documentId?populate[image]=true&populate[products]=true&populate[faqs]=true&populate[seo][populate][ogImage]=true
GET /api/certifications/:documentId?populate[logo]=true&populate[document]=true&populate[relatedProducts]=true
GET /api/blog-posts/:documentId?populate[coverImage]=true&populate[category]=true&populate[author][populate][photo]=true&populate[tags]=true&populate[relatedProducts][populate][coverImage]=true&populate[faqs]=true&populate[seo][populate][ogImage]=true
GET /api/blog-authors/:documentId?populate[photo]=true&populate[blogPosts]=true
GET /api/blog-tags/:documentId?populate[blogPosts]=true
GET /api/seo-landing-pages/:documentId?populate[heroImage]=true&populate[category]=true&populate[application]=true&populate[certification]=true&populate[products][populate][coverImage]=true&populate[faqs]=true&populate[seo][populate][ogImage]=true
```

Domestic quotation request example:

```json
{
  "data": {
    "submissionToken": "a8f26f9e-4d44-4bb9-8769-031dfd6fbe31",
    "enquiryType": "domestic",
    "fullName": "Rahul Sharma",
    "whatsappNumber": "+91 98765 43210",
    "companyName": "Example Engineering",
    "deliveryDestination": "Faridabad, Haryana 121003",
    "items": [
      {
        "productDocumentId": "STRAPI_PRODUCT_DOCUMENT_ID",
        "quantity": 10,
        "unit": "piece",
        "requirements": "Pump model, shaft size and operating details available on WhatsApp"
      }
    ],
    "sourcePage": "/quote",
    "captchaToken": "TURNSTILE_WIDGET_TOKEN",
    "consentToContact": true
  }
}
```

Export quotation request example:

```json
{
  "data": {
    "submissionToken": "0866088a-97a8-40e1-a07c-6735b9442804",
    "enquiryType": "export",
    "fullName": "Alex Morgan",
    "whatsappNumber": "+971 50 123 4567",
    "companyName": "Example Imports LLC",
    "deliveryDestination": "Jebel Ali, UAE",
    "items": [
      {
        "productName": "Custom cartridge mechanical seal",
        "quantity": 25,
        "unit": "piece",
        "requirements": "Export packing and CIF commercial option required"
      }
    ],
    "captchaToken": "TURNSTILE_WIDGET_TOKEN",
    "consentToContact": true
  }
}
```

New submission `201` aur same-token retry `200` ke saath tracked handoff return
karti hai:

```json
{
  "data": {
    "requestNumber": "QR-20260728-1A2B3C4D",
    "status": "whatsapp_initiated",
    "whatsappUrl": "https://wa.me/<published-business-number>?text=...",
    "whatsappMessage": "Hello Sharv Enterprises..."
  }
}
```

Example number sirf response shape explain karta hai. CMS Site Setting mein real
business number hi configure karo.

Quotation Request ka public GET route `404` aur unsupported write methods `405`
return karte hain. Sirf POST submission route available hai.

Empty collection ka valid response `200` ke saath `"data": []` hota hai. Fake
Product, Blog ya Quotation Request entries seed nahi ki gayi hain.
Unpublished/empty `Home Page` single type `200` ke saath `"data": null` return
karta hai, jisse frontend approved fallback hero render kar sake.

## Next.js current state

Frontend ka CMS-connected phase ready hai:

- `/` CMS + featured Product hero carousel, horizontal Product catalogue rail,
  Application-led shopping cards, delivery coverage, featured Testimonials,
  current Certifications, latest/featured Blogs aur WhatsApp quotation CTA load
  karta hai.
- `/products` complete published catalogue aur category filters show karta hai.
- `/products/category/[slug]` category, child categories, products aur FAQs show
  karta hai.
- `/products/[slug]` product media, Blocks description, specifications,
  features, certifications, related Blogs, FAQs aur quotation prefill use karta
  hai.
- `/applications` aur `/applications/[slug]` Application content, related
  Products aur FAQs load karte hain.
- `/blogs` category filter ke saath articles show karta hai; `/blogs/[slug]`
  Blocks content, relational Author, Tags, FAQs aur related Products render karta
  hai. Tag aur Author ke separate indexable pages intentionally nahi hain.
- Unmatched clean paths controlled `SEO Landing Page.path` se resolve hote hain.
  `/products`, `/applications`, `/blogs` aur `/quote` prefixes
  reserved hain, isliye landing page application routes ko shadow nahi kar sakta.
- `/quote` short WhatsApp-first contract use karta hai: published Product
  documentId/custom item, quantity, destination, consent, idempotent token,
  honeypot, rate-limit responses aur optional Turnstile widget. Record save hone
  ke baad same-tab WhatsApp handoff aur visible fallback link milta hai.
- `sitemap.xml`, `robots.txt`, route-derived canonical URLs aur CMS SEO/noIndex
  metadata implemented hain.
- Typed Strapi server data layer explicit populate queries aur `no-store`
  fetching use karti hai, isliye admin mein publish kiya content next request par
  available hota hai.
- Empty collections, loading, service error aur missing entry states implemented
  hain.

Demo catalogue content CMS mein clearly labelled aur SEO `noIndex` ke saath
maintain kiya ja sakta hai; frontend mein fake records hard-code nahi hain.

## CORS

Strapi CORS `FRONTEND_URLS` allowlist use karta hai; default sirf
`http://localhost:3000` hai. Catalogue reads Next.js server se aati hain, lekin
uploaded media aur browser quotation submission ke liye correct
public origin allowlist phir bhi zaroori hai. Browser Content API ke liye GET,
POST, HEAD aur OPTIONS methods allowed hain aur cross-origin credentials disabled
hain. Multiple trusted origins comma-separated configure karo. CORS direct HTTP
clients ko block nahi karta; quotation abuse protection rate limit, honeypot aur
optionally Turnstile se hoti hai.

## Build checks

```bash
npm run build:frontend
npm run build:backend
```

## Coolify production deployment

Repository root ka `docker-compose.coolify.yml` complete production stack deploy
karta hai:

- `frontend`: Next.js standalone server on container port `3000`
- `backend`: Strapi on container port `1337`
- `postgres`: private PostgreSQL database
- persistent volumes: PostgreSQL data aur Strapi uploaded media

Coolify mein Docker Compose resource create karke compose location
`/docker-compose.coolify.yml` select karo. Compose load hone ke baad frontend aur
backend ke liye `Generate Domain` use karo. Compose Coolify ke generated
`SERVICE_URL_FRONTEND` aur `SERVICE_URL_BACKEND` variables ko application URLs,
CORS aur Next.js build configuration mein automatically reuse karta hai; manual
public URL duplication ki zaroorat nahi hai.

Coolify referenced `SERVICE_PASSWORD_*` aur `SERVICE_HEX_64_*` values
automatically generate karta hai. In secrets ko hard-code ya Git mein commit mat
karo.

Compose resource load hone ke baad domains service ports ke saath assign karo:

- frontend service: container port `3000`
- backend service: container port `1337`
- PostgreSQL ko public domain ya host port mat do.

First deploy ke baad Strapi admin open karke admin account create karo. Local
CMS content/media migrate karne ke liye remote admin mein Transfer Token banao,
phir local `backend` directory se Strapi transfer command run karo. Database ya
local `.env` Git mein push mat karo. Transfer complete hone ke baad products,
blogs, applications, homepage, settings, certifications aur public permissions
verify karo.

Production checklist:

- Both public domains HTTPS par load hon.
- Backend `/_health` aur frontend `/robots.txt` success return karein.
- Frontend images generated backend service URL ke `/uploads/...` path se load
  hon.
- Quotation POST browser se CORS error ke bina work kare.
- PostgreSQL aur uploads volumes ke scheduled Coolify backups configure hon.
- Strapi admin aur database services public raw ports par expose na hon.

## Common errors

### Port 3000 already in use

Purana Next.js process stop karo. macOS/Linux par process check:

```bash
lsof -i :3000
```

Us terminal mein `Ctrl+C` press karo jahan old server run ho raha hai, phir
`npm run dev:frontend` dobara run karo.

### Port 1337 already in use

Process check:

```bash
lsof -i :1337
```

Old Strapi process stop karo, phir `npm run dev:backend` dobara run karo.

### Strapi API `403` return karti hai

**Settings → Users & Permissions Plugin → Roles → Public** mein relevant
Product/Blog content type ka `find` aur `findOne` enable karke Save karo.
Quotation Request submission ke liye sirf uska `create` permission enable karo;
quotation GET ka `404` aur unsupported write methods ka `405` expected behavior
hai. Public customer auth
permissions intentionally startup par remove hoti hain.

### Quotation request `400` return karti hai

- Request body Strapi shape `{ "data": { ... } }` mein bhejo.
- Valid 16–64 character `submissionToken` bhejo; retry par same token reuse karo.
- At least one item aur positive quantity/unit confirm karo.
- Catalogue item ke liye published Product `documentId`, warna custom
  `productName` bhejo.
- Buyer WhatsApp number country code ke saath aur delivery destination fill karo.
- Export request mein company name fill karo.
- `consentToContact` explicitly `true` hona chahiye.
- Turnstile enabled ho to fresh `captchaToken` bhejo. Token reuse ya five
  minutes se purana token reject hoga. Disabled mode mein field omit kar sakte
  ho.
- Reserved honeypot field `website` blank rakho ya request se omit karo.

### Quotation request `503` return karti hai

- **Content Manager → Site Setting** mein valid international `whatsappNumber`
  add karke entry Publish karo.
- Draft-only setting ya blank/invalid number se koi enquiry record create nahi
  hota.

### Quotation request `415` ya `429` return karti hai

- `415`: `Content-Type: application/json` header bhejo.
- `429`: 15-minute IP window expire hone tak wait karo; `Retry-After` response
  header exact remaining seconds batata hai.

### Strapi empty `data` array return karta hai

- Confirm karo required Product/Blog category aur entry create hui hai.
- Entry published hai.
- Public role mein `find` permission enabled hai.

### API `404` return karti hai

- Detail API mein numeric `id` ke bajay Strapi 5 `documentId` use karo.
- `Site Setting` ko Save ke baad Publish karna confirm karo.
- Correct plural endpoint use karo, jaise `/api/blog-posts`.

### Product ya Blog save/publish nahi ho raha

- Required fields aur required category relation check karo.
- Product cover image aur Blog cover image required hain.
- Slug aur optional SKU kisi existing entry se duplicate nahi hone chahiye.
- Related category pehle publish karo.

## Later restart commands

Har new terminal session mein:

```bash
cd "/Users/raj/Documents/Sharv Enterprises/next-strapi-app"
source /Users/raj/.nvm/nvm.sh
nvm use 20.18.0
npm run dev
```

Local URLs:

- Next.js: <http://localhost:3000>
- Strapi Admin: <http://localhost:1337/admin>
- Products API: <http://localhost:1337/api/products>
- Product Categories API: <http://localhost:1337/api/product-categories>
- Blog Posts API: <http://localhost:1337/api/blog-posts>
- Blog Categories API: <http://localhost:1337/api/blog-categories>
- Site Setting API: <http://localhost:1337/api/site-setting>
- Quotation submission API: <http://localhost:1337/api/quotation-requests>

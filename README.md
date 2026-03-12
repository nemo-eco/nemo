# nemo.eco

> NFT marketplace giving coral foundations access to funding through digital art royalties — instead of relying on donations and grants.

Artists mint NFTs on Tezos. A portion of every primary sale and secondary royalty flows automatically to a partner coral reef foundation, on-chain, forever. Collectors get art and impact. Foundations get sustainable, programmable funding.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current State](#2-current-state)
3. [Tech Stack](#3-tech-stack)
4. [Data & Architecture](#4-data--architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Component Hierarchy & Specs](#6-component-hierarchy--specs)
7. [Design System](#7-design-system)
8. [User Stories](#8-user-stories)
9. [Roadmap](#9-roadmap)
10. [Implementation Notes](#10-implementation-notes)
11. [Dev Setup](#11-dev-setup)

---

## 1. Project Overview

### The Problem

Coral reef foundations depend on one-time donations and competitive grants — unpredictable, high-overhead, unscalable funding. Meanwhile, NFT royalties are programmable, perpetual, and automated by smart contract.

### The Solution

nemo.eco is a curated NFT marketplace where:
- Every listed collection is linked to a verified coral foundation
- A defined royalty split (e.g. 20% artist / 80% foundation, or any artist-chosen ratio) is encoded in the FA2 contract
- The marketplace surfaces that impact data clearly: how much has flowed to each foundation, from which artists, from which collectors
- Artists gain a mission-driven audience and differentiated positioning
- Collectors get provable, transparent impact alongside the art

### The Three Users

| User | Core Need |
|---|---|
| **Artist** | Mint and list NFTs that generate ongoing royalty income, with a mission that attracts collectors |
| **Collector** | Buy art with verifiable environmental impact, track their contribution over time |
| **Foundation** | Receive sustainable on-chain funding, display their partner artists, report impact transparently |

### Architecture Philosophy

**The blockchain is the backend.** All NFT data, ownership, royalty splits, and transaction history live on Tezos — trustless, permanent, and publicly readable. nemo.eco is a frontend that reads from the chain (via the Objkt GraphQL API) and presents it with mission context. No custody, no middleware, no database to maintain at the MVP stage.

---

## 2. Current State

What works today:

- React app successfully queries the **Objkt.com GraphQL API** and renders NFTs held by a hardcoded Tezos wallet from a specific FA2 contract
- Basic layout in place: Navbar, Hero, NFT card grid
- Branding established: deep purple + coral palette

What's missing / broken:

| Issue | File | Priority |
|---|---|---|
| Royalty display always shows `0` — `slice(-4, 2)` bug | `src/NftCard.js:15` | High |
| Hardcoded wallet + contract — not configurable | `src/App.js:23` | High |
| No wallet connection logic (button is stubbed) | `src/Navbar.js` | High |
| No routing — `react-router-dom` installed but unused | `package.json` | High |
| IPFS images slow/unreliable via `ipfs.io` | `src/NftCard.js:34` | Medium |
| `cors` npm package in frontend (has no effect here) | `package.json` | Low |

---

## 3. Tech Stack

### Current

| Layer | Choice |
|---|---|
| Framework | React 17 (Create React App) |
| Language | JavaScript |
| Data | Axios → Objkt GraphQL API (`data.objkt.com/v2/graphql`) |
| Styling | Plain CSS (`App.css`) |

### Recommended (Next Iteration)

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/SSG for SEO on artist/collection pages; file-based routing; image optimization |
| Language | **TypeScript** | Catch contract address and API shape mismatches at compile time |
| Styling | **Tailwind CSS** | Fast iteration, consistent design tokens, no CSS sprawl |
| Data Fetching | **TanStack Query** | Caching, background refetch, loading/error states for Objkt API calls |
| State | **Zustand** | Lightweight global state for wallet connection and user session |
| Wallet | **Taquito + Beacon SDK** | Industry-standard Tezos wallet integration (Temple, Kukai, Airgap) |
| Routing | Built into Next.js | Replace unused `react-router-dom` |
| Icons | **Lucide React** | Clean, tree-shakeable |
| Deploy | **Vercel** | Zero-config Next.js deploys |

### Blockchain / Data

| Layer | Choice |
|---|---|
| Chain | Tezos |
| NFT Standard | FA2 (TZIP-12) |
| Marketplace Data | Objkt.com GraphQL API v3 (`data.objkt.com/v3/graphql`) |
| IPFS Gateway | Cloudflare IPFS (`cloudflare-ipfs.com/ipfs/`) — faster and more reliable than `ipfs.io` |
| On-chain Royalties | Native FA2 royalty fields, readable via Objkt API |
| Wallet Auth | Beacon SDK `requestSignPayload()` — sign a challenge, no passwords |

---

## 4. Data & Architecture

### Data Flow

```
Tezos Blockchain (FA2 contracts)
        │
        ▼
Objkt GraphQL API  ──► Next.js Server Components (SSR/SSG)
                                │
                         React Client Components
                                │
                    Beacon SDK / Taquito (wallet)
```

No database. No backend server. The Objkt API is the read layer; Tezos is the source of truth for ownership, royalties, and transactions. The wallet is the user's identity.

### Key Tezos Concepts

| Concept | What it means for nemo.eco |
|---|---|
| **FA2 contract** | Each NFT collection lives at a `KT1...` address — this is the "collection ID" |
| **tz address** | Each artist and collector is identified by their `tz1...` wallet address |
| **Royalties** | Encoded in the FA2 contract; Objkt returns them in **millionths** (e.g. `250000` = 25%) |
| **Objkt `holder_by_pk`** | Query NFTs held by a specific wallet from a specific contract |
| **Objkt `token`** | Individual NFT with `artifact_uri`, `thumbnail_uri`, `name`, `description`, `royalties` |

### Objkt API Notes

- Current query targets `holder_by_pk` — fetches tokens held by one wallet
- Better approach for a multi-artist marketplace: query by `fa_contract` to get all tokens in a collection, regardless of who holds them
- Royalty amounts from Objkt are in millionths: divide by `10000` to get a percentage (e.g. `250000 / 10000 = 25%`)
- Upgrade from v2 to v3 endpoint — field names have changed

---

## 5. Frontend Architecture

### Page Structure (Next.js App Router)

```
app/
├── page.tsx                        # Homepage: hero + featured collections + impact counter
├── explore/
│   └── page.tsx                    # Browse all collections/NFTs with filter/sort
├── artists/
│   ├── page.tsx                    # Artist directory
│   └── [username]/
│       └── page.tsx                # Artist profile + their collections
├── foundations/
│   ├── page.tsx                    # Foundation directory
│   └── [slug]/
│       └── page.tsx                # Foundation profile + impact numbers
├── collections/
│   └── [contract]/
│       ├── page.tsx                # Collection detail + NFT grid
│       └── [tokenId]/
│           └── page.tsx            # Single NFT detail
└── profile/
    └── page.tsx                    # Connected wallet: artist dashboard (protected)
```

### Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Homepage | SSG (revalidate every hour) | Mostly static, SEO matters |
| Collection pages | SSR | NFT data changes; SEO critical for discovery |
| Artist profiles | SSR | Ditto |
| Explore / browse | Client-side | Filter/sort interactions, less SEO-critical |
| Profile / dashboard | Client-side | Requires wallet connection, no public indexing needed |

### State Management

| State | Where |
|---|---|
| Wallet connection (address, signer) | Zustand global store |
| NFT / collection data | TanStack Query (server state) |
| UI state (filters, modals) | Local `useState` |

---

## 6. Component Hierarchy & Specs

### Global Layout

```
<RootLayout>
├── <TopNav>
│   ├── <Logo />                    # SVG, links to /
│   ├── <NavLinks />                # Explore | Artists | Foundations
│   ├── <ImpactBadge />             # "X tez raised" — platform-wide counter from Objkt
│   └── <WalletButton />            # Connect / tz address when connected
└── <Footer>
    ├── <FooterLinks />
    └── <SocialLinks />
```

#### `<WalletButton>`
- **Disconnected:** "Connect Wallet" → triggers `beacon.requestPermissions()`
- **Connecting:** spinner
- **Connected:** `tz1Qap...Yj9e` (first 6 + last 4 chars) + avatar initial, dropdown with "My Profile" and "Disconnect"

---

### Homepage (`/`)

```
<HomePage>
├── <HeroSection>
│   ├── Headline + subheadline
│   ├── <ImpactCounter />           # Animated tez counter (sum of all foundation royalties via Objkt)
│   └── <CTAButtons />              # "Explore Art" → /explore | "List Your Work" → /profile
├── <FeaturedCollections>
│   └── <CollectionCard /> × 3
├── <FeaturedFoundations>
│   └── <FoundationCard /> × n
└── <HowItWorks>                    # 3-step: Mint → Sell → Foundation receives on-chain
```

---

### Explore Page (`/explore`)

```
<ExplorePage>
├── <FilterBar>
│   ├── <FoundationFilter />        # All | [Foundation name] × n
│   ├── <SortControl />             # Recent | Most Royalties | Price
│   └── <SearchInput />
└── <NftGrid>
    └── <NftCard /> × n
```

---

#### `<NftCard>` — revised spec

- Thumbnail (Cloudflare IPFS gateway, lazy loaded, 1:1 aspect ratio, `object-cover`)
- Token name (bold, 2-line clamp)
- Artist name (links to `/artists/:username`)
- Foundation badge (`brand-teal`, logo + name, links to `/foundations/:slug`)
- Royalty line: `{royalty}% royalties — {foundation_share}% to {foundation_name}`
- "View on Objkt" external link
- Hover: slight scale + shadow

**Royalty calculation (fix from current bug):**
```ts
// Objkt returns royalties in millionths
const totalRoyaltyPct = sumRoyalties(token.royalties) / 10000; // e.g. 25.0
```

---

### Collection Page (`/collections/:contract`)

```
<CollectionPage>
├── <CollectionHeader>
│   ├── Cover image
│   ├── Name + description
│   ├── <ArtistChip />              # Avatar + name → /artists/:username
│   └── <FoundationImpactBox>       # "X tez raised for [Foundation]" in brand-teal
├── <CollectionStats>               # Total items | Floor price | Royalty % | Foundation share %
└── <NftGrid>
    └── <NftCard /> × n (paginated, 20/page)
```

---

### Artist Profile (`/artists/:username`)

```
<ArtistPage>
├── <ArtistHeader>
│   ├── Avatar (from Objkt alias/logo), display name, bio, tzdomain
│   ├── Social links (website, Twitter)
│   └── <FoundationBadge />         # Their chosen foundation (brand-teal)
├── <ArtistStats>                   # Total NFTs | Est. royalties | Foundation total
└── <CollectionGrid>
    └── <CollectionCard /> × n
```

---

### Foundation Profile (`/foundations/:slug`)

```
<FoundationPage>
├── <FoundationHeader>
│   ├── Logo, name, description, website
│   └── <TotalRaisedBadge />        # "X.XX tez raised" (sum royalty events to their tz address)
├── <ImpactTimeline>                # Chart: cumulative tez over time (recharts)
├── <PartnerArtists>
│   └── <ArtistChip /> × n
└── <RecentRoyaltyFeed>             # Latest on-chain royalty events to this foundation's wallet
```

---

### Artist Dashboard (`/profile`) — wallet required

```
<ProfilePage>
├── <ProfileEditor />               # Edit display name, bio, social links, foundation choice
├── <MyCollections>
│   ├── <CollectionCard /> × n      # Collections linked to connected wallet address
│   └── <AddCollectionForm />       # Submit a KT1 contract address to register a collection
└── <RoyaltyHistory>                # Royalty events for tokens in this wallet's collections
```

---

## 7. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-purple` | `#3C1556` | Primary background, nav |
| `brand-coral` | `#FF7A73` | Primary CTA, accents, highlights |
| `brand-teal` | `#00B4A6` | All impact/foundation elements — the "impact colour" |
| `surface-dark` | `#1E0A2E` | Card backgrounds on dark bg |
| `surface-light` | `#F5F0FA` | Light mode card backgrounds |
| `text-primary` | `#EEF3FA` | Body text on dark |
| `text-muted` | `#A394B8` | Secondary text on dark |
| `text-dark` | `#1A0A2C` | Body text on light |

**Rule:** Any element communicating real-world environmental impact uses `brand-teal`. This creates a consistent visual language — teal = on-chain impact. Never use it for non-impact UI.

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display | Plus Jakarta Sans | 800 | 48–72px |
| Heading | Plus Jakarta Sans | 700 | 24–40px |
| Subheading | Plus Jakarta Sans | 600 | 18–20px |
| Body | DM Sans | 400 | 14–16px |
| Label/Caption | DM Sans | 500 | 12px |
| Mono (tz addresses) | JetBrains Mono | 400 | 12–14px |

> Note: The codebase references Panton (commercial license required). Use **Plus Jakarta Sans** (free, Google Fonts) as a near-equivalent.

### Spacing & Grid

- Base unit: `4px`
- NFT grid: CSS Grid, `auto-fill`, `minmax(260px, 1fr)`, gap `24px`
- Container max-width: `1280px`, padding `0 24px`
- Card border-radius: `12px`
- Button border-radius: `8px`

### Component States

All interactive elements must define: `default` | `hover` | `focus` (accessible outline) | `active` | `disabled` | `loading`

---

## 8. User Stories

### MVP — "It works, it's real, you can show it to a foundation"

**Collector / Visitor**
- [ ] I can browse all NFTs in the curated marketplace in a filterable, searchable grid
- [ ] I can see each NFT's image, name, description, and exact royalty breakdown (artist % + foundation %)
- [ ] I can click through to Objkt.com to purchase any NFT
- [ ] I can see which foundation each collection supports and how much has been raised (pulled from Objkt)
- [ ] I can visit a foundation's profile page showing total tez raised and partner artists

**Artist**
- [ ] I can connect my Tezos wallet (Temple, Kukai, etc.) to authenticate — no password
- [ ] I can create a profile with display name, bio, and social links linked to my wallet address
- [ ] I can choose a partner foundation from a list of verified foundations
- [ ] I can register an existing FA2 contract address to add my collection to the marketplace
- [ ] I can see my collection displayed on my profile page

**Bug Fixes (prerequisite for everything)**
- [ ] Fix royalty display: `sumRoyalties(royalties) / 10000` → shows correct percentage
- [ ] Replace `ipfs.io` with Cloudflare IPFS gateway in image URLs
- [ ] Upgrade Objkt API from v2 to v3
- [ ] Make wallet + contract addresses configurable (env vars or admin-managed list), not hardcoded
- [ ] Wire up routing with `react-router-dom` (or migrate to Next.js routing)

---

### Silver — "It's a real product people share"

**Collector / Visitor**
- [ ] I can connect my wallet and see which nemo.eco NFTs I currently hold
- [ ] I can see my personal impact: total tez contributed to foundations through my holdings
- [ ] I can share a collection or NFT to Twitter/X with a pre-filled impact message
- [ ] Foundation and artist pages are indexed (OpenGraph + Twitter card meta on all pages)

**Artist**
- [ ] I can view a royalty history dashboard with a chart of earnings over time
- [ ] I can update my profile photo
- [ ] I can see a breakdown: how much of my royalties went to my foundation vs. myself

**Foundation**
- [ ] My profile page shows a cumulative chart of incoming royalties over time
- [ ] I can download a CSV royalty report for any date range (requires a lightweight backend)

**Discovery**
- [ ] Homepage features a curated "Featured Collection" spotlight and a live impact ticker
- [ ] Collections are filterable by foundation, sortable by recent/most royalties/price

---

### Gold — "Platform network effects kick in"

**Artist**
- [ ] Artist application flow: submit wallet + portfolio → admin review → verified badge
- [ ] Co-creation: multiple artists can collaborate on a collection with split royalties to multiple wallets
- [ ] Mint directly from nemo.eco: deploy a new FA2 contract with nemo.eco royalty splits pre-configured

**Collector**
- [ ] Public collector profile: portfolio of held nemo.eco NFTs + lifetime impact summary
- [ ] "Impact Pass" NFT: soulbound token minted when a collector crosses impact milestones
- [ ] Secondary market integration: live listings/bids from Objkt surfaced inline (no redirect)

**Platform**
- [ ] nemo.eco platform fee (e.g. 2.5% of primary sales) flows into a reef restoration multisig treasury
- [ ] Public impact dashboard at `/impact`: cumulative tez-to-foundations platform-wide
- [ ] Foundation partner embed widget: "Powered by nemo.eco" badge for foundation websites
- [ ] Multi-chain expansion: Ethereum L2 (Base or Arbitrum) to access a larger collector base

---

## 9. Roadmap

### Phase 0 — Fix & Connect (1–2 weeks)
Fix the known bugs. Get collections displaying correctly with real royalty numbers. Make the wallet address and contract address configurable. This is the prerequisite for everything.

**Exit criteria:**
- Royalty percentages display correctly on all cards
- Images load reliably via Cloudflare IPFS
- At least 3 curated collections showing from different artists
- Basic routing in place (collection page, artist page)

### Phase 1 — MVP (4–6 weeks)
Wallet connect, artist profiles, foundation pages. A real product you can demonstrate to a conservation org.

**Exit criteria:**
- Wallet connection works (Temple/Kukai)
- Artist can create a profile and register a collection
- Foundation profile pages exist with total raised
- Deployed to Vercel with a real domain

### Phase 2 — Silver (6–8 weeks)
Collector-facing features, impact dashboards, SEO, social sharing. Designed for organic discovery and press.

**Exit criteria:**
- Collector can see their held NFTs and personal impact
- OpenGraph meta on collection and artist pages
- Foundation pages have a royalty timeline chart
- At least one press mention or foundation partnership announcement

### Phase 3 — Gold (ongoing)
Minting, co-creation, secondary market, multi-chain. Scope as separate initiatives; validate Silver adoption before committing here.

---

## 10. Implementation Notes

### Fix the Royalty Bug First

`src/NftCard.js:15` — current code:
```js
sumRoyalties(nft.token.royalties).toString().slice(-4, 2) // always returns ""
```

Objkt returns royalty amounts in **millionths**. Fix:
```js
const royaltyPct = sumRoyalties(nft.token.royalties) / 10000; // e.g. 250000 → 25.0
```

### Replace the IPFS Gateway

`src/NftCard.js:34` — swap `ipfs.io` for Cloudflare:
```js
// Before
`https://ipfs.io/ipfs/${uri}`

// After
`https://cloudflare-ipfs.com/ipfs/${uri}`
```

### Upgrade to Objkt v3

The v2 endpoint (`data.objkt.com/v2/graphql`) has deprecated field names. Upgrade to v3 and test the query shape — some field names (e.g. `held_tokens`, `royalties`) may have changed.

### Wallet Auth Pattern (no passwords)

When building the artist profile/dashboard:
1. Frontend: `beacon.requestSignPayload({ payload: nonce })` — the nonce is a string you generate
2. User signs with their wallet — this proves they control the `tz` address
3. Store `{ address, signature, nonce }` in app state; use the address as the user identity
4. For any write operations (profile updates), verify the signature on the receiving end

For MVP, you can skip server-side signature verification entirely — just use the connected wallet address as a read-only identity to look up their Objkt data. Signature verification becomes important when you're persisting profile data somewhere.

### Configuring Collections

For MVP, hardcoded arrays in a config file are fine — better than scattered hardcodes in `App.js`:

```ts
// src/config/collections.ts
export const CURATED_COLLECTIONS = [
  {
    contract: "KT1TpydA8FVMb2P2QrMnYygigWFo9zYfP6yo",
    foundationSlug: "coral-guardian",
    foundationName: "Coral Guardian",
    foundationSharePct: 80,
  },
  // ...
];
```

### Query Strategy

Current approach queries NFTs held by a specific wallet. For a marketplace, a better query is by contract address — returns all tokens in a collection regardless of current holder:

```graphql
{
  fa_by_pk(contract: "KT1...") {
    name
    tokens(limit: 20, offset: 0) {
      token_id
      name
      description
      thumbnail_uri
      artifact_uri
      royalties { amount shares { holder_address amount } }
    }
  }
}
```

### Next.js Migration Path

CRA is in maintenance mode. When ready to migrate:
1. `npx create-next-app@latest nemo-next --typescript --tailwind --app`
2. Copy components one by one — they're small and straightforward to port
3. Replace `useEffect` + `axios` data fetching with Next.js Server Components + `fetch`
4. Replace `react-router-dom` with Next.js file-based routing

---

## 11. Dev Setup

```bash
# Install dependencies
npm install

# Start dev server
npm start
# → http://localhost:3000
```

### Environment Variables

Create `.env.local`:
```
REACT_APP_OBJKT_GRAPHQL=https://data.objkt.com/v3/graphql
```

### Scripts

| Command | Description |
|---|---|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm test` | Run tests |

---

*Built for the reefs.*

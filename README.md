# README

## Lyhyt kuvaus tuotearvostelu sivustosta

Moderni, tuotantovalmis web-sovellus, joka tarjoaa valmiin kehitysympäristön Next.js + TypeScript -tuotearvosteluprojektille.

## Asennus

Varmista, että sinulla on **Bun** asennettuna.

```bash
npm bun install -g
```

Projektin riippuvuuksien asentaminen (projektin juurihakemistossa):

```bash
bun install
```

## Tietokanta

Tietokanta on paikallinen sekä MongoDB:ssä. Lisää MongoDB yhdistysmerkkijono .env tiedostoon. Luo se mikäli sitä ei jo ole.

## Komennot

Kehityspalvelimen käynnistys:

```bash
bun run dev
```

Tuotantoversion buildaus:

```bash
bun run build
```

Tuotantopalvelimen käynnistys:

```bash
bun start
```

Sovellus on oletuksena käytettävissä osoitteessa:

```
http://localhost:3000
```


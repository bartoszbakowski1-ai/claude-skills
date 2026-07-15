---
name: audyt-anti-ai
description: Uruchom, gdy chcesz ocenić, czy strona wygląda jak wygenerowana przez AI ("AI-look", "AI-slop"). Wywołuj na hasła "audyt anti-ai", "sprawdź czy strona wygląda jak AI", "przeanalizuj stronę pod AI-look", "oceń tę stronę", "czy ta strona pachnie AI", albo gdy wklejasz URL żywej strony lub wskazujesz lokalny projekt/plik do oceny wyglądu. Audytor (nie budowniczy): ogląda RENDER strony przez przeglądarkę (Playwright MCP) albo grepuje lokalny kod, liczy flagi po 6 obszarach (typografia, layout, kolor, zdjęcia, copy, ruch), zwraca werdykt po ludzku - score 0-1 czysto / 2-3 lekki AI-slop / 4+ ciężki - top flagi z cytatem i priorytetową listę poprawek. Zaprojektowany do odpalenia NA ŻYWO podczas live jako bonus. Samowystarczalny (pełna checklista w pliku). NIC nie wysyła na zewnątrz i niczego nie deployuje.
---

# Skill: audyt-anti-ai

Jesteś krytykiem-designerem z okiem praktyka. Bierzesz jedną stronę i mówisz wprost, czy wygląda jak zaprojektowana, czy jak wypluta przez v0 / Lovable / Bolt / Claude. Robisz to na podstawie realnych sygnałów (render albo kod), nie na wyczucie. Werdykt ma być KONKRETNY: score, top flagi z cytatem "co znalazłem", i lista poprawek od najważniejszej.

Ten skill to AUDYTOR, nie budowniczy. Nie przepisujesz strony. Diagnozujesz i dajesz recepty. Naprawy zostawiasz skillom `design` / `zbuduj-strone` / `sprawdz-kod`.

Kontekst użycia: często odpalasz to NA ŻYWO podczas live jako bonus - wrzucasz URL i na oczach widzów rozbierasz stronę na części. Dlatego werdykt ma być czytelny na głos, ciepły, bez żargonu, po polsku, naturalnie. Najpierw jedno zdanie werdyktu, potem detale.

Fundament merytoryczny: skondensowany ruleset anti-AI-look (15 tellów, ZAKAZANE/NAKAZANE, scoring, premium craft). Esencja - 6 obszarów, telle i progi scoringu - jest w tym pliku niżej i jest samowystarczalna.

## ROBI / NIE ROBI

ROBI:
- przyjmuje URL żywej strony ALBO lokalny projekt/plik z kodem
- dla URL: ogląda render przez przeglądarkę (Playwright MCP) i wyciąga realne sygnały (fonty, kolory, liczba zdjęć, gradienty, wycentrowanie, badge CAPSem, gradient-text, tracking nagłówków)
- dla kodu: grepuje klasy i wzorce zdradzające AI-look
- liczy flagi po 6 obszarach i wystawia score 0-1 / 2-3 / 4+
- każda flaga = konkretny cytat z tego co znalazł + dlaczego to tell AI + jak naprawić
- zwraca werdykt "po ludzku" gotowy do czytania na żywo + priorytetową listę poprawek

NIE ROBI:
- nie przepisuje strony ani nie buduje sekcji (to `design` / `zbuduj-strone`)
- nie deployuje, nie pushuje, nic nie wysyła na zewnątrz
- nie zmienia kodu Bartka (chyba że osobno o to poprosi - wtedy to już inny skill)
- nie ocenia SEO/bezpieczeństwa (to `sprawdz-kod` / `bezpieczenstwo`)

## Zasady prowadzenia

- Po polsku, polskie znaki z ogonkami zawsze (ą ć ę ł ń ó ś ź ż). Zero długich myślników (em-dash ani en-dash), tylko krótki "-".
- Ton ciepły i konkretny, jak w rozmowie. Werdykt najpierw jednym zdaniem, potem rozwinięcie. Nadaje się do czytania na głos.
- Cytuj to, co realnie znalazłeś (nazwa klasy, wartość computed style, fragment copy) - nie "gdzieś jest gradient", tylko "hero ma `from-violet-500 to-blue-500`".
- Nie zgaduj. Jak czegoś nie dało się zmierzyć (np. dynamiczna strona nie doładowała), powiedz to wprost i oceniaj tylko to, co widać.
- Nie naprawiaj w tym skillu. Dajesz receptę, wykonanie to inny skill. Wyjątek: użytkownik wprost mówi "to napraw".

## Wejście - rozpoznaj tryb

Na starcie ustal, co audytujesz. Maks 1 pytanie, jeśli niejasne.

- **URL** (zaczyna się od http, albo mówisz "ta strona", "wklejam link") -> TRYB RENDER (sekcja A). To domyślny tryb na live.
- **Lokalny projekt/plik** (ścieżka, "mój projekt", "ten folder", jest `package.json`) -> TRYB KOD (sekcja B).
- Jak masz jedno i drugie (lokalny projekt, który da się odpalić) - render bije kod. Najlepiej audytuj to, co widzi użytkownik. Jak nie ma jak odpalić lokalnie, grepuj kod.

---

## TRYB A - audyt RENDER (żywy URL, przeglądarka)

To główny tryb na live. Oglądasz to, co widzi odwiedzający, i mierzysz sygnały skryptem.

### A1. Otwórz stronę
Użyj Playwright MCP:
1. `mcp__plugin_playwright_playwright__browser_navigate` -> URL.
2. Daj stronie chwilę (jeśli SPA/animacje wchodzą - `browser_wait_for` albo krótka pauza), żeby doładowała hero i sekcje.
3. `mcp__plugin_playwright_playwright__browser_take_screenshot` (full page jeśli się da) - to Twoje "oko". Obejrzyj: pierwsze wrażenie, hero, paleta, czy są realne zdjęcia czy same ikony, czy wszystko wycentrowane, czy jest fioletowy gradient. Zapisz pierwsze wrażenie jednym zdaniem PRZED liczbami.

### A2. Zbierz twarde sygnały skryptem
Wstrzyknij zbieracz przez `mcp__plugin_playwright_playwright__browser_evaluate`. Jako parametr `function` podaj CAŁĄ funkcję z pliku `audit-snippet.js` w katalogu tego skilla (od `() => {` do zamykającego `}`). Skrypt czyta DOM i computed styles i zwraca JSON z sygnałami - nic nie wysyła.

Skrypt zwraca m.in.:
- `fonts` - font nagłówka vs body, czy to ten sam (brak pairingu), czy nagłówek to domyślny tell (Inter/Geist/Roboto).
- `color` - tło body, próbka koloru akcentu, liczba gradientów, ile z nich fioletowo-niebieskich, ile węzłów gradient-text.
- `images` - liczba realnych zdjęć (`realMediaTotal`) vs ikony/svg.
- `typography` - ile nagłówków z ciasnym trackingiem, ile bez `text-balance`, ile badge'y CAPSem.
- `layout` - odsetek wycentrowanych sekcji, wysokość hero w vh, liczba grup identycznych kart.
- `motion` - liczba animacji w pętli (pulse/bounce/spin/infinite).
- `copy` - liczba em-dashy, czy są liczby, trafienia buzzwordów, czy są polskie ogonki.

Jeśli `browser_evaluate` czegoś nie zmierzy (np. cross-origin, shadow DOM), dolicz to okiem ze screenshota i `browser_snapshot` (drzewo dostępności) - zaznacz w werdykcie, że to ocena wzrokowa, nie pomiar.

### A3. Uzupełnij okiem (screenshot + snapshot)
Skrypt liczy, ale niektóre telle ocenia się wzrokiem. Ze screenshota / `browser_snapshot` dooceń:
- Czy hero to sam wycentrowany tekst + przycisk na pustym/gradientowym tle (klasyczny hero AI-slop)?
- Czy zdjęcia są "plastikowe" (za gładka AI-ilustracja) mimo że skrypt policzył je jako realne media?
- Czy jest dark hero + neon glow + glassmorphism jako domyślna estetyka?
- Czy układ to dokładnie hero -> 3 karty -> testimoniale -> CTA gradient (domyślny szkielet)?
- Czy jest choć jeden element-sygnatura, czy strona jest wymienna z każdą inną?

Przejdź do sekcji WSPÓLNEJ (liczenie flag).

---

## TRYB B - audyt KODU (lokalny projekt/plik)

Gdy nie ma żywego URL albo wskazujesz repo. Grepujesz wzorce zdradzające AI-look. Czytaj tylko pliki widoku (`src/**`, `app/**`, `components/**`, `globals.css`), nie całe drzewo - oszczędzasz tokeny.

Odpal z katalogu projektu (dostosuj glob do struktury - `src`, `app`, albo root):

```bash
# 1. Typografia: ciasny tracking, brak text-balance, eyebrow CAPSem
rg -n "tracking-tight(er)?" src app 2>/dev/null
rg -n "uppercase[^\"']*tracking-(wide|wider|widest)|tracking-(wide|wider|widest)[^\"']*uppercase" src app 2>/dev/null
rg -c "text-balance|text-wrap:\s*balance" src app 2>/dev/null

# 2. Kolor: fioletowo-niebieskie gradienty + gradient text
rg -n "from-(violet|purple|indigo|fuchsia)|to-(blue|indigo|violet|purple)|via-(violet|purple|indigo)|#8b5cf6|#7c3aed|#6d28d9|#a855f7|#6366f1|#4f46e5" src app 2>/dev/null
rg -n "bg-clip-text[^\"']*text-transparent|text-transparent[^\"']*bg-clip-text|-webkit-background-clip:\s*text" src app 2>/dev/null

# 3. Zdjęcia vs ikony: policz realne <Image>/<img>/next-image i ikony
rg -no "<(Image|img)\b|next/image" src app 2>/dev/null | wc -l
rg -no "lucide-react|<svg|@heroicons" src app 2>/dev/null | wc -l

# 4. Layout: identyczne karty (map po jednym komponencie w gridzie), wszystko wycentrowane
rg -n "grid-cols-(3|4|6)" src app 2>/dev/null
rg -n "text-center[^\"']*mx-auto|mx-auto[^\"']*text-center" src app 2>/dev/null

# 5. Ruch w pętli + zły import motion
rg -n "animate-(pulse|bounce|ping|spin)" src app 2>/dev/null
rg -n "from ['\"]framer-motion['\"]" src app 2>/dev/null

# 6. Copy: em-dash (długi myślnik / en-dash), buzzwordy, brak ogonków
rg -n "[—–]" src app 2>/dev/null
rg -ni "elevate|unlock|unleash|supercharge|empower|seamless|revolutioniz|all-in-one|game-chang|next-level|cutting-edge|build the future" src app 2>/dev/null
rg -c "[ąćęłńóśźż]" --glob 'src/**/*.{tsx,ts,jsx,mdx}' src app 2>/dev/null | head
```

Interpretacja jak w rulesetcie:
- Trafienie em-dash / gradient violet->blue / gradient-text / `tracking-tight` na nagłówku = flaga (cytuj plik:linia).
- `text-balance` bliskie zeru na polskiej wielosekcyjnej stronie = flaga (typografia).
- Ikony (svg/lucide) mocno przewyższają realne obrazy, a `<Image>` jest 0-2 = flaga zdjęć.
- `grid-cols-3` z `.map()` po jednym komponencie + jeden wspólny `hover:` = flaga identycznych kart (zajrzyj do komponentu, potwierdź).
- Zero polskich ogonków w widocznej treści na polskiej stronie = flaga copy (jak w `sprawdz-kod`).

Przejdź do sekcji WSPÓLNEJ.

---

## SEKCJA WSPÓLNA - liczenie flag (6 obszarów)

Każdy obszar może dać flagi. Flaga = konkretny, potwierdzony sygnał AI-look. Notuj do każdej: (1) CO znalazłeś - cytat/wartość, (2) DLACZEGO to tell AI, (3) JAK naprawić - jedno zdanie recepty.

**1. Typografia**
- `tracking-tight`/`tracking-tighter` albo ujemny letter-spacing na nagłówkach 24px+ (Claude tak domyślnie generuje).
- Nagłówki bez `text-balance` (łamią się brzydko przy wolnym miejscu).
- Eyebrow/badge CAPSem nad nagłówkiem (`uppercase tracking-widest text-xs`).
- Ten sam font na nagłówki i body (brak pairingu), albo nagłówek na domyślnym Inter/Geist.

**2. Layout**
- Hero to sam wycentrowany tekst + przycisk na pustym/gradientowym tle, niski (poniżej ~70vh), bez realnego wizualu.
- Grupy identycznych kart w gridzie (3/4/6) z tym samym hover.
- Dominujące `text-center mx-auto` (wysoki `centeredRatio`), zero asymetrii i oddechu.
- Domyślny szkielet hero -> 3 features -> testimoniale -> CTA gradient bez własnej sekcji.

**3. Kolor**
- Fioletowo-niebieski gradient (violet->blue, purple->indigo, cyan->violet, pink->orange) - "VibeCode Purple".
- Gradient text na nagłówku (`bg-clip-text text-transparent`).
- Kolor marki zalewający tło większości sekcji zamiast neutralnego jasnego tła (akcent ma być ~10%, nie tło).

**4. Zdjęcia**
- Mało realnych mediów: `realMediaTotal` 0-2 = flaga blokująca, 3-4 = minimum, 5+ = OK na dłuższej stronie.
- Ikony Lucide w kółku przy każdej sekcji jako jedyny wizual. Emoji jako ikony UI.
- Plastikowe AI-ilustracje zamiast prawdziwych fotografii osoby/pracy/efektu.

**5. Copy**
- Em-dash / en-dash w tekście (`emDashCount` > 0) - najsilniejszy tell tekstu AI.
- Buzzwordy (Elevate/Unlock/Supercharge/all-in-one/seamless...).
- Zero konkretnych liczb/nazw/dat (`hasDigits` false) - copy pasuje do dowolnej branży.
- Na polskiej stronie: brak ogonków w widocznej treści (polski ASCII: "wiecej", "uslugi", "sie").

**6. Ruch**
- Ruch w pętli: `animate-pulse`/`animate-bounce`/`spin`, floating blob, animowany gradient tła (`loopingAnimations` > 0).
- Strona całkowicie martwa (zero reveal przy scrollu) - drugi biegun, też czyta się jak szablon.
- Import z `framer-motion` zamiast `motion/react` (tylko tryb kodu).

### Zliczanie i score

Policz WSZYSTKIE flagi z 6 obszarów. Próg wg rulesetu (za Krebsem):

- **0-1 flaga = CZYSTO.** Strona nie krzyczy AI. Pochwal to, co dobre.
- **2-3 flagi = LEKKI AI-SLOP.** Da się to naprawić w kilka ruchów. Wskaż które.
- **4+ flag = CIĘŻKI AI-SLOP.** Strona wygląda jak domyślny output. Trzeba przerobić sekcje, nie łatać.

Flaga blokująca (kolor marki jako tło całej strony, 0-2 realnych zdjęć) waży podwójnie w Twoim komentarzu, nawet jeśli w zliczaniu to jedna flaga - powiedz wprost, że to najpilniejsze.

Opcjonalnie (jak jest czas / na życzenie): mini-test PREMIUM CRAFT z rulesetu sekcja 5 - policz, ile z 8 pozytywnych elementów (warstwa ruchu, kontrast skali typografii, głębia, edytorialna asymetria, stany hover, element-sygnatura, realne media, konkret w treści) strona ma świadomie. 0-2 = szablon bez charakteru, 3-5 = wygląda jak marka, 6-8 = poziom agencji. To odpowiedź na "brak AI-tellów to nie to samo co dobry design".

---

## WERDYKT - format wyjścia (czytasz to na żywo)

Zbuduj odpowiedź dokładnie w tej kolejności. Ma się dobrze czytać na głos.

```
WERDYKT: [jedno zdanie po ludzku, np. "Strona pachnie AI - fioletowy gradient,
zero prawdziwych zdjęć i wszystko wycentrowane. Lekki slop, do ogarnięcia."]

SCORE: X flag -> [CZYSTO / LEKKI AI-SLOP / CIĘŻKI AI-SLOP]

CO KRZYCZY "AI" (top flagi, od najmocniejszej):
1. [Obszar] - znalazłem: "[konkret/cytat]". To tell, bo [1 zdanie]. Fix: [1 zdanie].
2. [Obszar] - znalazłem: "[...]". Tell, bo [...]. Fix: [...].
3. [...]
(tyle ile realnie jest, top 3-5)

CO JEST DOBRZE (jeśli jest):
- [1-2 rzeczy, które strona robi dobrze - nie tylko krytyka]

POPRAWKI OD NAJWAŻNIEJSZEJ:
1. [najpilniejsza, zwykle flaga blokująca]
2. [...]
3. [...]

[Jak trzeba: "Chcesz, żebym to naprawił skillem design/zbuduj-strone?" - ale
tego skilla to NIE robi sam.]
```

Zasady werdyktu:
- Zawsze najpierw jedno zdanie, potem detale - żeby na live było od razu wiadomo, o co chodzi.
- Cytuj realne znaleziska, nie ogólniki. "Hero: `from-violet-600 to-indigo-600`" bije "są gradienty".
- Daj też to, co dobre - audyt bez pochwały brzmi jak hejt, a strona zwykle ma coś na plus.
- Poprawki priorytetyzuj: flaga blokująca (tło/zdjęcia) i hero idą na górę, kosmetyka (jeden badge CAPSem) na dół.
- Zamknij max 3 "Next actions", np. "napraw hero", "dorzuć 3 realne zdjęcia", "zabij fioletowy gradient".

## Odpalenie na żywo (przykład)

Na live piszesz po prostu:

```
/audyt-anti-ai https://przyklad-strony.pl
```

albo w rozmowie: "sprawdź czy ta strona wygląda jak AI: https://...". Wtedy: otwórz w przeglądarce -> screenshot (oko) -> wstrzyknij `audit-snippet.js` (pomiar) -> policz flagi -> przeczytaj werdykt. Całość ma trwać krótko i skończyć się jednym zdaniem plus 3 poprawkami, żeby dało się "pogadać z wynikiem" na antenie.

Dla lokalnego projektu: "zaudytuj mój projekt pod AI-look" albo `/audyt-anti-ai .` z katalogu -> tryb KOD.

## Uwagi

- Ten skill jest samowystarczalny: pełna checklista, progi scoringu i format werdyktu są w tym pliku. Naprawy (nie audyt) zostaw osobnym skillom budującym stronę.
- Skill jest READ-ONLY wobec cudzej strony: czyta, mierzy, ocenia. Nie modyfikuje, nie wysyła, nie zapisuje danych strony nigdzie na zewnątrz.

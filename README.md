# Bokeh.is

Bokeh.is er faglegt vefforrit hannað fyrir kvikmyndagerðarfólk og ljósmyndara. Forritið inniheldur nákvæma gagnamagnsreiknivél fyrir atvinnuvélar og sjónrænan Bokeh-hermi sem sýnir fram á dýptarskerðingu og linsuþjöppun (e. lens compression) í rauntíma.

## Helstu eiginleikar

### Gagnamagnsreiknivél
* **Ljósmyndir:** Áætlar fjölda RAW mynda sem komast á minniskort út frá lágmarks- og hámarksstærðum RAW skráa valinnar myndavélar.
* **Vídeó:** Reiknar út nákvæman upptökutíma byggt á gagnahraða (MB/s), upplausn, rammafjölda og þjöppun (styður m.a. BRAW, ProRes, XAVC, CinemaDNG og ARRIRAW).
* **Blandað (Bæði):** Reiknar út tiltækt geymslupláss fyrir vídeó að frádregnum áætluðum fjölda RAW ljósmynda.
* **Tími í GB:** Reiknar út nauðsynlegt geymslupláss (GB) fyrir tiltekinn upptökutíma miðað við valinn gagnahraða.

### Bokeh Hermir
* Tekur mið af stærð myndflögu (crop factor) hverrar myndavélar og skalar útkomuna í samræmi við það.
* Takmarkar valmöguleika ljósops við raunverulega getu hverrar linsu.
* Styður breytilega brennivídd fyrir aðdráttarlinsur (zoom linsur).
* Reiknar dýptarskerðingu og óskerpu nákvæmlega út frá brennivídd, ljósopi og fjarlægð.
* Líkir eftir linsuþjöppun (lens compression) með því að kvarða forgrunn og bakgrunn á dýnamískan hátt út frá fjarlægð og aðdrætti.

## Tækniupplýsingar

* **Framendi:** Next.js (App Router), React 19, TypeScript
* **Bakendi & Gagnagrunnur:** Supabase (PostgreSQL)
* **Viðmót og Stílar:** SCSS (Sérsniðið "Glassmorphism" útlit með CSS hreyfimyndum)
* **Hýsing:** Netlify

## Uppsetning og keyrsla (Local Development)

1. Sækja verkefnið og setja upp pakka:
```bash
git clone <slóð-á-repo>
cd bokeh.is
npm install

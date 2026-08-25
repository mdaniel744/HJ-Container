import { resolveCompliance } from "@/lib/compliance";

const UPDATED = "24. august 2026";

// These reviewed storefront copies override the legacy Base44 text at render
// time. The Base44 records still provide slugs, publication state and ordering.
const POLICY_OVERRIDES = {
  handelsbetingelser: {
    body_da: `Senest opdateret: ${UPDATED}
## 1. Sælger og kontaktoplysninger
HJ Container ApS, CVR 16217670, EUID DKCVR.16217670, Endelavevej 8A, 8700 Horsens, Danmark. E-mail: contact@hjcontainer.com.
## 2. Anvendelse
Disse handelsbetingelser gælder for køb på hjcontainer.com. Vi sælger til både forbrugere og erhvervskunder, men regler, der udtrykkeligt gælder for forbrugere, gælder ikke for erhvervskøb. Vi leverer kun til adresser i Danmark.
## 3. Produkter og stand
Produktets type, størrelse, højde, stand, farve, pris og tilgængelighed fremgår af produktsiden og den valgte variant. Brugte containere kan have almindelige brugs- og aldersspor, herunder buler, ridser, overfladerust, reparationer og farvevariationer. Sådanne oplyste og forventelige forhold er ikke i sig selv en mangel.
## 4. Priser
Priser vises i DKK og er inklusive 25 % moms, medmindre andet tydeligt er angivet. Fragt og eventuel aflæsning lægges særskilt til og vises i kassen, før en direkte ordre afgives. Ved forhold, som ikke kan beregnes sikkert, kan varen kun bestilles via et individuelt tilbud.
## 5. Bestilling og aftale
Når du trykker på “Afgiv ordre”, afgiver du en bindende bestilling på de viste varer, fragt, aflæsning og totalpris. En automatisk modtagelseskvittering er ikke en bekræftelse på, at ordren kan gennemføres. Vi kontrollerer lager, leveringsadresse og sikker adgang og sender derefter ordrebekræftelse eller kontakter dig, hvis ordren ikke kan gennemføres som bestilt.
Et tilbud er ikke bindende, før det er accepteret efter de vilkår og inden den frist, der står i tilbuddet.
## 6. Betaling
Betaling sker med faktura eller bankoverførsel. Betalingsoplysninger og den gældende betalingsfrist står i ordrebekræftelsen og fakturaen. Levering sker først, når den aftalte betalingsbetingelse er opfyldt. Se også Betalingsbetingelser.
## 7. Levering og aflæsning
Leveringsprisen beregnes ud fra dansk postnummer, containerstørrelse, antal og aflæsningsmetode. Adgangsforhold og underlag kan medføre, at der kræves et individuelt tilbud. Kunden skal give korrekte oplysninger og sikre lovlig, fri og bæredygtig adgang for det aftalte køretøj. Se Levering og fragt.
## 8. Fortrydelsesret for forbrugere
Ved fjernsalg har forbrugere som udgangspunkt 14 dages fortrydelsesret fra den dag, containeren modtages. Undtagelsen for varer fremstillet efter kundens specifikationer eller med tydeligt personligt præg bruges kun, når containeren faktisk er individuelt fremstillet eller ændret på denne måde. Se Fortrydelsesret og Returnering og tilbagebetaling.
## 9. Reklamation
Forbrugere har 2 års reklamationsret efter købelovens regler. En berettiget reklamation behandles uden omkostninger for forbrugeren. Se Reklamation og garanti.
## 10. Erhvervskøb
Erhvervskunder har ikke lovbestemt fortrydelsesret. Returnering, undersøgelsespligt, reklamationsfrist og øvrige afvigelser gælder kun, hvis de fremgår af det konkrete tilbud eller en særskilt skriftlig aftale.
## 11. Lovvalg og tvister
Køb er underlagt dansk ret. En forbruger kan bruge den danske klageadgang, der er beskrevet under Klageadgang og tvistløsning.`,
    body_en: `Last updated: 24 August 2026
## 1. Seller and contact details
HJ Container ApS, CVR 16217670, EUID DKCVR.16217670, Endelavevej 8A, 8700 Horsens, Denmark. Email: contact@hjcontainer.com.
## 2. Scope
These terms apply to purchases on hjcontainer.com. We sell to consumers and businesses, but provisions expressly stated for consumers do not apply to business purchases. We deliver only to addresses in Denmark.
## 3. Products and condition
The product page and selected variant state the type, size, height, condition, colour, price and availability. Used containers may have ordinary signs of age and use, including dents, scratches, surface rust, repairs and colour variation. Disclosed and reasonably expected wear is not in itself a defect.
## 4. Prices
Prices are in DKK and include 25% VAT unless clearly stated otherwise. Shipping and unloading are added separately and shown in checkout before a direct order is placed. Where a reliable price cannot be calculated, the product can only be ordered through an individual quotation.
## 5. Orders and contract
By pressing “Place Order”, you place a binding order for the displayed products, shipping, unloading and total price. An automated receipt is not confirmation that the order can be fulfilled. We check stock, the delivery address and safe access, then send an order confirmation or contact you if the order cannot be fulfilled as placed.
A quotation is not binding until accepted under the terms and within the validity period stated in it.
## 6. Payment
Payment is by invoice or bank transfer. Payment details and the applicable deadline are stated in the order confirmation and invoice. Delivery takes place only after the agreed payment condition has been met. See Payment terms.
## 7. Delivery and unloading
The delivery price is based on the Danish postcode, container size, quantity and unloading method. Site access and ground conditions may require an individual quotation. The customer must provide accurate information and ensure lawful, clear and load-bearing access for the agreed vehicle. See Shipping and delivery.
## 8. Consumer withdrawal
For distance sales, consumers generally have a 14-day right of withdrawal from the day the container is received. The exception for goods made to the customer's specifications or clearly personalised is used only where the container has actually been individually made or altered in that way. See Right of withdrawal and Returns and refunds.
## 9. Consumer complaints
Consumers have a two-year statutory right to complain under Danish law. A justified complaint is handled without cost to the consumer. See Complaints and warranty.
## 10. Business purchases
Business customers have no statutory right of withdrawal. Returns, inspection duties, complaint periods and other variations apply only if stated in the specific quotation or a separate written agreement.
## 11. Law and disputes
Purchases are governed by Danish law. Consumers can use the Danish complaints route described under Complaints and dispute resolution.`,
  },
  betalingsbetingelser: {
    body_da: `Senest opdateret: ${UPDATED}
## Betalingsmetoder
HJ Container ApS modtager betaling via faktura eller bankoverførsel. Der opkræves ikke et særskilt betalingsgebyr for disse metoder.
## Betalingsoplysninger og frist
Efter ordregennemgangen modtager kunden en ordrebekræftelse eller faktura med kontooplysninger, betalingsreference og den gældende betalingsfrist. Betal kun til den konto, der står i dokumentet fra HJ Container ApS.
## Hvornår leveringen planlægges
Levering gennemføres først, når betalingen er registreret, eller når en anden skriftlig betalingsaftale udtrykkeligt fremgår af ordrebekræftelsen. Den aftalte leveringsplan bekræftes skriftligt.
## Manglende eller forsinket betaling
Hvis betaling ikke sker rettidigt, kan ordren sættes i bero. Eventuelle renter og rykkergebyrer kan kun opkræves efter gældende dansk ret og den skriftlige aftale.
## Tilbagebetaling
Tilbagebetaling sker som udgangspunkt med samme betalingsmiddel som ved købet, medmindre kunden udtrykkeligt accepterer andet uden gebyr. For forbrugeres fortrydelsesret gælder de særlige frister under Fortrydelsesret.`,
    body_en: `Last updated: 24 August 2026
## Payment methods
HJ Container ApS accepts invoice and bank transfer payments. No separate payment fee is charged for these methods.
## Payment details and deadline
After order review, the customer receives an order confirmation or invoice stating the bank details, payment reference and applicable deadline. Pay only to the account stated in a document from HJ Container ApS.
## Delivery planning
Delivery takes place only after payment has been registered, unless a different written payment arrangement is expressly stated in the order confirmation. The agreed delivery plan is confirmed in writing.
## Late or missing payment
If payment is not made on time, the order may be put on hold. Interest and reminder fees may be charged only under applicable Danish law and the written agreement.
## Refunds
Refunds are normally made using the same payment method as the purchase unless the customer expressly agrees otherwise without a fee. The special deadlines under Right of withdrawal apply to consumer withdrawals.`,
  },
  "levering-og-fragt": {
    body_da: `Senest opdateret: ${UPDATED}
## Leveringsområde
HJ Container ApS leverer kun til adresser i Danmark. Leveringslandet er fastlåst til Danmark i webshoppen og tilbudsformularen.
## Sådan beregnes fragten
Ved en direkte ordre beregnes transporten ud fra leveringspostnummer, containerstørrelse og antal. Den aktuelle beregningsmodel bruger følgende grundsatser pr. container før størrelsestillæg: Midtjylland 2.200 DKK, Syddanmark 2.900 DKK, Nordjylland 3.200 DKK samt Sjælland og Bornholm 4.200 DKK. Grundsatsen ganges med 1,00 for 10 fod, 1,15 for 20 fod og 1,60 for 40 fod og derefter med antallet.
Beløbene, som vises i kassen til en forbruger, er inklusive moms. Den beregnede transportpris og eventuel aflæsning vises særskilt før den bindende ordre.
## Aflæsning
Kranbil koster aktuelt 1.500 DKK pr. container. Hvis kunden stiller egnet kran eller truck til rådighed, eller hvis aflæsning ikke er nødvendig, beregnes der ikke et aflæsningsbeløb. Valget “Usikker” kræver et individuelt tilbud.
## Hvornår kræves et tilbud
Der kræves manuel transportplanlægning ved tre eller flere containere, postnumre uden fast sats, begrænset lastbiladgang, ikke-bærende eller ujævnt underlag, usikker aflæsning eller andre særlige placeringsforhold. Tilbudsforespørgslen er ikke en ordre, og den endelige pris skal accepteres skriftligt.
## Kundens ansvar på leveringsstedet
Kunden skal oplyse korrekt adresse og adgangsforhold. Der skal være lovlig og fri adgang for en fuldstørrelse lastbil, tilstrækkelig frihøjde og et plant, bæredygtigt underlag. Kunden skal oplyse om smalle veje, luftledninger, hegn, bygninger og andre hindringer. Forgæves kørsel eller ekstraarbejde som følge af urigtige eller ufuldstændige oplysninger kan faktureres, hvis omkostningen er aftalt eller følger af gældende ret.
## Leveringstid
Den konkrete leveringsdag aftales og bekræftes skriftligt efter kontrol af lager, betaling og transportforhold.
## Modtagelse og transportskade
Kunden bør kontrollere containeren ved modtagelsen og notere synlig transportskade på fragtbrevet. Send hurtigst muligt ordrenummer, beskrivelse og billeder til contact@hjcontainer.com. Dette begrænser ikke en forbrugers lovbestemte reklamationsret.`,
    body_en: `Last updated: 24 August 2026
## Delivery area
HJ Container ApS delivers only to addresses in Denmark. The delivery country is fixed to Denmark in the shop and quotation form.
## How shipping is calculated
For a direct order, transport is calculated from the delivery postcode, container size and quantity. The current model uses these base rates per container before the size multiplier: Central Denmark DKK 2,200, Southern Denmark DKK 2,900, Northern Denmark DKK 3,200, and Zealand and Bornholm DKK 4,200. The base rate is multiplied by 1.00 for 10ft, 1.15 for 20ft and 1.60 for 40ft, then by quantity.
Amounts shown to consumers in checkout include VAT. The calculated transport and any unloading charge are shown separately before the binding order.
## Unloading
Crane-truck unloading currently costs DKK 1,500 per container. No unloading amount is calculated where the customer provides suitable crane or forklift equipment or unloading is not required. Selecting “Unsure” requires an individual quotation.
## When a quotation is required
Manual transport planning is required for three or more containers, postcodes without a fixed rate, restricted truck access, unsuitable ground, uncertain unloading or other special placement conditions. A quotation request is not an order and the final price must be accepted in writing.
## Customer responsibilities at the delivery site
The customer must provide an accurate address and access details. There must be lawful, clear access for a full-size truck, sufficient overhead clearance and level, load-bearing ground. Narrow roads, overhead cables, fences, buildings and other obstacles must be disclosed. A wasted journey or extra work caused by incorrect or incomplete information may be invoiced where agreed or permitted by applicable law.
## Delivery time
The specific delivery day is agreed and confirmed in writing after stock, payment and transport conditions have been checked.
## Receipt and transport damage
The customer should inspect the container on receipt and record visible transport damage on the delivery note. Send the order number, description and photographs to contact@hjcontainer.com as soon as possible. This does not limit a consumer's statutory complaint rights.`,
  },
  "returnering-og-tilbagebetaling": {
    body_da: `Senest opdateret: ${UPDATED}
## Forbrugere
Ved fjernsalg har en forbruger som udgangspunkt 14 dages fortrydelsesret fra den dag, containeren modtages. Meddelelsen om fortrydelse skal sendes inden fristen til contact@hjcontainer.com eller til HJ Container ApS, Endelavevej 8A, 8700 Horsens. Standardfortrydelsesformularen kan bruges, men er ikke obligatorisk.
## Returnering af en container
En container kan ikke returneres med almindelig post. Kontakt os før transport bestilles, så afhentning, adgang og sikker håndtering kan aftales. Medmindre vi skriftligt aftaler andet, er returadressen HJ Container ApS, Endelavevej 8A, 8700 Horsens, Danmark. Containeren skal sendes eller afleveres uden unødig forsinkelse og senest 14 dage efter meddelelsen om fortrydelse.
## Returomkostninger
Ved almindelig fortrydelse betaler forbrugeren de direkte udgifter til returtransport. Prisen afhænger blandt andet af containerstørrelse, afstand, adgang og den nødvendige kran- eller løfteløsning. Kontakt os, før transport bestilles. Ved en berettiget reklamation betaler HJ Container ApS de nødvendige transportomkostninger.
## Varens stand og værdiforringelse
Forbrugeren hæfter kun for en værdiforringelse, der skyldes anden håndtering end den, der er nødvendig for at fastslå containerens art, egenskaber og funktion. En container må ikke ændres, ombygges, males, beskadiges eller tages i egentlig brug ud over denne undersøgelse, hvis fuld tilbagebetaling forventes.
## Tilbagebetaling
Ved gyldig fortrydelse tilbagebetaler vi alle modtagne beløb, herunder udgiften til den billigste standardlevering, uden unødig forsinkelse og senest 14 dage efter, at vi modtog meddelelsen. Ekstra levering valgt af kunden ud over billigste standardlevering tilbagebetales ikke. Vi kan tilbageholde tilbagebetalingen, indtil containeren er modtaget retur, eller forbrugeren har fremlagt dokumentation for returneringen, alt efter hvad der sker først. Tilbagebetaling sker med samme betalingsmiddel, medmindre andet udtrykkeligt aftales uden gebyr.
## Individuelt fremstillede varer
Fortrydelsesretten bortfalder kun for en container, der faktisk er fremstillet efter forbrugerens specifikationer eller har fået et tydeligt personligt præg. Valg mellem almindelige lagerførte varianter som størrelse, standardhøjde eller High Cube, stand og standardfarve er ikke automatisk en sådan undtagelse.
## Erhvervskunder
Erhvervskøb har ingen lovbestemt fortrydelsesret. En erhvervsreturnering kræver en forudgående skriftlig aftale.`,
    body_en: `Last updated: 24 August 2026
## Consumers
For distance sales, a consumer generally has a 14-day right of withdrawal from the day the container is received. Notice must be sent within the period to contact@hjcontainer.com or HJ Container ApS, Endelavevej 8A, 8700 Horsens. The model withdrawal form may be used but is not mandatory.
## Returning a container
A container cannot be returned by ordinary post. Contact us before arranging transport so collection, access and safe handling can be agreed. Unless otherwise agreed in writing, the return address is HJ Container ApS, Endelavevej 8A, 8700 Horsens, Denmark. The container must be sent or delivered without undue delay and no later than 14 days after notice of withdrawal.
## Return costs
For an ordinary withdrawal, the consumer pays the direct return-transport cost. The price depends on container size, distance, access and the required crane or lifting solution. Contact us before arranging transport. For a justified complaint, HJ Container ApS pays the necessary transport costs.
## Condition and diminished value
The consumer is liable only for diminished value caused by handling beyond what is necessary to establish the container's nature, characteristics and functioning. A container must not be altered, converted, painted, damaged or put into actual use beyond that examination if a full refund is expected.
## Refund
Following a valid withdrawal, we refund all sums received, including the least expensive standard delivery, without undue delay and no later than 14 days after receiving the notice. Additional delivery selected by the customer above the least expensive standard delivery is not refunded. We may withhold the refund until the container is returned or the consumer supplies evidence of return, whichever occurs first. The refund uses the same payment method unless another method is expressly agreed without a fee.
## Custom-made goods
The withdrawal right is excluded only for a container actually made to the consumer's specifications or given a clearly personal character. Selecting between ordinary stocked variants such as size, standard height or High Cube, condition and standard colour is not automatically such an exception.
## Business customers
Business purchases have no statutory right of withdrawal. A business return requires a prior written agreement.`,
  },
  fortrydelsesret: {
    body_da: `Senest opdateret: ${UPDATED}
## Fortrydelsesfrist
Som forbruger har du ved fjernsalg som udgangspunkt ret til at fortryde købet uden begrundelse inden 14 dage. Fristen løber fra den dag, hvor du eller en af dig udpeget tredjemand, dog ikke transportøren, får containeren i fysisk besiddelse. Ved flere varer i samme ordre, som leveres hver for sig, løber fristen fra modtagelsen af den sidste vare.
## Sådan fortryder du
Send inden fristens udløb en utvetydig meddelelse til contact@hjcontainer.com eller HJ Container ApS, Endelavevej 8A, 8700 Horsens, om at du vil fortryde. Du kan bruge vores standardfortrydelsesformular, men det er ikke et krav. Gem dokumentation for, at meddelelsen er sendt rettidigt.
## Returnering
En container kan ikke sendes med almindelig post. Kontakt os før transport bestilles. Du skal som udgangspunkt sende eller aflevere containeren til HJ Container ApS, Endelavevej 8A, 8700 Horsens, Danmark, uden unødig forsinkelse og senest 14 dage efter, at du meddelte fortrydelsen, medmindre vi skriftligt aftaler afhentning eller en anden returadresse.
## Udgift til returtransport
Du betaler den direkte udgift til returtransport ved almindelig fortrydelse. Prisen afhænger blandt andet af containerstørrelse, afstand, adgang og den nødvendige kran- eller løfteløsning. Kontakt os, før transport bestilles. Ved en berettiget reklamation gælder dette ikke; se Reklamation og garanti.
## Tilbagebetaling
Vi tilbagebetaler alle beløb modtaget fra dig, herunder udgiften til den billigste standardlevering, uden unødig forsinkelse og senest 14 dage efter modtagelsen af din meddelelse. Vi kan tilbageholde beløbet, indtil containeren er modtaget retur, eller du har dokumenteret returneringen, alt efter hvad der sker først. Tilbagebetalingen sker med samme betalingsmiddel, medmindre du udtrykkeligt accepterer andet uden gebyr.
## Værdiforringelse
Du hæfter kun for en værdiforringelse, der skyldes håndtering ud over det, der er nødvendigt for at fastslå containerens art, egenskaber og funktion.
## Undtagelse for reelt individuelt fremstillede varer
Der er ikke fortrydelsesret for en container, der faktisk er fremstillet efter dine specifikationer eller har fået et tydeligt personligt præg. Valg af en almindelig lagerført variant er ikke i sig selv nok til at bruge undtagelsen.
## Erhvervskøb
Den lovbestemte fortrydelsesret gælder kun for forbrugere og ikke for erhvervskøb.`,
    body_en: `Last updated: 24 August 2026
## Withdrawal period
For distance sales, consumers generally have the right to withdraw without giving a reason within 14 days. The period runs from the day you or a third party nominated by you, other than the carrier, takes physical possession of the container. For goods in one order delivered separately, it runs from receipt of the last item.
## How to withdraw
Before the period expires, send an unambiguous statement to contact@hjcontainer.com or HJ Container ApS, Endelavevej 8A, 8700 Horsens, stating that you withdraw. You may use our model withdrawal form, but this is not mandatory. Keep evidence that the notice was sent on time.
## Return
A container cannot be returned by ordinary post. Contact us before arranging transport. Unless we agree collection or another return address in writing, send or deliver the container to HJ Container ApS, Endelavevej 8A, 8700 Horsens, Denmark, without undue delay and no later than 14 days after giving notice.
## Return-transport cost
You pay the direct return-transport cost for an ordinary withdrawal. The price depends on container size, distance, access and the required crane or lifting solution. Contact us before arranging transport. This does not apply to a justified complaint; see Complaints and warranty.
## Refund
We refund all amounts received from you, including the least expensive standard delivery, without undue delay and no later than 14 days after receiving your notice. We may withhold the refund until the container is returned or you provide evidence of return, whichever occurs first. The refund uses the same payment method unless you expressly agree otherwise without a fee.
## Diminished value
You are liable only for diminished value caused by handling beyond what is necessary to establish the container's nature, characteristics and functioning.
## Exception for genuinely custom-made goods
There is no withdrawal right for a container actually made to your specifications or given a clearly personal character. Selecting an ordinary stocked variant is not sufficient on its own to use this exception.
## Business purchases
The statutory withdrawal right applies only to consumers, not business purchases.`,
  },
  "reklamation-og-garanti": {
    body_da: `Senest opdateret: ${UPDATED}
## 2 års reklamationsret for forbrugere
Når du handler som forbruger, har du 2 års reklamationsret efter købelovens regler. Reklamationsretten dækker mangler, der var til stede ved levering, selv om de først viser sig senere.
## Brugte containere
En brugt containers alder, pris, produktbeskrivelse og oplyste stand indgår i vurderingen. Almindelige og oplyste brugsspor som mindre buler, ridser, overfladerust, tidligere reparationer og farvevariationer er ikke automatisk en mangel. En konkret afvigelse fra det aftalte eller manglende normal funktion kan derimod være en mangel.
## Sådan reklamerer du
Skriv til contact@hjcontainer.com med ordrenummer, kontaktoplysninger, en præcis beskrivelse og tydelige billeder. Reklamer inden rimelig tid efter, at manglen blev opdaget. For forbrugere er en reklamation inden 2 måneder efter opdagelsen altid rettidig.
Bestil ikke returtransport eller reparation på vores regning, før vi har haft mulighed for at vurdere sagen og aftale sikker håndtering.
## Afhjælpning
Ved en berettiget reklamation har forbrugeren efter omstændighederne ret til afhjælpning, omlevering, et passende afslag eller ophævelse. HJ Container ApS kan normalt tilbyde afhjælpning eller omlevering først, når det kan ske gratis, inden rimelig tid og uden væsentlig ulempe. Vi betaler de nødvendige og rimelige transportomkostninger ved en berettiget reklamation.
## Returnering ved reklamation
Returadresse og transportform aftales skriftligt for den konkrete container. Udgangspunktet er HJ Container ApS, Endelavevej 8A, 8700 Horsens, men tung transport må ikke iværksættes uden aftale.
## Garanti
En eventuel frivillig garanti gælder kun, hvis den er givet udtrykkeligt og skriftligt. Den begrænser aldrig en forbrugers lovbestemte reklamationsret.
## Erhvervskunder
For erhvervskøb gælder den reklamationsfrist og de beføjelser, der står i det konkrete tilbud eller en særskilt skriftlig aftale.`,
    body_en: `Last updated: 24 August 2026
## Two-year consumer complaint right
Consumers have a two-year statutory right to complain under Danish sales law. It covers defects present at delivery, even if they become apparent later.
## Used containers
The age, price, product description and disclosed condition of a used container form part of the assessment. Ordinary and disclosed wear such as minor dents, scratches, surface rust, earlier repairs and colour variation is not automatically a defect. A specific departure from what was agreed or lack of normal function may be a defect.
## How to complain
Email contact@hjcontainer.com with the order number, contact details, a precise description and clear photographs. Complain within a reasonable time after discovering the defect. For consumers, a complaint within two months after discovery is always timely.
Do not arrange return transport or repair at our cost before we have had an opportunity to assess the matter and agree safe handling.
## Remedies
For a justified complaint, the consumer may, depending on the circumstances, be entitled to repair, replacement, an appropriate price reduction or cancellation. HJ Container ApS may normally offer repair or replacement first where this is free, completed within a reasonable time and without significant inconvenience. We pay necessary and reasonable transport costs for a justified complaint.
## Return following a complaint
The return address and transport method are agreed in writing for the specific container. The starting point is HJ Container ApS, Endelavevej 8A, 8700 Horsens, but heavy transport must not be started without agreement.
## Warranty
Any voluntary warranty applies only if expressly given in writing. It never limits a consumer's statutory complaint rights.
## Business customers
For business purchases, the complaint period and remedies stated in the specific quotation or a separate written agreement apply.`,
  },
  "klageadgang-og-tvistloesning": {
    body_da: `Senest opdateret: ${UPDATED}
## Kontakt os først
Hvis du vil klage over et køb, skal du først skrive til contact@hjcontainer.com med ordrenummer, beskrivelse og den løsning, du ønsker. Vi forsøger at finde en løsning direkte med dig.
## Dansk forbrugerklage
Hvis du er forbruger, og vi ikke finder en løsning, kan du indgive klage til Mæglingsteamet for Forbrugerklager via Nævnenes Hus' klageportal på naevneneshus.dk. Nævnenes Hus har adressen Toldboden 2, 8800 Viborg. Portalen oplyser de aktuelle betingelser, beløbsgrænser og gebyrer.
Hvis mæglingen ikke løser sagen, vil du som udgangspunkt kunne få mulighed for at gå videre til Forbrugerklagenævnet efter de gældende regler.
## Domstole og lovvalg
Du kan også indbringe en tvist for de danske domstole. Dansk ret gælder med respekt for ufravigelige forbrugerregler.`,
    body_en: `Last updated: 24 August 2026
## Contact us first
To complain about a purchase, first email contact@hjcontainer.com with the order number, a description and the remedy you seek. We will try to resolve the matter directly with you.
## Danish consumer complaint route
If you are a consumer and we do not reach a solution, you can submit a complaint to the Mediation Team for Consumer Complaints through the Nævnenes Hus complaint portal at naevneneshus.dk. Nævnenes Hus is located at Toldboden 2, 8800 Viborg. The portal states the current conditions, value thresholds and fees.
If mediation does not resolve the case, you will generally have the option to proceed to the Danish Consumer Complaints Board under the applicable rules.
## Courts and governing law
You may also bring a dispute before the Danish courts. Danish law applies, subject to mandatory consumer protections.`,
  },
};

const formatDkk = (amount) => new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 }).format(amount);
const formatRange = ([min, max], lang) => min === max
  ? `${min} ${lang === "en" ? "business days" : "hverdage"}`
  : `${min}–${max} ${lang === "en" ? "business days" : "hverdage"}`;

function appendApprovedCommercialValues(policy, settings) {
  const resolved = resolveCompliance(settings);
  let body_da = policy.body_da;
  let body_en = policy.body_en;

  if (policy.slug_da === "levering-og-fragt" && resolved.handlingTime && resolved.transitTime) {
    body_da += `\n## Normalt tidsestimat\nNormal håndtering er ${formatRange(resolved.handlingTime, "da")}, og normal transport efter afsendelse er ${formatRange(resolved.transitTime, "da")}. Den konkrete leveringsdag bekræftes skriftligt.`;
    body_en += `\n## Normal time estimate\nNormal handling is ${formatRange(resolved.handlingTime, "en")}, and normal transit after dispatch is ${formatRange(resolved.transitTime, "en")}. The specific delivery day is confirmed in writing.`;
  }

  if (["returnering-og-tilbagebetaling", "fortrydelsesret"].includes(policy.slug_da) && resolved.returnTransportMaxDkk) {
    body_da += `\n## Maksimumestimat for returtransport\nDen direkte returtransport for én container anslås til højst ${formatDkk(resolved.returnTransportMaxDkk)} DKK inklusive moms ved almindelige danske adgangsforhold. Den konkrete pris kan være lavere og aftales før transporten bestilles.`;
    body_en += `\n## Maximum return-transport estimate\nDirect return transport for one container is estimated at no more than DKK ${formatDkk(resolved.returnTransportMaxDkk)} including VAT under ordinary Danish access conditions. The actual price may be lower and is agreed before transport is arranged.`;
  }

  if (["betalingsbetingelser", "handelsbetingelser"].includes(policy.slug_da) && resolved.paymentDeadlineDays) {
    body_da += `\n## Fast betalingsfrist\nBetalingsfristen er ${resolved.paymentDeadlineDays} kalenderdage fra fakturadatoen, medmindre en anden frist udtrykkeligt står i ordrebekræftelsen.`;
    body_en += `\n## Standard payment deadline\nThe payment deadline is ${resolved.paymentDeadlineDays} calendar days from the invoice date unless another deadline is expressly stated in the order confirmation.`;
  }

  return { ...policy, body_da, body_en };
}

export function applyPolicyOverride(policy, settings = {}) {
  if (!policy) return policy;
  const override = POLICY_OVERRIDES[policy.slug_da];
  const merged = override ? { ...policy, ...override, compliance_managed: true } : policy;
  return appendApprovedCommercialValues(merged, settings);
}

export function applyPolicyOverrides(policies = [], settings = {}) {
  return policies.map((policy) => applyPolicyOverride(policy, settings));
}

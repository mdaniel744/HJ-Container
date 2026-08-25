export function applyFaqOverride(faq) {
  if (!faq) return faq;
  const question = `${faq.question_da || ""} ${faq.question_en || ""}`.toLowerCase();

  if (faq.category === "sizes" && /(hvilke|what).*(størrelse|size)/.test(question)) {
    return {
      ...faq,
      answer_da: "Vi tilbyder Standard- og High Cube-containere i 10, 20 og 40 fod. Open Side tilbydes i 20 og 40 fod, ikke i 10 fod. Den enkelte produktside viser kun gyldige varianter for den valgte størrelse.",
      answer_en: "We offer Standard and High Cube containers in 10ft, 20ft and 40ft. Open Side is offered in 20ft and 40ft, not 10ft. Each product page shows only valid variants for the selected size.",
    };
  }

  if (faq.category === "returns" && /(return|retur|fortryd)/.test(question)) {
    return {
      ...faq,
      answer_da: "Forbrugere har som udgangspunkt 14 dages fortrydelsesret ved fjernsalg. Kontakt os før tung returtransport bestilles. Den fulde proces, returadresse, frister og regler om tilbagebetaling står under Fortrydelsesret og Returnering og tilbagebetaling.",
      answer_en: "Consumers generally have a 14-day right of withdrawal for distance sales. Contact us before arranging heavy return transport. The full process, return address, deadlines and refund rules are set out under Right of withdrawal and Returns and refunds.",
    };
  }

  return faq;
}

export function applyFaqOverrides(faqs = []) {
  return faqs.map(applyFaqOverride);
}


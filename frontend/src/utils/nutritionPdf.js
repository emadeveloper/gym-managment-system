function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildNutritionLines({ user, nutritionData }) {
  const lines = [];
  const dailyMacros = nutritionData.dailyMacros || {};

  lines.push('LA RESISTENCIA - PLAN NUTRICIONAL');
  lines.push('');
  lines.push(`Cliente: ${user?.name || nutritionData.user?.name || 'Usuario'}`);
  lines.push(`Objetivo: ${nutritionData.user?.goal || 'Sin objetivo definido'}`);
  lines.push(`Fecha de creacion: ${nutritionData.createdDate || 'Sin fecha'}`);
  lines.push(`Proxima revision: ${nutritionData.nextReview || 'Pendiente'}`);
  lines.push('');
  lines.push('MACROS DIARIOS');
  lines.push(`Calorias: ${dailyMacros.calories || 0} kcal`);
  lines.push(`Proteina: ${dailyMacros.protein || 0} g`);
  lines.push(`Carbohidratos: ${dailyMacros.carbs || 0} g`);
  lines.push(`Grasas: ${dailyMacros.fat || 0} g`);
  lines.push('');

  (nutritionData.meals || []).forEach((meal) => {
    lines.push(`${meal.name} - ${meal.time}`);
    meal.items.forEach((item) => {
      lines.push(
        `- ${item.name}: ${item.portion} | ${item.calories} kcal | P ${item.protein}g | C ${item.carbs}g | G ${item.fat}g`,
      );
    });
    lines.push('');
  });

  if (nutritionData.tips?.length) {
    lines.push('RECOMENDACIONES');
    nutritionData.tips.forEach((tip) => lines.push(`- ${tip}`));
    lines.push('');
  }

  if (nutritionData.restrictions?.length) {
    lines.push('RESTRICCIONES');
    nutritionData.restrictions.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  }

  if (nutritionData.supplements?.length) {
    lines.push('SUPLEMENTOS');
    nutritionData.supplements.forEach((item) => lines.push(`- ${item}`));
  }

  return lines;
}

function buildPdf(pages) {
  const pageCount = pages.length;
  const fontId = 3 + pageCount * 2;
  const objects = new Array(fontId);

  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  const pageRefs = [];

  for (let index = 0; index < pageCount; index += 1) {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    pageRefs.push(`${pageId} 0 R`);

    const commands = [
      'BT',
      '/F1 11 Tf',
      '40 790 Td',
      '14 TL',
      ...pages[index].map((line, lineIndex) =>
        lineIndex === 0
          ? `(${escapePdfText(line)}) Tj`
          : `T* (${escapePdfText(line)}) Tj`,
      ),
      'ET',
    ].join('\n');

    objects[pageId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId - 1] =
      `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`;
  }

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageCount} >>`;
  objects[fontId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((objectContent, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objectContent}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

export function downloadNutritionPdf({ user, nutritionData }) {
  const lines = buildNutritionLines({ user, nutritionData });
  const maxLinesPerPage = 46;
  const pages = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  const pdfContent = buildPdf(pages);
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `plan-nutricional-${user?.name || 'usuario'}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

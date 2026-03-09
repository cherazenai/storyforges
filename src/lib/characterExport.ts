import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

// The 12 structured character fields in display order
const CHARACTER_FIELDS = [
  "Name", "Title / Alias", "Race", "Role", "World Setting",
  "Personality", "Backstory", "Abilities / Powers", "Goal / Motivation",
  "Secret", "Weakness", "Character Arc Potential",
];

function getCharacterName(result: Record<string, string>): string {
  const name = result["Name"] || Object.values(result)[0] || "character";
  return name.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
}

function getOrderedEntries(result: Record<string, string>): [string, string][] {
  return CHARACTER_FIELDS
    .filter((key) => key in result)
    .map((key) => [key, result[key]] as [string, string])
    .concat(Object.entries(result).filter(([key]) => !CHARACTER_FIELDS.includes(key)));
}

// ─── PDF EXPORT ───────────────────────────────────────────────

export function exportCharacterPDF(result: Record<string, string>) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Title bar
  doc.setFillColor(20, 25, 35);
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setFillColor(56, 130, 161); // frost accent line
  doc.rect(0, 50, pageWidth, 1.5, "F");

  // Character name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(220, 230, 240);
  const charName = result["Name"] || "Unknown Character";
  doc.text(charName, margin, y + 8);

  // Subtitle
  const alias = result["Title / Alias"] || "";
  const role = result["Role"] || "";
  const subtitle = [alias, role].filter(Boolean).join(" — ");
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(140, 160, 180);
    doc.text(subtitle, margin, y + 18);
  }

  y = 60;

  // Content sections
  const entries = getOrderedEntries(result);
  for (const [key, value] of entries) {
    if (key === "Name") continue; // already in header

    checkPageBreak(25);

    // Section heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(56, 130, 161);
    doc.text(key.toUpperCase(), margin, y);
    y += 1;

    // Accent line under heading
    doc.setDrawColor(56, 130, 161);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 40, y);
    y += 5;

    // Section content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 65, 75);
    const lines = doc.splitTextToSize(value, contentWidth);
    for (const line of lines) {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 6;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 170, 180);
    doc.text(
      `StoryForge Character Sheet — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  const filename = `${getCharacterName(result)}-character-sheet.pdf`;
  doc.save(filename);
}

// ─── EXCEL EXPORT ─────────────────────────────────────────────

export function exportCharacterExcel(result: Record<string, string>) {
  const entries = getOrderedEntries(result);
  const data = entries.map(([key, value]) => ({ Field: key, Content: value }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 22 }, // Field column
    { wch: 80 }, // Content column
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Character Profile");

  const filename = `${getCharacterName(result)}-profile.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ─── WORD EXPORT ──────────────────────────────────────────────

export async function exportCharacterWord(result: Record<string, string>) {
  const entries = getOrderedEntries(result);
  const charName = result["Name"] || "Unknown Character";
  const alias = result["Title / Alias"] || "";
  const role = result["Role"] || "";
  const subtitle = [alias, role].filter(Boolean).join(" — ");

  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: charName,
          bold: true,
          size: 48,
          color: "1a1f2b",
          font: "Calibri",
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
    })
  );

  // Subtitle
  if (subtitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            italics: true,
            size: 24,
            color: "6b7280",
            font: "Calibri",
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // Divider
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "3882a1" },
      },
      spacing: { after: 300 },
    })
  );

  // Sections
  for (const [key, value] of entries) {
    if (key === "Name") continue;

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: key,
            bold: true,
            size: 24,
            color: "3882a1",
            font: "Calibri",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 80 },
      })
    );

    // Split by newlines for abilities lists etc.
    const lines = value.split("\n").filter(Boolean);
    for (const line of lines) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22,
              color: "374151",
              font: "Calibri",
            }),
          ],
          spacing: { after: 60 },
        })
      );
    }
  }

  // Footer
  children.push(
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "d1d5db" },
      },
      spacing: { before: 400, after: 100 },
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Generated by StoryForge",
          italics: true,
          size: 18,
          color: "9ca3af",
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${getCharacterName(result)}-profile.docx`;
  saveAs(blob, filename);
}

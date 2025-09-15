// src/utils/htmlToDocx.ts
import { Paragraph, TextRun, HeadingLevel, UnderlineType } from 'docx';

// Función auxiliar para convertir HTML de Quill a elementos docx
export function parseHtmlToDocxElements(htmlContent: string): Paragraph[] {
    console.log('Parsing HTML to DOCX elements', htmlContent);
  const elements: Paragraph[] = [];
  
  if (!htmlContent || htmlContent.trim() === '' || htmlContent === '<p><br></p>') {
    elements.push(new Paragraph({ children: [new TextRun('')] }));
    return elements;
  }

  // Crear un DOM temporal y buscar bloques en todo el árbol (p, headings, listas)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const blocks = Array.from(
    tempDiv.querySelectorAll('p, h1, h2, h3, ul, ol')
  ) as HTMLElement[];

  if (blocks.length === 0) {
    // Fallback: tratar como texto plano sin formato
    const plainText = tempDiv.textContent?.trim();
    if (plainText) {
      elements.push(new Paragraph({ children: [new TextRun({ text: plainText, size: 24 })] }));
    } else {
      elements.push(new Paragraph({ children: [new TextRun('')] }));
    }
    return elements;
  }

  for (const block of blocks) {
    const tag = block.tagName.toLowerCase();
    switch (tag) {
      case 'p':
        elements.push(createParagraphFromElement(block));
        break;
      case 'h1':
        elements.push(createHeadingFromElement(block, HeadingLevel.HEADING_1));
        break;
      case 'h2':
        elements.push(createHeadingFromElement(block, HeadingLevel.HEADING_2));
        break;
      case 'h3':
        elements.push(createHeadingFromElement(block, HeadingLevel.HEADING_3));
        break;
      case 'ul':
      case 'ol': {
        const isOrdered = tag === 'ol';
        const items = Array.from(block.querySelectorAll(':scope > li')) as HTMLElement[];
        for (let i = 0; i < items.length; i++) {
          const li = items[i];
          const runs = [] as TextRun[];
          const bullet = isOrdered ? `${i + 1}. ` : '• ';
          runs.push(new TextRun({ text: bullet }));

          // Conservar formato dentro del <li>
          if (li.childNodes.length) {
            Array.from(li.childNodes).forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const t = node.textContent || '';
                if (t.trim()) runs.push(new TextRun({ text: t, size: 24 }));
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                runs.push(...createTextRunsFromElement(node as HTMLElement));
              }
            });
          } else {
            const text = li.textContent || '';
            if (text.trim()) runs.push(new TextRun({ text, size: 24 }));
          }

          elements.push(new Paragraph({ children: runs }));
        }
        break;
      }
      default:
        // Otros contenedores: intentar extraer párrafos internos
        const innerParagraphs = block.querySelectorAll('p');
        if (innerParagraphs.length) {
          innerParagraphs.forEach((p) => elements.push(createParagraphFromElement(p as HTMLElement)));
        } else {
          const text = block.textContent || '';
          if (text.trim()) {
            elements.push(new Paragraph({ children: [new TextRun({ text, size: 24 })] }));
          }
        }
        break;
    }
  }

  return elements.length ? elements : [new Paragraph({ children: [new TextRun('')] })];
}

function createParagraphFromElement(element: HTMLElement): Paragraph {
  if (!element.textContent?.trim() || element.innerHTML === '<br>') {
    return new Paragraph({ children: [new TextRun({ text: '', size: 24 })] });
  }

  const alignment = getParagraphAlignment(element);

  // Reemplazar recorrido manual por uno recursivo que hereda estilos
  const runs = buildRuns(element, { size: 24 });
  if (runs.length === 0) runs.push(new TextRun({ text: '', size: 24 }));

  return new Paragraph({ alignment, children: runs });
}

// Tipos auxiliares para evitar any
type HighlightName = 'none' | 'black' | 'blue' | 'cyan' | 'darkBlue' | 'darkCyan' | 'darkGray' | 'darkGreen' | 'darkMagenta' | 'darkRed' | 'darkYellow' | 'green' | 'lightGray' | 'magenta' | 'red' | 'white' | 'yellow';

type ExtractedStyles = {
  size: number;
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  highlight?: HighlightName;
};

function toRunOptions(text: string, styles: ExtractedStyles) {
  return {
    text,
    ...(styles.size ? { size: Math.round(styles.size) } : {}),
    ...(styles.bold ? { bold: true } : {}),
    ...(styles.italics ? { italics: true } : {}),
    ...(styles.underline ? { underline: { type: UnderlineType.SINGLE } } : {}),
    ...(styles.strike ? { strike: true } : {}),
    ...(styles.color ? { color: styles.color } : {}),
    ...(styles.highlight ? { highlight: styles.highlight } : {}),
  };
}

// Construye TextRuns recursivamente heredando estilos
function buildRuns(node: Node, inherited: ExtractedStyles): TextRun[] {
  const runs: TextRun[] = [];

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text.trim()) {
      runs.push(new TextRun(toRunOptions(text, inherited)));
    }
    return runs;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const merged: ExtractedStyles = { ...inherited, ...extractTextStyles(el) };

    if (el.childNodes.length === 0) {
      const text = el.textContent || '';
      if (text.trim()) {
        runs.push(new TextRun(toRunOptions(text, merged)));
      }
      return runs;
    }

    Array.from(el.childNodes).forEach((child) => {
      runs.push(...buildRuns(child, merged));
    });
  }

  return runs;
}

// Wrapper de compatibilidad usado en listas y otros lugares
function createTextRunsFromElement(element: HTMLElement): TextRun[] {
  return buildRuns(element, { size: 24 });
}

function extractTextStyles(element: HTMLElement): ExtractedStyles {
  const styles: ExtractedStyles = { size: 24 };

  const css = element.style;
  const classes = Array.from(element.classList);

  console.log('Extracting styles from element:', element.tagName, 'style:', element.getAttribute('style'), 'classes:', classes);

  // Bold / Italic por tags o estilos
  if (['STRONG', 'B'].includes(element.tagName) || css.fontWeight === 'bold' || css.fontWeight === '700' || classes.includes('ql-bold')) {
    styles.bold = true;
    console.log('Applied bold style');
  }
  if (['EM', 'I'].includes(element.tagName) || css.fontStyle === 'italic' || classes.includes('ql-italic')) {
    styles.italics = true;
    console.log('Applied italic style');
  }

  // Underline / Strike
  if (element.tagName === 'U' || css.textDecoration?.includes('underline') || classes.includes('ql-underline')) {
    styles.underline = true;
    console.log('Applied underline style');
  }
  if (['S', 'STRIKE'].includes(element.tagName) || css.textDecoration?.includes('line-through') || classes.includes('ql-strike')) {
    styles.strike = true;
    console.log('Applied strike style');
  }

  // Color del texto (inline style o clase ql-color-*)
  if (css.color) {
    const color = parseColor(css.color);
    if (color) {
      styles.color = color;
      console.log('Applied color from CSS:', css.color, '-> hex:', color);
    }
  } else {
    const colorClass = classes.find((c) => c.startsWith('ql-color-'));
    if (colorClass) {
      const name = colorClass.replace('ql-color-', '');
      const named = namedToHex(name);
      if (named) {
        styles.color = named;
        console.log('Applied color from class:', colorClass, '-> hex:', named);
      }
    }
  }

  // Tamaño (inline font-size o clase ql-size-*)
  if (css.fontSize) {
    const fontSize = parseFontSize(css.fontSize);
    if (fontSize) {
      styles.size = fontSize;
      console.log('Applied font size from CSS:', css.fontSize, '-> half-points:', fontSize);
    }
  } else {
    if (classes.includes('ql-size-small')) styles.size = 20; // 10pt
    if (classes.includes('ql-size-large')) styles.size = 36; // 18pt
    if (classes.includes('ql-size-huge')) styles.size = 64;  // 32pt
  }

  // Highlight (inline background-color o clase ql-background-*)
  if (css.backgroundColor) {
    const bg = parseColor(css.backgroundColor);
    if (bg && bg !== 'FFFFFF') {
      const h = mapToHighlightColor(bg);
      if (h) {
        styles.highlight = h;
        console.log('Applied highlight from CSS:', css.backgroundColor, '-> color:', h);
      }
    }
  } else {
    const bgClass = classes.find((c) => c.startsWith('ql-background-'));
    if (bgClass) {
      const name = bgClass.replace('ql-background-', '');
      const hex = namedToHex(name);
      const h = hex && mapToHighlightColor(hex);
      if (h) {
        styles.highlight = h;
        console.log('Applied highlight from class:', bgClass, '-> color:', h);
      }
    }
  }

  console.log('Final extracted styles:', styles);
  return styles;
}

function getParagraphAlignment(element: HTMLElement): 'left' | 'center' | 'right' | 'both' {
  const css = element.style;
  const classes = element.classList;
  if (css.textAlign === 'center' || classes.contains('ql-align-center')) return 'center';
  if (css.textAlign === 'right' || classes.contains('ql-align-right')) return 'right';
  if (css.textAlign === 'justify' || classes.contains('ql-align-justify')) return 'both';
  return 'left';
}

function mapToHighlightColor(hexColor: string): HighlightName | null {
  const colorMap: { [key: string]: HighlightName } = {
    'FFFF00': 'yellow',
    'FF0000': 'red',
    '00FF00': 'green',
    '0000FF': 'blue',
    '00FFFF': 'cyan',
    'FF00FF': 'magenta',
    '000000': 'black',
    'FFFFFF': 'white',
    '808080': 'lightGray',
    '404040': 'darkGray',
    '008000': 'darkGreen',
    '000080': 'darkBlue',
    '800080': 'darkMagenta',
    '800000': 'darkRed',
    '008080': 'darkCyan',
    'FFFF80': 'darkYellow',
  };
  return colorMap[hexColor] || null;
}

function parseColor(colorString: string): string | null {
  if (!colorString) return null;
  if (colorString.startsWith('rgb')) {
    const m = colorString.match(/\d+/g);
    if (m && m.length >= 3) {
      const r = parseInt(m[0]);
      const g = parseInt(m[1]);
      const b = parseInt(m[2]);
      return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
    }
  }
  if (colorString.startsWith('#')) return colorString.substring(1).toUpperCase();
  return namedToHex(colorString);
}

function namedToHex(name?: string | null): string | null {
  if (!name) return null;
  const map: Record<string, string> = {
    black: '000000', white: 'FFFFFF', red: 'FF0000', green: '008000', blue: '0000FF',
    yellow: 'FFFF00', orange: 'FFA500', purple: '800080', pink: 'FFC0CB', gray: '808080', grey: '808080',
  };
  return map[name.toLowerCase()] || null;
}

function parseFontSize(fontSizeString: string): number | null {
  if (!fontSizeString) return null;
  const matches = fontSizeString.match(/^(\d+(?:\.\d+)?)(px|pt|em|rem|%)?$/);
  if (!matches) return null;
  const value = parseFloat(matches[1]);
  const unit = matches[2] || 'px';
  switch (unit) {
    case 'pt':
      return value * 2;
    case 'px':
      return value * 1.5; // 1px ≈ 0.75pt; en half-points: *2 -> 1.5
    case 'em':
    case 'rem':
      return (value * 24) / 1; // 1em ~ 12pt -> 24 half-points
    default:
      return value * 1.5;
  }
}

function createHeadingFromElement(element: HTMLElement, level: typeof HeadingLevel.HEADING_1 | typeof HeadingLevel.HEADING_2 | typeof HeadingLevel.HEADING_3): Paragraph {
  const runs = buildRuns(element, { size: 32, bold: true });
  return new Paragraph({
    heading: level,
    children: runs.length ? runs : [new TextRun({ text: element.textContent || 'Documento vacío', bold: true, size: 32 })],
  });
}

const useLoadFonts = () => {
  useEffect(() => {
    const fontElements = document.querySelectorAll("[class*='font-']");
    const fonts = new Map();

    fontElements.forEach(element => {
      element.classList.forEach(cls => {
        if (cls.startsWith('font-')) {
          const [fontNamePart, weightPart] = cls.replace('font-', '').split(/-(\d+)?$/);
          const fontName = fontNamePart.replace(/-/g, ' ');
          const fontWeight = weightPart ? weightPart : '400';

          if (!fonts.has(fontName)) {
            fonts.set(fontName, new Set());
          }
          fonts.get(fontName).add(fontWeight);
        }
      });
    });

    if (fonts.size > 0) {
      const style = document.createElement('style');
      const maxFontsPerImport = 4;
      const fontImportBase = 'https://fonts.googleapis.com/css2?';
      let fontImportParts = [];
      let currentImport = [];

      fonts.forEach((weights, fontName) => {
        if (currentImport.length >= maxFontsPerImport) {
          fontImportParts.push(currentImport);
          currentImport = [];
        }
        currentImport.push(`family=${fontName.replace(/ /g, '+')}`);
      });

      if (currentImport.length > 0) {
        fontImportParts.push(currentImport);
      }

      let fontCss = '';

      fontImportParts.forEach(importGroup => {
        const fontImport = fontImportBase + importGroup.join('&') + '&display=swap';
        style.textContent += `@import url("${fontImport}");\n`;
      });

      fonts.forEach((weights, fontName) => {
        weights.forEach(weight => {
          const className = 'font-' + fontName.replace(/ /g, '-');
          if (weight === '400') {
            fontCss += `.${className} { font-family: '${fontName}'; font-weight: 400; }\n`;
          } else {
            fontCss += `.${className}-${weight} { font-family: '${fontName}'; font-weight: ${weight}; }\n`;
          }
        });
      });

      style.textContent += fontCss;
      document.head.appendChild(style);
    }
  }, []);
};

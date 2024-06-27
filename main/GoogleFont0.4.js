document.addEventListener("DOMContentLoaded", () => {
    const fontElements = document.querySelectorAll("[class*='gfont-']");
    const fonts = new Map();

    fontElements.forEach(element => {
        element.classList.forEach(cls => {
            if (cls.startsWith('gfont-')) {
                const parts = cls.replace('gfont-', '').split('-');
                const fontWeight = parts.pop() || '400';
                const fontName = parts.join(' ').replace(/-/g, ' ');

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
            const weightsParam = `:wght@${Array.from(weights).join(';')}`;
            const familyParam = `family=${fontName.replace(/ /g, '+')}${weightsParam}`;
            currentImport.push(familyParam);

            if (currentImport.length >= maxFontsPerImport) {
                fontImportParts.push(currentImport);
                currentImport = [];
            }
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
            const baseClassName = 'gfont-' + fontName.replace(/ /g, '-');
            weights.forEach(weight => {
                if (weight === '400') {
                    fontCss += `.${baseClassName} { font-family: '${fontName}'; font-weight: 400; }\n`;
                } else {
                    fontCss += `.${baseClassName}-${weight} { font-family: '${fontName}'; font-weight: ${weight}; }\n`;
                }
            });
        });

        style.textContent += fontCss;
        document.head.appendChild(style);
    }
});

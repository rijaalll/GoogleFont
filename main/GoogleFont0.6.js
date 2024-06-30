document.addEventListener("DOMContentLoaded", () => {
            const fontElements = document.querySelectorAll("[class*='font-']");
            const fonts = new Set();

            fontElements.forEach(element => {
                element.classList.forEach(cls => {
                    if (cls.startsWith('font-')) {
                        const fontName = cls.replace('font-', '').replace(/-/g, ' ');
                        fonts.add(fontName);
                    }
                });
            });

            if (fonts.size > 0) {
                const style = document.createElement('style');
                const maxFontsPerImport = 4;
                const fontImportBase = 'https://fonts.googleapis.com/css2?';
                let fontImportParts = [];
                let currentImport = [];

                fonts.forEach(fontName => {
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

                fonts.forEach(fontName => {
                    const className = 'font-' + fontName.replace(/ /g, '-');
                    fontCss += `.${className} { font-family: '${fontName}'; }\n`;
                });

                style.textContent += fontCss;
                document.head.appendChild(style);
            }
        });

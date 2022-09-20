import { highlight, languages } from "prismjs";
import { FC } from "react";
import { CodeWithReplacements } from "../../notion-utils/src";

export const Code: FC<{
  code: string;
  language: string;
  replacements?: CodeWithReplacements["replacements"];
}> = ({ code, language = "javascript", replacements }) => {
  const languageL = language.toLowerCase();
  const prismLanguage = languages[languageL] || languages.javascript;

  const hasReplacements = replacements && Object.keys(replacements).length;

  if (hasReplacements) {
    for (const [snippet, repl] of Object.entries(replacements)) {
      code = code.replace(snippet, repl);
    }
  } else {
    code = highlight(code, prismLanguage, language);
  }

  return (
    <pre
      className={`notion-code no-language-${languageL} language-${languageL}`}
    >
      <code
        className={`language-${languageL} language-${languageL}`}
        dangerouslySetInnerHTML={{
          __html: code
        }}
      />
    </pre>
  );
};

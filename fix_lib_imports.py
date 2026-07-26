import re

file_path = 'src/app/pages/admin/AdminLibrary.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { useConfirm }' not in content:
    content = content.replace("import { useLanguage } from '../../context/LanguageContext';", "import { useLanguage } from '../../context/LanguageContext';\nimport { useConfirm } from '../../hooks/useConfirm';")

if 'const { confirm: customConfirm, ConfirmDialog } = useConfirm();' not in content:
    content = content.replace("const { t, language } = useLanguage();", "const { t, language } = useLanguage();\n  const { confirm: customConfirm, ConfirmDialog } = useConfirm();")

if '<ConfirmDialog />' not in content:
    content = content.replace('return (\n    <div className="space-y-6">', 'return (\n    <div className="space-y-6">\n      <ConfirmDialog />', 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

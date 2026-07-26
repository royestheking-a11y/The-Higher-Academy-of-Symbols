import re

file_path = 'src/app/pages/AdminDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace confirm statements
# Example: if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteSupervisor(s.id); toast.success(t('تم الحذف', 'Deleted')); }
# Becomes: customConfirm('تأكيد الحذف', 'Confirm Delete', 'هل أنت متأكد أنك تريد الحذف؟', 'Are you sure you want to delete?', () => { deleteSupervisor(s.id); toast.success(t('تم الحذف', 'Deleted')); })

pattern = re.compile(r"if\s*\(\s*confirm\s*\(\s*t\s*\(\s*'[^']*'\s*,\s*'[^']*'\s*\)\s*\)\s*\)\s*\{\s*(.*?)\s*\}")
content = pattern.sub(r"customConfirm('تأكيد الحذف', 'Confirm Delete', 'هل أنت متأكد أنك تريد الحذف؟', 'Are you sure you want to delete?', () => { \1 })", content)

# Check if useConfirm is imported
if 'import { useConfirm }' not in content:
    content = content.replace("import { useLanguage } from '../context/LanguageContext';", "import { useLanguage } from '../context/LanguageContext';\nimport { useConfirm } from '../hooks/useConfirm';")

# Check if customConfirm is initialized
if 'const { confirm: customConfirm, ConfirmDialog } = useConfirm();' not in content:
    content = content.replace("const { t, language } = useLanguage();", "const { t, language } = useLanguage();\n  const { confirm: customConfirm, ConfirmDialog } = useConfirm();")

# Add <ConfirmDialog /> inside the main return wrapper
if '<ConfirmDialog />' not in content:
    content = content.replace("return (\n    <div className=", "return (\n    <div className=\n      <ConfirmDialog />\n", 1)
    if '<ConfirmDialog />' not in content:
        content = content.replace("return (\n    <div", "return (\n    <div\n      <ConfirmDialog />")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done fixing AdminDashboard.tsx confirms.")

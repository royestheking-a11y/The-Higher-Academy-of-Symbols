import re

for file_path in ['src/app/pages/admin/AdminBooks.tsx', 'src/app/pages/admin/AdminLibrary.tsx']:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if useConfirm is imported
    if 'import { useConfirm }' not in content:
        content = content.replace("import { useLanguage } from '../../context/LanguageContext';", "import { useLanguage } from '../../context/LanguageContext';\nimport { useConfirm } from '../../hooks/useConfirm';")

    # Check if customConfirm is initialized
    if 'const { confirm: customConfirm, ConfirmDialog } = useConfirm();' not in content:
        content = content.replace("const { t, language } = useLanguage();", "const { t, language } = useLanguage();\n  const { confirm: customConfirm, ConfirmDialog } = useConfirm();")

    # Replace window.confirm pattern
    # In AdminBooks: if (!window.confirm(t('هل أنت متأكد من حذف هذا الكتاب؟', 'Are you sure you want to delete this book?'))) return;
    # It's an early return. We need to wrap the whole delete logic!
    
    # Wait, the delete logic is:
    # const handleDelete = async (id: string) => {
    #   if (!window.confirm(t('...', '...'))) return;
    #   ... fetch DELETE ...
    # };
    
    # Let's use a regex to replace handleDelete entirely if it matches the structure.
    # Actually, simpler: replace the body of handleDelete.


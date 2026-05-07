// =============================================================================
// Standblatt Generator
// =============================================================================

// -----------------------------------------------------------------------------
// Generic helpers
// -----------------------------------------------------------------------------

const $  = (id) => document.getElementById(id);
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const triggerDownload = (filename, blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
};

// -----------------------------------------------------------------------------
// Translations
// -----------------------------------------------------------------------------

const TRANSLATIONS = {
    de: {
        'tab.participants':         'Teilnehmer',
        'tab.settings':             'Einstellungen',
        'btn.print':                'Drucken',
        'verb.print':               'drucken',
        'verb.download':            'herunterladen',
        'verb.copy':                'kopieren',
        'verb.delete':              'löschen',
        'count.all':                'Alle',
        'placeholder.filter':       'Suchen…',
        'btn.exportBackup':         'Anlass exportieren',
        'btn.importBackup':         'Anlass importieren',
        'btn.importCsv':            'CSV importieren',
        'msg.csvImported':          '{count} Teilnehmer importiert.',
        'msg.csvImportFailed':      'CSV-Datei konnte nicht gelesen werden.',
        'btn.removeLogo':           'Entfernen',
        'btn.clearAll':             'Alle Daten löschen',
        'confirm.clearAll':         'ACHTUNG: Damit werden alle Einstellungen, das Logo und sämtliche Teilnehmer unwiderruflich gelöscht. Fortfahren?',
        'col.lastName':             'Nachname',
        'col.firstName':            'Vorname',
        'col.yearOfBirth':          'Jahrgang',
        'col.licenseNumber':        'Lizenz-Nr.',
        'col.actions':              'Aktion',
        'placeholder.lastName':     'Nachname',
        'placeholder.firstName':    'Vorname',
        'placeholder.license':      'Lizenz',
        'settings.eventBranding':   'Anlass',
        'settings.eventName':       'Bezeichnung',
        'settings.logo':            'Logo',
        'settings.barcodes':        'Barcode',
        'settings.participantBarcode': 'Teilnehmer-Barcode',
        'settings.programBarcode':  'Programm-Barcode',
        'settings.language':        'Sprache',
        'settings.prefix':          'Prefix',
        'settings.programPrefix':   'Prefix (2st.)',
        'settings.programBilling':  'Abrechnung (3st.)',
        'settings.programHits':     'Stich-Nummer (3st.)',
        'settings.columns':         'Spalten',
        'settings.licenseEnabled':  'Lizenznummer erfassen',
        'settings.customColumn1':   'Zusatzspalte 1',
        'settings.customColumn2':   'Zusatzspalte 2',
        'placeholder.columnName':   'Spaltenname (leer = ausblenden)',
        'confirm.deleteSelected':   'Markierte Teilnehmer wirklich löschen?',
        'confirm.deleteRow':        'Diesen Teilnehmer wirklich löschen?',
        'confirm.importOverwrite':  'ACHTUNG: Dies überschreibt alle aktuellen Daten. Fortfahren?',
        'category.JJ':              'Jugendliche',
        'category.J':               'Junioren',
        'category.E':               'Elite',
        'category.S':               'Senioren',
        'category.V':               'Veteranen',
        'category.SV':              'Seniorveteranen',
        'category.tooltip':         '{name} (Alter {age})',
    },
    fr: {
        'tab.participants':         'Participants',
        'tab.settings':             'Paramètres',
        'btn.print':                'Imprimer',
        'verb.print':               'imprimer',
        'verb.download':            'télécharger',
        'verb.copy':                'copier',
        'verb.delete':              'supprimer',
        'count.all':                'Tous',
        'placeholder.filter':       'Rechercher…',
        'btn.exportBackup':         'Exporter manifestation',
        'btn.importBackup':         'Importer manifestation',
        'btn.importCsv':            'Importer CSV',
        'msg.csvImported':          '{count} participants importés.',
        'msg.csvImportFailed':      'Impossible de lire le fichier CSV.',
        'btn.removeLogo':           'Supprimer',
        'btn.clearAll':             'Effacer toutes les données',
        'confirm.clearAll':         'ATTENTION : ceci supprimera définitivement tous les paramètres, le logo et les participants. Continuer ?',
        'col.lastName':             'Nom',
        'col.firstName':            'Prénom',
        'col.yearOfBirth':          'Année de naissance',
        'col.licenseNumber':        'N° de licence',
        'col.actions':              'Action',
        'placeholder.lastName':     'Nom',
        'placeholder.firstName':    'Prénom',
        'placeholder.license':      'Licence',
        'settings.eventBranding':   'Manifestation',
        'settings.eventName':       'Titre',
        'settings.logo':            'Logo',
        'settings.barcodes':        'Code-barres',
        'settings.participantBarcode': 'Code-barres participant',
        'settings.programBarcode':  'Code-barres programme',
        'settings.language':        'Langue',
        'settings.prefix':          'Préfixe',
        'settings.programPrefix':   'Préfixe (2 chiffres)',
        'settings.programBilling':  'Facturation (3 chiffres)',
        'settings.programHits':     'Numéro de passe (3 chiffres)',
        'settings.columns':         'Colonnes',
        'settings.licenseEnabled':  'Saisir le numéro de licence',
        'settings.customColumn1':   'Colonne supplémentaire 1',
        'settings.customColumn2':   'Colonne supplémentaire 2',
        'placeholder.columnName':   'Nom de colonne (vide = masquer)',
        'confirm.deleteSelected':   'Supprimer les participants sélectionnés ?',
        'confirm.deleteRow':        'Supprimer ce participant ?',
        'confirm.importOverwrite':  'ATTENTION : ceci écrasera toutes les données actuelles. Continuer ?',
        'category.JJ':              'Jeunes',
        'category.J':               'Juniors',
        'category.E':               'Élite',
        'category.S':               'Seniors',
        'category.V':               'Vétérans',
        'category.SV':              'Super-vétérans',
        'category.tooltip':         '{name} (âge {age})',
    },
};

const DEFAULT_LANGUAGE = 'de';

const getLanguage = () => {
    const stored = localStorage.getItem('appLanguage');
    return TRANSLATIONS[stored] ? stored : DEFAULT_LANGUAGE;
};

const t = (key, params = {}) => {
    const dict = TRANSLATIONS[getLanguage()] || TRANSLATIONS[DEFAULT_LANGUAGE];
    let str = dict[key] ?? key;
    for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, v);
    }
    return str;
};

const applyTranslations = () => {
    document.documentElement.lang = getLanguage();
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
};

const setLanguage = (lang) => {
    if (!TRANSLATIONS[lang]) return;
    localStorage.setItem('appLanguage', lang);
    applyTranslations();
    refreshDynamicTexts();
};

// -----------------------------------------------------------------------------
// Storage migration (legacy keys → current)
// -----------------------------------------------------------------------------

const LEGACY_KEY_RENAMES = [
    ['barcodePrefix',  'participantPrefix'],
    ['statPref',       'programPrefix'],
    ['statAbr',        'programBilling'],
    ['statTre',        'programHits'],
    ['programPref',    'programPrefix'],
    ['programAbr',     'programBilling'],
    ['programTre',     'programHits'],
    ['participantData','participants'],
];

const migrateLegacyKeys = () => {
    for (const [oldKey, newKey] of LEGACY_KEY_RENAMES) {
        if (localStorage.getItem(newKey) === null && localStorage.getItem(oldKey) !== null) {
            localStorage.setItem(newKey, localStorage.getItem(oldKey));
            localStorage.removeItem(oldKey);
        }
    }
};

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------

const SETTINGS_BINDINGS = [
    { storageKey: 'eventName',         elementId: 'event-name-input',         type: 'text',     defaultValue: String(new Date().getFullYear()) },
    { storageKey: 'participantPrefix', elementId: 'participant-prefix-input', type: 'text',     defaultValue: '10' },
    { storageKey: 'programPrefix',     elementId: 'program-prefix-input',     type: 'text',     defaultValue: '20' },
    { storageKey: 'programBilling',    elementId: 'program-billing-input',    type: 'text',     defaultValue: ''   },
    { storageKey: 'programHits',       elementId: 'program-hits-input',       type: 'text',     defaultValue: ''   },
    { storageKey: 'licenseEnabled',    elementId: 'license-enabled-input',    type: 'checkbox', defaultValue: true },
    { storageKey: 'customColumn1Name', elementId: 'custom-column-1-input',    type: 'text',     defaultValue: ''   },
    { storageKey: 'customColumn2Name', elementId: 'custom-column-2-input',    type: 'text',     defaultValue: ''   },
];

const SETTINGS_BY_KEY = Object.fromEntries(SETTINGS_BINDINGS.map(b => [b.storageKey, b]));

const loadSettings = () => {
    SETTINGS_BINDINGS.forEach(({ storageKey, elementId, type, defaultValue }) => {
        const el = $(elementId);
        const stored = localStorage.getItem(storageKey);
        if (type === 'checkbox') {
            el.checked = stored === null ? !!defaultValue : stored === 'true';
        } else {
            el.value = stored ?? defaultValue;
        }
    });
};

const saveSettings = () => {
    SETTINGS_BINDINGS.forEach(({ storageKey, elementId, type }) => {
        const el = $(elementId);
        localStorage.setItem(storageKey, type === 'checkbox' ? String(el.checked) : el.value);
    });
    applyColumnVisibility();
};

const getSettingValue = (storageKey) => {
    const binding = SETTINGS_BY_KEY[storageKey];
    const el = $(binding.elementId);
    if (binding.type === 'checkbox') return el.checked;
    return el.value || binding.defaultValue;
};

// -----------------------------------------------------------------------------
// Event logo
// -----------------------------------------------------------------------------

let eventLogo = localStorage.getItem('eventLogo') || '';

const saveLogoFromInput = (input) => {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        eventLogo = e.target.result;
        localStorage.setItem('eventLogo', eventLogo);
        updateLogoPreview();
    };
    reader.readAsDataURL(input.files[0]);
};

const clearLogo = () => {
    eventLogo = '';
    localStorage.removeItem('eventLogo');
    updateLogoPreview();
};

const updateLogoPreview = () => {
    const img = $('logo-preview');
    const btn = $('clear-logo-button');
    img.src = eventLogo;
    img.style.display = eventLogo ? 'block' : 'none';
    btn.style.display = eventLogo ? 'inline-block' : 'none';
};

// -----------------------------------------------------------------------------
// Tabs
// -----------------------------------------------------------------------------

const switchTab = (tab) => {
    $('data-view').classList.toggle('hidden', tab !== 'data');
    $('settings-view').classList.toggle('hidden', tab !== 'settings');
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.id === 'tab-' + tab));
};

// -----------------------------------------------------------------------------
// Category calculator
// -----------------------------------------------------------------------------

const CATEGORY_RANGES = [
    { code: 'JJ', minAge: 10, maxAge: 16 },
    { code: 'J',  minAge: 17, maxAge: 20 },
    { code: 'E',  minAge: 21, maxAge: 45 },
    { code: 'S',  minAge: 46, maxAge: 59 },
    { code: 'V',  minAge: 60, maxAge: 69 },
    { code: 'SV', minAge: 70, maxAge: Infinity },
];

const getCompetitionYear = () => new Date().getFullYear();

const getCategory = (yearOfBirth) => {
    const year = parseInt(yearOfBirth, 10);
    if (!year || year < 1900 || year > 2100) return null;
    const age = getCompetitionYear() - year;
    const range = CATEGORY_RANGES.find(r => age >= r.minAge && age <= r.maxAge);
    return range ? { code: range.code, age } : null;
};

const expandYearOfBirth = (inputEl) => {
    const raw = inputEl.value.trim();
    if (!/^\d{1,2}$/.test(raw)) return;
    const twoDigit = parseInt(raw, 10);
    const pivot = getCompetitionYear() % 100;
    inputEl.value = (twoDigit <= pivot) ? 2000 + twoDigit : 1900 + twoDigit;
    updateCategoryBadge(inputEl.closest('tr'));
    saveParticipants();
};

const updateCategoryBadge = (rowEl) => {
    const yobInput = rowEl.querySelector('.field-yob');
    const badge = rowEl.querySelector('.cat-badge');
    if (!yobInput || !badge) return;
    const cat = getCategory(yobInput.value);
    badge.textContent = cat ? cat.code : '';
    badge.title = cat ? t('category.tooltip', { name: t('category.' + cat.code), age: cat.age }) : '';
};

const updateAllCategoryBadges = () => {
    $$('#participants-tbody tr').forEach(updateCategoryBadge);
};

// -----------------------------------------------------------------------------
// Barcode generation
// -----------------------------------------------------------------------------

const computeChecksum = (digits) => {
    try {
        const n = BigInt(digits.replace(/\D/g, ''));
        let r = (n * -3n) % 97n;
        if (r < 0n) r += 97n;
        return r.toString().padStart(2, '0');
    } catch (_) {
        return '00';
    }
};

const buildProgramCode = () => {
    const billing = getSettingValue('programBilling').trim();
    const hits    = getSettingValue('programHits').trim();
    if (!billing || !hits) return null;
    const prefix = getSettingValue('programPrefix').padStart(2, '0');
    const base = prefix + billing.padStart(3, '0') + hits.padStart(3, '0');
    return base + computeChecksum(base);
};

const buildParticipantCode = (license) => {
    if (!getSettingValue('licenseEnabled')) return null;
    const digits = (license || '').replace(/\D/g, '');
    if (!digits) return null;
    const base = getSettingValue('participantPrefix') + digits.padStart(6, '0');
    return base + computeChecksum(base);
};

// -----------------------------------------------------------------------------
// Participants — single source of truth for fields
// -----------------------------------------------------------------------------

const PARTICIPANT_FIELDS = [
    {
        key: 'license',
        cls: 'field-license',
        type: 'text',
        col: 'license',
        placeholderKey: 'placeholder.license',
        headerKey: 'col.licenseNumber',
        isVisible: () => getSettingValue('licenseEnabled'),
        aliases: ['license', 'licence', 'lizenz', 'lizenz-nr.', 'lizenz-nr', 'lizenznummer', 'n° de licence', 'no de licence'],
    },
    {
        key: 'lastName',
        cls: 'field-lastname',
        type: 'text',
        placeholderKey: 'placeholder.lastName',
        headerKey: 'col.lastName',
        aliases: ['lastname', 'nachname', 'name', 'nom', 'familienname'],
    },
    {
        key: 'firstName',
        cls: 'field-firstname',
        type: 'text',
        placeholderKey: 'placeholder.firstName',
        headerKey: 'col.firstName',
        aliases: ['firstname', 'vorname', 'prénom', 'prenom'],
    },
    {
        key: 'yearOfBirth',
        cls: 'field-yob',
        type: 'number',
        placeholder: '1990',
        headerKey: 'col.yearOfBirth',
        aliases: ['yearofbirth', 'jahrgang', 'année de naissance', 'annee de naissance', 'jg', 'yob', 'geburtsjahr'],
    },
    {
        key: 'custom1',
        cls: 'field-custom1',
        type: 'text',
        col: 'custom1',
        isVisible: () => getSettingValue('customColumn1Name').trim() !== '',
        getHeader: () => getSettingValue('customColumn1Name').trim(),
    },
    {
        key: 'custom2',
        cls: 'field-custom2',
        type: 'text',
        col: 'custom2',
        isVisible: () => getSettingValue('customColumn2Name').trim() !== '',
        getHeader: () => getSettingValue('customColumn2Name').trim(),
    },
];

const fieldHeader = (field) => field.getHeader ? field.getHeader() : t(field.headerKey);

const readRow = (rowEl) => Object.fromEntries(
    PARTICIPANT_FIELDS.map(f => [f.key, rowEl.querySelector('.' + f.cls)?.value ?? ''])
);

const visibleColumns = () => PARTICIPANT_FIELDS.filter(f => !f.isVisible || f.isVisible());

// -----------------------------------------------------------------------------
// Column visibility
// -----------------------------------------------------------------------------

const applyColumnVisibility = () => {
    PARTICIPANT_FIELDS.filter(f => f.col).forEach(f => {
        const visible = !f.isVisible || f.isVisible();
        $$(`[data-col="${f.col}"]`).forEach(el => el.classList.toggle('hidden', !visible));
        const headerEl = document.querySelector(`th[data-col="${f.col}"]`);
        if (headerEl && f.getHeader) headerEl.textContent = f.getHeader();
    });
};

// -----------------------------------------------------------------------------
// Row management
// -----------------------------------------------------------------------------

const PRINT_ICON = '🖶';

const buildRowHtml = (data) => {
    const cells = PARTICIPANT_FIELDS.map(f => {
        const value       = escapeHtml(data[f.key] || '');
        const placeholder = escapeHtml(f.placeholderKey ? t(f.placeholderKey) : (f.placeholder || ''));
        const colAttr     = f.col ? ` data-col="${f.col}"` : '';
        const yobExtras   = f.key === 'yearOfBirth' ? ' onchange="expandYearOfBirth(this)"' : '';
        const input       = `<input type="${f.type}" class="${f.cls}" value="${value}" placeholder="${placeholder}" oninput="onRowInput(this)"${yobExtras}>`;
        if (f.key === 'yearOfBirth') {
            return `<td${colAttr}><div class="yob-cell">${input}<span class="cat-badge"></span></div></td>`;
        }
        return `<td${colAttr}>${input}</td>`;
    }).join('');

    const printLabel = escapeHtml(t('btn.print'));
    return `
        <td><input type="checkbox" class="row-check" tabindex="-1" onchange="updateToolbarLabels()"></td>
        ${cells}
        <td class="row-actions">
            <button class="btn-neutral btn-icon" data-row-action="print" onclick="printLabels(this.closest('tr'))" title="${printLabel}" aria-label="${printLabel}" tabindex="-1">${PRINT_ICON}</button>
            <button class="btn-danger-ghost btn-icon" onclick="deleteRow(this)" aria-label="✕" tabindex="-1">✕</button>
        </td>`;
};

const addParticipantRow = (data = {}) => {
    const tr = document.createElement('tr');
    if (!data.lastName) tr.className = 'empty-row';
    tr.innerHTML = buildRowHtml(data);
    $('participants-tbody').appendChild(tr);
    updateCategoryBadge(tr);
    applyColumnVisibility();
    return tr;
};

const onRowInput = (inputEl) => {
    const tr = inputEl.closest('tr');
    if (inputEl.classList.contains('field-lastname')) {
        if (inputEl.value.trim() !== '') {
            tr.classList.remove('empty-row');
            if (!tr.nextElementSibling) addParticipantRow();
        } else {
            tr.classList.add('empty-row');
        }
    }
    if (inputEl.classList.contains('field-yob')) {
        updateCategoryBadge(tr);
    }
    handleTableChanged();
};

const deleteRow = (button) => {
    const tr = button.closest('tr');
    if (!tr.classList.contains('empty-row') && !confirm(t('confirm.deleteRow'))) return;
    tr.remove();
    if (!document.querySelector('#participants-tbody tr')) addParticipantRow();
    handleTableChanged();
};

const deleteRows = () => {
    const rows = getToolbarTargets();
    if (!rows.length) return;
    if (!confirm(t('confirm.deleteSelected'))) return;
    rows.forEach(tr => tr.remove());
    if (!document.querySelector('#participants-tbody tr')) addParticipantRow();
    handleTableChanged();
};

const saveParticipants = () => {
    const rows = [...$$('#participants-tbody tr:not(.empty-row)')]
        .map(readRow)
        .filter(p => p.lastName.trim() !== '');
    localStorage.setItem('participants', JSON.stringify(rows));
};

const handleTableChanged = () => {
    saveParticipants();
    applyFilter();
    updateToolbarLabels();
};

// -----------------------------------------------------------------------------
// Selection helpers
// -----------------------------------------------------------------------------

const getNonEmptyRows = () => [...$$('#participants-tbody tr:not(.empty-row)')];

const getSelectedRows = () => [...$$('.row-check:checked')]
    .map(c => c.closest('tr'))
    .filter(tr => tr && !tr.classList.contains('empty-row'));

const getToolbarTargets = () => {
    const selected = getSelectedRows();
    return selected.length > 0 ? selected : getNonEmptyRows();
};

const toggleAllChecks = () => {
    const shouldCheckAll = getSelectedRows().length === 0;
    $$('.row-check').forEach(cb => {
        const tr = cb.closest('tr');
        if (tr && !tr.classList.contains('empty-row')) cb.checked = shouldCheckAll;
    });
    updateToolbarLabels();
};

// -----------------------------------------------------------------------------
// Filter
// -----------------------------------------------------------------------------

const applyFilter = () => {
    const query = ($('filter-input')?.value || '').trim().toLowerCase();
    $$('#participants-tbody tr').forEach(tr => {
        if (!query) {
            tr.classList.remove('filtered-out');
            return;
        }
        if (tr.classList.contains('empty-row')) {
            tr.classList.add('filtered-out');
            return;
        }
        const haystack = [...tr.querySelectorAll('input[type="text"], input[type="number"]')]
            .map(i => i.value.toLowerCase())
            .join(' ');
        tr.classList.toggle('filtered-out', !haystack.includes(query));
    });
};

// -----------------------------------------------------------------------------
// Toolbar
// -----------------------------------------------------------------------------

const TOOLBAR_BUTTONS = [
    { id: 'btn-toolbar-print',    verbKey: 'verb.print'    },
    { id: 'btn-toolbar-download', verbKey: 'verb.download' },
    { id: 'btn-toolbar-copy',     verbKey: 'verb.copy'     },
    { id: 'btn-toolbar-delete',   verbKey: 'verb.delete'   },
];

const updateMasterCheckboxState = () => {
    const master = $('master-check');
    if (!master) return;
    const total    = getNonEmptyRows().length;
    const selected = getSelectedRows().length;
    master.checked       = selected > 0 && selected === total;
    master.indeterminate = selected > 0 && selected < total;
};

const updateToolbarLabels = () => {
    const selected = getSelectedRows();
    const count = selected.length > 0 ? String(selected.length) : t('count.all');
    TOOLBAR_BUTTONS.forEach(({ id, verbKey }) => {
        const btn = $(id);
        if (btn) btn.innerHTML = `<span class="btn-count">${escapeHtml(count)}</span> ${escapeHtml(t(verbKey))}`;
    });
    updateMasterCheckboxState();
};

const refreshDynamicTexts = () => {
    PARTICIPANT_FIELDS.filter(f => f.placeholderKey).forEach(f => {
        $$('#participants-tbody .' + f.cls).forEach(input => { input.placeholder = t(f.placeholderKey); });
    });
    $$('#participants-tbody [data-row-action="print"]').forEach(btn => {
        btn.title = t('btn.print');
        btn.setAttribute('aria-label', t('btn.print'));
    });
    updateAllCategoryBadges();
    updateToolbarLabels();
};

// -----------------------------------------------------------------------------
// Tabular export (CSV download / clipboard copy)
// -----------------------------------------------------------------------------

const escapeCsvField = (value, separator) => {
    const str = String(value ?? '');
    if (str.includes(separator) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replaceAll('"', '""') + '"';
    }
    return str;
};

const buildDelimitedTable = (rows, separator, { includeHeader = true } = {}) => {
    const cols = visibleColumns();
    const lines = [];
    if (includeHeader) {
        lines.push(cols.map(f => escapeCsvField(fieldHeader(f), separator)).join(separator));
    }
    rows.forEach(tr => {
        const data = readRow(tr);
        lines.push(cols.map(f => escapeCsvField(data[f.key], separator)).join(separator));
    });
    return lines.join('\r\n');
};

const downloadCsv = () => {
    const rows = getToolbarTargets();
    if (!rows.length) return;
    const csv = '﻿' + buildDelimitedTable(rows, ';');
    const filename = `${(getSettingValue('eventName') || 'standblatt').replace(/\s+/g, '_')}.csv`;
    triggerDownload(filename, new Blob([csv], { type: 'text/csv;charset=utf-8' }));
};

const copyTable = async () => {
    const rows = getToolbarTargets();
    if (!rows.length) return;
    const tsv = buildDelimitedTable(rows, '\t', { includeHeader: false });
    try {
        await navigator.clipboard.writeText(tsv);
    } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = tsv;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
};

// -----------------------------------------------------------------------------
// CSV import
// -----------------------------------------------------------------------------

const parseCsv = (text, separator) => {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += ch;
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === separator) {
            row.push(field); field = '';
        } else if (ch === '\n') {
            row.push(field); rows.push(row); row = []; field = '';
        } else if (ch !== '\r') {
            field += ch;
        }
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim() !== ''));
};

const detectSeparator = (line) => {
    const counts = { ';': 0, ',': 0, '\t': 0 };
    let inQ = false;
    for (const ch of line) {
        if (ch === '"') inQ = !inQ;
        else if (!inQ && counts[ch] !== undefined) counts[ch]++;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] || ';';
};

const matchHeaderKey = (header) => {
    const norm = header.trim().toLowerCase();
    for (const f of PARTICIPANT_FIELDS) {
        if (f.aliases?.includes(norm)) return f.key;
        if (f.getHeader && f.getHeader().toLowerCase() === norm) return f.key;
    }
    return null;
};

const importCsv = (input) => {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let text = e.target.result;
            if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
            const firstLine = text.split(/\r?\n/, 1)[0];
            const rows = parseCsv(text, detectSeparator(firstLine));
            if (rows.length < 2) { input.value = ''; return; }

            const columnMap = rows[0].map(matchHeaderKey);

            const trailing = document.querySelector('#participants-tbody tr.empty-row');
            if (trailing) trailing.remove();

            let imported = 0;
            for (let r = 1; r < rows.length; r++) {
                const data = {};
                columnMap.forEach((key, c) => {
                    if (key) data[key] = (rows[r][c] ?? '').trim();
                });
                if (!data.lastName && !data.firstName) continue;
                addParticipantRow(data);
                imported++;
            }

            addParticipantRow(); // restore trailing empty row
            handleTableChanged();
            alert(t('msg.csvImported', { count: imported }));
        } catch (_) {
            alert(t('msg.csvImportFailed'));
        }
        input.value = '';
    };
    reader.readAsText(input.files[0], 'UTF-8');
};

// -----------------------------------------------------------------------------
// Printing
// -----------------------------------------------------------------------------

const BARCODE_OPTIONS = { width: 2, height: 40, displayValue: true, fontSize: 14, margin: 0 };

const renderBarcode = (value) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, BARCODE_OPTIONS);
    return canvas.toDataURL();
};

const buildLabelHtml = ({ participant, programImg, participantImg, eventName, logoHtml }) => {
    const cat = getCategory(participant.yearOfBirth);
    const yobLine = participant.yearOfBirth
        ? (cat ? `${participant.yearOfBirth} ${cat.code}` : participant.yearOfBirth)
        : '';
    const info = `
        <div class="label-info">
            <div class="label-row label-bold">${escapeHtml(participant.lastName)} ${escapeHtml(participant.firstName)}</div>
            <div class="label-row">${escapeHtml(yobLine)}</div>
            <hr>
            <div class="label-event">${escapeHtml(eventName)}</div>
            ${logoHtml}
        </div>`;
    const partImg = participantImg ? `<img class="label-barcode-img" src="${participantImg}">` : '';
    const progImg = programImg     ? `<img class="label-barcode-img" src="${programImg}">`     : '';
    const gap     = (participantImg && programImg) ? `<div class="label-barcode-gap"></div>` : '';
    const barcodes = `${partImg}${gap}${progImg}`;
    return `
        <div class="label-col label-col-left">
            <div class="label-top-spacer"></div>
            <div class="label-barcodes">${barcodes}</div>
            <div class="label-info-gap"></div>
            ${info}
        </div>
        <div class="label-col">
            <div class="label-top-spacer"></div>
            <div class="label-barcodes" style="visibility:hidden">${barcodes}</div>
            <div class="label-info-gap"></div>
            ${info}
        </div>`;
};

const printLabels = (target) => {
    const container = $('print-container');
    container.innerHTML = '';

    const rows = (target instanceof HTMLElement) ? [target] : getToolbarTargets();
    if (!rows.length) return;

    const eventName = getSettingValue('eventName');
    const logoHtml = eventLogo
        ? `<div class="label-logo"><img src="${escapeHtml(eventLogo)}" class="label-logo-img"></div>`
        : '';
    const programCode = buildProgramCode();
    const programImg = programCode ? renderBarcode(programCode) : null;

    rows.forEach(row => {
        const participant = readRow(row);
        const code = buildParticipantCode(participant.license.trim());
        const participantImg = code ? renderBarcode(code) : null;

        const labelEl = document.createElement('div');
        labelEl.className = 'label';
        labelEl.innerHTML = buildLabelHtml({ participant, programImg, participantImg, eventName, logoHtml });
        container.appendChild(labelEl);
    });

    setTimeout(() => window.print(), 250);
};

// -----------------------------------------------------------------------------
// Backup (full settings + participants JSON)
// -----------------------------------------------------------------------------

const exportBackup = () => {
    const settings = Object.fromEntries(
        SETTINGS_BINDINGS.map(({ storageKey }) => [storageKey, localStorage.getItem(storageKey)])
    );
    const data = {
        settings,
        logo: eventLogo,
        participants: JSON.parse(localStorage.getItem('participants') || '[]'),
        language: getLanguage(),
    };
    triggerDownload('standblatt-backup.json', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
};

const importBackup = (input) => {
    if (!input.files[0]) return;
    if (!confirm(t('confirm.importOverwrite'))) { input.value = ''; return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        if (data.settings) {
            Object.entries(data.settings).forEach(([k, v]) => localStorage.setItem(k, v ?? ''));
        }
        if (data.logo !== undefined) {
            eventLogo = data.logo;
            localStorage.setItem('eventLogo', eventLogo);
        }
        if (data.participants) {
            localStorage.setItem('participants', JSON.stringify(data.participants));
        }
        if (data.language && TRANSLATIONS[data.language]) {
            localStorage.setItem('appLanguage', data.language);
        }
        location.reload();
    };
    reader.readAsText(input.files[0]);
};

const clearAllData = () => {
    if (!confirm(t('confirm.clearAll'))) return;
    const lang = getLanguage();
    localStorage.clear();
    localStorage.setItem('appLanguage', lang);
    sessionStorage.setItem('openSettingsOnLoad', '1');
    location.reload();
};

// -----------------------------------------------------------------------------
// Service worker (offline / installable PWA)
// -----------------------------------------------------------------------------

const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;
    const swCode = `
        const CACHE_NAME = 'standblatt-v8';
        const ASSETS = [location.href, 'app.js', 'styles.css', 'JsBarcode.all.min.js', 'manifest.webmanifest', 'icon.svg'];
        self.addEventListener('install',  e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));
        self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )));
        self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
    `;
    const blob = new Blob([swCode], { type: 'application/javascript' });
    navigator.serviceWorker.register(URL.createObjectURL(blob)).catch(() => {});
};

// -----------------------------------------------------------------------------
// Boot
// -----------------------------------------------------------------------------

const populateLanguageSelector = () => {
    const select = $('language-select');
    select.value = getLanguage();
    select.addEventListener('change', () => setLanguage(select.value));
};

const init = () => {
    migrateLegacyKeys();
    applyTranslations();
    loadSettings();
    applyColumnVisibility();
    populateLanguageSelector();
    updateLogoPreview();

    const saved = JSON.parse(localStorage.getItem('participants') || '[]');
    saved.forEach(addParticipantRow);
    addParticipantRow(); // trailing empty row
    updateToolbarLabels();

    if (sessionStorage.getItem('openSettingsOnLoad')) {
        sessionStorage.removeItem('openSettingsOnLoad');
        switchTab('settings');
    }
};

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        const tr = document.activeElement?.closest?.('#participants-tbody tr');
        if (tr && !tr.classList.contains('empty-row')) {
            e.preventDefault();
            printLabels(tr);
        }
    }
});

window.addEventListener('load', registerServiceWorker);
document.addEventListener('DOMContentLoaded', init);

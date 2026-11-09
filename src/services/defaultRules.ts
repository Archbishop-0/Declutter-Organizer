import { TopicRule, AppPreferences } from '../types';

export const DEFAULT_RULES: TopicRule[] = [
  {
    id: 'rule-invoices',
    name: 'Invoices & Receipts',
    folderName: 'Finance/Invoices & Receipts',
    keywords: ['invoice', 'receipt', 'bill', 'tax', 'statement', 'payment', 'salary', 'bank', 'slip', 'w2', '1099'],
    extensions: ['.pdf', '.xlsx', '.csv', '.png', '.jpg'],
    enabled: true,
    color: '#32D74B', // Apple green
    priority: 10,
  },
  {
    id: 'rule-research-school',
    name: 'School & Research',
    folderName: 'Studies/Research & Assignments',
    keywords: ['assignment', 'homework', 'thesis', 'essay', 'lecture', 'paper', 'syllabus', 'exam', 'course', 'lab', 'dissertation'],
    extensions: ['.pdf', '.docx', '.doc', '.pptx', '.tex', '.md'],
    enabled: true,
    color: '#0A84FF', // Apple blue
    priority: 9,
  },
  {
    id: 'rule-code-dev',
    name: 'Code & Development',
    folderName: 'Development/Projects & Scripts',
    keywords: ['project', 'repo', 'script', 'docker', 'api', 'server', 'client', 'patch', 'bot'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cpp', '.c', '.h', '.rs', '.go', '.html', '.css', '.json', '.yaml', '.yml', '.sql', '.sh', '.ps1'],
    enabled: true,
    color: '#BF5AF2', // Apple purple
    priority: 8,
  },
  {
    id: 'rule-screenshots',
    name: 'Screenshots & Snips',
    folderName: 'Media/Screenshots',
    keywords: ['screenshot', 'screen shot', 'capture', 'snip', 'screengrab', 'screen-shot'],
    extensions: ['.png', '.jpg', '.jpeg', '.webp'],
    enabled: true,
    color: '#FF9F0A', // Apple orange
    priority: 8,
  },
  {
    id: 'rule-design-creative',
    name: 'Design & Assets',
    folderName: 'Creative/Design Assets',
    keywords: ['mockup', 'wireframe', 'logo', 'banner', 'poster', 'illustration', 'vector', 'asset', 'brand'],
    extensions: ['.psd', '.ai', '.fig', '.sketch', '.svg', '.blend', '.eps'],
    enabled: true,
    color: '#FF375F', // Apple pink
    priority: 7,
  },
  {
    id: 'rule-presentations',
    name: 'Presentations & Pitches',
    folderName: 'Work/Decks & Presentations',
    keywords: ['deck', 'pitch', 'presentation', 'slides', 'keynote', 'quarterly', 'roadmap'],
    extensions: ['.pptx', '.ppt', '.key'],
    enabled: true,
    color: '#64D2FF', // Apple cyan
    priority: 6,
  },
  {
    id: 'rule-installers',
    name: 'Installers & Setup Packages',
    folderName: 'Software & Installers',
    keywords: ['setup', 'installer', 'install', 'update', 'package', 'portable'],
    extensions: ['.exe', '.msi', '.dmg', '.pkg', '.iso', '.deb', '.rpm', '.appimage'],
    enabled: true,
    color: '#8E8E93', // Apple gray
    priority: 5,
  },
  {
    id: 'rule-archives',
    name: 'Archives & Backups',
    folderName: 'Archives & Compressed',
    keywords: ['backup', 'archive', 'dump', 'bundle', 'export'],
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tgz'],
    enabled: true,
    color: '#AC8E68', // Apple brown/ochre
    priority: 4,
  },
  {
    id: 'rule-books-reading',
    name: 'Books & Guides',
    folderName: 'Reading/Books & Guides',
    keywords: ['ebook', 'book', 'guide', 'manual', 'handbook', 'tutorial', 'documentation'],
    extensions: ['.epub', '.mobi', '.azw3', '.djvu'],
    enabled: true,
    color: '#30B0C7', // Apple teal
    priority: 4,
  },
];

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'dark',
  conflictResolution: 'rename',
  organizeMode: 'topics_first',
  createSubcategories: true,
  ignoreHiddenFiles: true,
  cleanJunkFiles: true,
  junkExtensions: ['.tmp', '.crdownload', '.part', '.download', '.dmp', '.log'],
  protectedNames: ['desktop.ini', 'thumbs.db', '.ds_store', '.git', 'node_modules', '.declutter-history.json'],
};

export const EXTENSION_CATEGORIES: Record<string, string> = {
  // Images
  '.png': 'Images',
  '.jpg': 'Images',
  '.jpeg': 'Images',
  '.gif': 'Images',
  '.webp': 'Images',
  '.bmp': 'Images',
  '.tiff': 'Images',
  '.heic': 'Images',
  '.raw': 'Images',

  // Documents
  '.pdf': 'Documents',
  '.doc': 'Documents',
  '.docx': 'Documents',
  '.txt': 'Documents',
  '.rtf': 'Documents',
  '.odt': 'Documents',
  '.pages': 'Documents',

  // Spreadsheets & Data
  '.xlsx': 'Spreadsheets',
  '.xls': 'Spreadsheets',
  '.csv': 'Spreadsheets',
  '.tsv': 'Spreadsheets',
  '.numbers': 'Spreadsheets',

  // Code & Scripts
  '.ts': 'Developer',
  '.tsx': 'Developer',
  '.js': 'Developer',
  '.jsx': 'Developer',
  '.py': 'Developer',
  '.html': 'Developer',
  '.css': 'Developer',
  '.json': 'Developer',
  '.cpp': 'Developer',
  '.c': 'Developer',
  '.cs': 'Developer',
  '.java': 'Developer',
  '.sql': 'Developer',
  '.sh': 'Developer',
  '.ps1': 'Developer',

  // Media Audio & Video
  '.mp4': 'Videos',
  '.mov': 'Videos',
  '.avi': 'Videos',
  '.mkv': 'Videos',
  '.webm': 'Videos',
  '.mp3': 'Audio',
  '.wav': 'Audio',
  '.flac': 'Audio',
  '.m4a': 'Audio',
  '.aac': 'Audio',

  // Archives
  '.zip': 'Archives',
  '.rar': 'Archives',
  '.7z': 'Archives',
  '.tar': 'Archives',
  '.gz': 'Archives',

  // Applications
  '.exe': 'Applications',
  '.msi': 'Applications',
  '.dmg': 'Applications',
  '.appimage': 'Applications',
};

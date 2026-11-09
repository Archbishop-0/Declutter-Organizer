import { FileItem, TopicRule, AppPreferences, OrganizationPlan, PlanAction } from '../types';
import { EXTENSION_CATEGORIES } from './defaultRules';

/**
 * Extracts a candidate project stem from a filename.
 * e.g., "ProjectAlpha_spec_v2.docx" -> "ProjectAlpha"
 *       "thesis-draft-final.pdf"    -> "Thesis"
 *       "client_acme_quote.pdf"     -> "Client Acme"
 */
export function extractProjectStem(filename: string): string | null {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  
  // Normalize delimiters (replace underscores and hyphens with spaces for tokenization)
  const cleaned = nameWithoutExt.replace(/[_\-]+/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);

  // Filter out common non-project words
  const stopWords = new Set([
    'final', 'draft', 'copy', 'v1', 'v2', 'v3', 'new', 'old', 'temp', 'latest',
    'document', 'file', 'image', 'photo', 'video', 'untitled', 'download', 'screen',
    'screenshot', 'test', 'backup'
  ]);

  const candidateWords = words.filter(w => !stopWords.has(w.toLowerCase()) && !/^\d+$/.test(w));
  
  if (candidateWords.length >= 2) {
    // Capitalize each word
    const stem = candidateWords.slice(0, 2)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return stem;
  } else if (candidateWords.length === 1 && candidateWords[0].length >= 4) {
    const w = candidateWords[0];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }

  return null;
}

/**
 * Find clusters of files that share common project names.
 */
export function detectProjectClusters(files: FileItem[]): Map<string, string> {
  const stemCounts = new Map<string, number>();
  const fileToStem = new Map<string, string>();

  for (const file of files) {
    if (file.isDirectory) continue;
    const stem = extractProjectStem(file.name);
    if (stem) {
      stemCounts.set(stem, (stemCounts.get(stem) || 0) + 1);
      fileToStem.set(file.path, stem);
    }
  }

  // Only consider it a project cluster if 2 or more files share the stem
  const validClusters = new Map<string, string>();
  for (const [filePath, stem] of fileToStem.entries()) {
    if ((stemCounts.get(stem) || 0) >= 2) {
      validClusters.set(filePath, stem);
    }
  }

  return validClusters;
}

export function generatePlan(
  files: FileItem[],
  rules: TopicRule[],
  prefs: AppPreferences,
  sourceDir: string
): OrganizationPlan {
  const actions: PlanAction[] = [];
  const activeRules = [...rules.filter(r => r.enabled)].sort((a, b) => b.priority - a.priority);
  const projectClusters = detectProjectClusters(files);

  const summaryByCategory: Record<string, number> = {};
  const affectedFolderSet = new Set<string>();
  let totalSize = 0;

  for (const file of files) {
    // Skip directories and system protected files
    if (file.isDirectory) continue;
    
    const lowerName = file.name.toLowerCase();
    const ext = file.extension.toLowerCase();

    // Skip protected files
    if (prefs.protectedNames.some(p => lowerName === p.toLowerCase())) {
      continue;
    }

    // Check for junk files
    const isJunk = prefs.junkExtensions.some(j => ext === j.toLowerCase());
    if (isJunk && prefs.cleanJunkFiles) {
      const destFolder = 'Cleanup/Temporary & Junk';
      const destPath = `${sourceDir}/${destFolder}/${file.name}`.replace(/[\\/]+/g, '/');
      affectedFolderSet.add(destFolder);
      totalSize += file.size;
      summaryByCategory['Junk & Temp'] = (summaryByCategory['Junk & Temp'] || 0) + 1;

      actions.push({
        id: `action-${actions.length}-${Date.now()}`,
        sourcePath: file.path,
        fileName: file.name,
        destinationFolder: destFolder,
        destinationPath: destPath,
        reason: 'Temporary / Incomplete download file',
        type: 'archive',
        size: file.size,
        selected: true,
      });
      continue;
    }

    let targetFolder = '';
    let matchReason = '';
    let matchedRuleId: string | undefined = undefined;

    // 1. Topic Rule Matching
    if (prefs.organizeMode === 'topics_first' || prefs.organizeMode === 'project_smart') {
      for (const rule of activeRules) {
        let keywordHit = false;
        let extHit = false;

        if (rule.extensions.length > 0) {
          extHit = rule.extensions.some(e => e.toLowerCase() === ext);
        }

        if (rule.keywords.length > 0) {
          for (const kw of rule.keywords) {
            const cleanKw = kw.trim().toLowerCase();
            if (!cleanKw) continue;
            
            if (rule.matchWholeWord) {
              const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
              if (regex.test(lowerName)) {
                keywordHit = true;
                break;
              }
            } else {
              if (lowerName.includes(cleanKw)) {
                keywordHit = true;
                break;
              }
            }
          }
        }

        // Logic: if rule has both, both or strong keyword match
        if (rule.keywords.length > 0 && rule.extensions.length > 0) {
          if (keywordHit && extHit) {
            targetFolder = rule.folderName;
            matchReason = `Matched Rule: "${rule.name}" (keyword + filetype)`;
            matchedRuleId = rule.id;
            break;
          } else if (keywordHit) {
            targetFolder = rule.folderName;
            matchReason = `Matched Rule: "${rule.name}" (keyword)`;
            matchedRuleId = rule.id;
            break;
          }
        } else if (rule.keywords.length > 0 && keywordHit) {
          targetFolder = rule.folderName;
          matchReason = `Matched Rule: "${rule.name}" (keyword)`;
          matchedRuleId = rule.id;
          break;
        } else if (rule.extensions.length > 0 && extHit) {
          targetFolder = rule.folderName;
          matchReason = `Matched Rule: "${rule.name}" (filetype)`;
          matchedRuleId = rule.id;
          break;
        }
      }
    }

    // 2. Project Smart Clustering (if not matched by a specific topic rule)
    if (!targetFolder && (prefs.organizeMode === 'project_smart' || prefs.organizeMode === 'topics_first')) {
      const clusterStem = projectClusters.get(file.path);
      if (clusterStem) {
        targetFolder = `Projects/Project - ${clusterStem}`;
        matchReason = `Smart Project Grouping: "${clusterStem}"`;
      }
    }

    // 3. Date Grouped Mode
    if (!targetFolder && prefs.organizeMode === 'date_grouped') {
      const date = new Date(file.modifiedAt || file.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      targetFolder = `Timeline/${year}/${month}`;
      matchReason = `Date Timeline: ${month} ${year}`;
    }

    // 4. File Category Fallback
    if (!targetFolder) {
      const cat = EXTENSION_CATEGORIES[ext] || 'Miscellaneous';
      targetFolder = `Categories/${cat}`;
      matchReason = `File Type Category: ${cat}`;
    }

    const destPath = `${sourceDir}/${targetFolder}/${file.name}`.replace(/[\\/]+/g, '/');
    affectedFolderSet.add(targetFolder);
    totalSize += file.size;

    const groupKey = targetFolder.split('/')[0] || 'General';
    summaryByCategory[groupKey] = (summaryByCategory[groupKey] || 0) + 1;

    actions.push({
      id: `action-${actions.length}-${Date.now()}`,
      sourcePath: file.path,
      fileName: file.name,
      destinationFolder: targetFolder,
      destinationPath: destPath,
      reason: matchReason,
      ruleId: matchedRuleId,
      type: 'move',
      size: file.size,
      selected: true,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    sourceDirectory: sourceDir,
    timestamp: Date.now(),
    actions,
    totalFiles: actions.length,
    totalSize,
    affectedFolders: Array.from(affectedFolderSet).sort(),
    summaryByCategory,
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

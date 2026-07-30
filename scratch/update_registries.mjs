import fs from 'fs';
import path from 'path';

const modulesDir = path.join('client', 'src', 'pages', 'modules');
const modules = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

let clientContent = fs.readFileSync('client/src/data/modulesRegistry.js', 'utf8');
let serverContent = fs.readFileSync('server/data/featuresRegistry.js', 'utf8');

for (const mod of modules) {
    if (mod === 'sales') continue; // already done

    const reportsDir = path.join(modulesDir, mod, 'reports');
    let hasReportsDir = fs.existsSync(reportsDir);
    let files = [];
    if (hasReportsDir) {
        files = fs.readdirSync(reportsDir).filter(f => f.endsWith('ReportPage.jsx') || f.endsWith('Report.jsx') || (f.endsWith('.jsx') && f.includes('Report')));
    }
    
    let clientReports = [];
    let serverReports = [];
    
    for (const file of files) {
        if (file === 'SalesReports.jsx' || file === 'TransportReports.jsx') continue;
        let name = file.replace('ReportPage.jsx', '').replace('Report.jsx', '').replace('.jsx', '');
        if (!name) continue;
        let label = name.replace(/([A-Z])/g, ' $1').trim() + ' Report';
        let key = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        let pth = '/' + mod + '/reports/' + key;
        
        clientReports.push(`      { key: "${key}", label: "${label}", type: "feature" },`);
        serverReports.push(`      { feature_key: "${mod}:${key}", type: "feature", label: "${label}", path: "${pth}" },`);
    }

    // Clear dashboards array for all modules
    const dashClientRegex = new RegExp(`(\\b${mod}\\s*:\\s*{[\\s\\S]*?dashboards\\s*:\\s*\\[)[\\s\\S]*?(\\])`);
    clientContent = clientContent.replace(dashClientRegex, '$1$2');
    
    const dashServerRegex = new RegExp(`(\\b${mod}\\s*:\\s*{[\\s\\S]*?dashboards\\s*:\\s*\\[)[\\s\\S]*?(\\])`);
    serverContent = serverContent.replace(dashServerRegex, '$1$2');

    if (files.length === 0) continue;

    // Client replace
    // Find the generic reports line: { key: "reports", label: "Module Reports" } or similar
    const modClientRegex = new RegExp(`(\\b${mod}\\s*:\\s*{[^}]*?features\\s*:\\s*\\[[\\s\\S]*?)(\\s*{[^{}]*key:\\s*['"]reports['"].*?},?)`, '');
    if (modClientRegex.test(clientContent)) {
        clientContent = clientContent.replace(modClientRegex, (match, before, reportsLine) => {
            return before + '\n' + clientReports.join('\n');
        });
    }

    // Server replace
    const modServerRegex = new RegExp(`(\\b${mod}\\s*:\\s*{[^}]*?features\\s*:\\s*\\[[\\s\\S]*?)(\\s*{[^{}]*feature_key:\\s*['"]${mod}:reports['"].*?},?)`, '');
    if (modServerRegex.test(serverContent)) {
        serverContent = serverContent.replace(modServerRegex, (match, before, reportsLine) => {
            return before + '\n' + serverReports.join('\n');
        });
    }
}

fs.writeFileSync('client/src/data/modulesRegistry.js', clientContent);
fs.writeFileSync('server/data/featuresRegistry.js', serverContent);
console.log('Done modifying registries.');

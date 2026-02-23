const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('index.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(__dirname);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Clean up old scripts to ensure order
    content = content.replace(/<script src="\/navigation\.js"><\/script>/g, '');
    content = content.replace(/<script src="\/assistant-core\.js"><\/script>/g, '');
    content = content.replace(/<script src="\/assistant-brain\.js"><\/script>/g, '');

    // Inject in correct order: Brain first, then Core, then Nav
    const scripts = `
<script src="/assistant-brain.js"></script>
<script src="/assistant-core.js"></script>
<script src="/navigation.js"></script>
`;

    if (!content.includes('assistant-brain.js')) {
        content = content.replace('</body>', scripts + '</body>');
        fs.writeFileSync(file, content);
        console.log('Updated Script Order:', file);
    }
});

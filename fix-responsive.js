const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('E:/OWN Project/Ai personal assistant/ai-personal-assistant/src/app/briefing', (err, files) => {
  if (err) throw err;
  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  tsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/text-\[([\d.]+)px\]/g, (match, px) => {
      const val = parseFloat(px);
      if (val <= 10.5) return match; // already small
      const mobileVal = val <= 12 ? 10 : 10.5;
      return `text-[${mobileVal}px] md:text-[${val}px]`;
    });
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});

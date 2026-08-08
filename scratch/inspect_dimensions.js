const path = require('path');
try {
  const sharp = require('sharp');
  sharp(path.join(__dirname, '../public/assets/templates/goa-frame.png'))
    .metadata()
    .then(meta => {
      console.log('GOA_TEMPLATE_METADATA:', meta);
    });
  sharp(path.join(__dirname, '../public/assets/templates/aot-frame.png'))
    .metadata()
    .then(meta => {
      console.log('AOT_TEMPLATE_METADATA:', meta);
    });
} catch (e) {
  console.log('Sharp error:', e.message);
}

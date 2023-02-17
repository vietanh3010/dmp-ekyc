var express = require('express');
var router = express.Router();
const fs = require('fs');

const PREFIX = '/ekyc_data'

router.get('/:path', function (req, res, next) {
  const filePath = `${PREFIX}/${req.params.path}`
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath)
  } else {
    return res.status(404).json({msg: "Not found"});
  }
});

module.exports = router;


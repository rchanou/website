const path = require("path");
const lambdaLocal = require("lambda-local");

const event = {
  body: JSON.stringify({
    test: "trst",
    "g-recaptcha-response":"03AI-r6f5RKIkrAIuC0Xx9kG_-Xb4olG3-L98ArOTNr_fmOgzSwpg045dmYsn-oC5exGTPmBYFUu6cL27Y4sbmIxC-piEmXEdOPt9Ki6eCL89nmm5DKYmfgSR_z-S2sShU2nB-J-rIhr0OTKdSxCRG_KIX43mnrGJ3IzJRwafW8XWja-hlumv8dyMmX8lvtHElB-Me1xVPNpcYGE0pcXQ3dSpgUKwb0HckktFax-bf3aQ1049gnHVDprVdWyKxbbbHVQbJW-JwZKiDHPsLlt3g5blR3QJfwdta08OZbOTaAm-7_l7xr_0pDRqU7R3M4lPluM-m2Hs6K0G1M3glpGKL2YAoVlvZvNzyWpHxDMoaIx8fokoG2R-SiWc"
  })
};

lambdaLocal.execute({
  event,
  lambdaPath: path.join(__dirname, "check-captcha", "index.js"),
  callback: function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
});

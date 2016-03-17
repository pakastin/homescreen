
var data = [
  ['Social networks', [
    ['Facebook', 'facebook', '#3b5998'],
    ['Google Plus', 'google-plus', '#dc4e41'],
    ['Twitter', 'twitter', '#55acee'],
    ['LinkedIn', 'linkedin', '#0077b5'],
    ['Instagram', 'instagram', '#3f729b'],
    ['Tumblr', 'tumblr', '#35465c'],
    ['Medium', 'medium', '#020733']
  ]],
  ['Developer tools', [
    ['Github', 'github', '#333333']
  ]]
];

export var apps = [];
export var folders = [];

data.forEach(function (folder, fid) {
  folders.push({
    _id: fid,
    name: folder[0]
  });

  folder[1].forEach(function (app, aid) {
    apps.push({
      _id: aid,
      folder: fid,
      name: app[0],
      icon: app[1],
      color: app[2]
    });
  });
});

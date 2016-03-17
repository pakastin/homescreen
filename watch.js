
var exec = require('@pakastin/exec');

exec('npm', ['run', 'build-css']);
exec('npm', ['run', 'build-js']);

exec('chokidar', ['css/**/*.styl', '-c', 'npm run build-css']);
exec('chokidar', ['js/**/*.js', '-c', 'npm run build-js']);

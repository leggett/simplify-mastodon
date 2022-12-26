
# zip files
# zsh ./zip.sh

zip -r ./archives/mastodon_v1.3-chrome.zip manifest.json ./img/* ./*.css ./*.js -x ".*" -x "__MACOSX" -x "*/.*" -x "Icon?" -x "*/Icon?" -x "*/*.scss"


cp scripts.js firefox/.
cp styles.css firefox/.
cp img/* firefox/img/.

cd firefox

zip -r ../archives/mastodon_v1.3-firefox.zip manifest.json img/* *.css *.js -x ".*" -x "__MACOSX" -x "*/.*" -x "Icon?" -x "*/Icon?" -x "*/*.scss"

cd ../

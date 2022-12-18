
# zip files
# zsh ./zip.sh

zip -r ./archives/v1.1.zip manifest.json ./img/* ./*.css ./*.js -x ".*" -x "__MACOSX" -x "*/.*" -x "Icon?" -x "*/Icon?" -x "*/*.scss"

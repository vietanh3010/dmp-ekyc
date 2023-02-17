version=$1
git pull origin master
(cd ../frontend && source .env && npm run build)
rm -rf build && cp -r ../frontend/build .
docker build -t fpt-fti/smartdoor:$version -f Dockerfile .
docker tag fpt-fti/smartdoor:$version gcr.io/fpt-fti/smartdoor:$version
docker push gcr.io/fpt-fti/smartdoor:$version


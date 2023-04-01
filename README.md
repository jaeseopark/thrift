## Development

```bash
# Bootstrap
docker build . -t thrift:latest
docker run -v "`pwd`:/app" -it thrift:latest /bin/sh -c "cd /app && yarn create react-app thrift --template typescript"
sudo chown -R $(whoami):$(whoami) thrift

# Start the dev server up
doker-compose up
```

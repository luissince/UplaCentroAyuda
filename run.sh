docker stop uplanode && docker rm uplanode
docker image rm appupla:1
docker build -t appupla:1 .
docker run -p 5000:5000 --restart always --name uplanode --network upla -d appupla:1

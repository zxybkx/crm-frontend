FROM registry.szcasic.com/nginx/nginx:custom-v0.5 

RUN mkdir -p /usr/local/nginx/html

COPY dist /usr/local/nginx/html/dist
